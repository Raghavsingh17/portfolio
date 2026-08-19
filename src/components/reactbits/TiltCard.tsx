"use client";

import React, { useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number;
}

function TiltCardComponent({
  children,
  className,
  maxRotate = 10,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [sheenPosition, setSheenPosition] = useState({ x: 50, y: 50 });
  const animationFrameRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -maxRotate;
    const rY = ((x - centerX) / centerX) * maxRotate;
    const sheenX = (x / rect.width) * 100;
    const sheenY = (y / rect.height) * 100;

    if (animationFrameRef.current !== null) return;

    animationFrameRef.current = requestAnimationFrame(() => {
      setRotateX(rX);
      setRotateY(rY);
      setSheenPosition({ x: sheenX, y: sheenY });
      animationFrameRef.current = null;
    });
  };

  const handleMouseLeave = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 200,
        mass: 0.5,
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl transition-shadow duration-300",
        className
      )}
    >
      {/* Light sheen overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export const TiltCard = memo(TiltCardComponent);

