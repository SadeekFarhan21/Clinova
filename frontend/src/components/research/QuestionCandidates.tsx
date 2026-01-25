import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";

interface Question {
  id: number;
  topic: string;
  prompt: string;
}

interface QuestionCandidatesProps {
  questions: Question[];
  onSelect: (question: Question) => void;
}

export const QuestionCandidates = ({ questions, onSelect }: QuestionCandidatesProps) => {
  return (
    <motion.div
      className="w-full max-w-3xl space-y-4 mesh-gradient-glow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="inline-flex items-center gap-2 glass-badge mb-4">
          <Sparkles className="w-3 h-3" />
          <span>Agent 1 Complete</span>
        </div>
        <h3 className="font-display text-xl font-medium text-foreground mb-2">
          Select a Research Direction
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose one of the following causal research questions to proceed
        </p>
      </motion.div>

      <div className="space-y-3">
        {questions.map((question, index) => (
          <motion.button
            key={question.id}
            onClick={() => onSelect(question)}
            className="w-full glass-card-interactive p-6 text-left group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <span className="glass-badge mb-3 inline-block">
                  {question.topic}
                </span>
                <p className="text-sm text-foreground leading-relaxed">
                  {question.prompt}
                </p>
              </div>
              <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full flex items-center justify-center glass-panel opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ChevronRight className="w-4 h-4 text-foreground" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
