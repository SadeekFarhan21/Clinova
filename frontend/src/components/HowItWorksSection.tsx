import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  MousePointer2, 
  Brain, 
  GitBranch, 
  Code2, 
  BarChart3, 
  SearchCode,
  ChevronRight,
  ChevronDown
} from "lucide-react";

interface StepCardProps {
  stepNumber: string;
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
}

const StepCard = ({ stepNumber, title, description, children, delay = 0 }: StepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3 } 
      }}
      className="group relative flex flex-col rounded-3xl p-6 cursor-pointer h-[320px]
                 bg-white/10 dark:bg-white/5 backdrop-blur-xl
                 border border-white/20 dark:border-white/10
                 shadow-lg shadow-black/5
                 transition-all duration-300 ease-out
                 hover:bg-white/15 dark:hover:bg-white/10
                 hover:border-white/40 dark:hover:border-white/25
                 hover:shadow-2xl hover:shadow-primary/10
                 glass-shimmer"
    >
      {/* Step Badge */}
      <div className="absolute top-4 left-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-muted/80 
                        border border-border/40 text-xs font-medium text-muted-foreground">
          {stepNumber}
        </span>
      </div>

      {/* Visual Stage - fixed height for uniformity */}
      <div className="mt-10 mb-6">
        <div className="w-full h-32 rounded-2xl 
                       bg-gradient-to-br from-white/20 to-white/5 dark:from-white/10 dark:to-white/[0.02]
                       backdrop-blur-md border border-white/30 dark:border-white/15
                       flex items-center justify-center p-4 overflow-hidden
                       shadow-inner shadow-white/10">
          {children}
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-2 mt-auto">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

const ArrowConnector = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: delay + 0.3 }}
      className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg 
                 bg-muted/60 border border-border/40 flex-shrink-0"
    >
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </motion.div>
  );
};

const MobileArrowConnector = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: delay + 0.3 }}
      className="flex lg:hidden items-center justify-center w-10 h-10 rounded-lg 
                 bg-muted/60 border border-border/40 mx-auto my-4"
    >
      <ChevronDown className="w-5 h-5 text-muted-foreground" />
    </motion.div>
  );
};

// Visual Stage Components
const SearchBarVisual = () => (
  <div className="relative w-full">
    {/* Search bar mock */}
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl 
                    bg-gradient-to-r from-white/30 to-white/10 dark:from-white/15 dark:to-white/5
                    backdrop-blur-sm border border-white/40 dark:border-white/20
                    shadow-lg shadow-black/10">
      <Plus className="w-4 h-4 text-foreground/70 flex-shrink-0 drop-shadow-sm" 
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }} />
      <span className="text-xs text-muted-foreground truncate flex-1">
        Are contrast media drugs safe...
      </span>
      <Search className="w-4 h-4 text-foreground/70 flex-shrink-0"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }} />
    </div>
    {/* Mouse cursor overlay */}
    <motion.div
      animate={{ x: [0, 5, 0], y: [0, 3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-1 right-1/3"
    >
      <MousePointer2 className="w-5 h-5 text-foreground" 
                     style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.25))' }} />
    </motion.div>
  </div>
);

const LogicFlowVisual = () => (
  <div className="flex items-center justify-center gap-4 w-full">
    {/* Brain icon */}
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="p-3 rounded-xl 
                 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/20 dark:to-white/5
                 backdrop-blur-sm border border-white/50 dark:border-white/25
                 shadow-lg shadow-black/10"
    >
      <Brain className="w-6 h-6 text-foreground"
             style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.2))' }} />
    </motion.div>
    
    {/* Connection lines */}
    <div className="flex items-center gap-1">
      <div className="w-4 h-px bg-gradient-to-r from-transparent to-white/50" />
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronRight className="w-3 h-3 text-foreground/60" 
                      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }} />
      </motion.div>
      <div className="w-4 h-px bg-gradient-to-r from-white/50 to-transparent" />
    </div>
    
    {/* Flowchart */}
    <div className="p-3 rounded-xl 
                    bg-gradient-to-br from-white/40 to-white/10 dark:from-white/20 dark:to-white/5
                    backdrop-blur-sm border border-white/50 dark:border-white/25
                    shadow-lg shadow-black/10">
      <GitBranch className="w-6 h-6 text-foreground"
                 style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.2))' }} />
    </div>
  </div>
);

