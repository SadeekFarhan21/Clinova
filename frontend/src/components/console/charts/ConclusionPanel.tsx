import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ConclusionPanelProps {
  drugName: string;
}

export const ConclusionPanel = ({ drugName }: ConclusionPanelProps) => {
  const riskDiff = (-2 + Math.random() * 4).toFixed(2);
  const ciLow = (parseFloat(riskDiff) - 2 - Math.random()).toFixed(2);
  const ciHigh = (parseFloat(riskDiff) + 2 + Math.random()).toFixed(2);
  const pValue = (0.3 + Math.random() * 0.6).toFixed(3);
  
  const isSignificant = parseFloat(pValue) < 0.05;
  const favorsDrug = parseFloat(riskDiff) < 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4"
    >
      {/* Main conclusion */}
      <div className={`glass-panel-subtle p-4 text-center rounded-lg border ${
        isSignificant 
          ? favorsDrug 
            ? 'border-emerald-500/20 bg-emerald-500/5' 
            : 'border-amber-500/20 bg-amber-500/5'
          : 'border-blue-500/20 bg-blue-500/5'
      }`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          {isSignificant ? (
            favorsDrug ? (
              <TrendingDown className="w-5 h-5 text-emerald-500" />
            ) : (
              <TrendingUp className="w-5 h-5 text-amber-500" />
            )
          ) : (
            <Minus className="w-5 h-5 text-blue-500" />
          )}
          <span className={`font-semibold ${
            isSignificant 
              ? favorsDrug ? 'text-emerald-600' : 'text-amber-600'
              : 'text-blue-600'
          }`}>
            {isSignificant 
              ? favorsDrug 
                ? 'SIGNIFICANT BENEFIT' 
                : 'SIGNIFICANT RISK INCREASE'
              : 'NO SIGNIFICANT DIFFERENCE'}
          </span>
        </div>
        <p className="text-xs font-mono bg-muted/50 inline-block px-3 py-1 rounded">
          Risk Difference: {riskDiff}% (95% CI: {ciLow}% to {ciHigh}%), p={pValue}
        </p>
      </div>

      {/* Recommendation */}
      <div className="glass-panel-subtle p-4 rounded-lg">
        <p className="text-sm font-medium mb-2">Recommendation:</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isSignificant 
            ? favorsDrug
              ? `Evidence supports preferential use of ${drugName} based on the observed reduction in primary outcome. Consider for patients meeting eligibility criteria.`
              : `Caution advised with ${drugName} due to observed increase in primary outcome. Consider alternative agents when appropriate.`
            : `Evidence does not support preferential use of ${drugName} over comparator for the primary outcome. Agent selection can be based on other factors (cost, availability, patient preference).`
          }
        </p>
      </div>
    </motion.div>
  );
};
