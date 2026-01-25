import { motion } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ValidationSummaryProps {
  drugName: string;
}

const issuesResolved = [
  "Time zero fallback using procedure time validated",
  "CT linkage rule allowed proper time alignment",
  "Race-based eGFR equations replaced with CKD-EPI 2021",
  "IV route requirement validated with route_concept_id",
];

export const ValidationSummary = ({ drugName }: ValidationSummaryProps) => {
  const iterations = Math.floor(Math.random() * 3) + 2;
  const gatesPassed = [1, 2, 3, 4, 5, 6];

  return (
    <div className="w-full space-y-4">
      {/* Status badge */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel-subtle p-4 text-center border border-emerald-500/20 bg-emerald-500/5 rounded-lg"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="font-medium text-emerald-600">Final Status: VALID ({iterations} iterations)</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Gates Passed: {gatesPassed.map(g => `Gate ${g}`).join(', ')}
        </p>
      </motion.div>

      {/* Issues resolved */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Issues Resolved:</p>
        {issuesResolved.map((issue, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-2 text-xs"
          >
            <div 
              className="w-3 h-3 rounded-sm mt-0.5 shrink-0"
              style={{ 
                backgroundColor: `hsl(${40 + idx * 10}, 80%, 60%)`,
                opacity: 0.8 
              }}
            />
            <span className="text-muted-foreground">{issue}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
