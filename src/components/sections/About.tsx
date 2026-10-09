"use client";

import { memo, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PERSONAL_INFO } from "@/src/data/portfolio";
import { ScrollReveal } from "@/src/components/animations/ScrollReveal";
import { SpotlightCard } from "@/src/components/reactbits/SpotlightCard";
import { ShinyText } from "@/src/components/animations/ShinyText";
import { getAboutHighlights } from "@/src/utils/aboutHelpers";

interface AboutProps {
  onOpenResume?: () => void;
}

function RevealWord({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.35, 1]);
  const y = useTransform(progress, range, [3, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className="inline-block mr-[0.28em] font-normal transition-colors text-slate-200"
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

function AboutComponent({ onOpenResume }: AboutProps) {
  const HIGHLIGHTS = getAboutHighlights(onOpenResume);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 overflow-hidden scroll-mt-20"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header (matching Skills & Projects) */}
        <ScrollReveal className="text-center mb-16">
          <span className="rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-400 border border-blue-500/20 uppercase">
            Engineering Identity
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">
            <ShinyText>A Little About Me</ShinyText>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            {PERSONAL_INFO.tagline}
          </p>
        </ScrollReveal>

        {/* Main Bio Card (Matches reference design) */}
        <div className="mx-auto max-w-5xl pb-16">
          <ScrollReveal>
            <SpotlightCard className="w-full p-8 sm:p-12 border border-[#162544] bg-[#070e22]/90 rounded-3xl shadow-[0_0_50px_rgba(2,6,23,0.8)] backdrop-blur-xl relative overflow-hidden">
              {/* Subtle radial ambient glow inside card */}
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Eyebrow tag */}
                <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold tracking-wider text-cyan-400 uppercase">
                  <span className="text-cyan-400 font-bold">&lt;&gt;</span>
                  <span>THE BACKGROUND</span>
                </div>

                {/* Title */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  Who I am.
                </h2>

                {/* Bio paragraphs */}
                <div className="space-y-5 pt-1">
                  <RevealTextOnScroll
                    text={PERSONAL_INFO.bio}
                    progress={scrollYProgress}
                    range={[0.1, 0.35]}
                    className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed"
                  />

                  <RevealTextOnScroll
                    text="When I'm not writing code, you can find me exploring new technologies, experimenting with modern UI patterns, optimizing frontend performance, or building full-stack integrations with Node.js, Express.js, and MongoDB."
                    progress={scrollYProgress}
                    range={[0.25, 0.5]}
                    className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed"
                  />
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-slate-800/80 my-7" />

                {/* Bottom skill pills */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="inline-flex items-center rounded-full bg-blue-950/40 px-4 py-1.5 text-xs sm:text-sm font-medium text-blue-400 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:border-blue-400/70 transition-colors">
                    Full-Stack Architecture
                  </span>
                  <span className="inline-flex items-center rounded-full bg-indigo-950/40 px-4 py-1.5 text-xs sm:text-sm font-medium text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:border-indigo-400/70 transition-colors">
                    Generative AI Tooling
                  </span>
                  <span className="inline-flex items-center rounded-full bg-fuchsia-950/40 px-4 py-1.5 text-xs sm:text-sm font-medium text-fuchsia-300 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.15)] hover:border-fuchsia-400/70 transition-colors">
                    Core Web Vitals Optimization
                  </span>
                </div>
              </div>
            </SpotlightCard>
          </ScrollReveal>
        </div>

        {/* 4 Professional Cards */}
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
