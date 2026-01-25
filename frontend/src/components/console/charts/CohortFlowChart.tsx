import { motion } from "framer-motion";

interface CohortFlowChartProps {
  drugName: string;
  initialN: number;
  eligibleN: number;
  treatmentN: number;
  controlN: number;
}

export const CohortFlowChart = ({ 
  drugName, 
  initialN, 
  eligibleN, 
  treatmentN, 
  controlN 
}: CohortFlowChartProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-4">
      {/* Initial Population */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel-subtle px-6 py-3 text-center rounded-lg border border-emerald-500/20 bg-emerald-500/5"
      >
        <p className="text-xs text-muted-foreground">Initial Population</p>
        <p className="text-sm font-medium">N = {initialN.toLocaleString()}</p>
      </motion.div>

      {/* Arrow down */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-px h-8 bg-border"
      />

      {/* After Eligibility */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel-subtle px-6 py-3 text-center rounded-lg border border-amber-500/20 bg-amber-500/5"
      >
        <p className="text-xs text-muted-foreground">After Eligibility Criteria</p>
        <p className="text-sm font-medium">N = {eligibleN.toLocaleString()}</p>
      </motion.div>

      {/* Arrow splits */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-8 my-2"
      >
        <div className="w-16 h-px bg-border" />
        <div className="w-px h-8 bg-border" />
        <div className="w-16 h-px bg-border" />
      </motion.div>

      {/* Treatment groups */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-8"
      >
        <div className="glass-panel-subtle px-4 py-3 text-center rounded-lg border border-blue-500/20 bg-blue-500/5">
          <p className="text-xs text-muted-foreground">{drugName}</p>
          <p className="text-xs text-muted-foreground/70">(Treatment)</p>
          <p className="text-sm font-medium mt-1">N = {treatmentN.toLocaleString()}</p>
        </div>
        <div className="glass-panel-subtle px-4 py-3 text-center rounded-lg border border-purple-500/20 bg-purple-500/5">
          <p className="text-xs text-muted-foreground">Control</p>
          <p className="text-xs text-muted-foreground/70">(Comparator)</p>
          <p className="text-sm font-medium mt-1">N = {controlN.toLocaleString()}</p>
        </div>
      </motion.div>
    </div>
  );
};
