"use client";

import { useRef, useEffect } from "react";
import { useTheme } from "@/src/context/ThemeContext";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

interface RippleGridProps {
  className?: string;
  gridSize?: number;
}

export function RippleGrid({ className = "", gridSize = 45 }: RippleGridProps) {
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
    const ripples: Ripple[] = [];
    let lastMouseTime = 0;

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

    const addRipple = (x: number, y: number, isClick = false) => {
      ripples.push({
        x,
        y,
        radius: 0,
        maxRadius: isClick ? 340 : 230,
        alpha: isClick ? 0.95 : 0.7,
        speed: isClick ? 5.5 : 4,
      });
      if (ripples.length > 25) {
        ripples.shift();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseTime > 70) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x >= 0 && x <= width && y >= 0 && y <= height) {
          addRipple(x, y, false);
          lastMouseTime = now;
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        addRipple(x, y, true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const time = Date.now() * 0.0015;

      // Draw vibrant colorful grid nodes with neon glow
      for (let x = gridSize / 2; x < width; x += gridSize) {
        for (let y = gridSize / 2; y < height; y += gridSize) {
          let offsetX = 0;
          let offsetY = 0;
          let totalAlpha = 0;

          for (let i = 0; i < ripples.length; i++) {
            const r = ripples[i];
            const dx = x - r.x;
            const dy = y - r.y;
            const dist = Math.hypot(dx, dy);

            const ringDist = Math.abs(dist - r.radius);
            if (ringDist < 55) {
              const factor = Math.cos((ringDist / 55) * (Math.PI / 2)) * r.alpha;
              const angle = Math.atan2(dy, dx);
              offsetX += Math.cos(angle) * factor * 18;
              offsetY += Math.sin(angle) * factor * 18;
              totalAlpha += factor;
            }
          }

          const drawX = x + offsetX;
          const drawY = y + offsetY;

          // Flowing spectrum hue based on dot coordinates and time
          const baseHue = (x * 0.25 + y * 0.25 + time * 35) % 360;
          const pointSize =
            totalAlpha > 0.05
              ? 3.5 + totalAlpha * 6
              : 2.5 + Math.sin(time * 2 + (x + y) * 0.02) * 0.6;

          ctx.save();
          if (totalAlpha > 0.05) {
            const activeHue = (baseHue + totalAlpha * 120) % 360;
            ctx.fillStyle = `hsl(${activeHue}, 90%, 65%)`;
            ctx.shadowColor = `hsl(${activeHue}, 90%, 60%)`;
            ctx.shadowBlur = 10 + totalAlpha * 15;
            ctx.globalAlpha = Math.min(1, 0.7 + totalAlpha * 0.8);
          } else {
            ctx.fillStyle = `hsl(${baseHue}, 85%, 65%)`;
            ctx.shadowColor = `hsl(${baseHue}, 85%, 60%)`;
            ctx.shadowBlur = 5;
            ctx.globalAlpha = 0.65 + Math.sin(time * 1.5 + x * 0.05) * 0.2;
          }

          ctx.beginPath();
          ctx.arc(drawX, drawY, pointSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Render expanding vivid colorful ripple rings
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha *= 0.965;

        const ringHue = (r.x * 0.3 + r.y * 0.3 + r.radius * 2 + time * 50) % 360;

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsl(${ringHue}, 90%, 65%)`;
        ctx.shadowColor = `hsl(${ringHue}, 90%, 60%)`;
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = r.alpha * 0.85;
        ctx.stroke();
        ctx.restore();

        if (r.radius >= r.maxRadius || r.alpha <= 0.01) {
          ripples.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
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

export default RippleGrid;
