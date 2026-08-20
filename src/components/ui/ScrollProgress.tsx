"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useTheme } from "@/src/context/ThemeContext";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const { currentPreset } = useTheme();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        scaleX,
        background: `linear-gradient(90deg, ${currentPreset.colors.accent}, ${currentPreset.colors.primary})`,
        boxShadow: `0 0 12px ${currentPreset.colors.primaryGlow}`,
      }}
      className="fixed top-0 left-0 right-0 z-[10000] h-1 origin-left"
    />
  );
}
