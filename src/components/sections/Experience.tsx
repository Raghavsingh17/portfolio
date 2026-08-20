"use client";

import { memo } from "react";
import { Briefcase, Calendar, MapPin, ChevronRight } from "lucide-react";
import { EXPERIENCES } from "@/src/data/portfolio";
import { Experience as ExperienceType } from "@/src/types/portfolio";
import { ScrollReveal } from "@/src/components/reactbits/ScrollReveal";
import { SpotlightCard } from "@/src/components/reactbits/SpotlightCard";
import { ShinyText } from "@/src/components/reactbits/ShinyText";
import { AnimatedBorderGlow } from "@/src/components/reactbits/AnimatedBorderGlow";
import { RippleGrid } from "@/src/components/reactbits/RippleGrid";

function ExperienceComponent() {
  return (
    <section id="experience" className="relative py-24 sm:py-32 overflow-hidden scroll-mt-20">
      {/* Interactive Ripple Grid Background */}
      <RippleGrid />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="text-center">
          <span className="rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-400 border border-blue-500/20 uppercase">
            Career Journey
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white light:text-slate-900 sm:text-5xl">
           <ShinyText>Work Experience</ShinyText>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400 light:text-slate-600">
            My engineering trajectory delivering impactful web platforms and leading technical teams.
          </p>
        </ScrollReveal>

        {/* Timeline Container */}
        <div className="relative mt-16 space-y-8 before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-indigo-500/50 before:to-transparent md:before:left-1/2 md:before:-translate-x-1/2">
          {EXPERIENCES.map((exp: ExperienceType, idx: number) => {
            const isEven = idx % 2 === 0;
            return (
              <ScrollReveal
                key={exp.id}
                direction={isEven ? "left" : "right"}
                delay={idx * 0.1}
                className={`relative flex items-center ${isEven ? "md:flex-row-reverse" : ""
                  }`}
              >
                {/* Timeline Center Indicator Circle */}
                <div className="absolute left-6 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-blue-500 bg-slate-950 text-blue-400 shadow-[0_0_12px_#3b82f6] md:left-1/2">
                  <Briefcase className="h-4 w-4" />
                </div>

                {/* Experience Card */}
                <div className="ml-12 w-full md:ml-0 md:w-1/2 md:px-6">
                  <AnimatedBorderGlow glowColor="theme" containerClassName="h-full">
                    <SpotlightCard className="h-full border-0">
                    {/* Period & Status */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="flex items-center gap-1.5 text-xs font-mono text-blue-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {exp.period}
                        </span>
                        {exp.status === "Current" && (
                          <AnimatedBorderGlow
                            glowColor="theme"
                            containerClassName="rounded-full p-[1.5px] shadow-sm shadow-emerald-500/20"
                            className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1.5"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Present Role</span>
                          </AnimatedBorderGlow>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white light:text-slate-900">
                        {exp.role}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-300 light:text-slate-600">
                        <span className="text-blue-400">{exp.company}</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin className="h-3 w-3" />
                          {exp.location}
                        </span>
                      </div>

                      <p className="mt-4 text-xs sm:text-sm text-slate-300 light:text-slate-600 leading-relaxed">
                        {exp.summary}
                      </p>

                      {/* Achievements bullets */}
                      <ul className="mt-4 space-y-2">
                        {exp.achievements.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="flex items-start gap-2 text-xs text-slate-300 light:text-slate-600"
                          >
                            <ChevronRight className="h-4 w-4 shrink-0 text-blue-400 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tech Badges */}
                      <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-white/10 light:border-slate-200">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-slate-300 light:bg-slate-100 light:text-slate-600"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </SpotlightCard>
                  </AnimatedBorderGlow>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const Experience = memo(ExperienceComponent);
