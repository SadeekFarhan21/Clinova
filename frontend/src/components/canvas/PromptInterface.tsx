import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowRight } from "lucide-react";

interface PromptInterfaceProps {
  isVisible: boolean;
  onSubmit: (prompt: string) => void;
}

export const PromptInterface = ({ isVisible, onSubmit }: PromptInterfaceProps) => {
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Question header */}
          <motion.p
            className="text-center text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            What would you like to create?
          </motion.p>

          {/* Input container - Standalone glass effect */}
          <motion.div
            className={`relative flex items-center gap-4 px-6 py-5 rounded-[2rem] border transition-all duration-300 ${
              isFocused 
                ? "border-white/30 bg-white/20" 
                : "border-white/20 bg-white/10"
            }`}
            style={{
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
            }}
            animate={{
              boxShadow: isFocused 
                ? "0 8px 32px hsl(var(--foreground) / 0.1), inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 1px rgba(255,255,255,0.1)"
                : "0 4px 24px hsl(var(--foreground) / 0.06), inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -1px 1px rgba(255,255,255,0.05)"
            }}
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your model..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
            
            <motion.button
              onClick={handleSubmit}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                prompt.trim() 
                  ? "bg-foreground text-background" 
                  : "bg-muted text-muted-foreground"
              }`}
              whileHover={prompt.trim() ? { scale: 1.05 } : {}}
              whileTap={prompt.trim() ? { scale: 0.95 } : {}}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
