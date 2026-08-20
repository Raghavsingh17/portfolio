"use client";

import { motion } from "framer-motion";
import { useTheme, ThemeId } from "@/src/context/ThemeContext";
import { LightfallBackground } from "./LightfallBackground";
import { ParticlesBackground } from "./ParticlesBackground";

interface HeroAboutBackgroundProps {
  className?: string;
}

export function HeroAboutBackground({ className = "" }: HeroAboutBackgroundProps) {
  const { theme } = useTheme();

  // Dynamic Orb Color Presets per theme
  const orbColorsMap: Record<ThemeId, string[]> = {
    dark: [
      "rgba(6, 182, 212, 0.22)",  // Neon Cyan
      "rgba(139, 92, 246, 0.22)", // Vivid Violet
      "rgba(59, 130, 246, 0.22)", // Electric Blue
      "rgba(236, 72, 153, 0.18)",  // Hot Pink
    ],
    "tokyo-night": [
      "rgba(187, 154, 247, 0.22)", // Soft Violet
      "rgba(247, 118, 142, 0.22)", // Soft Pink
      "rgba(67, 56, 202, 0.22)",   // Iris
      "rgba(217, 70, 239, 0.18)",   // Magenta
    ],
    cyberpunk: [
      "rgba(0, 240, 255, 0.24)",  // Neon Cyan
      "rgba(255, 0, 127, 0.24)",  // Neon Pink
      "rgba(168, 85, 247, 0.24)",  // Neon Purple
      "rgba(59, 130, 246, 0.18)",  // Electric Blue
    ],
    dracula: [
      "rgba(189, 147, 249, 0.22)", // Purple
      "rgba(80, 250, 123, 0.2)",   // Neon Green
      "rgba(255, 121, 198, 0.2)",  // Pink
      "rgba(139, 92, 246, 0.18)",  // Violet
    ],
    "nord-ice": [
      "rgba(136, 192, 208, 0.22)", // Frost Cyan
      "rgba(129, 161, 193, 0.22)", // Polar Blue
      "rgba(94, 129, 172, 0.22)",  // Deep Ice
      "rgba(143, 188, 187, 0.18)", // Mint Cyan
    ],
    "emerald-matrix": [
      "rgba(16, 185, 129, 0.24)",  // Emerald Green
      "rgba(52, 211, 153, 0.24)",  // Mint Accent
      "rgba(5, 150, 105, 0.22)",   // Deep Jade
      "rgba(16, 185, 129, 0.18)",  // Soft Emerald
    ],
    catppuccin: [
      "rgba(203, 166, 247, 0.22)", // Mauve
      "rgba(245, 224, 220, 0.2)",  // Rosewater
      "rgba(243, 139, 168, 0.2)",  // Red/Pink
      "rgba(180, 190, 254, 0.18)", // Lavender
    ],
    "sunset-horizon": [
      "rgba(245, 158, 11, 0.24)",  // Amber Gold
      "rgba(244, 63, 94, 0.22)",   // Sunset Rose
      "rgba(236, 72, 153, 0.2)",   // Pink
      "rgba(249, 115, 22, 0.18)",  // Orange
    ],
  };

  const orbColors = orbColorsMap[theme] || orbColorsMap.dark;

  return (
    <div className={`pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden ${className}`}>
      {/* 1. Base Layer: Vibrant Multi-Tone Lightfall Vertical Beams */}
      <LightfallBackground count={55} speed={1.8} />

      {/* 2. Middle Layer: Floating Ambient Glowing Orbs / Bokeh Spheres */}
      <motion.div
        animate={{
          x: [-30, 30, -30],
          y: [-30, 30, -30],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: orbColors[0] }}
        className="absolute -top-24 left-1/4 h-[480px] w-[480px] rounded-full blur-[130px]"
      />

      <motion.div
        animate={{
          x: [30, -30, 30],
          y: [30, -40, 30],
          scale: [1.1, 0.9, 1.1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: orbColors[1] }}
        className="absolute top-1/3 -right-20 h-[520px] w-[520px] rounded-full blur-[140px]"
      />

      <motion.div
        animate={{
          x: [-40, 25, -40],
          y: [-20, 35, -20],
          scale: [0.95, 1.1, 0.95],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: orbColors[2] }}
        className="absolute top-2/3 left-10 h-[500px] w-[500px] rounded-full blur-[135px]"
      />

      <motion.div
        animate={{
          x: [25, -35, 25],
          y: [35, -25, 35],
          scale: [1, 1.12, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: orbColors[3] }}
        className="absolute bottom-10 right-1/4 h-[460px] w-[460px] rounded-full blur-[125px]"
      />

      {/* 3. Top Background Layer: Interactive Micro-Particle Dust Field */}
      <div className="opacity-90">
        <ParticlesBackground />
      </div>
    </div>
  );
}
