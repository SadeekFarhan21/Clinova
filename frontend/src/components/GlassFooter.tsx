import { motion } from "framer-motion";

export const GlassFooter = () => {
  return (
    <motion.footer
      className="fixed bottom-0 left-0 right-0 z-40 border-t
                 bg-white/10 dark:bg-white/5 backdrop-blur-xl
                 border-white/20 dark:border-white/10"
      style={{
        boxShadow: '0 -1px 0 rgba(255,255,255,0.15), 0 -12px 50px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.18)'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground/50">
          © 2025 Clinova
        </p>
        
        <div className="flex items-center gap-6">
          <FooterLink href="#">Privacy</FooterLink>
          <FooterLink href="#">Terms</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </div>
      </div>
    </motion.footer>
  );
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink = ({ href, children }: FooterLinkProps) => (
  <a
    href={href}
    className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors duration-200"
  >
    {children}
  </a>
);
