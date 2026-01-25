import { motion } from "framer-motion";
import { useMemo } from "react";

interface ShimmerParticlesProps {
  isActive: boolean;
  count?: number;
}

export const ShimmerParticles = ({ isActive, count = 12 }: ShimmerParticlesProps) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 0.5,
      duration: Math.random() * 2 + 2,
    }));
  }, [count]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-foreground/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ 
            opacity: 0, 
            scale: 0,
            y: 20 
          }}
          animate={{ 
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
            y: [20, -30],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
      
      {/* Shimmer gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          duration: 1.5,
          delay: 0.2,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
