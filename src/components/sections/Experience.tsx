"use client";

import { memo, useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { EXPERIENCES } from "@/src/data/portfolio";
import { Experience as ExperienceType } from "@/src/types/portfolio";
import { SpotlightCard } from "@/src/components/reactbits/SpotlightCard";
import { ShinyText } from "@/src/components/animations/ShinyText";
import { LottiePlayer } from "@/src/components/animations/LottiePlayer";
import codeAnimation from "@/src/assets/lottie/code.json";

function WorkspaceIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 16 16"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H4Zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.373 5.373 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2H2Z" />
    </svg>
  );
}

function ExperienceComponent() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.15 });
  const [navTriggerCount, setNavTriggerCount] = useState(0);

  // Listen for navbar clicks on "Experience" link
  useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent<{ targetId?: string }>;
      if (customEvent.detail?.targetId === "experience") {
        setNavTriggerCount((prev) => prev + 1);
      }
    };

    window.addEventListener("portfolio-navigate", handleNav);
    return () => window.removeEventListener("portfolio-navigate", handleNav);
  }, []);

  const shouldAnimate = isInView || navTriggerCount > 0;

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative pt-16 sm:pt-24 lg:pt-36 pb-16 sm:pb-24 lg:pb-36 overflow-hidden scroll-mt-24 lg:scroll-mt-32 bg-transparent"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Decorative Accent Line */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-3">
            <span className="inline-block w-10 sm:w-16 md:w-28 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-blue-500" />
            <span className="rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-300 border border-blue-500/30 uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              Career Journey
            </span>
            <span className="inline-block w-10 sm:w-16 md:w-28 h-[1px] bg-gradient-to-l from-transparent via-cyan-500/50 to-blue-500" />
          </div>

          <h2 className="mt-3 text-2xl xs:text-3xl font-extrabold text-white sm:text-5xl tracking-tight">
            <ShinyText>Work Experience</ShinyText>
          </h2>

          <p className="mx-auto mt-2.5 max-w-2xl text-slate-300 text-xs sm:text-base font-medium">
            My engineering trajectory delivering impactful web platforms and leading technical teams.
          </p>

          {/* Central decorative divider line */}
          <div className="mt-5 mx-auto w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>

        {/* 2-Column Layout: Left Laptop with Coffee Animation | Right Experience Cards */}
        <div className="mt-12 sm:mt-16 lg:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Build-up Animated Laptop with Coffee */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <motion.div
              key={`laptop-${navTriggerCount}`}
              initial={{ opacity: 0, scale: 0.8, y: 35 }}
              animate={
                shouldAnimate
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.8, y: 35 }
              }
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-full flex items-center justify-center"
            >
              {/* Atmospheric Glow behind Laptop (matches Cosmic Background) */}
              <div className="absolute inset-0 bg-radial from-cyan-500/20 via-blue-600/15 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

              {/* Gentle Floating Motion */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full flex items-center justify-center"
              >
                <LottiePlayer
                  animationData={codeAnimation}
                  className="w-full h-auto drop-shadow-[0_15px_35px_rgba(59,130,246,0.25)]"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Experience Cards with Timeline Line */}
          <div className="lg:col-span-7">
            {/* Timeline Line Container */}
            <div className="relative space-y-4 sm:space-y-5 before:absolute before:inset-0 before:left-4 sm:before:left-5 before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-blue-500/70 before:to-transparent">
              {EXPERIENCES.map((exp: ExperienceType, idx: number) => {
                return (
                  <motion.div
                    key={`${exp.id}-${navTriggerCount}`}
                    initial={{ opacity: 0, x: 45, y: 20 }}
                    animate={
                      shouldAnimate
                        ? { opacity: 1, x: 0, y: 0 }
                        : { opacity: 0, x: 45, y: 20 }
                    }
                    transition={{
                      duration: 0.6,
                      delay: idx * 0.22, // Staggered 1 by 1 entrance!
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative flex items-center"
                  >
                    {/* Timeline Node Icon */}
                    <div className="absolute left-4 sm:left-5 z-10 flex h-7 w-7 sm:h-8 sm:w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-cyan-400 bg-slate-950 text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.65)]">
                      <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>

                    {/* Compact Experience Card (Image 2 style with Image 1 workspace icon) */}
                    <div className="pl-9 sm:pl-12 w-full">
                      <SpotlightCard className="h-full p-4 sm:p-5 !bg-slate-900/85 !border-white/10 hover:!border-cyan-500/40 shadow-xl transition-all duration-300 group">
                        {/* Period & Status Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-semibold text-cyan-400">
                            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400" />
                            {exp.period}
                          </span>

                          {exp.status === "Completed" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-300 border border-blue-500/25">
                              <CheckCircle2 className="h-3 w-3 text-blue-400" />
                              <span>Completed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/25">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Present Role</span>
                            </span>
                          )}
                        </div>

                        {/* Icon + Role & Company Row */}
                        <div className="flex items-center gap-3.5 sm:gap-4 mt-1">
                          <div className="shrink-0 text-cyan-400 group-hover:text-cyan-300 p-2 sm:p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/25 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                            <WorkspaceIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                              {exp.role}
                            </h3>

                            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs sm:text-sm font-semibold text-slate-300">
                              <span className="text-cyan-300 font-bold">{exp.company}</span>
                              {exp.location && (
                                <span className="flex items-center gap-1 text-slate-400 font-medium">
                                  <MapPin className="h-3 w-3 text-slate-400" />
                                  {exp.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </SpotlightCard>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const Experience = memo(ExperienceComponent);
