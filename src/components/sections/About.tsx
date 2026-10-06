"use client";

import { memo, useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { ArrowUpRight, Sparkles, FileText, Send, Code2, Terminal, Laptop } from "lucide-react";
import { PERSONAL_INFO } from "@/src/data/portfolio";
import { ScrollReveal } from "@/src/components/animations/ScrollReveal";
import { SpotlightCard } from "@/src/components/reactbits/SpotlightCard";
import { ShinyText } from "@/src/components/animations/ShinyText";
import { getAboutHighlights } from "@/src/utils/aboutHelpers";

interface AboutProps {
  onOpenResume?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// REVEAL TEXT ON SCROLL (Word-by-word luminous gradual fade)
// ─────────────────────────────────────────────────────────────────────────────

function RevealWord({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const y = useTransform(progress, range, [4, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className="inline-block mr-[0.28em] font-normal transition-colors text-white"
    >
      {word}
    </motion.span>
  );
}

function RevealTextOnScroll({
  text,
  className = "",
  progress,
  range = [0, 1],
}: {
  text: string;
  className?: string;
  progress: MotionValue<number>;
  range?: [number, number];
}) {
  const words = text.split(" ");
  const [rangeStart, rangeEnd] = range;
  const totalRange = rangeEnd - rangeStart;

  return (
    <p className={`flex flex-wrap leading-relaxed ${className}`}>
      {words.map((word, i) => {
        const start = rangeStart + (i / words.length) * totalRange;
        const end = Math.min(rangeEnd, start + (1.2 / words.length) * totalRange);
        return <RevealWord key={i} word={word} progress={progress} range={[start, end]} />;
      })}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT COMPONENT (3D Developer Avatar + Workstation Desk Scene)
// ─────────────────────────────────────────────────────────────────────────────

function AboutComponent({ onOpenResume }: AboutProps) {
  const HIGHLIGHTS = getAboutHighlights(onOpenResume);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // ───────────────────────────────────────────────────────────────────────────
  // INTERACTIVE CURSOR & GAZE TRACKING (3D Spring Physics)
  // When cursor moves UP / DOWN -> Avatar tilts and looks UP / DOWN
  // When avatar is on left -> Naturally looks right towards the bio (+8° base)
  // Moving cursor towards bio -> Avatar turns further towards bio
  // ───────────────────────────────────────────────────────────────────────────
  const tiltX = useSpring(0, { stiffness: 140, damping: 20 });
  const tiltY = useSpring(8, { stiffness: 140, damping: 20 });
  const shiftX = useSpring(0, { stiffness: 120, damping: 22 });
  const shiftY = useSpring(0, { stiffness: 120, damping: 22 });
  const specularX = useSpring(50, { stiffness: 90, damping: 25 });
  const specularY = useSpring(45, { stiffness: 90, damping: 25 });

  useEffect(() => {
    const handleGlobalPointerMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();

      // Only track when About section is within active viewing range
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;

      // Normalized coordinates from -1.0 to +1.0 relative to viewport center
      const normX = ((e.clientX / window.innerWidth) - 0.5) * 2;
      const normY = ((e.clientY / window.innerHeight) - 0.5) * 2;

      // 1. Tilt X (Up / Down Gaze tracking):
      // Cursor up (normY < 0) -> tilts back (avatar looks UP)
      // Cursor down (normY > 0) -> tilts forward (avatar looks DOWN)
      tiltX.set(normY * 14);

      // 2. Tilt Y (Left / Right Gaze tracking):
      // Base orientation is +8deg facing right towards the bio text.
      // Moving cursor right towards bio increases rotation up to +22deg.
      // Moving cursor left brings it towards front/neutral (-2deg).
      tiltY.set(8 + normX * 12);

      // 3. Subtle physical parallax shift
      shiftX.set(normX * 8);
      shiftY.set(normY * 8);

      // 4. Dynamic specular rim lighting highlight (%)
      specularX.set(50 + normX * 30);
      specularY.set(45 + normY * 30);
    };

    window.addEventListener("pointermove", handleGlobalPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleGlobalPointerMove);
  }, [tiltX, tiltY, shiftX, shiftY, specularX, specularY]);

  // ───────────────────────────────────────────────────────────────────────────
  // SCROLL-LINKED ANIMATIONS (Entrance -> Slide Left + Morph -> Bio Reveal)
  // ───────────────────────────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Stage 1 Entrance Header & Watermark
  const introHeaderOpacity = useTransform(scrollYProgress, [0.0, 0.16], [1, 0]);
  const introHeaderY = useTransform(scrollYProgress, [0.0, 0.16], [0, -30]);
  const introBackdropOpacity = useTransform(scrollYProgress, [0.0, 0.2], [0.85, 0]);
  const introBackdropScale = useTransform(scrollYProgress, [0.0, 0.2], [1, 1.15]);

  // Avatar 1 (Close-up Bust - about-avatar.jpg):
  // Shows in center with 3D entrance at start of section, then fades out as it slides left
  const avatar1Opacity = useTransform(scrollYProgress, [0.0, 0.08, 0.22, 0.42], [0.3, 1, 1, 0]);
  const avatar1Scale = useTransform(scrollYProgress, [0.0, 0.12, 0.42], [0.92, 1.02, 0.94]);

  // Avatar 2 (Coder at Desk - about-coding.jpg):
  // Fades in as user scrolls down, seated at desk facing right toward bio
  const avatar2Opacity = useTransform(scrollYProgress, [0.22, 0.44], [0, 1]);
  const avatar2Scale = useTransform(scrollYProgress, [0.22, 0.44], [0.92, 1.0]);

  // Avatar Container X Translation (Center -> Left)
  // On desktop: 0vw (center) to -23vw (left side)
  const avatarContainerX = useTransform(
    scrollYProgress,
    [0.15, 0.45],
    ["0vw", "-23vw"]
  );

  // Background "ABOUT" watermark behind desk on left
  const watermarkOpacity = useTransform(scrollYProgress, [0.24, 0.48], [0, 0.08]);

  // Bio Panel Container on the Right
  const bioContainerOpacity = useTransform(scrollYProgress, [0.22, 0.42], [0, 1]);
  const bioContainerX = useTransform(scrollYProgress, [0.22, 0.42], [60, 0]);
  const bioBlur = useTransform(scrollYProgress, [0.22, 0.42], ["12px", "0px"]);

  // Staggered reveal milestones for bio details ("bio vhi thora dhire dhire aayega")
  const bioBadgeOpacity = useTransform(scrollYProgress, [0.26, 0.38], [0, 1]);
  const bioHeadingOpacity = useTransform(scrollYProgress, [0.30, 0.44], [0, 1]);
  const bioTagsOpacity = useTransform(scrollYProgress, [0.55, 0.72], [0, 1]);
  const bioActionsOpacity = useTransform(scrollYProgress, [0.65, 0.80], [0, 1]);

  return (
    <section id="about" ref={sectionRef} className="relative scroll-mt-20">
      {/* ================================================================
          STAGE 1 — Pinned 3D Interactive Avatar & Cinematic Bio Reveal
         ================================================================ */}
      <div className="relative h-[250vh] w-full">
        <div
          ref={stageRef}
          className="sticky top-0 h-screen w-full flex flex-col justify-between items-center overflow-hidden pt-20 pb-6 pointer-events-auto"
        >
          {/* Ambient Cosmic Lighting Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[720px] bg-cyan-500/12 blur-[170px] pointer-events-none rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-[550px] h-[550px] bg-rose-500/10 blur-[180px] pointer-events-none rounded-full" />
          <div className="absolute bottom-10 left-1/3 w-[600px] h-[120px] bg-cyan-400/15 blur-[80px] pointer-events-none rounded-full" />

          {/* Initial Entrance Title: "A Little About Me" (fades out as you scroll down) */}
          <motion.div
            style={{ opacity: introHeaderOpacity, y: introHeaderY }}
            className="relative z-20 text-center space-y-2 px-4 select-none shrink-0"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-400 border border-cyan-500/20 uppercase shadow-[0_0_20px_rgba(6,182,212,0.18)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Engineering Identity
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl tracking-tight">
              <ShinyText>A Little About Me</ShinyText>
            </h2>
          </motion.div>

          {/* Central Spatial Stage */}
          <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex-1 flex items-center justify-center">
            {/* Background "WHO I AM." watermark during initial scroll */}
            <motion.div
              style={{ opacity: introBackdropOpacity, scale: introBackdropScale }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none -z-10 whitespace-nowrap text-center w-full"
            >
              <span className="text-[14vw] font-black tracking-widest text-white/[0.05] uppercase font-sans select-none">
                Who I Am.
              </span>
            </motion.div>

            {/* Background "ABOUT" watermark behind the desk avatar on the left (matching user's screenshot 2) */}
            <motion.div
              style={{ opacity: watermarkOpacity }}
              className="absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 select-none pointer-events-none -z-10 text-white font-black font-sans text-[11vw] sm:text-[9vw] tracking-wider leading-none uppercase"
            >
              ABOUT
            </motion.div>

            {/* ==========================================================
                THE 3D AVATAR CONTAINER (Moves Center -> Left on Scroll)
                Tracks cursor UP/DOWN & LEFT/RIGHT in real time
               ========================================================== */}
            <motion.div
              style={{
                x: avatarContainerX,
                perspective: 1200,
              }}
              className="absolute z-20 flex items-center justify-center select-none"
            >
              {/* 3D Rotational Rig driven by dynamic springs */}
              <motion.div
                style={{
                  rotateX: tiltX,
                  rotateY: tiltY,
                  x: shiftX,
                  y: shiftY,
                  transformStyle: "preserve-3d",
                }}
                className="relative flex items-center justify-center"
              >
                {/* Desk Base Ambient Shadow & Floor Neon Pool */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[380px] h-[36px] bg-rose-500/25 blur-[30px] rounded-full pointer-events-none -z-10" />
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[460px] h-[50px] bg-cyan-500/20 blur-[40px] rounded-full pointer-events-none -z-10" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[280px] h-[20px] bg-black/80 blur-[15px] rounded-full pointer-events-none -z-10" />

                {/* Outer Framing with Dynamic Cursor Specular Glow */}
                <div className="relative group/avatar rounded-3xl overflow-hidden p-1">
                  {/* Dynamic Cursor Light Spotlight that follows mouse */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none rounded-3xl z-30 transition-opacity duration-300 opacity-60 mix-blend-soft-light"
                    style={{
                      background: "radial-gradient(circle 300px at 50% 40%, rgba(255,255,255,0.35), transparent 70%)",
                    }}
                  />

                  {/* ────────────────────────────────────────────────────────
                      IMAGE 1: AVATAR BUST (about-avatar.jpg)
                      Appears first, looking forward/right, floats & animates
                     ──────────────────────────────────────────────────────── */}
                  <motion.div
                    style={{
                      opacity: avatar1Opacity,
                      scale: avatar1Scale,
                    }}
                    className="relative flex items-center justify-center w-[290px] sm:w-[360px] md:w-[420px] lg:w-[440px] aspect-square rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 bg-slate-950/40 backdrop-blur-sm"
                  >
                    <Image
                      src="/about-avatar.jpg"
                      alt="Raghav Singh - 3D Character Avatar"
                      width={800}
                      height={800}
                      priority
                      className="w-full h-full object-cover select-none pointer-events-none scale-105"
                      style={{
                        maskImage:
                          "radial-gradient(ellipse 85% 85% at 50% 48%, black 72%, transparent 100%)",
                        WebkitMaskImage:
                          "radial-gradient(ellipse 85% 85% at 50% 48%, black 72%, transparent 100%)",
                      }}
                    />

                    {/* Subtle Pulsing Halo behind the cap */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-400/25 blur-3xl rounded-full pointer-events-none" />
                  </motion.div>

                  {/* ────────────────────────────────────────────────────────
                      IMAGE 2: CODER AT DESK (about-coding.jpg)
                      Slides left, typing on desk with screen glow, looking right
                     ──────────────────────────────────────────────────────── */}
                  <motion.div
                    style={{
                      opacity: avatar2Opacity,
                      scale: avatar2Scale,
                    }}
                    className="absolute inset-0 flex items-center justify-center w-[290px] sm:w-[360px] md:w-[420px] lg:w-[440px] aspect-square rounded-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.9)] border border-white/10 bg-slate-950/40 backdrop-blur-sm"
                  >
                    <Image
                      src="/about-coding.jpg"
                      alt="Raghav Singh - 3D Developer at Workstation"
                      width={800}
                      height={800}
                      priority
                      className="w-full h-full object-cover select-none pointer-events-none scale-105"
                      style={{
                        maskImage:
                          "radial-gradient(ellipse 88% 88% at 50% 50%, black 75%, transparent 100%)",
                        WebkitMaskImage:
                          "radial-gradient(ellipse 88% 88% at 50% 50%, black 75%, transparent 100%)",
                      }}
                    />

                    {/* Monitor Pink Ambient Screen Glow */}
                    <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-rose-500/20 blur-2xl rounded-full pointer-events-none mix-blend-screen" />
                    {/* Keyboard Cyan Glow */}
                    <div className="absolute bottom-1/4 left-1/3 w-36 h-20 bg-cyan-400/20 blur-xl rounded-full pointer-events-none mix-blend-screen" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* ==========================================================
                BIO PANEL (Emerges on the Right, revealing gradually)
                "bio vhi thora dhire dhire aayega"
               ========================================================== */}
            <motion.div
              style={{
                opacity: bioContainerOpacity,
                x: bioContainerX,
                filter: bioBlur,
              }}
              className="absolute right-4 sm:right-8 lg:right-14 max-w-xl w-full space-y-5 text-left z-20 pointer-events-auto"
            >
              {/* Header Badge */}
              <motion.div style={{ opacity: bioBadgeOpacity }} className="space-y-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-cyan-400 border border-cyan-500/20 uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  ABOUT ME
                </span>
                <motion.h3
                  style={{ opacity: bioHeadingOpacity }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight"
                >
                  <ShinyText>Designing & Building with Purpose.</ShinyText>
                </motion.h3>
              </motion.div>

              {/* Primary Bio Paragraph (Smooth word-by-word luminous scroll reveal) */}
              <div className="relative">
                <RevealTextOnScroll
                  text={PERSONAL_INFO.bio}
                  progress={scrollYProgress}
                  range={[0.30, 0.58]}
                  className="text-sm sm:text-base lg:text-lg font-normal leading-relaxed text-slate-200"
                />
              </div>

              {/* Secondary Philosophy Paragraph */}
              <div className="relative">
                <RevealTextOnScroll
                  text="When I'm not writing code, I love exploring cutting-edge web motion patterns, optimizing frontend performance, architecting scalable component libraries, and creating immersive 3D web experiences."
                  progress={scrollYProgress}
                  range={[0.48, 0.72]}
                  className="text-xs sm:text-sm lg:text-base text-slate-300/90 font-light leading-relaxed"
                />
              </div>

              {/* Technical Pillar Badges (Fades in gradually) */}
              <motion.div
                style={{ opacity: bioTagsOpacity }}
                className="flex flex-wrap gap-2 pt-1"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 border border-cyan-500/25 shadow-sm backdrop-blur-md">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  Frontend Architecture
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300 border border-rose-500/25 shadow-sm backdrop-blur-md">
                  <Laptop className="w-3.5 h-3.5 text-rose-400" />
                  Interactive 3D UI
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 border border-blue-500/25 shadow-sm backdrop-blur-md">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  React & Next.js
                </span>
              </motion.div>

              {/* Interactive Call-To-Action Buttons */}
              <motion.div
                style={{ opacity: bioActionsOpacity }}
                className="flex items-center gap-3 pt-2"
              >
                {onOpenResume && (
                  <button
                    onClick={onOpenResume}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>View Resume</span>
                  </button>
                )}

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all hover:scale-105 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5 text-slate-400" />
                  <span>Get in Touch</span>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================================================================
          STAGE 2 — 4 Professional Highlight Cards (SpotlightCard grid)
         ================================================================ */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.id} delay={idx * 0.1} className="h-full">
                <SpotlightCard
                  onClick={item.onClick}
                  className={`h-full flex flex-col justify-between ${
                    item.isInteractive ? "cursor-pointer group/resumeCard" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`h-12 w-12 shrink-0 rounded-2xl border border-white/10 bg-slate-950/90 flex items-center justify-center shadow-lg ${item.iconColor}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-1.5">
                      <span>{item.title}</span>
                      {item.isInteractive && (
                        <ArrowUpRight className="h-4 w-4 text-blue-400 transition-transform group-hover/resumeCard:translate-x-0.5 group-hover/resumeCard:-translate-y-0.5" />
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const About = memo(AboutComponent);