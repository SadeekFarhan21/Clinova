import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/layouts/MainLayout";
import { DottedGrid } from "@/components/canvas/DottedGrid";
import { ExistingModels } from "@/components/canvas/ExistingModels";
import { ActionButtons } from "@/components/canvas/ActionButtons";
import { PatientSearch } from "@/components/canvas/PatientSearch";
import { EHRDisplay } from "@/components/canvas/EHRDisplay";
import { DrugModelSelector } from "@/components/canvas/DrugModelSelector";
import { AnalysisResults } from "@/components/canvas/AnalysisResults";
import { AmbientBackground } from "@/components/AmbientBackground";
import { ThreeBackground } from "@/components/ThreeBackground";
// Research components
import { ResearchPrompt } from "@/components/research/ResearchPrompt";
import { ActiveThesisBar } from "@/components/research/ActiveThesisBar";
import { AgentTimeline } from "@/components/research/AgentTimeline";
import { ResearchCandidateSelector } from "@/components/research/ResearchCandidateSelector";
import { SkeletonDashboard } from "@/components/research/SkeletonDashboard";
import { CodeEditor } from "@/components/research/CodeEditor";
import { DataDropZone } from "@/components/research/DataDropZone";
import { ResultsDashboard } from "@/components/research/ResultsDashboard";
import { RoadmapStubs } from "@/components/research/RoadmapStubs";

import { supabase } from "@/integrations/supabase/client";
import { createTrial, getTrialStatus, getTrialResults, getExampleTrials } from "@/lib/api";
import { transformTrialDataForDashboard } from "@/lib/transform-trial-data";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type CanvasState =
  | "idle"
  | "patient-search"
  | "ehr-loading"
  | "ehr-display"
  | "drug-selection"
  | "analysis-results"
  // Research states
  | "research-prompt"
  | "research-processing"       // Backend agents are running
  | "research-code-ready"
  | "research-awaiting-data"
  | "research-results";

interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: string;
  mrn: string;
}

interface AgentStep {
  id: string;
  agent: string;
  status: "pending" | "active" | "complete";
  message: string;
}

// Multi-agent steps mapping to backend pipeline
const INITIAL_AGENT_STEPS: AgentStep[] = [
  { id: "question", agent: "Question Agent", status: "pending", message: "Transforming to causal PICO format..." },
  { id: "design", agent: "Design Agent", status: "pending", message: "Generating trial emulation protocol..." },
  { id: "validator", agent: "Validator Agent", status: "pending", message: "Validating design specification..." },
  { id: "omop", agent: "OMOP Agent", status: "pending", message: "Mapping medical terms to OMOP concepts..." },
  { id: "code", agent: "Code Agent", status: "pending", message: "Generating executable Python code..." },
];

// Mock data
const mockModels = [
  { id: "1", name: "Image Classification v2", status: "completed" as const, timestamp: "2 hours ago" },
  { id: "2", name: "Sentiment Analyzer", status: "running" as const, timestamp: "1 day ago" },
  { id: "3", name: "Object Detection", status: "completed" as const, timestamp: "3 days ago" },
];

