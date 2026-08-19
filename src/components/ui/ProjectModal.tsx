"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, CheckCircle, Sparkles } from "lucide-react";
import { Github } from "@/src/components/ui/Icons";
import { Project } from "@/src/types/portfolio";
import { GlowBorderButton } from "@/src/components/reactbits/GlowBorderButton";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

function ProjectModalComponent({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-slate-950/95 p-6 sm:p-8 text-slate-100 shadow-2xl backdrop-blur-2xl light:border-slate-300 light:bg-white light:text-slate-900 styled-category-scrollbar"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-slate-900/80 p-2.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors light:bg-slate-100 light:text-slate-600 light:hover:bg-slate-200 z-20"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="mb-6 pr-12">
            <span className="rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400 border border-blue-500/20">
              {project.category}
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white light:text-slate-900">
              {project.title}
            </h2>
            <p className="mt-1 text-sm sm:text-base text-blue-400 font-medium">
              {project.subtitle}
            </p>
          </div>

          {/* Image Banner - Wide & Spacious Banner */}
          <div className="relative mb-6 aspect-video max-h-[380px] w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            {project.metrics && (
              <div className="absolute bottom-4 left-4 rounded-full bg-slate-950/80 px-4 py-1.5 text-xs font-medium text-blue-300 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                {project.metrics}
              </div>
            )}
          </div>

          {/* Detailed description */}
          <div className="mb-6 space-y-4">
            <p className="text-sm sm:text-base leading-relaxed text-slate-300 light:text-slate-700">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Key Features List */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400 light:text-slate-600">
                Key Engineering Highlights
              </h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {project.highlights.map((highlight: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 rounded-xl bg-slate-900/60 p-3 text-xs sm:text-sm text-slate-200 border border-white/5 light:bg-slate-50 light:text-slate-800 light:border-slate-200"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack Tags */}
          <div className="mb-8 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-300 border border-white/5 light:bg-slate-100 light:text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4">
            <GlowBorderButton
              as="a"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              glowColor="cyber"
              size="sm"
              innerClassName="px-6 py-3 text-sm font-semibold gap-2"
            >
              <span>View Live Demo</span>
              <ExternalLink className="h-4 w-4" />
            </GlowBorderButton>

            <GlowBorderButton
              as="a"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              glowColor="rainbow"
              size="sm"
              innerClassName="px-6 py-3 text-sm font-semibold gap-2"
            >
              <Github className="h-4 w-4" />
              <span>Source Code</span>
            </GlowBorderButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export const ProjectModal = memo(ProjectModalComponent);
