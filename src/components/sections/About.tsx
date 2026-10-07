"use client";

import { memo, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ArrowUpRight, Code2, Terminal, Laptop } from "lucide-react";
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
      className="relative w-full py-24 sm:py-32 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20">
        <ScrollReveal>
          <SpotlightCard className="w-full p-8 sm:p-12 border border-white/10 bg-white/5 rounded-3xl shadow-2xl backdrop-blur-md">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-16">
              
              {/* Left side: Heading and Highlights */}
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-cyan-400 border border-cyan-500/20 uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    ABOUT ME
                  </span>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight pt-2">
                    <ShinyText>Designing & Building with Purpose.</ShinyText>
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
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
                </div>
              </div>

              {/* Right side: Bio text and Actions */}
              <div className="flex-1 space-y-8">
                <div className="space-y-6">
                  <div className="relative">
                    <RevealTextOnScroll
                      text={PERSONAL_INFO.bio}
                      progress={scrollYProgress}
                      range={[0.1, 0.4]}
                      className="text-base sm:text-lg font-normal leading-relaxed text-slate-200"
                    />
                  </div>

                  <div className="relative">
                    <RevealTextOnScroll
                      text="When I'm not writing code, I love exploring cutting-edge web motion patterns, optimizing frontend performance, architecting scalable component libraries, and creating immersive 3D web experiences."
                      progress={scrollYProgress}
                      range={[0.3, 0.6]}
                      className="text-sm sm:text-base text-slate-300/90 font-light leading-relaxed"
                    />
                  </div>
                </div>
               </div>
            </div>
          </SpotlightCard>
        </ScrollReveal>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
