import { motion } from "framer-motion";
import { Shield, MessageSquare, Sliders, Lock } from "lucide-react";

const roadmapItems = [
  {
    id: "malpractice",
    icon: Shield,
    title: "Malpractice Shield",
    description: "Defensibility Score & Risk Quantification",
  },
  {
    id: "collaboration",
    icon: MessageSquare,
    title: "Agent Collaboration Log",
    description: "Trace any decision back to source literature",
  },
  {
    id: "sensitivity",
    icon: Sliders,
    title: "Sensitivity Sliders",
    description: "Real-time causal robustness testing",
  },
];

export const RoadmapStubs = () => {
  return (
    <motion.div
      className="border-t border-border bg-muted/30 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Coming Soon
            </span>
          </div>

          <div className="flex gap-4">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-background/50 border border-border/50 opacity-60 cursor-not-allowed"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.6, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ opacity: 0.8 }}
              >
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground uppercase">
                  Soon
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
