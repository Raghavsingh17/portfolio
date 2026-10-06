"use client";

import { memo, useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  MotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

interface AboutAvatarProps {
  scrollYProgress: MotionValue<number>;
}

function AboutAvatarComponent({ scrollYProgress }: AboutAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // ───────────────────────────────────────────────────────────────────────────
  // 3D CURSOR INTERACTION (Buttery Smooth Damped Physics)
  // Subtle responsive tilt: Mouse left/right tilts yaw; Up/down tilts pitch
  // ───────────────────────────────────────────────────────────────────────────
  const springConfig = { stiffness: 120, damping: 24, mass: 0.8 };
  const mouseTiltX = useSpring(0, springConfig); // Pitch (-8° to +8°)
  const mouseTiltY = useSpring(0, springConfig); // Yaw (-10° to +10°)
  const mouseParallaxX = useSpring(0, springConfig); // Micro-shift X
  const mouseParallaxY = useSpring(0, springConfig); // Micro-shift Y

  useEffect(() => {
    if (shouldReduceMotion) return;

    const handlePointerMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Only calculate if the avatar container is visible in viewport
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;

      // Normalized coordinates from -1.0 (left/top) to +1.0 (right/bottom)
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;

      // Extremely subtle, elegant 3D tilt angles (as requested: not excessive)
      // Moving mouse right -> subtly rotates toward right
      // Moving mouse left -> subtly rotates toward left
      // Moving mouse up -> subtly tilts up
      // Moving mouse down -> subtly tilts down
      mouseTiltX.set(normY * -7); // negative normY tilts head up
      mouseTiltY.set(normX * 9);
      mouseParallaxX.set(normX * 8);
      mouseParallaxY.set(normY * 8);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [shouldReduceMotion, mouseTiltX, mouseTiltY, mouseParallaxX, mouseParallaxY]);

  // ───────────────────────────────────────────────────────────────────────────
  // SCROLL-LINKED TRANSFORMS (Synchronized with User's Scroll Progress)
  // CENTERED AVATAR ──(scroll)──> AVATAR MOVES LEFT + SCALES DOWN SLIGHTLY
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Initial Reveal & Camera Dolly (0.0 -> 0.15)
  const initialOpacity = useTransform(scrollYProgress, [0.0, 0.12], [0.4, 1.0]);
  const initialScale = useTransform(scrollYProgress, [0.0, 0.14], [0.94, 1.02]);
  const initialY = useTransform(scrollYProgress, [0.0, 0.14], [30, 0]);

  // 2. Scroll to Left Position (0.16 -> 0.50)
  // Center (0vw) to Left (-22vw on large desktop, -16vw on laptops, 0 on mobile)
  const scrollTranslateX = useTransform(
    scrollYProgress,
    [0.16, 0.50],
    ["0vw", "-21vw"]
  );

  // Subtle scale-down as it settles into the two-column layout
  const scrollScale = useTransform(
    scrollYProgress,
    [0.16, 0.50],
    [1.02, 0.94]
  );

  // Slight backward depth movement in Z (perspective dolly)
  const scrollZ = useTransform(
    scrollYProgress,
    [0.16, 0.50],
    [0, -40]
  );

  // Subtle natural rotation to face slightly toward the right (toward About text)
  const scrollRotateY = useTransform(
    scrollYProgress,
    [0.16, 0.50],
    [0, 6]
  );

  // Combine scroll rotation and mouse tilt into total dynamic rotation
  const totalRotateY = useTransform(
    [mouseTiltY, scrollRotateY],
    ([tilt, scroll]) => (shouldReduceMotion ? 0 : (tilt as number) + (scroll as number))
  );

  return (
    <motion.div
      ref={containerRef}
      style={{
        x: shouldReduceMotion ? 0 : scrollTranslateX,
        z: shouldReduceMotion ? 0 : scrollZ,
        perspective: 1200,
      }}
      className="relative z-20 flex items-center justify-center select-none pointer-events-none"
    >
      {/* 3D Rotational Rig (Handles combined scroll rotation + cursor tracking) */}
      <motion.div
        style={{
          rotateX: shouldReduceMotion ? 0 : mouseTiltX,
          rotateY: totalRotateY,
          x: shouldReduceMotion ? 0 : mouseParallaxX,
          y: shouldReduceMotion ? 0 : mouseParallaxY,
          scale: shouldReduceMotion ? 1 : scrollScale,
          transformStyle: "preserve-3d",
        }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* Soft Volumetric Atmospheric Glow Pool behind avatar */}
        <div
          aria-hidden="true"
          className="absolute -inset-8 bg-gradient-to-t from-blue-500/20 via-cyan-400/10 to-transparent blur-[70px] rounded-full pointer-events-none -z-10"
        />

        {/* Ambient Ground/Floor Shadow & Rim Light */}
        <div
          aria-hidden="true"
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[340px] h-[36px] bg-blue-600/25 blur-[28px] rounded-full pointer-events-none -z-10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[240px] h-[18px] bg-black/70 blur-[14px] rounded-full pointer-events-none -z-10"
        />

        {/* Floating Idle Animation Layer (Subtle, slow breathing bobbing) */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [0, -8, 0],
                  rotateZ: [0, 0.5, -0.5, 0],
                }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            opacity: initialOpacity,
            scale: initialScale,
            y: initialY,
          }}
          className="relative flex items-center justify-center"
        >
          {/* Main 3D Avatar Visual Asset */}
          <div className="relative w-[280px] sm:w-[350px] md:w-[390px] lg:w-[440px] xl:w-[470px] aspect-[736/1104] max-h-[70vh]">
            <Image
              src="/avatar-clean.png"
              alt="Raghav Singh - 3D Developer Avatar"
              width={736}
              height={1104}
              priority
              quality={95}
              className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
            />

            {/* Subtle Specular Rim Light Overlay (soft holographic sheen) */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none rounded-3xl mix-blend-overlay opacity-30 bg-gradient-to-tr from-transparent via-white/20 to-cyan-300/30"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export const AboutAvatar = memo(AboutAvatarComponent);
