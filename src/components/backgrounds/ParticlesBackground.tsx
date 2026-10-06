"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  hue: number;
  baseVx: number;
  baseVy: number;
}

export interface ParticlesBackgroundProps {
  particleCount?: number;
  particleColors?: string[];
  particleSpread?: number;
  speed?: number;
  particleBaseSize?: number;
  moveParticlesOnHover?: boolean;
  alphaParticles?: boolean;
  disableRotation?: boolean;
  colorful?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ParticlesBackground({
  particleCount = 140,
  particleColors = ["#ffffff", "#a855f7", "#06b6d4", "#ec4899", "#3b82f6", "#10b981"],
  particleSpread = 10,
  speed = 0.6,
  particleBaseSize = 2.5,
  moveParticlesOnHover = true,
  alphaParticles = true,
  colorful = true,
  className = "",
  children,
}: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const particles: Particle[] = [];

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180,
      targetX: -1000,
      targetY: -1000,
    };

    const paletteHues = [275, 195, 325, 215, 160, 290, 340, 45, 235];

    const initParticles = () => {
      const parent = canvas.parentElement || document.body;
      width = canvas.width = parent.clientWidth || window.innerWidth;
      height = canvas.height = parent.clientHeight || window.innerHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const maxCap = width < 768 ? 70 : 140;
      const count = Math.min(Math.floor((width * height) / 8000), maxCap, particleCount);
      particles.length = 0;

      for (let i = 0; i < count; i++) {
        const vx = (Math.random() - 0.5) * speed * 1.2;
        const vy = (Math.random() - 0.5) * speed * 1.2;
        const selectedHue = colorful
          ? (paletteHues[i % paletteHues.length] + (Math.random() - 0.5) * 25 + 360) % 360
          : 0;

        // Size distribution: mostly small specks, some medium, a few large glowing orbs
        const sizeRand = Math.random();
        let radius = particleBaseSize * 0.5;
        if (sizeRand > 0.90) {
          radius = particleBaseSize * (2.2 + Math.random() * 1.5); // Large glowing orb
        } else if (sizeRand > 0.60) {
          radius = particleBaseSize * (1.2 + Math.random() * 0.8); // Medium particle
        } else {
          radius = particleBaseSize * (0.5 + Math.random() * 0.5); // Dust speck
        }

        const baseAlpha = Math.random() * 0.6 + 0.35;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          radius,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: 0.005 + Math.random() * 0.015,
          hue: selectedHue,
        });
      }
    };

    const updateMousePosition = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = clientX - rect.left;
      mouse.targetY = clientY - rect.top;
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    initParticles();
    window.addEventListener("resize", initParticles);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.016;
      mouse.x += (mouse.targetX - mouse.x) * 0.18;
      mouse.y += (mouse.targetY - mouse.y) * 0.18;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Twinkle / pulse alpha
        if (alphaParticles) {
          p.alpha = p.baseAlpha + Math.sin(time * p.twinkleSpeed * 100 + i) * 0.25;
          p.alpha = Math.max(0.2, Math.min(0.95, p.alpha));
        }

        if (colorful) {
          p.hue = (p.hue + 0.08) % 360;
        }

        // Return smoothly to base drift velocity
        p.vx += (p.baseVx - p.vx) * 0.04;
        p.vy += (p.baseVy - p.vy) * 0.04;

        // Screen edge wrap-around
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Interactive mouse hover displacement (React Bits behavior)
        if (moveParticlesOnHover && mouse.x > -500 && mouse.y > -500) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 3.5;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
          }
        }

        // Draw glowing circular particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (colorful) {
          ctx.fillStyle = `hsla(${p.hue}, 95%, 72%, ${p.alpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        }
        ctx.fill();

        // Soft outer glow aura for medium & large particles (high-performance canvas fill)
        if (p.radius > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.4, 0, Math.PI * 2);
          if (colorful) {
            ctx.fillStyle = `hsla(${p.hue}, 95%, 70%, ${p.alpha * 0.35})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.3})`;
          }
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", initParticles);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    particleCount,
    particleColors,
    particleSpread,
    speed,
    particleBaseSize,
    moveParticlesOnHover,
    alphaParticles,
    colorful,
  ]);

  return (
    <div className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  );
}

export default ParticlesBackground;
