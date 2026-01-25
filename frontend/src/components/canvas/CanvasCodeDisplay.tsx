import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Download } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import { CanvasFileUpload } from "./CanvasFileUpload";

interface CanvasCodeDisplayProps {
  code: string;
  onClose: () => void;
  onFileUpload?: (data: string) => void;
}

export const CanvasCodeDisplay = ({ code, onClose, onFileUpload }: CanvasCodeDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated_model.py";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (data: string) => {
    console.log("File uploaded:", data);
    onFileUpload?.(data);
  };

  return (
    <motion.div
      className="w-full max-w-4xl"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Code Display Panel */}
      <div className="glass-panel overflow-hidden flex flex-col h-[55vh]">
        {/* Editor header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
              <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
            </div>
            <span className="text-sm text-muted-foreground font-mono">
              generated_model.py
            </span>
            <span className="px-2 py-0.5 rounded text-xs bg-foreground/10 text-foreground">
              Generated
            </span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4 text-muted-foreground" />
            </motion.button>
            <motion.button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                copied
                  ? "bg-foreground text-background"
                  : "bg-muted hover:bg-muted/80"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Copied!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copy</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              New Model
            </motion.button>
          </div>
        </div>

        {/* Code content */}
        <div className="flex-1 overflow-auto p-4 bg-background/50">
          <pre className="text-sm font-mono leading-relaxed">
            <code ref={codeRef} className="language-python">
              {code}
            </code>
          </pre>
        </div>

        {/* Prism styles */}
        <style>{`
          code[class*="language-"],
          pre[class*="language-"] {
            color: hsl(var(--foreground));
            background: none;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
          }
          .token.comment { color: hsl(var(--muted-foreground)); font-style: italic; }
          .token.string { color: hsl(var(--foreground) / 0.8); }
          .token.keyword { color: hsl(var(--foreground)); font-weight: 600; }
          .token.function { color: hsl(var(--foreground) / 0.9); }
          .token.number { color: hsl(var(--muted-foreground)); }
          .token.operator { color: hsl(var(--muted-foreground)); }
          .token.class-name { color: hsl(var(--foreground)); }
          .token.punctuation { color: hsl(var(--muted-foreground)); }
          .token.decorator { color: hsl(var(--muted-foreground)); }
          .token.builtin { color: hsl(var(--foreground) / 0.85); }
        `}</style>
      </div>

      {/* File Upload Zone */}
      <CanvasFileUpload onFileUpload={handleFileUpload} />
    </motion.div>
  );
};
