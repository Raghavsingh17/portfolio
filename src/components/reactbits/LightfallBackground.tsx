"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/src/context/ThemeContext";

interface LightfallBackgroundProps {
  className?: string;
  count?: number;
  speed?: number;
}

// Multi-color beam spectrum palettes per theme preset
const THEME_SPECTRUMS: Record<string, string[]> = {
  dark: [
    "hsla(188, 95%, 60%, ", // Neon Cyan (#06b6d4)
    "hsla(265, 90%, 65%, ", // Vivid Violet (#8b5cf6)
    "hsla(217, 95%, 60%, ", // Electric Blue (#3b82f6)
    "hsla(330, 90%, 65%, ", // Hot Pink (#ec4899)
  ],
  "tokyo-night": [
    "hsla(245, 85%, 68%, ", // Deep Iris
    "hsla(292, 90%, 65%, ", // Vivid Magenta
    "hsla(270, 85%, 72%, ", // Soft Purple
    "hsla(340, 90%, 65%, ", // Bright Pink
  ],
  cyberpunk: [
    "hsla(190, 100%, 60%, ", // Neon Cyan
    "hsla(330, 100%, 60%, ", // Electric Magenta/Pink
    "hsla(280, 95%, 65%, ", // Vivid Purple
    "hsla(210, 100%, 65%, ", // Electric Blue
  ],
  dracula: [
    "hsla(265, 90%, 72%, ", // Bright Purple
    "hsla(140, 90%, 65%, ", // Neon Green
    "hsla(330, 85%, 65%, ", // Hot Pink
    "hsla(215, 90%, 65%, ", // Electric Blue
  ],
};

export function LightfallBackground({
  className = "",
  count = 65,
  speed = 1.6,
}: LightfallBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      width = parent ? Math.max(parent.scrollWidth, parent.clientWidth, window.innerWidth) : window.innerWidth;
      height = parent ? Math.max(parent.scrollHeight, parent.clientHeight, window.innerHeight) : window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();

    const parent = canvas.parentElement;
    const ro = new ResizeObserver(() => {
      handleResize();
    });
    if (parent) ro.observe(parent);

    window.addEventListener("resize", handleResize);

    const palette = THEME_SPECTRUMS[theme] || THEME_SPECTRUMS.dark;

    // Beams of light falling downward with multi-color gradient spectrum & fluid physics
    const beams = Array.from({ length: count }, () => {
      const colorPrefix = palette[Math.floor(Math.random() * palette.length)];
      const length = Math.random() * 280 + 120;
      return {
        x: Math.random() * width,
        y: Math.random() * (height + length) - length,
        length,
        width: Math.random() * 2.6 + 1.2,
        speed: (Math.random() * 1.8 + 1.1) * speed,
        opacity: Math.random() * 0.45 + 0.25,
        colorPrefix,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      beams.forEach((beam) => {
        beam.y += beam.speed;
        if (beam.y - beam.length > height) {
          beam.y = -beam.length;
          beam.x = Math.random() * width;
        }

        const gradient = ctx.createLinearGradient(
          beam.x,
          beam.y - beam.length,
          beam.x,
          beam.y
        );
        gradient.addColorStop(0, `${beam.colorPrefix}0)`);
        gradient.addColorStop(0.5, `${beam.colorPrefix}${beam.opacity * 0.7})`);
        gradient.addColorStop(1, `${beam.colorPrefix}${beam.opacity * 1.6})`);

        // Draw light stream
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = beam.width;
        ctx.lineCap = "round";
        ctx.moveTo(beam.x, beam.y - beam.length);
        ctx.lineTo(beam.x, beam.y);
        ctx.stroke();

        // Glowing head flare point
        ctx.beginPath();
        ctx.arc(beam.x, beam.y, beam.width * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `${beam.colorPrefix}${beam.opacity * 2.2})`;
        ctx.fill();

        // Ambient radial light aura behind key lead beams
        if (beam.width > 2.0) {
          const headGlow = ctx.createRadialGradient(
            beam.x,
            beam.y,
            0,
            beam.x,
            beam.y,
            beam.width * 7
          );
          headGlow.addColorStop(0, `${beam.colorPrefix}${beam.opacity * 0.35})`);
          headGlow.addColorStop(1, `${beam.colorPrefix}0)`);

          ctx.beginPath();
          ctx.arc(beam.x, beam.y, beam.width * 7, 0, Math.PI * 2);
          ctx.fillStyle = headGlow;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, speed, theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 min-h-full w-full opacity-95 mix-blend-screen transition-opacity duration-300 ${className}`}
    />
  );
}

export default LightfallBackground;
