"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCursor } from "@/src/context/CursorContext";

export function CustomCursor() {
  const { cursorMode, cursorText, cursorEnabled, setCursorMode } = useCursor();
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch screens / mobile devices (pointer: coarse or hover: none or width < 768)
    const touchCheck =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(hover: none)").matches ||
        "ontouchstart" in window ||
        window.innerWidth < 768);

    if (touchCheck) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest(
        'button, a, input[type="submit"], input[type="button"], [role="button"], .cursor-pointer'
      );
      const textEl = target.closest('input[type="text"], input[type="search"], textarea');

      if (interactiveEl) {
        setCursorMode("pointer");
      } else if (textEl) {
        setCursorMode("text");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, setCursorMode]);

  if (!cursorEnabled || !isVisible || isTouchDevice) return null;

  const isPointer = cursorMode === "pointer";
  const isMagnetic = cursorMode === "magnetic";
  const isText = cursorMode === "text";
  const isHidden = cursorMode === "hidden";

  if (isHidden) return null;

  return (
    <div className="hidden md:block">
      {/* Outer Ring / Aura */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border border-blue-500/40 bg-blue-500/10 backdrop-blur-[1px] dark:border-blue-400/50 dark:bg-blue-400/10"
        animate={{
          x: mousePosition.x - (isPointer || isMagnetic ? 24 : isText ? 32 : 16),
          y: mousePosition.y - (isPointer || isMagnetic ? 24 : isText ? 32 : 16),
          width: isPointer || isMagnetic ? 48 : isText ? 64 : 32,
          height: isPointer || isMagnetic ? 48 : isText ? 64 : 32,
          scale: isPointer ? 1.2 : isMagnetic ? 1.4 : isText ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          mass: 0.5,
        }}
      >
        {cursorText && (
          <span className="flex h-full w-full items-center justify-center text-[10px] font-bold tracking-widest text-blue-400 uppercase">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] dark:bg-blue-400 dark:shadow-[0_0_12px_#60a5fa]"
        animate={{
          x: mousePosition.x - 5,
          y: mousePosition.y - 5,
          scale: isPointer || isMagnetic ? 0.5 : isText ? 0 : 1,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 400,
          mass: 0.1,
        }}
      />
    </div>
  );
}
