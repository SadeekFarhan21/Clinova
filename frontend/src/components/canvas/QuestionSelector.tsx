import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { TypewriterText } from "./TypewriterText";
import { ShimmerParticles } from "./ShimmerParticles";
import researchData from "@/data/research-questions.json";

interface QuestionSelectorProps {
  isVisible: boolean;
  onSelect: (question: string) => void;
  onBack: () => void;
}

const THINKING_MESSAGES = [
  "Analyzing your research intent...",
  "Identifying causal frameworks...",
  "Generating relevant questions...",
];

// Fisher-Yates shuffle to get random questions
const getRandomQuestions = (count: number) => {
  const shuffled = [...researchData.questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const QuestionSelector = ({ isVisible, onSelect, onBack }: QuestionSelectorProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isThinking, setIsThinking] = useState(true);
  const [thinkingMessageIndex, setThinkingMessageIndex] = useState(0);
  const [thinkingProgress, setThinkingProgress] = useState(0);
  const [questionsRevealed, setQuestionsRevealed] = useState(0);

  // Get 3 random questions when component becomes visible
  const randomQuestions = useMemo(() => {
    if (isVisible) {
      return getRandomQuestions(3);
    }
    return [];
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setIsThinking(true);
      setThinkingMessageIndex(0);
      setThinkingProgress(0);
      setQuestionsRevealed(0);
      setSelectedIndex(null);
      return;
    }

    // Cycle through thinking messages
    const messageInterval = setInterval(() => {
      setThinkingMessageIndex((prev) => {
        if (prev >= THINKING_MESSAGES.length - 1) {
          clearInterval(messageInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    // Animate progress during thinking
    const progressInterval = setInterval(() => {
      setThinkingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 100);

    // End thinking phase after 2.5 seconds
    const thinkingTimer = setTimeout(() => {
      setIsThinking(false);
    }, 2500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearTimeout(thinkingTimer);
    };
  }, [isVisible]);

  // Reveal all questions simultaneously after thinking
  useEffect(() => {
    if (isThinking || !isVisible) return;
    
    // All questions appear at once with staggered animation delays
    setQuestionsRevealed(randomQuestions.length);
  }, [isThinking, isVisible, randomQuestions.length]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setTimeout(() => {
      onSelect(randomQuestions[index].prompt);
    }, 300);
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="w-full max-w-4xl"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence mode="wait">
            {isThinking ? (
              /* Thinking Phase */
              <motion.div
                key="thinking"
                className="flex flex-col items-center gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Glass container for thinking */}
                <div
                  className="w-full max-w-md px-8 py-8 rounded-[2rem] border border-white/20 bg-white/10"
                  style={{
                    backdropFilter: "blur(24px) saturate(180%)",
                    WebkitBackdropFilter: "blur(24px) saturate(180%)",
                    boxShadow: "0 8px 32px hsl(var(--foreground) / 0.08), inset 0 1px 1px rgba(255,255,255,0.3)",
                  }}
                >
                  {/* Thinking message with typewriter effect */}
                  <div className="h-6 mb-6 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={thinkingMessageIndex}
                        className="text-center text-foreground/80 text-sm font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TypewriterText 
                          text={THINKING_MESSAGES[thinkingMessageIndex]} 
                          speed={25}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Thin loading bar */}
                  <Progress 
                    value={thinkingProgress} 
                    className="h-1 bg-white/10"
                  />
                </div>
              </motion.div>
            ) : (
              /* Questions Phase */
              <motion.div
                key="questions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Header */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <h2 className="font-display text-2xl font-medium text-foreground mb-2">
                    Select a Research Question
                  </h2>
                  <p className="text-muted-foreground">
                    Choose the causal question that best matches your research objective
                  </p>
                </motion.div>

                {/* Questions list */}
                <div className="space-y-4">
                  {randomQuestions.map((question, index) => {
                    const isRevealed = index < questionsRevealed;
                    
                    return (
                      <motion.button
                        key={question.id}
                        onClick={() => handleSelect(index)}
                        className={`relative w-full text-left p-5 rounded-2xl border transition-all duration-500 group ${
                          selectedIndex === index
                            ? "bg-foreground text-background border-foreground"
                            : "bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                        style={{
                          backdropFilter: selectedIndex !== index ? "blur(12px)" : undefined,
                          WebkitBackdropFilter: selectedIndex !== index ? "blur(12px)" : undefined,
                        }}
                        initial={{ 
                          opacity: 0, 
                          y: 100, 
                          scale: 0.8,
                          filter: "blur(4px)"
                        }}
                        animate={isRevealed ? { 
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)"
                        } : {}}
                        transition={{ 
                          duration: 2.2,
                          delay: index * 0.12,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        whileHover={{ scale: 1.015, transition: { duration: 0.3 } }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!isRevealed}
                      >
                        {/* Shimmer particles on reveal */}
                        <ShimmerParticles isActive={isRevealed} count={8} />
                        
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                          {/* Selection circle */}
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              selectedIndex === index
                                ? "bg-background border-background"
                                : "border-foreground/20 group-hover:border-foreground/40"
                            }`}
                          >
                            {selectedIndex === index && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Check className="w-3 h-3 text-foreground" />
                              </motion.div>
                            )}
                          </div>
                          
                          {/* Topic badge - refined styling */}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                              selectedIndex === index
                                ? "bg-background/20 text-background/90"
                                : "bg-foreground/5 text-foreground/50 group-hover:bg-foreground/10 group-hover:text-foreground/70"
                            }`}
                          >
                            {question.topic}
                          </span>
                        </div>
                        
                        <p
                          className={`text-sm leading-relaxed pl-8 relative z-10 ${
                            selectedIndex === index
                              ? "text-background/90"
                              : "text-foreground/70 group-hover:text-foreground/90"
                          }`}
                        >
                          {question.prompt}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Back button */}
                <motion.div
                  className="flex justify-center mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: questionsRevealed >= randomQuestions.length ? 1 : 0,
                    y: questionsRevealed >= randomQuestions.length ? 0 : 20
                  }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    onClick={onBack}
                    className="text-sm text-muted-foreground/60 hover:text-foreground transition-colors duration-200"
                  >
                    ← Back to prompt
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
