import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AmbientBackground } from "@/components/AmbientBackground";
import { ThreeBackground } from "@/components/ThreeBackground";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { DocumentationModal } from "@/components/DocumentationModal";
import { InfiniteScrollTicker } from "@/components/InfiniteScrollTicker";

const Index = () => {
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative min-h-[calc(100vh-7.5rem)] flex items-center justify-center overflow-hidden">
        <AmbientBackground />
        <ThreeBackground />
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/60 backdrop-blur-sm border border-border/60 text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-foreground/60 animate-pulse-subtle" />
                Medical-grade AI infrastructure
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-5xl md:text-7xl font-semibold tracking-tight text-foreground mb-6"
            >
              The future of
              <br />
              <span className="text-gradient-clinical">virtual biotechnology</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed"
            >
              Precision-engineered infrastructure for training, deploying, and monitoring 
              AI models with clinical accuracy.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/research">
                <motion.button
                  className="glass-button flex items-center gap-3 text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  Open Canvas
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              
              <motion.button
                onClick={() => setIsDocsOpen(true)}
                className="glass-button-secondary flex items-center gap-3 text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <BookOpen className="w-4 h-4" />
                View Documentation
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div 
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          style={{
            background: "linear-gradient(to top, hsl(var(--background)), transparent)",
          }}
        />
      </div>

      {/* Infinite Scroll Ticker - pulled up with negative margin */}
      <div className="-mt-20 relative z-20">
        <InfiniteScrollTicker />
      </div>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Documentation Modal */}
      <DocumentationModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </MainLayout>
  );
};

export default Index;
