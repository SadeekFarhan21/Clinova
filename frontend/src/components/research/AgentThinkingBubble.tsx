import { motion } from "framer-motion";

interface AgentThinkingBubbleProps {
  agentName: string;
  thoughts: string[];
  isActive: boolean;
}

export const AgentThinkingBubble = ({ 
  agentName, 
  thoughts, 
  isActive 
}: AgentThinkingBubbleProps) => {
  if (!isActive) return null;

  return (
    <motion.div
      className="glass-panel p-4 rounded-xl max-w-sm"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
        <span className="text-xs font-medium text-foreground/80 uppercase tracking-wider">
          {agentName} thinking
        </span>
      </div>
      
      <div className="space-y-2">
        {thoughts.map((thought, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-2 text-xs text-muted-foreground"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.3 }}
          >
            <span className="text-foreground/40">→</span>
            <span>{thought}</span>
          </motion.div>
        ))}
      </div>

      {/* Animated dots */}
      <div className="flex gap-1 mt-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-foreground/40"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
};
