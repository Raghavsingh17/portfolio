"use client";

import { memo } from "react";
import {
  Briefcase,
  FileText,
  Smartphone,
  Palette,
  Code,
  ArrowUpRight,
} from "lucide-react";
import { PERSONAL_INFO } from "@/src/data/portfolio";
import { ScrollReveal } from "@/src/components/reactbits/ScrollReveal";
import { SpotlightCard } from "@/src/components/reactbits/SpotlightCard";
import { ShinyText } from "@/src/components/reactbits/ShinyText";
import { AnimatedBorderGlow } from "@/src/components/reactbits/AnimatedBorderGlow";

interface AboutProps {
  onOpenResume?: () => void;
}

function AboutComponent({ onOpenResume }: AboutProps) {
  const HIGHLIGHTS = [
    {
      id: "experience",
      icon: Briefcase,
      title: "2 + Years Experience",
      badge: "Career Metric",
      description:
        "Developing production-grade frontend systems, scalable full-stack APIs, reusable component libraries, and real-time interactive web applications.",
      glowColor: "cyber" as const,
      iconGlowColor: "cyan-blue" as const,
      iconColor: "text-cyan-400",
      isInteractive: false,
    },
    {
      id: "resume-hub",
      icon: FileText,
      title: "Interactive Resume",
      badge: "Live PDF Hub",
      description:
        "Explore full work history, tech stack breakdown, education, and certifications with live PDF preview or instant download.",
      glowColor: "rainbow" as const,
      iconGlowColor: "rainbow" as const,
      iconColor: "text-blue-400",
      isInteractive: true,
      onClick: onOpenResume,
    },
    {
      id: "responsive",
      icon: Smartphone,
      title: "Responsive & Scalable",
      badge: "Cross-Device",
      description:
        "Flawless mobile-first layouts with zero horizontal overflow, fluid typography, and sub-100ms Core Web Vitals performance.",
      glowColor: "sunset" as const,
      iconGlowColor: "sunset" as const,
      iconColor: "text-amber-400",
      isInteractive: false,
    },
    {
      id: "uiux",
      icon: Palette,
      title: "UI/UX & Micro-Interactions",
      badge: "Design Craft",
      description:
        "Crafting Apple and Vercel-inspired glassmorphism interfaces, smooth Framer Motion spring physics, and accessible components.",
      glowColor: "gold" as const,
      iconGlowColor: "purple" as const,
      iconColor: "text-purple-400",
      isInteractive: false,
    },
  ];

  return (
    <section id="about" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="text-center">
          <span className="rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-400 border border-blue-500/20 uppercase">
            Engineering Identity
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white light:text-slate-900 sm:text-5xl">
            <ShinyText>A Little About Me</ShinyText>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400 light:text-slate-600">
            A developer who bridges engineering rigor, aesthetic precision and digital solutions.
          </p>
        </ScrollReveal>

        {/* Story Section Card */}
        <div className="mt-16 max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <AnimatedBorderGlow glowColor="rainbow">
              <SpotlightCard className="h-full flex flex-col justify-between border-0 p-8 sm:p-10">
                <div>
                  <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-4">
                    <Code className="h-4 w-4" />
                    <span>The Background</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white light:text-slate-900 mb-4">
                    Who I am.
                  </h3>
                  <p className="text-slate-300 light:text-slate-700 leading-relaxed text-sm sm:text-base mb-4">
                    {PERSONAL_INFO.bio}
                  </p>
                  <p className="text-slate-400 light:text-slate-600 leading-relaxed text-sm sm:text-base">
                    When I’m not writing code, you can find me exploring new technologies, experimenting with modern UI patterns, optimizing frontend performance, or building full-stack integrations with Node.js, Express.js, and MongoDB.
                  </p>
                </div>

                {/* Tag Highlights */}
                <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-white/10 light:border-slate-200">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
                    Full-Stack Architecture
                  </span>
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                    Generative AI Tooling
                  </span>
                  <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400 border border-purple-500/20">
                    Core Web Vitals Optimization
                  </span>
                </div>
              </SpotlightCard>
            </AnimatedBorderGlow>
          </ScrollReveal>
        </div>

        {/* 4 Professional Highlights Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.id} delay={idx * 0.1}>
                <AnimatedBorderGlow glowColor={item.glowColor}>
                  <SpotlightCard
                    onClick={item.onClick}
                    className={`h-full border-0 flex flex-col justify-between ${item.isInteractive ? "cursor-pointer group/resumeCard" : ""
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <AnimatedBorderGlow
                          glowColor={item.iconGlowColor}
                          containerClassName="h-12 w-12 shrink-0 rounded-2xl p-[1.5px] shadow-lg"
                          className={`p-0 h-full w-full rounded-[calc(1rem-1.5px)] bg-slate-950/90 flex items-center justify-center ${item.iconColor}`}
                        >
                          <Icon className="h-6 w-6" />
                        </AnimatedBorderGlow>
                        <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white light:text-slate-900 mb-2 flex items-center gap-1.5">
                        <span>{item.title}</span>
                        {item.isInteractive && (
                          <ArrowUpRight className="h-4 w-4 text-blue-400 transition-transform group-hover/resumeCard:translate-x-0.5 group-hover/resumeCard:-translate-y-0.5" />
                        )}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </SpotlightCard>
                </AnimatedBorderGlow>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const About = memo(AboutComponent);
