"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function MagneticButton({
  children,
  className,
  distance = 0.4,
  as: Component,
  href,
  target,
  rel,
  onClick,
}: MagneticButtonProps) {
  const Tag = Component || (href ? "a" : "div");
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    setPosition({ x: middleX * distance, y: middleY * distance });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 250, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      <Tag suppressHydrationWarning href={href} target={target} rel={rel} onClick={onClick} className={cn("inline-block", className)}>
        {children}
      </Tag>
    </motion.div>
  );
}

export default MagneticButton;
