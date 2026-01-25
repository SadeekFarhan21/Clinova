import { motion } from "framer-motion";

const buzzwords = [
  "Virtual Clinical Trials",
  "AI-Driven Research",
  "Real-World Evidence",
  "Drug Intelligence",
  "Precision Medicine",
];

export const InfiniteScrollTicker = () => {
  // Duplicate the array for seamless loop
  const items = [...buzzwords, ...buzzwords];

  return (
    <div className="relative w-full overflow-hidden py-6 border-y border-foreground/10">
      {/* Left gradient fade */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-40 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, hsl(var(--background)), transparent)",
        }}
      />
      
      {/* Right gradient fade */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-40 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to left, hsl(var(--background)), transparent)",
        }}
      />

      <motion.div
        className="flex items-center gap-16 whitespace-nowrap"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
      >
        {items.map((word, index) => (
          <div key={index} className="flex items-center gap-16">
            <span className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-foreground/60">
              {word}
            </span>
            <span className="text-foreground/20 text-xs">
              ●
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
