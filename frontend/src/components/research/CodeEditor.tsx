import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Download, ExternalLink, X } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-python";

interface CodeEditorProps {
  code: string;
  onCopied: () => void;
}

export const CodeEditor = ({ code, onCopied }: CodeEditorProps) => {
  const [copied, setCopied] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onCopied();
    }, 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "causal_analysis.py";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      className="w-full max-w-4xl h-[70vh] flex"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Code editor panel */}
      <div className="flex-1 glass-panel overflow-hidden flex flex-col">
        {/* Editor header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
              <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
            </div>
            <span className="text-sm text-muted-foreground font-mono">
              causal_analysis.py
            </span>
            <span className="px-2 py-0.5 rounded text-xs bg-foreground/10 text-foreground">
              Verified
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
                    <span className="text-sm">Copy to Clipboard</span>
                  </motion.div>
                )}
              </AnimatePresence>
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

        {/* Line numbers gutter effect */}
        <style>{`
          code[class*="language-"],
          pre[class*="language-"] {
            color: hsl(var(--foreground));
            background: none;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
          }
          .token.comment { color: hsl(var(--muted-foreground)); }
          .token.string { color: hsl(var(--foreground) / 0.8); }
          .token.keyword { color: hsl(var(--foreground)); font-weight: 600; }
          .token.function { color: hsl(var(--foreground) / 0.9); }
          .token.number { color: hsl(var(--muted-foreground)); }
          .token.operator { color: hsl(var(--muted-foreground)); }
          .token.class-name { color: hsl(var(--foreground)); }
          .token.punctuation { color: hsl(var(--muted-foreground)); }
        `}</style>
      </div>

      {/* NIH Bridge Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-panel p-8 max-w-md text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-display text-xl font-medium text-foreground mb-2">
                NIH All of Us Integration
              </h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                This script is optimized for the NIH All of Us (AoU) Researcher Workbench environment. 
                Copy the script or download the file to run the causal analysis in your workspace.
              </p>
              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={() => setShowOverlay(false)}
                  className="px-6 py-3 rounded-xl bg-foreground text-background font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Script
                </motion.button>
              </div>
              <button
                onClick={() => setShowOverlay(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
