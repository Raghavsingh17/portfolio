"use client";

import React, { useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { useTheme } from "@/src/context/ThemeContext";

interface AnimatedBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  glowColor?: "cyan-blue" | "emerald" | "amber" | "indigo" | "theme";
  duration?: number;
}

function AnimatedBorderCardComponent({
  children,
  className,
  containerClassName,
  glowColor = "theme",
  duration = 3.5,
  ...props
}: AnimatedBorderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const { currentPreset } = useTheme();

  const conicGradients = {
    theme: currentPreset.colors.conicGradient,
    "cyan-blue": "conic-gradient(from 0deg, transparent 0%, transparent 70%, #06b6d4 90%, #3b82f6 100%)",
    emerald: "conic-gradient(from 0deg, transparent 0%, transparent 70%, #34d399 90%, #10b981 100%)",
    amber: "conic-gradient(from 0deg, transparent 0%, transparent 70%, #fbbf24 90%, #f59e0b 100%)",
    indigo: "conic-gradient(from 0deg, transparent 0%, transparent 70%, #818cf8 90%, #6366f1 100%)",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
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

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-[1.5px] transition-all duration-300 shadow-xl",
        containerClassName
      )}
      {...props}
    >
      {/* Continuous Framer Motion Rotating Conic Light Beam */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[350%] w-[350%] opacity-100 transition-opacity duration-300 will-change-transform"
        style={{
          x: "-50%",
          y: "-50%",
          background:
            glowColor && glowColor !== "theme" && conicGradients[glowColor as keyof typeof conicGradients]
              ? conicGradients[glowColor as keyof typeof conicGradients]
              : currentPreset.colors.conicGradient,
        }}
      />

      {/* Interactive Cursor Spotlight Glare */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          opacity,
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, ${currentPreset.colors.primaryGlow}, transparent 60%)`,
        }}
      />

      {/* Inner Content Box with Glass Surface */}
      <div
        className={cn(
          "relative z-10 h-full w-full rounded-[calc(1rem-1.5px)] border border-slate-800/80 bg-slate-950/95 p-6 transition-all duration-300 text-white subpixel-antialiased",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export const AnimatedBorderCard = memo(AnimatedBorderCardComponent);

