import { motion } from "framer-motion";
import { Check, Loader2, Circle } from "lucide-react";
import { AgentStep } from "@/pages/Research";

interface AgentTimelineProps {
  steps: AgentStep[];
}

export const AgentTimeline = ({ steps }: AgentTimelineProps) => {
  return (
    <motion.div
      className="w-96 glass-subtle border-r border-border/30"
      initial={{ x: -384, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -384, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-8">
        <h3 className="font-display text-sm font-semibold text-foreground mb-2">
          Agent Pipeline
        </h3>
        <p className="text-xs text-muted-foreground mb-8">
          Multi-agent research workflow
        </p>

        <div className="space-y-2">
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
                  className={`absolute left-[13px] top-10 w-0.5 h-10 transition-colors duration-300 ${
                    step.status === "complete"
                      ? "bg-foreground/20"
                      : "bg-border/50"
                  }`}
                />
              )}

              <div className="flex items-start gap-4 py-4">
                {/* Status indicator */}
                <div className="relative flex-shrink-0 mt-1">
                  {step.status === "complete" ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center"
                      style={{
                        boxShadow: "0 2px 12px hsl(var(--foreground) / 0.4)"
                      }}
                    >
                      <Check className="w-4 h-4 text-background" />
                    </motion.div>
                  ) : step.status === "active" ? (
                    <motion.div
                      className="w-7 h-7 rounded-full border-2 border-foreground flex items-center justify-center"
                      style={{
                        background: "hsl(var(--glass-bg) / 0.5)"
                      }}
                      animate={{
                        boxShadow: [
                          "0 0 0 0 hsl(var(--foreground) / 0.4)",
                          "0 0 0 10px hsl(var(--foreground) / 0)",
                        ]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-4 h-4 text-foreground" />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center"
                      style={{
                        background: "hsl(var(--glass-bg) / 0.3)"
                      }}
                    >
                      <Circle className="w-2.5 h-2.5 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-base font-semibold transition-colors duration-200 ${
                    step.status === "active"
                      ? "text-foreground"
                      : step.status === "complete"
                      ? "text-foreground/80"
                      : "text-muted-foreground/50"
                  }`}>
                    {step.agent}
                  </p>
                  <motion.p
                    className={`text-sm mt-1 transition-colors duration-200 leading-relaxed ${
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
