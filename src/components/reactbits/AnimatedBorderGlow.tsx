"use client";

import React, { useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { useTheme } from "@/src/context/ThemeContext";

interface AnimatedBorderGlowProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
  glowColor?:
    | "blue"
    | "indigo"
    | "amber"
    | "emerald"
    | "cyan-blue"
    | "rainbow"
    | "cyber"
    | "sunset"
    | "gold"
    | "theme"
    | (string & {});
  duration?: number;
  interactive?: boolean;
}

function AnimatedBorderGlowComponent({
  children,
  className,
  containerClassName,
  style,
  glowColor = "theme",
  duration = 3.5,
  interactive = true,
}: AnimatedBorderGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const { currentPreset } = useTheme();

  const conicGradients: Record<string, string> = {
    theme: currentPreset.colors.conicGradient,
    rainbow: "conic-gradient(from 0deg, transparent 0%, transparent 30%, #06b6d4 50%, #3b82f6 68%, #a855f7 82%, #ec4899 94%, #f43f5e 100%)",
    cyber: "conic-gradient(from 0deg, transparent 0%, transparent 40%, #00f0ff 60%, #ff007f 82%, #a855f7 100%)",
    sunset: "conic-gradient(from 0deg, transparent 0%, transparent 45%, #f59e0b 65%, #f43f5e 85%, #ec4899 100%)",
    gold: "conic-gradient(from 0deg, transparent 0%, transparent 60%, #d97706 78%, #fbbf24 100%)",
    "cyan-blue": "conic-gradient(from 0deg, transparent 0%, transparent 40%, #06b6d4 60%, #3b82f6 80%, #8b5cf6 100%)",
    blue: "conic-gradient(from 0deg, transparent 0%, transparent 50%, #3b82f6 70%, #60a5fa 85%, #a855f7 100%)",
    indigo: "conic-gradient(from 0deg, transparent 0%, transparent 50%, #6366f1 70%, #a855f7 85%, #ec4899 100%)",
    purple: "conic-gradient(from 0deg, transparent 0%, transparent 50%, #a855f7 70%, #c084fc 85%, #ec4899 100%)",
    amber: "conic-gradient(from 0deg, transparent 0%, transparent 50%, #f59e0b 70%, #fbbf24 85%, #ef4444 100%)",
    emerald: "conic-gradient(from 0deg, transparent 0%, transparent 50%, #10b981 70%, #34d399 85%, #06b6d4 100%)",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (animFrameRef.current !== null) return;
    animFrameRef.current = requestAnimationFrame(() => {
      setPosition({ x, y });
      animFrameRef.current = null;
    });
  };

  const handleMouseLeave = () => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setOpacity(0);
  };

  const bgStyle =
    glowColor && glowColor !== "theme"
      ? conicGradients[glowColor] || glowColor
      : currentPreset.colors.conicGradient;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group/borderGlow relative overflow-hidden rounded-3xl p-[1.5px] transition-all duration-300 shadow-xl",
        containerClassName
      )}
    >
      {/* Continuous Framer Motion Rotating Conic Light Beam */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[350%] w-[350%] opacity-100 transition-opacity duration-300 will-change-transform"
        style={{
          x: "-50%",
          y: "-50%",
          background: bgStyle,
        }}
      />

      {/* Interactive Cursor Glare */}
      {interactive && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover/borderGlow:opacity-100"
          style={{
            opacity,
            background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, ${currentPreset.colors.primaryGlow}, transparent 60%)`,
          }}
        />
      )}

      {/* Inner Content Box */}
      <div
        style={style}
        className={cn(
          "relative z-10 h-full w-full rounded-[calc(1.5rem-1.5px)] border border-slate-800/80 bg-slate-950/95 p-6 transition-all duration-300 text-white subpixel-antialiased",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export const AnimatedBorderGlow = memo(AnimatedBorderGlowComponent);

