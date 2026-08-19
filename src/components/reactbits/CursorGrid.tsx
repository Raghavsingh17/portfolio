"use client";

import { useRef, useEffect } from "react";
import { useTheme } from "@/src/context/ThemeContext";

interface CursorGridProps {
  gridSize?: number;
  className?: string;
}

export function CursorGrid({ gridSize = 75, className = "" }: CursorGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { currentPreset } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    let mouseX = -1000;
    let mouseY = -1000;
    let targetX = -1000;
    let targetY = -1000;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      targetX = -1000;
      targetY = -1000;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      mouseX = targetX;
      mouseY = targetY;

      ctx.clearRect(0, 0, width, height);

      const accentColor = currentPreset.colors.accent || "#06b6d4";
      const primaryGlow = currentPreset.colors.primary || "#3b82f6";

      // Subtle dark purple grid lines matching screenshot image
      ctx.strokeStyle = "rgba(168, 85, 247, 0.22)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // If mouse is active, render theme cell highlights & radial glare
      if (mouseX > -500 && mouseY > -500) {
        const glowRadius = 220;

        const startX = Math.max(0, Math.floor((mouseX - glowRadius) / gridSize) * gridSize);
        const endX = Math.min(width, Math.ceil((mouseX + glowRadius) / gridSize) * gridSize);
        const startY = Math.max(0, Math.floor((mouseY - glowRadius) / gridSize) * gridSize);
        const endY = Math.min(height, Math.ceil((mouseY + glowRadius) / gridSize) * gridSize);

        for (let x = startX; x < endX; x += gridSize) {
          for (let y = startY; y < endY; y += gridSize) {
            const cellCenterX = x + gridSize / 2;
            const cellCenterY = y + gridSize / 2;
            const dist = Math.hypot(cellCenterX - mouseX, cellCenterY - mouseY);

            if (dist < glowRadius) {
              const alpha = Math.pow(1 - dist / glowRadius, 1.8) * 0.55;

              ctx.fillStyle = alpha > 0.15 ? accentColor : primaryGlow;
              ctx.globalAlpha = alpha;
              ctx.fillRect(x + 1, y + 1, gridSize - 2, gridSize - 2);

              // Highlighted grid line borders near cursor
              ctx.globalAlpha = alpha * 1.8;
              ctx.strokeStyle = accentColor;
              ctx.strokeRect(x, y, gridSize, gridSize);
            }
          }
        }
        ctx.globalAlpha = 1.0;

        // Radial spotlight gradient
        const gradient = ctx.createRadialGradient(
          mouseX,
          mouseY,
          0,
          mouseX,
          mouseY,
          glowRadius
        );
        gradient.addColorStop(0, accentColor + "66");
        gradient.addColorStop(0.5, primaryGlow + "33");
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gridSize, currentPreset]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full opacity-100 transition-opacity duration-300 ${className}`}
    />
  );
}

export default CursorGrid;