const Canvas = () => {
  const [hasExistingModels] = useState(false);
  const [canvasState, setCanvasState] = useState<CanvasState>("idle");
  const [buttonsAnimated, setButtonsAnimated] = useState(false);

  // Patient analysis state
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [ehrData, setEhrData] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Research state
  const [thesis, setThesis] = useState("");
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>(INITIAL_AGENT_STEPS);
  const [researchResultsData, setResearchResultsData] = useState<any>(null);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!hasExistingModels && canvasState === "idle" && !buttonsAnimated) {
      const timer = setTimeout(() => {
        setButtonsAnimated(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [hasExistingModels, canvasState, buttonsAnimated]);

  // Listen for nav-reset event to return to idle
  useEffect(() => {
    const handleNavReset = (e: CustomEvent) => {
      if (e.detail.path === '/research') {
        resetToIdle();
      }
    };

    window.addEventListener('nav-reset', handleNavReset as EventListener);
    return () => window.removeEventListener('nav-reset', handleNavReset as EventListener);
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const handlePatientAnalysis = () => {
    setCanvasState("patient-search");
    setSelectedPatient(null);
    setEhrData(null);
    setAnalysisResult(null);
  };

  const handleResearch = () => {
    setCanvasState("research-prompt");
    setThesis("");
    setAgentSteps(INITIAL_AGENT_STEPS);
    setResearchResultsData(null);
    setCurrentRunId(null);
    setGeneratedCode("");
  };

  const handlePatientSelect = async (patient: Patient) => {
    setSelectedPatient(patient);
    setCanvasState("ehr-loading");

    try {
      const { data, error } = await supabase.functions.invoke('epic-ehr', {
        body: { action: 'getEHR', patientId: patient.id },
      });

      if (error) throw error;
      setEhrData(data.ehr);
      setCanvasState("ehr-display");
    } catch (err) {
      console.error('Failed to load EHR:', err);
      setCanvasState("patient-search");
    }
  };

  const handleAnalysisComplete = (drugs: string[], modelId: string, result: any) => {
    setAnalysisResult(result);
    setCanvasState("analysis-results");
  };

  // Poll backend for trial status and update agent steps
  const pollTrialStatus = useCallback(async (runId: string) => {
    try {
      const status = await getTrialStatus(runId);

      // Update agent steps based on backend progress
      if (status.status === "running") {
        // Show sequential agent progress based on elapsed time
        const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;

        // Estimated timings for each agent (in seconds)
        // Question: 0-30s, Design: 30-60s, Validator: 60-80s, OMOP: 80-85s, Code: 85-120s
        setAgentSteps(prev => prev.map((step, idx) => {
          if (idx === 0) {
            // Question agent - first 30 seconds
            return { ...step, status: elapsed < 30 ? "active" : "complete" };
          } else if (idx === 1) {
            // Design agent - 30-60 seconds
            return { ...step, status: elapsed < 30 ? "pending" : elapsed < 60 ? "active" : "complete" };
          } else if (idx === 2) {
            // Validator agent - 60-80 seconds
            return { ...step, status: elapsed < 60 ? "pending" : elapsed < 80 ? "active" : "complete" };
          } else if (idx === 3) {
            // OMOP agent - 80-85 seconds
            return { ...step, status: elapsed < 80 ? "pending" : elapsed < 85 ? "active" : "complete" };
          } else if (idx === 4) {
            // Code agent - 85+ seconds
            return { ...step, status: elapsed < 85 ? "pending" : "active" };
          }
          return step;
        }));
      } else if (status.status === "completed") {
        // All agents complete
        setAgentSteps(prev => prev.map(step => ({
          ...step,
          status: "complete"
        })));

        // Fetch results
        try {
          const results = await getTrialResults(runId);
          setGeneratedCode(results.code || "# No code generated");
          setCanvasState("research-code-ready");

          // Stop polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          toast.success("Research analysis complete!");
        } catch (error) {
          console.error("Failed to fetch results:", error);
          toast.error("Failed to fetch trial results");
        }
      } else if (status.status === "failed") {
        // Show error
        toast.error(`Trial failed: ${status.error || "Unknown error"}`);
        setCanvasState("research-prompt");

        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }
    } catch (error) {
      console.error("Failed to poll trial status:", error);
      // Continue polling, don't stop on transient errors
    }
  }, []);

  // Research handlers
  const handleResearchPromptSubmit = useCallback(async (prompt: string) => {
    setThesis(prompt);
    setCanvasState("research-processing");

    // Reset agent steps and start timer
    setAgentSteps(INITIAL_AGENT_STEPS);
    setStartTime(Date.now());

    try {
      // Call backend to create trial
      toast.info("Starting research analysis...");
      const response = await createTrial({ question: prompt });
      setCurrentRunId(response.run_id);

      // Start polling for status
      pollingIntervalRef.current = setInterval(() => {
        pollTrialStatus(response.run_id);
      }, 2000); // Poll every 2 seconds

      // Do initial poll immediately
      pollTrialStatus(response.run_id);

    } catch (error) {
      console.error("Failed to create trial:", error);
      toast.error("Failed to start research analysis. Make sure the backend is running.");
      setCanvasState("research-prompt");
    }
  }, [pollTrialStatus]);

  const handleCodeCopied = useCallback(() => {
    setTimeout(() => {
      setCanvasState("research-awaiting-data");
    }, 1000);
  }, []);

  const handleDataDrop = useCallback(async (data: any) => {
    try {
      // Fetch example trials from backend
      const examples = await getExampleTrials();

      if (examples.length > 0) {
        // Use the first example (AKI contrast trial)
        const example = examples.find((e: any) => e.id === "aki-contrast-trial") || examples[0];

        // Transform the data to match ResultsDashboard format
        const transformedData = transformTrialDataForDashboard(example.data);

        if (transformedData) {
          setResearchResultsData(transformedData);
        } else {
          // Fallback to provided data
          setResearchResultsData(data);
        }
      } else {
        // Fallback to provided data
        setResearchResultsData(data);
      }

      setCanvasState("research-results");
    } catch (error) {
      console.error("Failed to load example data:", error);
      // Fallback to provided mock data
      setResearchResultsData(data);
      setCanvasState("research-results");
    }
  }, []);

  const handleResearchReset = useCallback(() => {
    // Stop polling if active
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    setCanvasState("research-prompt");
    setThesis("");
    setAgentSteps(INITIAL_AGENT_STEPS);
    setResearchResultsData(null);
    setCurrentRunId(null);
    setGeneratedCode("");
    setStartTime(null);
  }, []);

  const resetToIdle = () => {
    // Stop polling if active
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    setCanvasState("idle");
    setSelectedPatient(null);
    setEhrData(null);
    setAnalysisResult(null);
    setThesis("");
    setAgentSteps(INITIAL_AGENT_STEPS);
    setResearchResultsData(null);
    setCurrentRunId(null);
    setGeneratedCode("");
    setStartTime(null);
    setButtonsAnimated(true);
  };

  const showBackButton = canvasState !== "idle";
  const isResearchState = canvasState.startsWith("research-");
  // Show agent timeline during processing phase
  const showAgentTimeline = canvasState === "research-processing";

  // Map canvas state to research phase for ActiveThesisBar
  const getResearchPhase = (): "prompt" | "processing" | "code-ready" | "awaiting-data" | "results" | null => {
    if (!isResearchState) return null;
    return canvasState.replace("research-", "") as any;
  };
  const researchPhase = getResearchPhase();

  return (
    <MainLayout showFooter={false}>
      <div className="relative h-[calc(100vh-4rem)] overflow-hidden bg-background">
        <AmbientBackground />
        <ThreeBackground />
        <DottedGrid />

        {/* Back button - fixed position below navbar */}
        <AnimatePresence>
          {showBackButton && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onClick={resetToIdle}
              className="fixed top-20 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-lg
                         bg-background/60 backdrop-blur-sm border border-border/50
                         text-muted-foreground hover:text-foreground hover:bg-background/80
                         transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </motion.button>
          )}
        </AnimatePresence>

        <div className="relative z-10 h-full flex">
          {/* Left sidebar - Agent Timeline (visible during research processing) */}
          <AnimatePresence>
            {showAgentTimeline && <AgentTimeline steps={agentSteps} />}
          </AnimatePresence>

          {/* Main content area */}
          <div className="flex-1 flex flex-col">
            {/* Active Thesis Bar (visible during research after prompt submission) */}
            <AnimatePresence>
              {isResearchState && canvasState !== "research-prompt" && (
                <ActiveThesisBar thesis={thesis} phase={researchPhase!} onReset={handleResearchReset} />
              )}
            </AnimatePresence>

            {/* Central content */}
            <div className="flex-1 flex items-center justify-center px-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                {hasExistingModels ? (
                  <ExistingModels key="existing" models={mockModels} />
                ) : (
                  <>
                    {/* Patient Analysis States */}
                    {canvasState === "patient-search" && (
                      <PatientSearch
                        key="patient-search"
                        onPatientSelect={handlePatientSelect}
                      />
                    )}

                    {canvasState === "ehr-loading" && (
                      <motion.div
                        key="ehr-loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                      >
                        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading patient EHR from Epic...</p>
                      </motion.div>
                    )}

                    {canvasState === "ehr-display" && selectedPatient && ehrData && (
                      <EHRDisplay
                        key="ehr-display"
                        patient={selectedPatient}
                        ehrData={ehrData}
                        onBack={() => setCanvasState("patient-search")}
                        onProceed={() => setCanvasState("drug-selection")}
                      />
                    )}

                    {canvasState === "drug-selection" && selectedPatient && ehrData && (
                      <DrugModelSelector
                        key="drug-selection"
                        patient={selectedPatient}
                        ehrData={ehrData}
                        onBack={() => setCanvasState("ehr-display")}
                        onRunAnalysis={handleAnalysisComplete}
                      />
                    )}

                    {canvasState === "analysis-results" && selectedPatient && analysisResult && (
                      <AnalysisResults
                        key="analysis-results"
                        result={analysisResult}
                        patient={selectedPatient}
                        onNewAnalysis={() => setCanvasState("drug-selection")}
                        onBackToSearch={resetToIdle}
                      />
                    )}

                    {/* Research States */}
                    {canvasState === "research-prompt" && (
                      <ResearchPrompt key="research-prompt" onSubmit={handleResearchPromptSubmit} />
                    )}

                    {canvasState === "research-processing" && (
                      <SkeletonDashboard key="research-processing" />
                    )}

                    {canvasState === "research-code-ready" && (
                      <CodeEditor key="research-code" code={generatedCode} onCopied={handleCodeCopied} />
                    )}

                    {canvasState === "research-awaiting-data" && (
                      <DataDropZone key="research-dropzone" onDataDrop={handleDataDrop} />
                    )}

                    {canvasState === "research-results" && (
                      <ResultsDashboard key="research-results" data={researchResultsData} />
                    )}

                    {/* Idle State */}
                    {canvasState === "idle" && (
                      <motion.div
                        key="welcome"
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h2 className="font-display text-2xl font-medium text-foreground mb-3">
                          Ready to build
                        </h2>
                        <p className="text-muted-foreground mb-8">
                          Click "Research" to start causal analysis or "Patient Analysis" for EHR-based drug modeling
                        </p>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          <ActionButtons
                            isAnimating={buttonsAnimated}
                            onPatientAnalysis={handlePatientAnalysis}
                            onResearch={handleResearch}
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Future Roadmap Stubs for Research */}
            {canvasState === "research-results" && <RoadmapStubs />}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Canvas;
