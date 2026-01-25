import { motion } from "framer-motion";
import { Check, Loader2, Circle } from "lucide-react";
import { AgentStep } from "@/pages/Research";

interface AgentTimelineProps {
  steps: AgentStep[];
}

export const AgentTimeline = ({ steps }: AgentTimelineProps) => {
  return (
    <motion.div
      className="w-80 glass-subtle"
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-6">
        <h3 className="font-display text-xs font-medium text-muted-foreground uppercase tracking-widest mb-8">
          Agent Pipeline
        </h3>

        <div className="space-y-1">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div 
                  className={`absolute left-[11px] top-8 w-0.5 h-8 transition-colors duration-300 ${
                    step.status === "complete" 
                      ? "bg-foreground/20" 
                      : "bg-border/50"
                  }`}
                />
              )}

              <div className="flex items-start gap-3 py-3">
                {/* Status indicator */}
                <div className="relative flex-shrink-0 mt-0.5">
                  {step.status === "complete" ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center"
                      style={{
                        boxShadow: "0 2px 8px hsl(var(--foreground) / 0.3)"
                      }}
                    >
                      <Check className="w-3 h-3 text-background" />
                    </motion.div>
                  ) : step.status === "active" ? (
                    <motion.div
                      className="w-6 h-6 rounded-full border-2 border-foreground flex items-center justify-center"
                      style={{
                        background: "hsl(var(--glass-bg) / 0.5)"
                      }}
                      animate={{ 
                        boxShadow: [
                          "0 0 0 0 hsl(var(--foreground) / 0.4)",
                          "0 0 0 8px hsl(var(--foreground) / 0)",
                        ]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-3 h-3 text-foreground" />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <div 
                      className="w-6 h-6 rounded-full border border-border/50 flex items-center justify-center"
                      style={{
                        background: "hsl(var(--glass-bg) / 0.3)"
                      }}
                    >
                      <Circle className="w-2 h-2 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium transition-colors duration-200 ${
                    step.status === "active" 
                      ? "text-foreground" 
                      : step.status === "complete"
                      ? "text-foreground/70"
                      : "text-muted-foreground/60"
                  }`}>
                    {step.agent}
                  </p>
                  <motion.p 
                    className={`text-xs mt-0.5 transition-colors duration-200 ${
                      step.status === "active"
                        ? "text-muted-foreground"
                        : "text-muted-foreground/40"
                    }`}
                    animate={step.status === "active" ? {
                      opacity: [0.6, 1, 0.6]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {step.message}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
