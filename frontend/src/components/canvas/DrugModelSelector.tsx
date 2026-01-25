import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Pill, Cpu, ArrowLeft, Plus, X, Loader2, 
  AlertCircle, CheckCircle, Play 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Model {
  name: string;
  description: string;
  drugClass: string;
  version: string;
}

interface DrugModelSelectorProps {
  patient: { name: string; mrn: string };
  ehrData: any;
  onBack: () => void;
  onRunAnalysis: (drugs: string[], modelId: string, result: any) => void;
}

const COMMON_DRUGS = [
  'Warfarin', 'Atorvastatin', 'Lisinopril', 'Metoprolol', 
  'Amlodipine', 'Omeprazole', 'Insulin Glargine', 'Gabapentin'
];

export const DrugModelSelector = ({ patient, ehrData, onBack, onRunAnalysis }: DrugModelSelectorProps) => {
  const [models, setModels] = useState<Record<string, Model>>({});
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [drugs, setDrugs] = useState<string[]>([]);
  const [drugInput, setDrugInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('run-drug-model', {
        body: { action: 'listModels' },
      });
      if (error) throw error;
      setModels(data.models || {});
    } catch (err: any) {
      setError('Failed to load models');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addDrug = (drug: string) => {
    const trimmed = drug.trim();
    if (trimmed && !drugs.includes(trimmed)) {
      setDrugs([...drugs, trimmed]);
      setDrugInput("");
    }
  };

  const removeDrug = (drug: string) => {
    setDrugs(drugs.filter(d => d !== drug));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && drugInput.trim()) {
      addDrug(drugInput);
    }
  };

  const runAnalysis = async () => {
    if (!selectedModel || drugs.length === 0) return;

    setIsRunning(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('run-drug-model', {
        body: {
          action: 'runAnalysis',
          modelId: selectedModel,
          ehrData,
          drugs,
        },
      });

      if (error) throw error;
      onRunAnalysis(drugs, selectedModel, data.result);
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="glass-panel p-6 rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to EHR
          </button>
          <div className="text-sm text-muted-foreground">
            Patient: <span className="text-foreground">{patient.name}</span> (MRN: {patient.mrn})
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Drug Selection */}
          <div>
            <h3 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary" />
              Select Drugs to Analyze
            </h3>

            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Enter drug name..."
                value={drugInput}
                onChange={(e) => setDrugInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-background/50"
              />
              <motion.button
                onClick={() => addDrug(drugInput)}
                disabled={!drugInput.trim()}
                className="glass-button-secondary px-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Quick add */}
            <div className="flex flex-wrap gap-2 mb-4">
              {COMMON_DRUGS.filter(d => !drugs.includes(d)).slice(0, 4).map(drug => (
                <button
                  key={drug}
                  onClick={() => addDrug(drug)}
                  className="text-xs px-2 py-1 rounded-full bg-background/30 border border-border/30
                             hover:bg-primary/10 hover:border-primary/30 transition-colors"
                >
                  + {drug}
                </button>
              ))}
            </div>

            {/* Selected drugs */}
            <div className="min-h-[100px] p-3 rounded-xl bg-background/30 border border-border/30">
              {drugs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {drugs.map(drug => (
                    <motion.span
                      key={drug}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full 
                                 bg-primary/10 text-primary text-sm"
                    >
                      {drug}
                      <button onClick={() => removeDrug(drug)} className="hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No drugs selected. Add drugs to analyze.
                </p>
              )}
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <h3 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              Select Analysis Model
            </h3>

            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
              {Object.entries(models).map(([id, model]) => (
                <motion.button
                  key={id}
                  onClick={() => setSelectedModel(id)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    selectedModel === id
                      ? 'bg-primary/10 border-primary/40 border-2'
                      : 'bg-background/30 border border-border/30 hover:border-primary/20'
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{model.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-background/50">
                          {model.drugClass}
                        </span>
                        <span className="text-xs text-muted-foreground">v{model.version}</span>
                      </div>
                    </div>
                    {selectedModel === id && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 
                         flex items-center gap-2 text-destructive text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Run button */}
        <div className="mt-6 flex justify-center">
          <motion.button
            onClick={runAnalysis}
            disabled={!selectedModel || drugs.length === 0 || isRunning}
            className="glass-button px-8 py-3 text-lg flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Running Analysis...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run Model Analysis
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
