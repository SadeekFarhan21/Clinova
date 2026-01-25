import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Circle, Brain, Code, Database, Microscope } from "lucide-react";
import { AgentStep } from "@/pages/Research";
import { StreamingText } from "./StreamingText";

interface AgentOrchestratorProps {
  steps: AgentStep[];
  currentThoughts: string[];
}

const agentIcons: Record<string, React.ElementType> = {
  "Agent 1": Microscope,
  "Agent 2a": Database,
  "Agent 2b": Brain,
  "Agent 3": Code,
};

const agentColors: Record<string, string> = {
  "Agent 1": "from-blue-500/20 to-cyan-500/20",
  "Agent 2a": "from-purple-500/20 to-pink-500/20",
  "Agent 2b": "from-amber-500/20 to-orange-500/20",
  "Agent 3": "from-emerald-500/20 to-teal-500/20",
};

export const AgentOrchestrator = ({ steps, currentThoughts }: AgentOrchestratorProps) => {
  const activeStep = steps.find(s => s.status === "active");

  return (
    <motion.div
      className="w-96 glass-subtle border-r border-border/50"
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -400, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <motion.div
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Brain className="w-4 h-4 text-foreground/70" />
          </motion.div>
          <div>
            <h3 className="font-display text-sm font-medium text-foreground">
              Agent Orchestrator
            </h3>
            <p className="text-xs text-muted-foreground">
              Multi-agent causal inference
            </p>
          </div>
        </div>

        {/* Agent Steps */}
        <div className="space-y-1 flex-1">
          {steps.map((step, index) => {
            const IconComponent = agentIcons[step.agent] || Circle;
            const gradientClass = agentColors[step.agent] || "";
            
            return (
              <motion.div
                key={step.id}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <motion.div 
                    className="absolute left-5 top-14 w-0.5 h-6"
                    style={{
                      background: step.status === "complete" 
                        ? "linear-gradient(to bottom, hsl(var(--foreground) / 0.3), hsl(var(--foreground) / 0.1))"
                        : "hsl(var(--border) / 0.5)"
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                  />
                )}

                <div className={`flex items-start gap-4 p-3 rounded-xl transition-all duration-300 ${
                  step.status === "active" 
                    ? `bg-gradient-to-r ${gradientClass} border border-foreground/10`
                    : ""
                }`}>
                  {/* Status indicator */}
                  <div className="relative flex-shrink-0 mt-0.5">
                    {step.status === "complete" ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center"
                        style={{
                          boxShadow: "0 4px 12px hsl(var(--foreground) / 0.25)"
                        }}
                      >
                        <Check className="w-5 h-5 text-background" />
                      </motion.div>
                    ) : step.status === "active" ? (
                      <motion.div
                        className="w-10 h-10 rounded-xl border-2 border-foreground flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: "hsl(var(--background))"
                        }}
                      >
                        {/* Spinning background */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <IconComponent className="w-5 h-5 text-foreground relative z-10" />
                        </motion.div>
                      </motion.div>
                    ) : (
                      <div 
                        className="w-10 h-10 rounded-xl border border-border/50 flex items-center justify-center"
                        style={{
                          background: "hsl(var(--muted) / 0.3)"
                        }}
                      >
                        <IconComponent className="w-4 h-4 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <p className={`text-sm font-medium transition-colors duration-200 ${
                      step.status === "active" 
                        ? "text-foreground" 
                        : step.status === "complete"
                        ? "text-foreground/70"
                        : "text-muted-foreground/50"
                    }`}>
                      {step.agent}
                    </p>
                    
                    {step.status === "active" ? (
                      <StreamingText 
                        text={step.message}
                        speed={25}
                        className="text-xs text-muted-foreground mt-1 block"
                      />
                    ) : (
                      <p className={`text-xs mt-1 transition-colors duration-200 ${
                        step.status === "complete"
                          ? "text-muted-foreground/60"
                          : "text-muted-foreground/30"
                      }`}>
                        {step.message}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Active Agent Thoughts */}
        <AnimatePresence>
          {activeStep && currentThoughts.length > 0 && (
            <motion.div
              className="mt-6 p-4 rounded-xl bg-gradient-to-br from-foreground/5 to-transparent border border-foreground/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  className="w-2 h-2 rounded-full bg-foreground"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-xs font-medium text-foreground/70 uppercase tracking-wider">
                  Live Output
                </span>
              </div>
              
              <div className="space-y-1.5 font-mono text-xs">
                {currentThoughts.map((thought, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-2 text-muted-foreground"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-foreground/30 select-none">$</span>
                    <span>{thought}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
