import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle } from "lucide-react";

interface CanvasFileUploadProps {
  onFileUpload: (data: string) => void;
}

export const CanvasFileUpload = ({ onFileUpload }: CanvasFileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isComplete, setIsComplete] = useState(false);

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

    // Read file content
    const text = await file.text();
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsProcessing(false);
    setIsComplete(true);
    
    // Notify parent with file content
    onFileUpload(text);
  }, [onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.txt')) {
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
      className="w-full mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {isComplete ? (
          <motion.div
            key="complete"
            className="flex items-center justify-center gap-3 py-4 px-6 rounded-lg border border-border bg-muted/30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-foreground">{fileName} uploaded successfully</span>
          </motion.div>
        ) : isProcessing ? (
          <motion.div
            key="processing"
            className="flex items-center justify-center gap-3 py-6 px-6 rounded-lg border border-border bg-muted/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FileText className="w-5 h-5 text-foreground" />
            </motion.div>
            <span className="text-sm text-muted-foreground">Processing {fileName}...</span>
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
              className="block cursor-pointer"
            >
              <input
                type="file"
                accept=".txt"
                onChange={handleFileSelect}
                className="hidden"
              />

              <motion.div
                className={`flex items-center justify-center gap-3 py-6 px-6 rounded-lg border-2 border-dashed transition-colors duration-200 ${
                  isDragging
                    ? "border-foreground/50 bg-foreground/5"
                    : "border-border hover:border-foreground/30 bg-muted/20"
                }`}
                animate={{
                  scale: isDragging ? 1.01 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <Upload className={`w-5 h-5 transition-colors ${
                  isDragging ? "text-foreground" : "text-muted-foreground"
                }`} />
                <span className={`text-sm transition-colors ${
                  isDragging ? "text-foreground" : "text-muted-foreground"
                }`}>
                  Drop your results file here or click to upload
                </span>
                <span className="text-xs text-muted-foreground/60">(.txt)</span>
              </motion.div>
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
