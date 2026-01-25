import { motion } from "framer-motion";
import { FileText, Clock } from "lucide-react";

interface ModelLog {
  id: string;
  name: string;
  status: "completed" | "running" | "failed";
  timestamp: string;
}

interface ExistingModelsProps {
  models: ModelLog[];
}

export const ExistingModels = ({ models }: ExistingModelsProps) => {
  return (
    <motion.div
      className="absolute inset-x-6 top-6 bottom-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-panel p-6 h-full overflow-auto">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-5 h-5 text-foreground" />
          <h2 className="font-display text-xl font-semibold text-foreground">
            Existing Models → Logs
          </h2>
        </div>

        <div className="space-y-3">
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div 
                  className={`w-2 h-2 rounded-full ${
                    model.status === "completed" 
                      ? "bg-green-500" 
                      : model.status === "running" 
                      ? "bg-yellow-500 animate-pulse" 
                      : "bg-red-500"
                  }`} 
                />
                <span className="font-medium text-foreground">{model.name}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Clock className="w-4 h-4" />
                <span>{model.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
