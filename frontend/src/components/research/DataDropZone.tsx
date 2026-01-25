import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react";

interface DataDropZoneProps {
  onDataDrop: (data: any) => void;
}

export const DataDropZone = ({ onDataDrop }: DataDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);

    // Simulate processing with particle animation timing
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock parsed data
    const mockData = {
      subgroups: [
        { name: "Age 65+", ate: 0.234, ci: [0.18, 0.29], n: 12450 },
        { name: "Age 45-64", ate: 0.189, ci: [0.14, 0.24], n: 28320 },
        { name: "Female", ate: 0.212, ci: [0.17, 0.25], n: 21890 },
        { name: "Male", ate: 0.198, ci: [0.15, 0.25], n: 18880 },
        { name: "High Risk", ate: 0.287, ci: [0.22, 0.35], n: 8920 },
        { name: "Low Risk", ate: 0.156, ci: [0.11, 0.20], n: 31850 },
      ],
      overall: {
        ate: 0.203,
        ci: [0.18, 0.23],
        n_treated: 20385,
        n_control: 20385,
        confidence: 0.987,
      },
      timeline: [
        { month: 0, treatment: 1.0, control: 1.0 },
        { month: 3, treatment: 0.95, control: 0.92 },
        { month: 6, treatment: 0.91, control: 0.85 },
        { month: 9, treatment: 0.88, control: 0.79 },
        { month: 12, treatment: 0.85, control: 0.74 },
      ],
    };

    onDataDrop(mockData);
  }, [onDataDrop]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  return (
    <motion.div
      className="w-full max-w-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="processing"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Data unpacking animation */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              {/* Central icon */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
              >
                <FileText className="w-12 h-12 text-foreground" />
              </motion.div>

              {/* Orbiting particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-foreground/60"
                  style={{
                    top: "50%",
                    left: "50%",
                  }}
                  animate={{
                    x: [0, Math.cos((i / 8) * Math.PI * 2) * 60, 0],
                    y: [0, Math.sin((i / 8) * Math.PI * 2) * 60, 0],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Expanding ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-foreground/20"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </div>

            <p className="text-lg font-medium text-foreground mb-2">
              Unpacking Data
            </p>
            <p className="text-sm text-muted-foreground">
              {fileName}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`block cursor-pointer transition-all duration-300 ${
                isDragging ? "scale-[1.02]" : ""
              }`}
            >
              <input
                type="file"
                accept=".txt,.json,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />

              <motion.div
                className={`glass-panel p-12 text-center border-2 border-dashed transition-colors duration-300 ${
                  isDragging
                    ? "border-foreground bg-foreground/5"
                    : "border-border hover:border-foreground/30"
                }`}
                animate={{
                  boxShadow: isDragging
                    ? "0 0 40px hsl(var(--foreground) / 0.1)"
                    : "0 4px 30px hsl(var(--foreground) / 0.04)",
                }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6"
                  animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                >
                  <Upload className={`w-8 h-8 transition-colors ${
                    isDragging ? "text-foreground" : "text-muted-foreground"
                  }`} />
                </motion.div>

                <h3 className="font-display text-xl font-medium text-foreground mb-2">
                  Drop Your Results
                </h3>
                <p className="text-muted-foreground mb-4">
                  Upload the analysis output from AoU Researcher Workbench
                </p>
                <p className="text-sm text-muted-foreground/60">
                  Accepts .txt, .json, or .csv files
                </p>
              </motion.div>
            </label>

            {/* Demo button */}
            <motion.button
              onClick={() => processFile(new File(["demo"], "demo_results.json"))}
              className="mt-4 mx-auto block text-sm text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              Or use demo data →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
