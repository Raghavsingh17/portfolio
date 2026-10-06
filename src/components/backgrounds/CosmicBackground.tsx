"use client";

import { memo, useEffect, useState } from "react";
import { useCosmic } from "@/src/context/CosmicContext";

function CosmicBackgroundComponent() {
  const { videoRef } = useCosmic();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute scroll-linked deepening factor (0 in Hero, up to 0.45 in lower sections)
  const depthOpacity = Math.min(0.5, Math.max(0, scrollY / 1200));

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden bg-[#090a0f]"
    >
      {/* 1. Continuous 3D Earth Horizon & Cosmic Animation Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none transform-gpu"
        style={{
          transform: `scale(${1 + Math.min(0.08, scrollY * 0.00004)})`,
          transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4"
          type="video/mp4"
        />
      </video>

      {/* 2. Base Cinematic Dark Tint Overlay */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      {/* 3. Subtle Vignette to frame center content and focus user eye */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(9, 10, 15, 0.4) 75%, rgba(9, 10, 15, 0.85) 100%)",
        }}
      />

      {/* 4. Scroll-linked Atmospheric Deep-Space Overlay (provides WCAG-compliant contrast for About/Skills/Projects) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-[#090a0f]"
        style={{
          opacity: depthOpacity,
        }}
      />

      {/* 5. Cosmic Horizon Aura Glow (soft cyan/blue planetary rim illumination) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-72 sm:h-96 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(59, 130, 246, 0.25) 0%, rgba(14, 165, 233, 0.12) 35%, transparent 70%)",
        }}
      />
    </div>
  );
}

export const CosmicBackground = memo(CosmicBackgroundComponent);
