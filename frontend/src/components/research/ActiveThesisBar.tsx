import { motion } from "framer-motion";
import { FileText, RotateCcw, CheckCircle, Loader2 } from "lucide-react";

type ActivePhase = "prompt" | "processing" | "code-ready" | "awaiting-data" | "results";

interface ActiveThesisBarProps {
  thesis: string;
  phase: ActivePhase;
  onReset: () => void;
}

const phaseLabels: Record<ActivePhase, string> = {
  prompt: "",
  processing: "Researching",
  "code-ready": "Script Ready",
  "awaiting-data": "Awaiting Data",
  results: "Analysis Complete",
};

export const ActiveThesisBar = ({ thesis, phase, onReset }: ActiveThesisBarProps) => {
  const isProcessing = phase === "processing";
  const isComplete = phase === "results";

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-panel px-5 py-2.5 flex items-center gap-4 h-[46px]">
        {/* Status icon */}
        <div className="flex-shrink-0">
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          ) : isComplete ? (
            <CheckCircle className="w-4 h-4 text-foreground" />
          ) : (
            <FileText className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        {/* Thesis text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground truncate font-medium">
            {thesis}
          </p>
        </div>

        {/* Phase label */}
        <motion.span
          className={`glass-badge ${
            isProcessing
              ? "!bg-foreground/5"
              : isComplete
              ? "!bg-foreground/10 !text-foreground"
              : ""
          }`}
          layout
        >
          {phaseLabels[phase]}
        </motion.span>

        {/* Reset button */}
        <motion.button
          onClick={onReset}
          className="p-2 rounded-lg glass-card-interactive"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      </div>
    </motion.div>
  );
};
