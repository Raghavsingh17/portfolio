"use client";

import { useState, useMemo, memo, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import { Sparkles, Eye, ArrowUpRight } from "lucide-react";
import { Github } from "@/src/components/icons/Icons";
import { PROJECTS } from "@/src/data/portfolio";
import { Project } from "@/src/types/portfolio";
import { ShinyText } from "@/src/components/animations/ShinyText";
import { ProjectModal } from "@/src/components/ui/ProjectModal";

const CATEGORIES = ["All", "Full Stack", "AI & ML", "Web App", "Developer Tools"];

type AccentKey = "cyan" | "blue" | "amber" | "purple" | "emerald";

const CATEGORY_ACCENT: Record<string, AccentKey> = {
  "AI & ML": "purple",
  "Full Stack": "cyan",
  "Web App": "blue",
  "Developer Tools": "amber",
  Default: "emerald",
};

const ACCENT_STYLES: Record<AccentKey, { border: string; tag: string; bullet: string; glow: string }> = {
  cyan:    { border: "border-cyan-500/25",    tag: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",    bullet: "bg-cyan-400",    glow: "rgba(6,182,212,0.22)"  },
  blue:    { border: "border-blue-500/25",    tag: "bg-blue-500/10 text-blue-300 border-blue-500/20",    bullet: "bg-blue-400",    glow: "rgba(59,130,246,0.22)" },
  amber:   { border: "border-amber-500/25",   tag: "bg-amber-500/10 text-amber-300 border-amber-500/20", bullet: "bg-amber-400",   glow: "rgba(245,158,11,0.22)" },
  purple:  { border: "border-purple-500/25",  tag: "bg-purple-500/10 text-purple-300 border-purple-500/20", bullet: "bg-purple-400", glow: "rgba(168,85,247,0.22)" },
  emerald: { border: "border-emerald-500/25", tag: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", bullet: "bg-emerald-400", glow: "rgba(16,185,129,0.22)" },
};

// ─────────────────────────────────────────────────────────────────────────────
// FRAMER STACKCARDONSCROLL COMPONENT
// Matching https://framer.com/m/StackCardOnScroll-0UU1Cf.js@KD0PxuuPkdsfI0lUqrkr
// Outer card: 56px rounded, rgb(5, 26, 36) background, 4px outer padding
// Inner image: 50px rounded container with overflow hidden
// Stacking physics: sticky cards in a shared scroll container with staggered tops
// ─────────────────────────────────────────────────────────────────────────────

interface ProjectStackCardProps {
  project: Project;
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  onViewDetails: (p: Project) => void;
}

function ProjectStackCard({
  project,
  index,
  totalCards,
  progress,
  range,
  targetScale,
  onViewDetails,
}: ProjectStackCardProps) {
  const accentKey = (CATEGORY_ACCENT[project.category] as AccentKey) ?? "emerald";
  const c = ACCENT_STYLES[accentKey];
  const isLastCard = index === totalCards - 1;

  // Staggered top offset: 84px clearance for fixed navbar + 22px per card layer
  const stickyTop = 84 + index * 22;

  // Dynamic scale driven by parent stack scroll progress (starts 1.0, scales down to targetScale)
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      className="sticky w-full max-w-[920px] mx-auto"
      style={{
        top: stickyTop,
        zIndex: index + 1,
        marginBottom: isLastCard ? "0px" : "36vh",
      }}
    >
      <motion.div
        style={{
          scale,
          transformOrigin: "top center",
          willChange: "transform",
        }}
        className="w-full"
      >
        {/* ── Framer Outer Card Shell: 56px rounded, rgb(5,26,36), full image with hover reveal ── */}
        <div
          className="relative w-full p-2 sm:p-2.5 transition-all duration-300"
          style={{
            backgroundColor: "#051a24",
            borderRadius: "56px",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow:
              "inset 0px 1px 0px 0px rgba(255, 255, 255, 0.25), 0 30px 60px -15px rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(9px)",
            WebkitBackdropFilter: "blur(9px)",
          }}
        >
          {/* ── FULL IMAGE CONTAINER (50px rounded, with hover reveal) ── */}
          <div
            className="group relative w-full h-[380px] sm:h-[460px] lg:h-[500px] overflow-hidden cursor-pointer"
            style={{ borderRadius: "50px" }}
            onClick={() => onViewDetails(project)}
          >
            {/* The Full Project Showcase Image */}
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 940px"
              priority={index === 0}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Permanent Subtle Vignette so edges look luxury & readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Always Visible Default State: Category Tag & Floating Title */}
            <div className="absolute top-5 left-6 right-6 flex items-center justify-between z-10 pointer-events-none">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`rounded-full px-3.5 py-1 text-[11px] font-bold tracking-[0.16em] uppercase border backdrop-blur-md bg-black/40 ${c.tag}`}
                >
                  {project.category}
                </span>
                {project.metrics && (
                  <span className="flex items-center gap-1.5 rounded-full bg-black/50 border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/80 backdrop-blur-md">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    {project.metrics}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-white/60 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 group-hover:opacity-0 transition-opacity">
                Hover to explore
              </span>
            </div>

            {/* Bottom Title Bar (Visible before hover) */}
            <div className="absolute bottom-6 left-6 right-6 z-10 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-lg">
                {project.title}
              </h3>
              <p className="text-xs sm:text-sm text-cyan-200/80 font-medium mt-1 drop-shadow">
                {project.subtitle}
              </p>
            </div>

            {/* ── ON HOVER REVEAL OVERLAY: Project Name, Details, Source, Demo ── */}
            <div
              className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-10 lg:p-12 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
              style={{
                backgroundColor: "rgba(5, 26, 36, 0.88)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Row: Category & Badges */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded-full px-3.5 py-1 text-[10px] font-bold tracking-[0.18em] uppercase border ${c.tag}`}
                  >
                    {project.category}
                  </span>
                  {project.metrics && (
                    <span className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[10px] font-semibold text-white/80">
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                      {project.metrics}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] font-medium text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Middle: Project Title, Subtitle, Description & Highlights */}
              <div className="my-auto py-4 space-y-3">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-cyan-300 font-medium">
                  {project.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-normal max-w-2xl line-clamp-3">
                  {project.description}
                </p>

                {/* Highlights preview */}
                {project.highlights && project.highlights.length > 0 && (
                  <ul className="divide-y divide-white/10 pt-2 max-w-xl hidden sm:block">
                    {project.highlights.slice(0, 2).map((h, i) => (
                      <li key={i} className="flex items-center gap-2.5 py-1.5 text-xs text-white/70">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.bullet}`} />
                        <span className="line-clamp-1">{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Bottom: Action buttons (View Details, Source, Demo) */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap pt-4 border-t border-white/15">
                <button
                  suppressHydrationWarning
                  onClick={() => onViewDetails(project)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold border ${c.tag} hover:brightness-125 transition-all shadow-lg shadow-black/40`}
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4.5 py-2.5 text-xs sm:text-sm font-semibold text-white/80 hover:text-white hover:bg-white/20 transition-all"
                >
                  <Github className="w-4 h-4" />
                  Source
                </a>

                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 px-4.5 py-2.5 text-xs sm:text-sm font-semibold text-cyan-300 hover:text-white hover:bg-cyan-500/30 transition-all ml-auto sm:ml-0"
                >
                  Live Demo <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STACK CONTAINER — tracks scroll across all cards to drive the stacking depth
// ─────────────────────────────────────────────────────────────────────────────

function ProjectStackScroll({
  projects,
  onViewDetails,
}: {
  projects: Project[];
  onViewDetails: (p: Project) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative w-full pb-20">
      {projects.map((project, index) => {
        // Calculate progressive scaling for stacked cards
        const targetScale = 1 - (projects.length - 1 - index) * 0.035;
        // Range starts scaling when subsequent cards scroll into view
        const start = projects.length > 1 ? index / projects.length : 0;

        return (
          <ProjectStackCard
            key={project.id}
            project={project}
            index={index}
            totalCards={projects.length}
            progress={scrollYProgress}
            range={[start, 1]}
            targetScale={targetScale}
            onViewDetails={onViewDetails}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS SECTION
// ─────────────────────────────────────────────────────────────────────────────

function ProjectsComponent() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(
    () => PROJECTS.filter((p) => activeCategory === "All" || p.category === activeCategory),
    [activeCategory]
  );

  return (
    // CRITICAL: NO overflow-hidden on section — it kills sticky positioning
    <section id="projects" className="relative py-24 sm:py-32 scroll-mt-20">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/8 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/8 blur-[160px] pointer-events-none rounded-full" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-400 border border-blue-500/20 uppercase">
            Portfolio Showcase
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">
            <ShinyText>Featured Projects</ShinyText>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Handcrafted software engineering solutions combining UI design, performance & AI integrations.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="mb-16 flex justify-center">
          <div className="rounded-2xl border border-white/10 p-1.5 bg-slate-950/80 backdrop-blur-xl flex flex-wrap justify-center gap-2 max-w-full">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  suppressHydrationWarning
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className="relative transition-all duration-300 focus:outline-none"
                >
                  {isActive ? (
                    <div
                      style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}
                      className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-lg whitespace-nowrap"
                    >
                      {category}
                    </div>
                  ) : (
                    <div className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/90 transition-all whitespace-nowrap">
                      {category}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stack card scroll */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {filteredProjects.length > 0 ? (
              <ProjectStackScroll projects={filteredProjects} onViewDetails={setSelectedProject} />
            ) : (
              <div className="text-center py-24 text-white/30 text-sm font-medium">
                No projects in this category yet.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Project detail modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}

export const Projects = memo(ProjectsComponent);
