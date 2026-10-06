"use client";

import { useState, useEffect, useRef, useMemo, memo, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  ArrowRight,
  Search,
  Grid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SKILLS } from "@/src/data/portfolio";
import { Skill } from "@/src/types/portfolio";
import { ScrollReveal } from "@/src/components/animations/ScrollReveal";
import { ShinyText } from "@/src/components/animations/ShinyText";
import { GlowBorderButton } from "@/src/components/reactbits/GlowBorderButton";
import {
  MODAL_CATEGORIES,
  renderTechIcon,
} from "@/src/utils/skillsHelpers";

const emptySubscribe = () => () => {};

function SkillsComponent() {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState("Languages");
  const [modalSearch, setModalSearch] = useState("");
  const modalGridRef = useRef<HTMLDivElement>(null);

  // Auto-scroll skills grid to top whenever category tab or search query changes
  useEffect(() => {
    if (modalGridRef.current) {
      modalGridRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [modalCategory, modalSearch]);

  // 1. Featured 6 High-Impact Skills on main section grid
  const featuredSkills = useMemo(() => SKILLS.filter((skill) => skill.isFeatured), []);

  // 2. Filter skills for Full-Page Overlay exploration
  const modalFilteredSkills = useMemo(() => {
    return SKILLS.filter((skill) => {
      let matchesCategory = false;

      if (modalCategory === "Languages") {
        matchesCategory = skill.category === "Languages";
      } else if (modalCategory === "Frameworks & Libraries") {
        matchesCategory =
          skill.category === "Frameworks & Libraries" ||
          skill.category === "Framework" ||
          skill.category === "Library" ||
          skill.category === "Styling" ||
          skill.category === "Frontend";
      } else if (modalCategory === "Backend & Database") {
        matchesCategory =
          skill.category === "Backend & Database" ||
          skill.category === "Backend" ||
          skill.category === "Database";
      } else if (modalCategory === "API & Data") {
        matchesCategory =
          skill.category === "API & Data" ||
          skill.category === "API" ||
          skill.category === "Data";
      } else if (modalCategory === "Testing & Animation") {
        matchesCategory =
          skill.category === "Testing & Animation" ||
          skill.category === "Testing" ||
          skill.category === "Animation";
      } else if (modalCategory === "Dev Tools") {
        matchesCategory =
          skill.category === "Dev Tools" ||
          skill.category === "DevOps" ||
          skill.category === "Tools";
      } else {
        matchesCategory = skill.category === modalCategory;
      }

      const query = modalSearch.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        skill.name.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query) ||
        skill.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [modalCategory, modalSearch]);

  // Body Scroll Locking & Keyboard Escape Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <section id="skills" className="relative py-24 sm:py-32 overflow-hidden scroll-mt-20">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="text-center">
          <span className="rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-400 border border-blue-500/20 uppercase">
            Technical Stack
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white light:text-slate-900 sm:text-5xl">
            <ShinyText>Skills & Expertise</ShinyText>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400 light:text-slate-600">
            High-impact single-technology stack expertise for modern web applications.
          </p>
        </ScrollReveal>

        {/* 1. Main Featured Skills Grid (6 High-Impact Single-Tech Cards) */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSkills.map((skill: Skill) => (
            <div key={skill.name} className="h-full">
              <div className="h-full flex flex-col justify-between p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 shadow-xl group hover:-translate-y-1">
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-11 w-11 shrink-0 rounded-xl border border-white/10 bg-slate-950/90 flex items-center justify-center shadow-md">
                      {renderTechIcon(skill.iconName)}
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-400 border border-blue-500/20">
                      <Sparkles className="h-3 w-3 text-blue-400" />
                      {skill.category}
                    </span>
                  </div>

                  {/* Skill Title & Description */}
                  <h3 className="text-xl font-bold text-white light:text-slate-900">
                    {skill.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 light:text-slate-600 leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. "Explore All Skills" Glow Border CTA Button */}
        <div className="mt-14 flex justify-center">
          <GlowBorderButton
            onClick={() => setIsModalOpen(true)}
            glowColor="theme"
            size="md"
            innerClassName="px-8 py-4 text-base sm:text-lg font-bold gap-3"
          >
            <Grid className="h-5 w-5 text-blue-400 transition-transform duration-300 group-hover:rotate-90" />
            <span>Explore All Skills & Technical Stack</span>
            <ArrowRight className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
          </GlowBorderButton>
        </div>
      </div>

      {/* 4. Full-Page Exploration Modal rendered via Portal to sit above all root elements */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[100] flex flex-col w-screen h-screen overflow-hidden bg-slate-950/95 backdrop-blur-2xl text-slate-100"
              >
                {/* Fixed Header Section (Title, Subtitle, Search, Close Button & Category Filter Pills) */}
                <div className="relative z-30 shrink-0 bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                  <div className="max-w-7xl mx-auto">
                    {/* Top Row: Title + Search & Close */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-2xl border border-white/10 bg-slate-900/90 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/20">
                          <Grid className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                              <ShinyText>All Skills & Technical Stack</ShinyText>
                            </h2>
                            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400 border border-blue-500/20">
                              {modalFilteredSkills.length} skills
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                            Comprehensive technology matrix across languages, frontend, backend, APIs & tools.
                          </p>
                        </div>
                      </div>

                      {/* Quick Search Input + Prominent Close Button */}
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-72 shrink-0 rounded-xl border border-white/10 bg-slate-900/90 focus-within:border-blue-500/50 transition-colors">
                          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-20 pointer-events-none" />
                          <input
                            suppressHydrationWarning
                            type="text"
                            placeholder="Search skills..."
                            value={modalSearch}
                            onChange={(e) => setModalSearch(e.target.value)}
                            className="w-full rounded-xl bg-transparent pl-10 pr-9 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 outline-none backdrop-blur-xl transition-all"
                          />
                          {modalSearch && (
                            <button
                              suppressHydrationWarning
                              type="button"
                              onClick={() => setModalSearch("")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        <button
                          suppressHydrationWarning
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          aria-label="Close skills overlay"
                          className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-xl border border-white/15 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg group"
                          title="Close (Esc)"
                        >
                          <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                        </button>
                      </div>
                    </div>

                    {/* Category Filter Pills Bar - Single Row Horizontal Scroll with Left/Right Navigation */}
                    <div className="relative mt-4 flex items-center gap-1.5 sm:gap-2">
                      <button
                        suppressHydrationWarning
                        type="button"
                        onClick={() => {
                          const container = document.getElementById("skills-modal-category-scroll");
                          if (container) container.scrollBy({ left: -160, behavior: "smooth" });
                        }}
                        className="flex lg:hidden h-[34px] w-[34px] sm:h-[36px] sm:w-[36px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900/90 text-slate-300 hover:text-white hover:border-blue-500/40 transition-colors"
                        aria-label="Scroll categories left"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <div
                        id="skills-modal-category-scroll"
                        className="flex flex-nowrap items-center gap-1.5 sm:gap-2.5 overflow-x-auto max-w-full pb-1 styled-category-scrollbar scroll-smooth"
                      >
                        {MODAL_CATEGORIES.map((cat) => {
                          const isActive = modalCategory === cat;
                          return (
                            <button
                              suppressHydrationWarning
                              key={cat}
                              onClick={() => setModalCategory(cat)}
                              className="relative group shrink-0 transition-all duration-300 focus:outline-none flex items-center"
                            >
                              {isActive ? (
                                <div
                                  style={{
                                    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                                  }}
                                  className="rounded-xl px-3.5 sm:px-4 py-1.5 sm:py-2 text-white font-bold text-[11px] sm:text-xs shadow-lg whitespace-nowrap flex items-center justify-center"
                                >
                                  <span className="whitespace-nowrap">{cat}</span>
                                </div>
                              ) : (
                                <div className="rounded-xl px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/90 bg-slate-900/60 border border-white/10 transition-all whitespace-nowrap flex items-center justify-center">
                                  {cat}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        suppressHydrationWarning
                        type="button"
                        onClick={() => {
                          const container = document.getElementById("skills-modal-category-scroll");
                          if (container) container.scrollBy({ left: 160, behavior: "smooth" });
                        }}
                        className="flex lg:hidden h-[34px] w-[34px] sm:h-[36px] sm:w-[36px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900/90 text-slate-300 hover:text-white hover:border-blue-500/40 transition-colors"
                        aria-label="Scroll categories right"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scrollable Skills Cards Grid Body */}
                <div ref={modalGridRef} className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <div className="max-w-7xl mx-auto flex flex-col min-h-full justify-between">
                    <div>
                      {modalFilteredSkills.length === 0 ? (
                        <div className="py-24 text-center text-slate-400 text-base">
                          No matching skills found in <span className="text-white font-semibold">{modalCategory}</span>. Try clearing your search query.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                          {modalFilteredSkills.map((skill: Skill) => (
                            <div
                              key={skill.name}
                              className="h-full flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm hover:border-blue-500/40 hover:bg-slate-900/90 transition-all duration-300 shadow-xl group hover:-translate-y-1 hover:shadow-blue-500/10"
                            >
                              <div>
                                {/* Card Top Row */}
                                <div className="flex items-center justify-between mb-4">
                                  <div className="h-11 w-11 shrink-0 rounded-xl border border-white/10 bg-slate-950/90 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:border-blue-500/30 transition-all">
                                    {renderTechIcon(skill.iconName)}
                                  </div>
                                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-400 border border-blue-500/20">
                                    {skill.category}
                                  </span>
                                </div>

                                {/* Skill Name & Description */}
                                <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                                  {skill.name}
                                </h3>
                                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                  {skill.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Summary Bar */}
                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
                      <GlowBorderButton
                        onClick={() => setIsModalOpen(false)}
                        glowColor="theme"
                        size="sm"
                        innerClassName="px-6 py-2.5 text-xs sm:text-sm font-bold gap-2"
                      >
                        <span>Close Exploration View</span>
                      </GlowBorderButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}

export const Skills = memo(SkillsComponent);
