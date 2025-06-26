
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface MotionFadeProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
}

const MotionFadeLeft = ({ children, delay = 0, duration = 0.7, x = -80 }: MotionFadeProps) => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: false });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default MotionFadeLeft;
