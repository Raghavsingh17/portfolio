"use client";

import { memo } from "react";
import {
  motion,
  MotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  FileText,
  Send,
  Code2,
  Terminal,
  Layers,
  Zap,
} from "lucide-react";
import { PERSONAL_INFO } from "@/src/data/portfolio";
import { ShinyText } from "@/src/components/animations/ShinyText";

interface AboutContentProps {
  scrollYProgress: MotionValue<number>;
  onOpenResume?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// LUMINOUS SCROLL REVEAL WORDS
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
  const opacity = useTransform(progress, range, [0.2, 1]);
  const y = useTransform(progress, range, [3, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className="inline-block mr-[0.28em] font-normal transition-colors text-slate-100"
    >
      {word}
    </motion.span>
  );
}

function RevealParagraph({
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
  const [start, end] = range;
  const total = end - start;

  return (
    <p className={`flex flex-wrap leading-relaxed ${className}`}>
      {words.map((word, i) => {
        const wordStart = start + (i / words.length) * total;
        const wordEnd = Math.min(end, wordStart + (1.2 / words.length) * total);
        return (
          <RevealWord
            key={i}
            word={word}
            progress={progress}
            range={[wordStart, wordEnd]}
          />
        );
      })}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT CONTENT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function AboutContentComponent({
  scrollYProgress,
  onOpenResume,
}: AboutContentProps) {
  const shouldReduceMotion = useReducedMotion();

  // 1. Small Label: "ABOUT ME" (enters first)
  const labelOpacity = useTransform(scrollYProgress, [0.20, 0.34], [0, 1]);
  const labelY = useTransform(scrollYProgress, [0.20, 0.34], [18, 0]);
  const labelBlur = useTransform(scrollYProgress, [0.20, 0.34], ["8px", "0px"]);

  // 2. Heading (enters next with smooth cinematic tilt and blur reduction)
  const headingOpacity = useTransform(scrollYProgress, [0.26, 0.42], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0.26, 0.42], [24, 0]);
  const headingX = useTransform(scrollYProgress, [0.26, 0.42], [20, 0]);
  const headingBlur = useTransform(scrollYProgress, [0.26, 0.42], ["10px", "0px"]);
  const headingRotateX = useTransform(scrollYProgress, [0.26, 0.42], [6, 0]);

  // 3. Bio Paragraphs Container
  const bioContainerOpacity = useTransform(scrollYProgress, [0.32, 0.48], [0, 1]);
  const bioContainerY = useTransform(scrollYProgress, [0.32, 0.48], [20, 0]);

  // 4. Skills & Role Information Pills
  const skillsOpacity = useTransform(scrollYProgress, [0.52, 0.70], [0, 1]);
  const skillsY = useTransform(scrollYProgress, [0.52, 0.70], [18, 0]);
  const skillsBlur = useTransform(scrollYProgress, [0.52, 0.70], ["6px", "0px"]);

  // 5. Call To Action Buttons
  const ctaOpacity = useTransform(scrollYProgress, [0.62, 0.78], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.62, 0.78], [16, 0]);

  return (
    <div className="relative z-20 w-full max-w-xl lg:max-w-2xl text-left pointer-events-auto flex flex-col justify-center space-y-6 sm:space-y-7">
      {/* ─────────────────────────────────────────────────────────────
          1. SMALL LABEL: "ABOUT ME"
         ───────────────────────────────────────────────────────────── */}
      <motion.div
        style={{
          opacity: shouldReduceMotion ? 1 : labelOpacity,
          y: shouldReduceMotion ? 0 : labelY,
          filter: shouldReduceMotion ? "none" : labelBlur,
        }}
        className="flex items-center gap-2 select-none"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-cyan-400 border border-blue-500/20 uppercase shadow-[0_0_15px_rgba(59,130,246,0.15)] backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          ABOUT ME
        </span>
        <span className="text-xs font-mono tracking-widest text-slate-400/80 uppercase">
          / 01 — IDENTITY
        </span>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          2. HEADING (Cinematic Typography)
         ───────────────────────────────────────────────────────────── */}
      <motion.div
        style={{
          opacity: shouldReduceMotion ? 1 : headingOpacity,
          y: shouldReduceMotion ? 0 : headingY,
          x: shouldReduceMotion ? 0 : headingX,
          filter: shouldReduceMotion ? "none" : headingBlur,
          rotateX: shouldReduceMotion ? 0 : headingRotateX,
          transformPerspective: 1000,
        }}
        className="space-y-1 select-none"
      >
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
          Crafting <ShinyText>High-Performance</ShinyText> Interfaces & 3D Experiences.
        </h2>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          3. BIO PARAGRAPHS (Luminous Word-by-Word Scroll Reveal)
         ───────────────────────────────────────────────────────────── */}
      <motion.div
        style={{
          opacity: shouldReduceMotion ? 1 : bioContainerOpacity,
          y: shouldReduceMotion ? 0 : bioContainerY,
        }}
        className="space-y-4"
      >
        {/* Primary Bio Paragraph */}
        <RevealParagraph
          text={PERSONAL_INFO.bio}
          progress={scrollYProgress}
          range={[0.34, 0.60]}
          className="text-sm sm:text-base lg:text-lg font-normal leading-relaxed text-slate-200/95"
        />

        {/* Secondary Philosophy Paragraph */}
        <RevealParagraph
          text="When I'm not writing code, I love experimenting with cutting-edge UI patterns, optimizing sub-100ms Core Web Vitals, and designing frictionless digital products engineered from concept to deployment."
          progress={scrollYProgress}
          range={[0.50, 0.74]}
          className="text-xs sm:text-sm lg:text-base text-slate-400/90 font-light leading-relaxed"
        />
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          4. SKILLS & ROLE INFORMATION PILLS
         ───────────────────────────────────────────────────────────── */}
      <motion.div
        style={{
          opacity: shouldReduceMotion ? 1 : skillsOpacity,
          y: shouldReduceMotion ? 0 : skillsY,
          filter: shouldReduceMotion ? "none" : skillsBlur,
        }}
        className="flex flex-wrap gap-2 pt-1"
      >
        <div className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500/10 px-3.5 py-1.5 text-xs font-medium text-cyan-300 border border-blue-500/20 backdrop-blur-md shadow-sm">
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frontend Architecture</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-300 border border-indigo-500/20 backdrop-blur-md shadow-sm">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive 3D Motion</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500/10 px-3.5 py-1.5 text-xs font-medium text-cyan-300 border border-cyan-500/20 backdrop-blur-md shadow-sm">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>React & Next.js</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 border border-emerald-500/20 backdrop-blur-md shadow-sm">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Performance & SEO</span>
        </div>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          5. CALL TO ACTION BUTTONS
         ───────────────────────────────────────────────────────────── */}
      <motion.div
        style={{
          opacity: shouldReduceMotion ? 1 : ctaOpacity,
          y: shouldReduceMotion ? 0 : ctaY,
        }}
        className="flex items-center gap-3 pt-2"
      >
        {onOpenResume && (
          <button
            onClick={onOpenResume}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600/30 to-cyan-500/30 hover:from-blue-600/40 hover:to-cyan-500/40 border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.18)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>View Resume</span>
          </button>
        )}

        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all hover:scale-105 active:scale-95"
        >
          <Send className="w-3.5 h-3.5 text-slate-400" />
          <span>Get in Touch</span>
        </a>
      </motion.div>
    </div>
  );
}

export const AboutContent = memo(AboutContentComponent);
