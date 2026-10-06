"use client";

import React, { useRef, useState, memo } from "react";
import { cn } from "@/src/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

function SpotlightCardComponent({
  children,
  className,
  spotlightColor = "rgba(59, 130, 246, 0.15)",
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const animationFrameRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (animationFrameRef.current !== null) return;

    animationFrameRef.current = requestAnimationFrame(() => {
      setPosition({ x, y });
      animationFrameRef.current = null;
    });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 transition-all duration-300 dark:border-white/10 dark:bg-slate-950/75 light:border-slate-200 light:bg-white/95 light:shadow-sm subpixel-antialiased",
        className
      )}
      {...props}
    >
      {/* Radial Spotlight Light */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />

      {/* Border Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl border border-blue-500/30 transition-opacity duration-300"
        style={{
          opacity,
          maskImage: `radial-gradient(200px circle at ${position.x}px ${position.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(200px circle at ${position.x}px ${position.y}px, black, transparent)`,
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export const SpotlightCard = memo(SpotlightCardComponent);

