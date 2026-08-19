"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[10000] h-1 origin-left bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]"
    />
  );
}
