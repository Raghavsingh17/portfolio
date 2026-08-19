"use client";

import React from "react";
import { cn } from "@/src/lib/utils";

interface ShinyTextProps {
  children: React.ReactNode;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export function ShinyText({
  children,
  disabled = false,
  speed = 3.5,
  className,
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={cn(
        "shiny-text inline-block font-semibold",
        disabled && "animate-none !text-white light:!text-slate-900",
        className
      )}
      style={{ animationDuration }}
    >
      {children}
    </span>
  );
}
