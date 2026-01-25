import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, ArrowRight } from "lucide-react";

interface ResearchPromptProps {
  onSubmit: (prompt: string) => void;
}

export const ResearchPrompt = ({ onSubmit }: ResearchPromptProps) => {
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  const suggestions = [
    "Analyze SGLT2 inhibitors for heart failure outcomes",
    "Compare GLP-1 agonists across diabetic subgroups",
    "Evaluate statin efficacy in elderly populations",
  ];

  return (
    <motion.div
      className="w-full max-w-3xl mesh-gradient-glow"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ 
        opacity: 0, 
        y: -100, 
        scale: 0.9,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
      }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Mode indicator */}
      <motion.div 
        className="flex items-center justify-center gap-2 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="glass-badge flex items-center gap-2">
          <Search className="w-3 h-3" />
          <span className="tracking-wider uppercase">Research Mode</span>
        </div>
      </motion.div>

      {/* Main prompt input */}
      <form onSubmit={handleSubmit}>
        <motion.div
          className={`relative glass-panel p-2 transition-all duration-200 ${
            isFocused ? "ring-1 ring-foreground/10" : ""
          }`}
          style={{
            boxShadow: isFocused 
              ? "0 20px 60px hsl(0 0% 0% / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.1)"
              : "0 10px 40px hsl(0 0% 0% / 0.06), inset 0 1px 0 hsl(0 0% 100% / 0.08)"
          }}
        >
          <div className="flex items-center gap-4 p-4">
            <Sparkles className="w-5 h-5 text-muted-foreground/60 flex-shrink-0" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Describe your causal research question..."
              className="flex-1 bg-transparent outline-none text-lg text-foreground placeholder:text-muted-foreground/60 font-light"
            />
            <motion.button
              type="submit"
              disabled={!prompt.trim()}
              className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
                prompt.trim()
                  ? "glass-button"
                  : "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
              }`}
              whileHover={prompt.trim() ? { scale: 1.02 } : {}}
              whileTap={prompt.trim() ? { scale: 0.98 } : {}}
            >
              Research
              {prompt.trim() && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </div>
        </motion.div>
      </form>

      {/* Suggestions */}
      <motion.div
        className="mt-8 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs text-muted-foreground/60 text-center mb-4 tracking-wide">
          Try a sample query
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="glass-card-interactive px-4 py-2 rounded-full text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
