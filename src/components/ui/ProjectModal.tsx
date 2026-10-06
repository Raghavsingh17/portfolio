"use client";

import { memo, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  Layers,
  Zap,
  Cpu,
} from "lucide-react";
import { Github } from "@/src/components/icons/Icons";
import { Project } from "@/src/types/portfolio";
import { GlowBorderButton } from "@/src/components/reactbits/GlowBorderButton";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const emptySubscribe = () => () => {};

function ProjectModalComponent({ project, onClose }: ProjectModalProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top whenever a new project opens
  useEffect(() => {
    if (project) {
      const reset = () => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      };
      reset();
      const raf = requestAnimationFrame(reset);
      const timer = setTimeout(reset, 50);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }
  }, [project]);

  if (!mounted || !project || typeof document === "undefined") return null;

  const content = (
    <AnimatePresence>
      {project && (
        <motion.div
          ref={scrollContainerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          data-lenis-prevent="true"
          className="fixed inset-0 z-[999999] w-screen h-screen overflow-y-auto bg-[#070d14] text-slate-100"
          style={{ overscrollBehavior: "contain" }}
        >
          {/* ── STICKY TOP HEADER BAR: Solves navbar overlap, clearly positioned at root ── */}
          <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 lg:px-12 py-4 bg-[#070d14]/95 backdrop-blur-xl border-b border-white/10">
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 px-4 py-2 text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition-all shadow-md cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
                {project.category}
              </span>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full bg-white/5 hover:bg-white/15 p-2 text-white/70 hover:text-white border border-white/15 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* ── MAIN CONTENT (Clean Full Page Layout — NO CARD NESTING) ── */}
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
            {/* Title & Category Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
                  {project.category}
                </span>
                {project.metrics && (
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-300">
                    <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                    {project.metrics}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {project.title}
              </h1>
              <p className="text-base sm:text-xl text-cyan-300/80 font-medium">
                {project.subtitle}
              </p>
            </div>

            {/* Showcase Image (Clean hero display, NOT boxed inside a card) */}
            <div className="relative w-full h-[280px] sm:h-[440px] lg:h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                priority
                className="object-cover"
              />
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-4 py-2 border-y border-white/10">
              <GlowBorderButton
                as="a"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                glowColor="theme"
                size="sm"
                innerClassName="px-6 py-3 text-xs sm:text-sm font-bold gap-2 cursor-pointer"
              >
                <span>View Live Demo</span>
                <ExternalLink className="h-4 w-4" />
              </GlowBorderButton>

              <GlowBorderButton
                as="a"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                glowColor="theme"
                size="sm"
                innerClassName="px-6 py-3 text-xs sm:text-sm font-bold gap-2 cursor-pointer"
              >
                <Github className="h-4 w-4" />
                <span>Source Code</span>
              </GlowBorderButton>
            </div>

            {/* Overview (Clean typography, NO card) */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Overview & Architecture
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-slate-300 font-normal">
                {project.longDescription || project.description}
              </p>
            </div>

            {/* Key Engineering Highlights (Clean List, NO cards) */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Key Engineering Highlights
                </h2>
                <ul className="space-y-3">
                  {project.highlights.map((highlight: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3.5 text-sm sm:text-base text-slate-200"
                    >
                      <CheckCircle className="h-5 w-5 shrink-0 text-cyan-400 mt-0.5" />
                      <span className="leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Technologies & Frameworks
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Back Button */}
            <div className="pt-8 pb-16 border-t border-white/10">
              <button
                onClick={onClose}
                className="flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Projects</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

export const ProjectModal = memo(ProjectModalComponent);
