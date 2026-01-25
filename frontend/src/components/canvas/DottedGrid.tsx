import { motion } from "framer-motion";

export const DottedGrid = () => {
  return (
    <motion.div
      className="absolute inset-0 dotted-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
    />
  );
};
