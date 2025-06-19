// components/MotionFadeIn.tsx
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import React from "react";

interface MotionFadeInProps {
  children: React.ReactNode;
  y?: number;
  delay?: number;
  duration?: number;
}

const MotionFadeIn: React.FC<MotionFadeInProps> = ({
  children,
  y = 40,
  delay = 0,
  duration = 0.8,
}) => {
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
