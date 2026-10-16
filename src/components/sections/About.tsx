"use client";

import { memo, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PERSONAL_INFO } from "@/src/data/portfolio";
import { ShinyText } from "@/src/components/animations/ShinyText";
import { SpotlightCard } from "@/src/components/reactbits/SpotlightCard";
import { AsciiPortrait } from "@/src/components/ascii/AsciiPortrait";
import { ScrollReveal } from "@/src/components/animations/ScrollReveal";
import { getAboutHighlights } from "@/src/utils/aboutHelpers";
import aboutPortraitSrc from "@/src/assets/images/about-portrait.png";

interface AboutProps {
  onOpenResume?: () => void;
}

// =========================================================================
// ACCESSIBLE FALLBACK (REDUCED MOTION)
// =========================================================================
function ReducedMotionAbout({ onOpenResume }: AboutProps) {
  const highlights = getAboutHighlights(onOpenResume);
  const staticProgress = useMotionValue(1.0);

  return (
    <section id="about-reduced" className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-transparent text-slate-100">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-3">
            <span className="inline-block w-10 sm:w-16 md:w-28 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-blue-500" />
            <span className="rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-300 border border-blue-500/30 uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              Engineering Identity
            </span>
            <span className="inline-block w-10 sm:w-16 md:w-28 h-[1px] bg-gradient-to-l from-transparent via-cyan-500/50 to-blue-500" />
          </div>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">
            <ShinyText>A Little About Me</ShinyText>
          </h2>
          <p className="mx-auto mt-2.5 max-w-2xl text-slate-300 text-xs sm:text-base font-medium">
            Full-stack engineer dedicated to crafting performant, pixel-perfect web experiences with modern architecture.
          </p>
          <div className="mt-5 mx-auto w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>

        {/* Bio & ASCII (Pure typography, no card container around ASCII) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          <div className="lg:col-span-5 flex justify-center select-none pointer-events-none">
            <AsciiPortrait
              imageSrc={aboutPortraitSrc.src}
              scrollProgress={staticProgress}
              columns={48}
              fontSize={10.5}
            />
          </div>

          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold tracking-wider text-cyan-400 uppercase">
              <span className="text-cyan-400 font-bold">&lt;&gt;</span>
              <span>THE BACKGROUND</span>
            </div>

            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Who I am.
            </h3>

            <div className="space-y-3.5 text-slate-100 text-sm sm:text-base lg:text-lg leading-relaxed font-semibold text-justify [text-align:justify]">
              <p>{PERSONAL_INFO.bio}</p>
              <p className="text-slate-200">
                When I&apos;m not writing code, you can find me exploring new technologies, experimenting with modern UI patterns, optimizing frontend performance, or building full-stack integrations with Node.js, Express.js, and MongoDB.
              </p>
            </div>

            <div className="w-full h-px bg-slate-800/80 my-4 sm:my-5" />

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
              <span className="inline-flex items-center rounded-full bg-blue-950/40 px-3.5 py-1 text-xs sm:text-sm font-medium text-blue-400 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                Full-Stack Architecture
              </span>
              <span className="inline-flex items-center rounded-full bg-indigo-950/40 px-3.5 py-1 text-xs sm:text-sm font-medium text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                Generative AI Tooling
              </span>
              <span className="inline-flex items-center rounded-full bg-fuchsia-950/40 px-3.5 py-1 text-xs sm:text-sm font-medium text-fuchsia-300 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.15)]">
                Core Web Vitals Optimization
              </span>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <SpotlightCard
                key={item.id}
                onClick={item.onClick}
                className={`p-5 sm:p-6 !bg-slate-900/65 dark:!bg-slate-900/65 border ${item.borderClass} backdrop-blur-xl shadow-2xl ${
                  item.isInteractive ? "cursor-pointer group/resumeCard" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl border ${item.iconBgClass} flex items-center justify-center ${item.iconShadowClass}`}>
                    <Icon className={`h-5 w-5 ${item.iconColorClass}`} />
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                </div>
                <h4 className={`text-base font-bold text-white mb-2 ${item.isInteractive ? "flex items-center gap-1.5" : ""}`}>
                  <span>{item.title}</span>
                  {item.isInteractive && (
                    <ArrowUpRight className="h-4 w-4 text-blue-400 transition-transform group-hover/resumeCard:translate-x-0.5 group-hover/resumeCard:-translate-y-0.5" />
                  )}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {item.description}
                </p>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// MOBILE & TABLET LAYOUT (<1024px)
// Pure floating ASCII portrait (NO CARD CONTAINER), full-width responsive
// flow, readable bio text, polished high-impact cards.
// =========================================================================
function AboutMobile({ onOpenResume }: AboutProps) {
  const highlights = getAboutHighlights(onOpenResume);
  const staticProgress = useMotionValue(1.0);

  return (
    <section className="relative w-full py-14 sm:py-20 px-4 sm:px-6 bg-transparent text-slate-100">
      <div className="w-full max-w-2xl mx-auto space-y-9 sm:space-y-11">
        {/* Section Header */}
        <ScrollReveal className="text-center">
          <div className="inline-flex items-center justify-center gap-3">
            <span className="inline-block w-10 sm:w-16 md:w-28 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-blue-500" />
            <span className="rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-300 border border-blue-500/30 uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              Engineering Identity
            </span>
            <span className="inline-block w-10 sm:w-16 md:w-28 h-[1px] bg-gradient-to-l from-transparent via-cyan-500/50 to-blue-500" />
          </div>
          <h2 className="mt-3 text-2xl xs:text-3xl font-extrabold text-white sm:text-4xl">
            <ShinyText>A Little About Me</ShinyText>
          </h2>
          <p className="mx-auto mt-2.5 max-w-xl text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
            Full-stack engineer dedicated to crafting performant, pixel-perfect web experiences with modern architecture.
          </p>
          <div className="mt-4 mx-auto w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </ScrollReveal>

        {/* PURE FLOATING ASCII PORTRAIT — NO CARD CONTAINER AROUND IT */}
        <ScrollReveal delay={0.1} className="flex justify-center items-center py-1 overflow-hidden select-none pointer-events-none">
          <div className="relative flex justify-center items-center">
            {/* Subtle atmospheric ambient glow behind the characters */}
            <div className="absolute inset-0 bg-radial from-blue-500/15 via-transparent to-transparent blur-3xl pointer-events-none" />
            <AsciiPortrait
              imageSrc={aboutPortraitSrc.src}
              scrollProgress={staticProgress}
              columns={36}
              fontSize={8.5}
            />
          </div>
        </ScrollReveal>

        {/* Bio Content */}
        <ScrollReveal delay={0.15} className="space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-cyan-400 uppercase">
            <span className="text-cyan-400 font-bold">&lt;&gt;</span>
            <span>THE BACKGROUND</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Who I am.
          </h3>

          <div className="space-y-3.5 text-slate-100 text-xs sm:text-sm leading-relaxed font-semibold text-justify [text-align:justify]">
            <p>{PERSONAL_INFO.bio}</p>
            <p className="text-slate-200">
              When I&apos;m not writing code, you can find me exploring new technologies, experimenting with modern UI patterns, optimizing frontend performance, or building full-stack integrations with Node.js, Express.js, and MongoDB.
            </p>
          </div>

          <div className="w-full h-px bg-slate-800/80 my-4" />

          {/* Skill Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center rounded-full bg-blue-950/40 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              Full-Stack Architecture
            </span>
            <span className="inline-flex items-center rounded-full bg-indigo-950/40 px-3 py-1 text-xs font-medium text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              Generative AI Tooling
            </span>
            <span className="inline-flex items-center rounded-full bg-fuchsia-950/40 px-3 py-1 text-xs font-medium text-fuchsia-300 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.15)]">
              Core Web Vitals Optimization
            </span>
          </div>
        </ScrollReveal>

        {/* 4 Cards Grid - Responsive, balanced padding, clean text */}
        <ScrollReveal delay={0.2} className="w-full pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 w-full">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={item.onClick}
                  className={`w-full p-4 sm:p-5 rounded-2xl border ${item.borderClass} ${item.hoverBorderClass} bg-[#0c1836]/90 backdrop-blur-2xl transition-all duration-300 ${item.shadowClass} ${
                    item.isInteractive ? "cursor-pointer group/resumeCard active:scale-[0.98]" : ""
                  } flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden`}
                >
                  {/* Subtle top edge gradient highlight */}
                  <div
                    className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${item.topGradientClass} to-transparent pointer-events-none`}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div
                        className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl border ${item.iconBgClass} flex items-center justify-center ${item.iconShadowClass}`}
                      >
                        <Icon className={`h-4.5 w-4.5 sm:h-5 sm:w-5 ${item.iconColorClass}`} />
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-bold border shadow-sm ${item.badgeClass}`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <h4
                      className={`text-sm sm:text-base font-bold text-white mb-1.5 tracking-tight ${
                        item.isInteractive ? "flex items-center gap-1.5" : ""
                      }`}
                    >
                      <span>{item.title}</span>
                      {item.isInteractive && (
                        <ArrowUpRight className="h-4 w-4 text-blue-400 transition-transform group-hover/resumeCard:translate-x-1 group-hover/resumeCard:-translate-y-1" />
                      )}
                    </h4>

                    <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// =========================================================================
// DESKTOP PINNED INTERACTIVE SCROLL LAYOUT (>=1024px)
// Sticky 320vh stage choreography with pure floating ASCII portrait (NO CARD)
// =========================================================================
function AboutDesktop({ onOpenResume }: AboutProps) {
  const highlights = getAboutHighlights(onOpenResume);
  const containerRef = useRef<HTMLElement>(null);

  // Master scroll progress across entire pinned About sequence
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const headerOpacity = useTransform(
    scrollYProgress,
    [0.00, 0.04, 1.00],
    [0.4, 1.0, 1.0]
  );

  const asciiScale = useTransform(
    scrollYProgress,
    [0.00, 0.20, 1.00],
    [0.85, 1.0, 1.0]
  );

  const desktopAsciiOpacity = useTransform(
    scrollYProgress,
    [0.00, 0.08, 1.00],
    [0.4, 1.0, 1.0]
  );

  // Center (0vw) -> Left (-25vw) -> Sweep to Right (+25vw)
  const desktopAsciiX = useTransform(
    scrollYProgress,
    [0.00, 0.28, 0.46, 0.60, 0.78, 1.00],
    ["0vw", "0vw", "-25vw", "-25vw", "25vw", "25vw"]
  );

  // Stage 2: Bio Reveal on Right Side
  const bioOpacity = useTransform(
    scrollYProgress,
    [0.00, 0.28, 0.40, 0.58, 0.68, 1.00],
    [0, 0, 1, 1, 0, 0]
  );

  const bioY = useTransform(
    scrollYProgress,
    [0.00, 0.28, 0.40, 0.58, 0.68, 1.00],
    [25, 25, 0, 0, -20, -20]
  );

  // Stage 3: 4 Cards Reveal on Left Side
  const cardsOpacity = useTransform(
    scrollYProgress,
    [0.00, 0.58, 0.72, 1.00],
    [0, 0, 1, 1]
  );

  const cardsY = useTransform(
    scrollYProgress,
    [0.00, 0.58, 0.72, 1.00],
    [30, 30, 0, 0]
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-transparent text-slate-100"
      style={{ height: "320vh" }}
    >
      {/* Pinned Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-between pt-16 pb-4 px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          style={{ opacity: headerOpacity }}
          className="w-full text-center z-30 shrink-0 pointer-events-none select-none mb-2"
        >
          <div className="inline-flex items-center justify-center gap-3">
            <span className="inline-block w-12 lg:w-28 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-blue-500" />
            <span className="rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-300 border border-blue-500/30 uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              Engineering Identity
            </span>
            <span className="inline-block w-12 lg:w-28 h-[1px] bg-gradient-to-l from-transparent via-cyan-500/50 to-blue-500" />
          </div>
          <h2 className="mt-1 text-4xl lg:text-5xl font-extrabold text-white">
            <ShinyText>A Little About Me</ShinyText>
          </h2>
          <p className="mx-auto mt-1 max-w-2xl text-slate-300 text-sm font-medium">
            Full-stack engineer dedicated to crafting performant, pixel-perfect web experiences with modern architecture.
          </p>
          <div className="mt-3 mx-auto w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </motion.div>

        {/* Central Choreography Stage */}
        <div className="relative w-full max-w-7xl flex-1 flex items-center justify-center my-auto">
          {/* Pure ASCII Portrait — NO CARD CONTAINER AROUND IT */}
          <motion.div
            style={{
              x: desktopAsciiX,
              y: 0,
              scale: asciiScale,
              opacity: desktopAsciiOpacity,
            }}
            className="absolute z-10 flex flex-col items-center justify-center will-change-transform top-1/2 -translate-y-1/2 select-none pointer-events-none"
          >
            <AsciiPortrait
              imageSrc={aboutPortraitSrc.src}
              scrollProgress={scrollYProgress}
              columns={54}
              fontSize={12}
            />
          </motion.div>

          {/* Stage 2: Bio Content on Right Side */}
          <motion.div
            style={{
              opacity: bioOpacity,
              y: bioY,
            }}
            className="absolute z-20 left-[52%] w-[46%] max-w-xl top-1/2 -translate-y-1/2 flex flex-col justify-center space-y-3.5"
          >
            <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-cyan-400 uppercase">
              <span className="text-cyan-400 font-bold">&lt;&gt;</span>
              <span>THE BACKGROUND</span>
            </div>

            <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Who I am.
            </h3>

            <div className="space-y-3.5 text-slate-100 text-base lg:text-[16px] leading-relaxed font-semibold text-justify [text-align:justify]">
              <p>{PERSONAL_INFO.bio}</p>
              <p className="text-slate-200 text-sm lg:text-[14.5px]">
                When I&apos;m not writing code, you can find me exploring new technologies, experimenting with modern UI patterns, optimizing frontend performance, or building full-stack integrations with Node.js, Express.js, and MongoDB.
              </p>
            </div>

            <div className="w-full h-px bg-slate-800/80 my-2.5" />

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="inline-flex items-center rounded-full bg-blue-950/40 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                Full-Stack Architecture
              </span>
              <span className="inline-flex items-center rounded-full bg-indigo-950/40 px-3 py-1 text-xs font-medium text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                Generative AI Tooling
              </span>
              <span className="inline-flex items-center rounded-full bg-fuchsia-950/40 px-3 py-1 text-xs font-medium text-fuchsia-300 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.15)]">
                Core Web Vitals Optimization
              </span>
            </div>
          </motion.div>

          {/* Stage 3: 4 Cards on Left Side */}
          <motion.div
            style={{
              opacity: cardsOpacity,
              y: cardsY,
            }}
            className="absolute z-20 left-[2%] w-[48%] max-w-xl top-1/2 -translate-y-1/2 flex flex-col justify-center pointer-events-auto"
          >
            <div className="grid grid-cols-2 gap-4 w-full">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={item.onClick}
                    className={`h-full p-5 rounded-2xl border ${item.borderClass} ${item.hoverBorderClass} bg-[#0c1836]/90 backdrop-blur-2xl transition-all duration-300 ${item.shadowClass} ${
                      item.isInteractive ? "cursor-pointer group/resumeCard" : ""
                    } flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden`}
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${item.topGradientClass} to-transparent pointer-events-none`}
                    />

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`h-11 w-11 rounded-xl border ${item.iconBgClass} flex items-center justify-center ${item.iconShadowClass} ${
                            item.isInteractive ? "group-hover/resumeCard:scale-110" : "group-hover:scale-110"
                          } transition-transform`}
                        >
                          <Icon className={`h-6 w-6 ${item.iconColorClass}`} />
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold border shadow-sm ${item.badgeClass}`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <h4
                        className={`text-base lg:text-lg font-bold text-white mb-1 tracking-tight ${
                          item.isInteractive ? "flex items-center gap-1" : ""
                        }`}
                      >
                        <span>{item.title}</span>
                        {item.isInteractive && (
                          <ArrowUpRight className="h-4 w-4 text-blue-400 transition-transform group-hover/resumeCard:translate-x-1 group-hover/resumeCard:-translate-y-1" />
                        )}
                      </h4>
                      <p className="text-xs lg:text-[13px] text-slate-200 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AboutComponent({ onOpenResume }: AboutProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <ReducedMotionAbout onOpenResume={onOpenResume} />;
  }

  return (
    <div id="about" className="relative w-full scroll-mt-20">
      {/* Mobile & Tablet Flow: pure floating ASCII portrait, 100% full width, clean card descriptions */}
      <div className="block lg:hidden">
        <AboutMobile onOpenResume={onOpenResume} />
      </div>

      {/* Desktop Pinned Scroll Flow: pure floating ASCII portrait with 320vh stage choreography */}
      <div className="hidden lg:block">
        <AboutDesktop onOpenResume={onOpenResume} />
      </div>
    </div>
  );
}

export const About = memo(AboutComponent);
