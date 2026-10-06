"use client";

import { useEffect, useRef } from "react";

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  isStar: boolean;
}

export interface SparklesBackgroundProps {
  className?: string;
  count?: number;
  speed?: number;
  colors?: string[];
  interactive?: boolean;
}

export function SparklesBackground({
  className = "",
  count = 220,
  speed = 1.0,
  colors = ["#60a5fa", "#a855f7", "#38bdf8", "#f472b6", "#fbbf24", "#10b981", "#ffffff"],
  interactive = true,
}: SparklesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    let sparkles: SparkleParticle[] = [];

    const initSparkles = () => {
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      sparkles = Array.from({ length: count }, () => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const isStar = Math.random() < 0.5;
        const baseAlpha = Math.random() * 0.5 + 0.35;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6 * speed,
          vy: (Math.random() - 0.5) * 0.6 * speed - 0.25, // Gentle upward float
          size: isStar ? Math.random() * 4.8 + 2.4 : Math.random() * 2.4 + 1.0,
          color,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: Math.random() * 0.045 + 0.018,
          phase: Math.random() * Math.PI * 2,
          isStar,
        };
      });
    };

    initSparkles();
    window.addEventListener("resize", initSparkles);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
    }

    // Helper to draw 4-point star sparkle
    const drawStar = (x: number, y: number, outerRadius: number, innerRadius: number) => {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / 4;
        const sx = x + Math.cos(angle) * radius;
        const sy = y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
    };

    const render = () => {
      time += 0.01;

      // Smooth mouse position interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      sparkles.forEach((p) => {
        // Position update
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Twinkle sinusoidal brightness modulation
        let alpha = p.baseAlpha + Math.sin(time * p.twinkleSpeed * 50 + p.phase) * 0.3;
        alpha = Math.max(0.12, Math.min(1.0, alpha));

        let px = p.x;
        let py = p.y;

        // Interactive mouse attraction / flare
        if (interactive && mx > 0) {
          const dx = px - mx;
          const dy = py - my;
          const dist = Math.hypot(dx, dy);
          const radius = 175;

          if (dist < radius) {
            const force = (1 - dist / radius) * 14;
            px += (dx / dist) * force;
            py += (dy / dist) * force;
            alpha = Math.min(1.0, alpha + 0.45);
          }
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.isStar ? 14 : 7;

        if (p.isStar) {
          drawStar(px, py, p.size, p.size * 0.32);
        } else {
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", initSparkles);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, speed, colors, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full opacity-90 ${className}`}
    />
  );
}

export default SparklesBackground;
