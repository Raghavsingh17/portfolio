"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/src/context/ThemeContext";
import { useCursor } from "@/src/context/CursorContext";
import { cn } from "@/src/lib/utils";

interface GlowBorderButtonProps {
  children: React.ReactNode;
  as?: "button" | "a";
  href?: string;
  download?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  className?: string;
  innerClassName?: string;
  glowColor?:
    | "blue"
    | "indigo"
    | "purple"
    | "cyan"
    | "emerald"
    | "rainbow"
    | "cyber"
    | "sunset"
    | "gold"
    | (string & {});
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  magnetic?: boolean;
  magneticDistance?: number;
}

const conicGradients: Record<string, string> = {
  blue: "conic-gradient(from 0deg, transparent 0%, transparent 70%, #3b82f6 90%, #60a5fa 100%)",
  indigo: "conic-gradient(from 0deg, transparent 0%, transparent 70%, #6366f1 90%, #818cf8 100%)",
  purple: "conic-gradient(from 0deg, transparent 0%, transparent 70%, #a855f7 90%, #c084fc 100%)",
  cyan: "conic-gradient(from 0deg, transparent 0%, transparent 70%, #06b6d4 90%, #38bdf8 100%)",
  emerald: "conic-gradient(from 0deg, transparent 0%, transparent 70%, #10b981 90%, #34d399 100%)",
  rainbow: "conic-gradient(from 0deg, transparent 0%, transparent 30%, #06b6d4 50%, #3b82f6 68%, #a855f7 82%, #ec4899 94%, #f43f5e 100%)",
  cyber: "conic-gradient(from 0deg, transparent 0%, transparent 45%, #00f0ff 65%, #ff007f 85%, #a855f7 100%)",
  sunset: "conic-gradient(from 0deg, transparent 0%, transparent 50%, #f59e0b 70%, #f43f5e 88%, #ec4899 100%)",
  gold: "conic-gradient(from 0deg, transparent 0%, transparent 65%, #d97706 82%, #fbbf24 100%)",
};

const sizeStyles = {
  sm: "px-6 py-2.5 text-xs sm:text-sm font-semibold gap-2",
  md: "px-8 py-4 text-base sm:text-lg font-bold gap-3",
  lg: "px-10 py-5 text-lg sm:text-xl font-extrabold gap-3.5",
};

export function GlowBorderButton({
  children,
  as = "button",
  href,
  download,
  target,
  rel,
  onClick,
  className = "",
  innerClassName = "",
  glowColor,
  size = "md",
  type = "button",
  disabled = false,
  magnetic = true,
  magneticDistance = 0.35,
}: GlowBorderButtonProps) {
  const { currentPreset } = useTheme();
  const { setCursorMode } = useCursor();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const conicBg = glowColor
    ? conicGradients[glowColor] || glowColor
    : currentPreset.colors.conicGradient || conicGradients.cyan;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!magnetic || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    setPosition({ x: middleX * magneticDistance, y: middleY * magneticDistance });
  };

  const handleMouseEnter = () => {
    setCursorMode("magnetic");
  };

  const handleMouseLeave = () => {
    if (magnetic) {
      setPosition({ x: 0, y: 0 });
    }
    setCursorMode("default");
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 250, damping: 15, mass: 0.1 }}
      className={cn(
        "group relative inline-flex items-center justify-center p-[2px] rounded-full overflow-hidden transition-all duration-300 active:scale-95 hover:scale-[1.02]",
        className
      )}
    >
      {/* Continuous Rotating Conic Gradient Light Beam (Centered Square to prevent bottom line clipping) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[350%] w-[350%] opacity-90 transition-opacity duration-300 group-hover:opacity-100 will-change-transform"
        style={{
          x: "-50%",
          y: "-50%",
          background: conicBg,
        }}
      />

      {/* Ambient Glow Aura */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-50"
        style={{ background: currentPreset.colors.primaryGlow }}
      />

      {/* Inner Button Core - Medium Size by Default */}
      <span
        className={cn(
          "relative z-10 flex h-full w-full items-center justify-center rounded-full bg-slate-950/90 text-white border border-white/10 backdrop-blur-xl transition-all duration-300 group-hover:bg-slate-900 group-hover:border-white/25 shadow-lg",
          sizeStyles[size],
          innerClassName
        )}
      >
        {children}
      </span>
    </motion.div>
  );

  if (as === "a" && href) {
    return (
      <a
        suppressHydrationWarning
        href={href}
        download={download}
        target={target}
        rel={rel}
        onClick={onClick}
        className="inline-block"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      suppressHydrationWarning
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-block border-0 bg-transparent p-0"
    >
      {content}
    </button>
  );
}
