import { motion } from "framer-motion";
import { FlaskConical, Stethoscope } from "lucide-react";

interface ActionButtonsProps {
  isAnimating: boolean;
  onPatientAnalysis?: () => void;
  onResearch?: () => void;
}

export const ActionButtons = ({ isAnimating, onPatientAnalysis, onResearch }: ActionButtonsProps) => {
  const animatedPosition = isAnimating 
    ? { x: 0, y: 0 } 
    : { x: 0, y: 0 };

  return (
    <motion.div
      className="flex gap-4 justify-center w-full flex-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        ...animatedPosition
      }}
      transition={{ 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1]
      }}
      layout
    >
      {onResearch && (
        <motion.button
          onClick={onResearch}
          className="glass-button flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <FlaskConical className="w-4 h-4" />
          Research
        </motion.button>
      )}

      {onPatientAnalysis && (
        <motion.button
          onClick={onPatientAnalysis}
          className="glass-button flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Stethoscope className="w-4 h-4" />
          Patient Analysis
        </motion.button>
      )}
    </motion.div>
  );
};
