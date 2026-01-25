import { motion } from "framer-motion";

export const SkeletonDashboard = () => {
  return (
    <motion.div
      className="w-full max-w-4xl mesh-gradient-glow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Dashboard skeleton with glass styling */}
      <div className="grid grid-cols-3 gap-4">
        {/* Main chart skeleton */}
        <motion.div
          className="col-span-2 h-64 rounded-xl overflow-hidden glass-panel"
          animate={{
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Chart bars skeleton */}
          <div className="h-full flex items-end justify-around p-6 gap-2">
            {[0.6, 0.8, 0.5, 0.9, 0.7, 0.4, 0.85].map((height, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t"
                style={{ 
                  height: `${height * 100}%`,
                  background: "hsl(var(--foreground) / 0.08)"
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Side metrics skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="h-[72px] rounded-xl glass-panel"
              animate={{
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.2 
              }}
            />
          ))}
        </div>

        {/* Bottom row skeletons */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-32 rounded-xl glass-panel"
            animate={{
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.5 + i * 0.15 
            }}
          />
        ))}
      </div>

      {/* Loading text */}
      <motion.p
        className="text-center text-sm text-muted-foreground/60 mt-8 tracking-wide"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Preparing analysis workspace...
      </motion.p>
    </motion.div>
  );
};
