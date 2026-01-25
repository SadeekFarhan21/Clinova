import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import clinovaLogo from "@/assets/clinova-logo.svg";

export const GlassNavbar = () => {
  const location = useLocation();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b
                 bg-white/10 dark:bg-white/5 backdrop-blur-xl
                 border-white/20 dark:border-white/10
                 shadow-lg shadow-black/5"
      style={{
        boxShadow: '0 1px 0 rgba(255,255,255,0.15), 0 12px 50px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-center">
        {/* Logo - positioned absolutely on the left */}
        <Link to="/" className="absolute left-6 flex items-center">
          <motion.img
            src={clinovaLogo}
            alt="Clinova - Virtual Clinical Trials"
            className="h-10 w-auto object-contain"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
        </Link>

        {/* Navigation - centered */}
        <nav className="hidden md:flex items-center gap-8">
          <NavItem to="/" active={location.pathname === "/"}>
            Home
          </NavItem>
          <NavItem to="/research" active={location.pathname === "/research"}>
            Canvas
          </NavItem>
          <NavItem to="/console" active={location.pathname === "/console"}>
            Drug Intelligence
          </NavItem>
        </nav>
      </div>
    </motion.header>
  );
};

interface NavItemProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavItem = ({ to, active, children }: NavItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (active) {
      // Dispatch custom event to reset the page state
      window.dispatchEvent(new CustomEvent('nav-reset', { detail: { path: to } }));
      e.preventDefault();
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`text-sm font-serif tracking-wide transition-all duration-200 ${
        active 
          ? "text-foreground font-medium" 
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
};
