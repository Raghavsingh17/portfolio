"use client";

import { memo } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";

interface AboutBackgroundProps {
  scrollYProgress?: MotionValue<number>;
}

function AboutBackgroundComponent({ scrollYProgress }: AboutBackgroundProps) {
  // Subtle scroll-driven atmospheric breathing
  const glowScale = useTransform(
    scrollYProgress || new MotionValue(0),
    [0, 0.5, 1],
    [1, 1.15, 1]
  );
  const glowOpacity = useTransform(
    scrollYProgress || new MotionValue(0),
    [0, 0.4, 0.8],
    [0.7, 0.85, 0.6]
  );

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none"
    >
      {/* 1. Deep Celestial Base Radial Glow behind the Avatar */}
      <motion.div
        style={{
          scale: glowScale,
          opacity: glowOpacity,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] sm:w-[1000px] h-[750px] bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-cyan-400/8 blur-[160px] rounded-full"
      />

      {/* 2. Secondary Cobalt Atmospheric Aura (echoing the avatar's signature blue tone) */}
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[130px] rounded-full" />

      {/* 3. Subtle Cybernetic Specular Rim on the right */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-500/8 blur-[140px] rounded-full" />

      {/* 4. Cinematic Vignette (Soft dark border falloff for focus) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(9, 10, 15, 0.65) 80%, rgba(9, 10, 15, 0.95) 100%)",
        }}
      />

      {/* 5. Minimal Ambient Depth Grid (Very low opacity, editorial aesthetic) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 80%)",
        }}
      />
    </div>
  );
}

export const AboutBackground = memo(AboutBackgroundComponent);
