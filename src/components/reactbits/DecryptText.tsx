"use client";

import { useEffect, useState } from "react";
import { cn } from "@/src/lib/utils";

interface DecryptTextProps {
  text: string;
  className?: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  animateOnHover?: boolean;
}

export function DecryptText({
  text,
  className,
  speed = 40,
  maxIterations = 10,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()",
  animateOnHover = false,
}: DecryptTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);

  const startDecrypt = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
      }

      iteration += 1 / (maxIterations / text.length);
    }, speed);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (!animateOnHover) {
      startDecrypt();
    }
  }, [text]);

  const handleMouseEnter = () => {
    if (animateOnHover && !isHovered) {
      setIsHovered(true);
      startDecrypt();
    }
  };

  const handleMouseLeave = () => {
    if (animateOnHover) {
      setIsHovered(false);
    }
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("font-mono tracking-tight", className)}
    >
      {displayText}
    </span>
  );
}
