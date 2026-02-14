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
import { AgentOutputDisplay } from "@/components/research/AgentOutputDisplay";
import { LogsViewer } from "@/components/canvas/LogsViewer";

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
  const [currentAgentStep, setCurrentAgentStep] = useState<number>(-1);
  const [agentStepData, setAgentStepData] = useState<any>({});
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Logs state
  const [showLogs, setShowLogs] = useState(false);

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
      toast.error("EHR integration not configured");
      setCanvasState("patient-search");
    } catch (err) {
      console.error('Failed to load EHR:', err);
      setCanvasState("patient-search");
    }
  };

  const handleAnalysisComplete = (drugs: string[], modelId: string, result: any) => {
    setAnalysisResult(result);
    setCanvasState("analysis-results");
  };

  // Simulate agent progress with example data
  const simulateAgentProgress = useCallback((example: any) => {
    const data = example.data;

    // Agent 1: Question (0-3 seconds)
    setTimeout(() => {
      setCurrentAgentStep(0);
      setAgentStepData((prev: any) => ({
        ...prev,
        causalQuestion: data.step1_causal_question
      }));
      setAgentSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx === 0 ? "complete" : idx === 1 ? "active" : "pending"
      })));
    }, 3000);

    // Agent 2: Design (3-6 seconds)
    setTimeout(() => {
      setCurrentAgentStep(1);
      setAgentStepData((prev: any) => ({
        ...prev,
        designSpec: data.step2a_design_spec
      }));
      setAgentSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx <= 1 ? "complete" : idx === 2 ? "active" : "pending"
      })));
    }, 6000);

    // Agent 3: Validator (6-9 seconds)
    setTimeout(() => {
      setCurrentAgentStep(2);
      setAgentStepData((prev: any) => ({
        ...prev,
        validation: data.step2b_validation
      }));
      setAgentSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx <= 2 ? "complete" : idx === 3 ? "active" : "pending"
      })));
    }, 9000);

    // Agent 4: OMOP (9-11 seconds)
    setTimeout(() => {
      setCurrentAgentStep(3);
      setAgentStepData((prev: any) => ({
        ...prev,
        omopMapping: data.step2c_omop_mapping
      }));
      setAgentSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx <= 3 ? "complete" : idx === 4 ? "active" : "pending"
      })));
    }, 11000);

    // Agent 5: Code - Complete and show results (11-13 seconds)
    setTimeout(() => {
      setCurrentAgentStep(4);
      setAgentStepData((prev: any) => ({
        ...prev,
        code: data.step3_code
      }));
      setAgentSteps(prev => prev.map(step => ({
        ...step,
        status: "complete"
      })));

      toast.success(`Loaded ${example.data.trial_config?.trial_name || example.id} example!`);
      setCanvasState("research-code-ready");
    }, 13000);
  }, []);

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
  }, [startTime]);

  // Research handlers
  const handleResearchPromptSubmit = useCallback(async (prompt: string) => {
    setThesis(prompt);
    setCanvasState("research-processing");

    // Reset agent steps and start timer
    setAgentSteps(INITIAL_AGENT_STEPS);
    setStartTime(Date.now());

    try {
      // Load example trial data directly (skip real backend processing)
      toast.info("Loading example trial data...");

      const examples = await getExampleTrials();

      // Smart matching: select example based on research question
      let example;
      const questionLower = prompt.toLowerCase();

      if (questionLower.includes('sglt2') || questionLower.includes('heart failure') || questionLower.includes('cardiovascular')) {
        example = examples.find((e: any) => e.id === "predict-trial" || e.id === "valor-trial");
      } else if (questionLower.includes('contrast') || questionLower.includes('kidney') || questionLower.includes('aki')) {
        example = examples.find((e: any) => e.id === "aki-contrast-trial");
      } else if (questionLower.includes('nephric') || questionLower.includes('nephropathy')) {
        example = examples.find((e: any) => e.id === "nephric-trial");
      }

      if (!example) {
        example = examples[0];
      }

      // Get the code from the example
      const code = example.code || "# No code available";
      setGeneratedCode(code);

      // Simulate agent progress with the example data
      simulateAgentProgress(example);

    } catch (error) {
      console.error("Failed to load example trial:", error);
      toast.error("Failed to load example trial data.");
      setCanvasState("research-prompt");
    }
  }, [simulateAgentProgress]);

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
        // Smart matching: select example based on current research question
        let example;
        const questionLower = thesis.toLowerCase();

        if (questionLower.includes('sglt2') || questionLower.includes('heart failure') || questionLower.includes('cardiovascular')) {
          // For cardiovascular questions, use PREDICT or VALOR trial
          example = examples.find((e: any) =>
            e.id === "predict-trial" || e.id === "valor-trial"
          );
        } else if (questionLower.includes('contrast') || questionLower.includes('kidney') || questionLower.includes('aki')) {
          // For kidney/contrast questions, use AKI contrast trial
          example = examples.find((e: any) => e.id === "aki-contrast-trial");
        } else if (questionLower.includes('nephric') || questionLower.includes('nephropathy')) {
          // For nephropathy questions, use NEPHRIC trial
          example = examples.find((e: any) => e.id === "nephric-trial");
        }

        // Fallback to first available example
        if (!example) {
          example = examples[0];
        }

        // Transform the data to match ResultsDashboard format
        const transformedData = transformTrialDataForDashboard(example.data);

        if (transformedData) {
          setResearchResultsData(transformedData);
          toast.success(`Loaded ${example.data.trial_config?.trial_name || example.id} example data`);
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
  }, [thesis]);

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
    setCurrentAgentStep(-1);
    setAgentStepData({});
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
    setCurrentAgentStep(-1);
    setAgentStepData({});
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

        <div className="relative z-10 h-full flex">
          {/* Left sidebar - Agent Timeline (visible during research processing) */}
          <AnimatePresence>
            {showAgentTimeline && <AgentTimeline steps={agentSteps} />}
          </AnimatePresence>

          {/* Main content area */}
          <div className="flex-1 flex flex-col">
            {/* Top bar with Back button and Active Thesis Bar */}
            <AnimatePresence>
              {(showBackButton || (isResearchState && canvasState !== "research-prompt")) && (
                <motion.div
                  className="flex items-center gap-3 mx-4 mt-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Back Button */}
                  {showBackButton && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      onClick={resetToIdle}
                      className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg
                                 bg-background/60 backdrop-blur-sm border border-border/50
                                 text-muted-foreground hover:text-foreground hover:bg-background/80
                                 transition-colors h-[46px]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-sm font-medium">Back</span>
                    </motion.button>
                  )}

                  {/* Active Thesis Bar */}
                  {isResearchState && canvasState !== "research-prompt" && (
                    <div className="flex-1">
                      <ActiveThesisBar thesis={thesis} phase={researchPhase!} onReset={handleResearchReset} />
                    </div>
                  )}
                </motion.div>
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
                      <AgentOutputDisplay
                        key="research-processing"
                        currentStep={currentAgentStep}
                        stepData={agentStepData}
                      />
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
                            onLogs={() => setShowLogs(true)}
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

        {/* Logs Viewer Modal */}
        <AnimatePresence>
          {showLogs && <LogsViewer onClose={() => setShowLogs(false)} />}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default Canvas;
