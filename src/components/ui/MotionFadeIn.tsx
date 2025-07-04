import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface MotionFadeProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
}

const MotionFadeIn = ({ children, delay = 0, duration = 0.8, y = 40 }: MotionFadeProps) => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: false });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default MotionFadeIn;