const CodeEditorVisual = () => (
  <div className="w-full">
    {/* Window chrome */}
    <div className="flex items-center gap-1.5 px-3 py-2 
                    bg-gradient-to-r from-white/20 to-white/10 dark:from-white/10 dark:to-white/5
                    rounded-t-xl border-b border-white/20 backdrop-blur-sm">
      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 shadow-sm shadow-rose-500/30" />
      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-sm shadow-amber-500/30" />
      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/30" />
    </div>
    
    {/* Code area */}
    <div className="relative px-4 py-6 
                    bg-gradient-to-b from-white/15 to-white/5 dark:from-white/10 dark:to-white/[0.02]
                    rounded-b-xl flex items-center justify-center backdrop-blur-sm">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Code2 className="w-12 h-12 text-foreground/70"
               style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))' }} />
      </motion.div>
      
      {/* .py badge */}
      <div className="absolute bottom-2 right-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded 
                        bg-gradient-to-r from-white/30 to-white/15 dark:from-white/15 dark:to-white/5
                        border border-white/40 dark:border-white/20
                        text-[10px] font-mono text-foreground/70 shadow-sm">
          .py
        </span>
      </div>
    </div>
  </div>
);

const DataAnalysisVisual = () => (
  <div className="relative w-full h-full flex items-end justify-center gap-2 p-4">
    {/* Bar chart with gradients */}
    <motion.div
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-4 h-8 bg-gradient-to-t from-foreground/30 to-foreground/10 rounded-t origin-bottom shadow-sm"
    />
    <motion.div
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-4 h-14 bg-gradient-to-t from-foreground/40 to-foreground/15 rounded-t origin-bottom shadow-sm"
    />
    <motion.div
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-4 h-10 bg-gradient-to-t from-foreground/35 to-foreground/12 rounded-t origin-bottom shadow-sm"
    />
    <motion.div
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-4 h-16 bg-gradient-to-t from-foreground/50 to-foreground/20 rounded-t origin-bottom shadow-md"
    />
    <motion.div
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="w-4 h-12 bg-gradient-to-t from-foreground/45 to-foreground/18 rounded-t origin-bottom shadow-sm"
    />
    
    {/* Magnifying glass overlay */}
    <motion.div
      animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <SearchCode className="w-10 h-10 text-foreground/70"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
    </motion.div>
  </div>
);

export const HowItWorksSection = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground tracking-tight">
            How it works
          </h2>
          <p className="text-muted-foreground text-lg md:text-right">
            Your Workflow, Reimagined
          </p>
        </motion.div>

        {/* Cards Grid with Connectors */}
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-0 lg:gap-4">
          {/* Card 1 */}
          <div className="flex-1 min-w-0 lg:basis-0">
            <StepCard
              stepNumber="Step 01"
              title="Clinical Question"
              description="Input your medical question and drug."
              delay={0.1}
            >
              <SearchBarVisual />
            </StepCard>
          </div>

          {/* Mobile Arrow */}
          <MobileArrowConnector delay={0.1} />
          
          {/* Desktop Arrow 1→2 */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <ArrowConnector delay={0.1} />
          </div>

          {/* Card 2 */}
          <div className="flex-1 min-w-0 lg:basis-0">
            <StepCard
              stepNumber="Step 02"
              title="Agent Designs"
              description="AI designs rigorous virtual trial protocol."
              delay={0.2}
            >
              <LogicFlowVisual />
            </StepCard>
          </div>

          {/* Mobile Arrow */}
          <MobileArrowConnector delay={0.2} />
          
          {/* Desktop Arrow 2→3 */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <ArrowConnector delay={0.2} />
          </div>

          {/* Card 3 */}
          <div className="flex-1 min-w-0 lg:basis-0">
            <StepCard
              stepNumber="Step 03"
              title="Agent Codes"
              description="Writes executable Python code for the trial."
              delay={0.3}
            >
              <CodeEditorVisual />
            </StepCard>
          </div>

          {/* Mobile Arrow */}
          <MobileArrowConnector delay={0.3} />
          
          {/* Desktop Arrow 3→4 */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <ArrowConnector delay={0.3} />
          </div>

          {/* Card 4 */}
          <div className="flex-1 min-w-0 lg:basis-0">
            <StepCard
              stepNumber="Step 04"
              title="Agent Analyzes"
              description="Analyzes data for medical-grade results."
              delay={0.4}
            >
              <DataAnalysisVisual />
            </StepCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
