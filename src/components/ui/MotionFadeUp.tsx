
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import React from "react";

interface Props {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

const MotionFadeUp = ({ children, delay = 0, duration = 0.6 }: Props) => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ delay, duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default MotionFadeUp;
