import { motion } from "framer-motion";
import { Activity, Cpu, Network, Zap } from "lucide-react";

interface ProcessingVisualizationProps {
  activeAgent: string | null;
}

export const ProcessingVisualization = ({ activeAgent }: ProcessingVisualizationProps) => {
  return (
    <motion.div
      className="w-full max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Central processing animation */}
      <div className="relative">
        {/* Neural network visualization */}
        <div className="glass-panel p-8 rounded-2xl overflow-hidden">
          {/* Animated grid background */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path 
                    d="M 30 0 L 0 0 0 30" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="0.5"
                    className="text-foreground/10"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Main content */}
          <div className="relative z-10">
            {/* Top metrics row */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { icon: Cpu, label: "Processing", value: "Active" },
                { icon: Network, label: "Connections", value: "847" },
                { icon: Activity, label: "Throughput", value: "2.4k/s" },
                { icon: Zap, label: "Latency", value: "12ms" },
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  className="glass-subtle p-4 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <metric.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {metric.label}
                    </span>
                  </div>
                  <motion.span
                    className="text-lg font-medium text-foreground"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {metric.value}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            {/* Central visualization */}
            <div className="relative h-64 flex items-center justify-center">
              {/* Orbiting nodes */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-foreground/30"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                  animate={{
                    x: [
                      Math.cos((i * Math.PI) / 2) * 80,
                      Math.cos((i * Math.PI) / 2 + Math.PI * 2) * 80,
                    ],
                    y: [
                      Math.sin((i * Math.PI) / 2) * 80,
                      Math.sin((i * Math.PI) / 2 + Math.PI * 2) * 80,
                    ],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}

              {/* Central core */}
              <motion.div
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-foreground/20 to-foreground/5 flex items-center justify-center border border-foreground/10"
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 0 0 hsl(var(--foreground) / 0)",
                    "0 0 40px 10px hsl(var(--foreground) / 0.1)",
                    "0 0 0 0 hsl(var(--foreground) / 0)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Cpu className="w-10 h-10 text-foreground/60" />
                </motion.div>
              </motion.div>

              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {[0, 1, 2, 3].map((i) => (
                  <motion.line
                    key={i}
                    x1="50%"
                    y1="50%"
                    x2={`${50 + Math.cos((i * Math.PI) / 2) * 30}%`}
                    y2={`${50 + Math.sin((i * Math.PI) / 2) * 30}%`}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-foreground/20"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                  />
                ))}
              </svg>
            </div>

            {/* Active agent indicator */}
            {activeAgent && (
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.p
                  className="text-sm text-muted-foreground"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {activeAgent} is processing your research query...
                </motion.p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
