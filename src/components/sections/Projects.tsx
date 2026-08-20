"use client";

import { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Sparkles, Eye, ArrowUpRight } from "lucide-react";
import { Github } from "@/src/components/ui/Icons";
import { PROJECTS } from "@/src/data/portfolio";
import { Project } from "@/src/types/portfolio";
import { ScrollReveal } from "@/src/components/reactbits/ScrollReveal";
import { SpotlightCard } from "@/src/components/reactbits/SpotlightCard";
import { TiltCard } from "@/src/components/reactbits/TiltCard";
import { ShinyText } from "@/src/components/reactbits/ShinyText";
import { AnimatedBorderGlow } from "@/src/components/reactbits/AnimatedBorderGlow";
import { ProjectModal } from "@/src/components/ui/ProjectModal";
import { useCursor } from "@/src/context/CursorContext";
import { CursorGrid } from "@/src/components/reactbits/CursorGrid";

import { useTheme } from "@/src/context/ThemeContext";

const CATEGORIES = ["All", "Full Stack", "AI & ML", "Web App", "Developer Tools"];

function ProjectsComponent() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { setCursorMode } = useCursor();
  const { currentPreset } = useTheme();

  const filteredProjects = useMemo(
    () =>
      PROJECTS.filter(
        (project) => activeCategory === "All" || project.category === activeCategory
      ),
    [activeCategory]
  );

  return (
    <section id="projects" className="relative py-24 sm:py-32 overflow-hidden scroll-mt-20">
      {/* Interactive Cursor Grid Background */}
      <CursorGrid />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="text-center">
          <span className="rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-400 border border-blue-500/20 uppercase">
            Portfolio Showcase
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white light:text-slate-900 sm:text-5xl">
             <ShinyText>Featured Projects</ShinyText>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400 light:text-slate-600">
            Handcrafted software engineering solutions combining UI design, performance & AI integrations.
          </p>
        </ScrollReveal>

        {/* Category Tabs */}
        <div className="mt-12 flex justify-center">
          <AnimatedBorderGlow
            glowColor="theme"
            containerClassName="rounded-2xl p-[1.5px] max-w-full"
            className="p-1.5 rounded-[calc(1rem-1.5px)] bg-slate-950/80 backdrop-blur-xl flex flex-wrap justify-center gap-2"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  suppressHydrationWarning
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className="relative group transition-all duration-300 focus:outline-none"
                >
                  {isActive ? (
                    <AnimatedBorderGlow
                      glowColor="theme"
                      containerClassName="rounded-xl p-[1.5px]"
                      style={{ background: `linear-gradient(135deg, ${currentPreset.colors.accent}, ${currentPreset.colors.primary})` }}
                      className="px-4 py-2 rounded-[calc(0.75rem-1.5px)] text-white font-bold text-xs shadow-lg"
                    >
                      <span className="whitespace-nowrap">{category}</span>
                    </AnimatedBorderGlow>
                  ) : (
                    <div className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/90 transition-all whitespace-nowrap">
                      {category}
                    </div>
                  )}
                </button>
              );
            })}
          </AnimatedBorderGlow>
        </div>

        {/* Projects Grid */}
        <motion.div layout className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredProjects.map((project: Project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <AnimatedBorderGlow glowColor="theme" containerClassName="h-full">
                  <TiltCard className="h-full border-0">
                    <SpotlightCard className="h-full flex flex-col justify-between p-0 overflow-hidden border-0">
                      {/* Project Image Banner */}
                      <div
                        onClick={() => setSelectedProject(project)}
                        onMouseEnter={() => setCursorMode("text", "VIEW")}
                        onMouseLeave={() => setCursorMode("default")}
                        className="group/img relative aspect-video w-full cursor-pointer overflow-hidden bg-slate-950"
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover/img:opacity-100 flex items-center justify-center">
                          <span className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg">
                            <Eye className="h-4 w-4" />
                            <span>View Details</span>
                          </span>
                        </div>

                        {project.metrics && (
                          <div className="absolute top-3 left-3 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] font-semibold text-blue-300 backdrop-blur-md border border-white/10 flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-blue-400" />
                            <span>{project.metrics}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                              {project.category}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-white light:text-slate-900 group-hover:text-blue-400 transition-colors">
                            {project.title}
                          </h3>
                          <p className="mt-2 text-xs sm:text-sm text-slate-400 light:text-slate-600 line-clamp-3 leading-relaxed">
                            {project.description}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 light:border-slate-200">
                          {/* Tech Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 light:bg-slate-100 light:text-slate-600"
                              >
                                {tag}
                              </span>
                            ))}
                            {project.tags.length > 4 && (
                              <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                                +{project.tags.length - 4}
                              </span>
                            )}
                          </div>

                          {/* Action Links */}
                          <div className="flex items-center justify-between">
                            <button
                              suppressHydrationWarning
                              onClick={() => setSelectedProject(project)}
                              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                              <span>Quick Details</span>
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>

                            <div className="flex items-center gap-3">
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-white transition-colors"
                                title="Source Code"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-white transition-colors"
                                title="Live Demo"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </TiltCard>
                </AnimatedBorderGlow>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Detailed Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}

export const Projects = memo(ProjectsComponent);
