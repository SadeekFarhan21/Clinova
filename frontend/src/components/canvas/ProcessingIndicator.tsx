import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface ProcessingIndicatorProps {
  isVisible: boolean;
}

const STATUS_MESSAGES = [
  "Analyzing Causal Parameters...",
  "Running Counterfactual Simulations...",
  "Calculating Risk Differentials...",
  "Synthesizing Clinical Evidence...",
];

export const ProcessingIndicator = ({ isVisible }: ProcessingIndicatorProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentMessageIndex(0);
      setProgress(0);
      return;
    }

    // Cycle through messages every 1.5 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 1500);

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 8 + 2;
      });
    }, 200);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="w-full max-w-md flex flex-col items-center gap-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glass container */}
      <div
        className="w-full px-8 py-8 rounded-[2rem] border border-white/20 bg-white/10"
        style={{
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          boxShadow: "0 8px 32px hsl(var(--foreground) / 0.08), inset 0 1px 1px rgba(255,255,255,0.3)",
        }}
      >
        {/* Status message with fade transition */}
        <div className="h-6 mb-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessageIndex}
              className="text-center text-foreground/80 text-sm font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {STATUS_MESSAGES[currentMessageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Sleek thin loading bar */}
        <div className="w-full">
          <Progress 
            value={progress} 
            className="h-1 bg-white/10"
          />
        </div>
      </div>
    </motion.div>
  );
};
