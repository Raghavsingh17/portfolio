"use client";

import { useState, useEffect, useRef, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Code2,
  Palette,
  Server,
  Database,
  Zap,
  Brain,
  Cpu,
  Box,
  Cloud,
  Gauge,
  Layers,
  X,
  ArrowRight,
  Search,
  Grid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SKILLS } from "@/src/data/portfolio";
import { Skill } from "@/src/types/portfolio";
import { ScrollReveal } from "@/src/components/reactbits/ScrollReveal";
import { AnimatedBorderCard } from "@/src/components/reactbits/AnimatedBorderCard";
import { ShinyText } from "@/src/components/reactbits/ShinyText";
import {
  ReactLogo,
  ReactBitsLogo,
  NextjsLogo,
  TypeScriptLogo,
  JavaScriptLogo,
  TailwindLogo,
  NodejsLogo,
  ExpressjsLogo,
  AGGridLogo,
  GraphQLLogo,
  ApolloClientLogo,
  Html5Logo,
  Css3Logo,
  Html5Css3Logo,
  RestApiLogo,
  SassLogo,
  FigmaLogo,
  ReduxLogo,
  StorybookLogo,
  MUILogo,
  FramerMotionLogo,
  MongoDBLogo,
  SQLiteLogo,
  PostmanLogo,
  InsomniaLogo,
  JestLogo,
  VitestLogo,
  ReactTestingLibraryLogo,
  GitLogo,
  GitHubLogo,
  JiraLogo,
} from "@/src/components/ui/TechIcons";

import { CursorGrid } from "@/src/components/reactbits/CursorGrid";
import { LightfallBackground } from "@/src/components/reactbits/LightfallBackground";
import { GlowBorderButton } from "@/src/components/reactbits/GlowBorderButton";
import { AnimatedBorderGlow } from "@/src/components/reactbits/AnimatedBorderGlow";

// Modal Categories for Full-Page Exploration
const MODAL_CATEGORIES = [
  "Languages",
  "Frameworks & Libraries",
  "Backend & Database",
  "API & Data",
  "Testing & Animation",
  "Dev Tools",
];

// Helper to get colorful animated border glow presets for skill icons
function getSkillIconGlow(category: string, idx: number) {
  if (category.includes("Backend") || category.includes("Database")) return "emerald";
  if (category.includes("Framework") || category.includes("Frontend") || category.includes("Library") || category.includes("Styling")) {
    return idx % 2 === 0 ? "cyan-blue" : "purple";
  }
  if (category.includes("Languages")) return idx % 2 === 0 ? "sunset" : "gold";
  if (category.includes("API") || category.includes("Data")) return "rainbow";
  if (category.includes("Testing") || category.includes("Animation")) return "cyber";
  return idx % 2 === 0 ? "indigo" : "rainbow";
}

// Helper to render official brand SVGs or fallback icons
function renderTechIcon(iconName: string) {
  switch (iconName) {
    case "ReactLogo":
      return <ReactLogo className="h-6 w-6" />;
    case "ReactBitsLogo":
      return <ReactBitsLogo className="h-6 w-6" />;
    case "NextjsLogo":
      return <NextjsLogo className="h-6 w-6 text-white light:text-slate-900" />;
    case "TypeScriptLogo":
      return <TypeScriptLogo className="h-7 w-7 text-blue-400" />;
    case "JavaScriptLogo":
      return <JavaScriptLogo className="h-7 w-7" />;
    case "TailwindLogo":
      return <TailwindLogo className="h-6 w-6" />;
    case "NodejsLogo":
      return <NodejsLogo className="h-6 w-6" />;
    case "ExpressjsLogo":
      return <ExpressjsLogo className="h-6 w-6 text-slate-200" />;
    case "AGGridLogo":
      return <AGGridLogo className="h-6 w-6" />;
    case "GraphQLLogo":
      return <GraphQLLogo className="h-6 w-6" />;
    case "ApolloClientLogo":
      return <ApolloClientLogo className="h-6 w-6" />;
    case "Html5Logo":
      return <Html5Logo className="h-7 w-7" />;
    case "Css3Logo":
      return <Css3Logo className="h-7 w-7" />;
    case "Html5Css3Logo":
      return <Html5Css3Logo className="h-7 w-7" />;
    case "RestApiLogo":
      return <RestApiLogo className="h-6 w-6" />;
    case "SassLogo":
      return <SassLogo className="h-6 w-6" />;
    case "FigmaLogo":
      return <FigmaLogo className="h-6 w-6" />;
    case "ReduxLogo":
      return <ReduxLogo className="h-6 w-6" />;
    case "StorybookLogo":
      return <StorybookLogo className="h-6 w-6" />;
    case "MUILogo":
      return <MUILogo className="h-6 w-6" />;
    case "FramerMotionLogo":
      return <FramerMotionLogo className="h-6 w-6" />;
    case "MongoDBLogo":
      return <MongoDBLogo className="h-6 w-6" />;
    case "SQLiteLogo":
      return <SQLiteLogo className="h-6 w-6" />;
    case "PostmanLogo":
      return <PostmanLogo className="h-6 w-6" />;
    case "InsomniaLogo":
      return <InsomniaLogo className="h-6 w-6" />;
    case "JestLogo":
      return <JestLogo className="h-6 w-6" />;
    case "VitestLogo":
      return <VitestLogo className="h-6 w-6" />;
    case "ReactTestingLibraryLogo":
      return <ReactTestingLibraryLogo className="h-6 w-6" />;
    case "GitLogo":
      return <GitLogo className="h-6 w-6" />;
    case "GitHubLogo":
      return <GitHubLogo className="h-6 w-6 text-white light:text-slate-900" />;
    case "JiraLogo":
      return <JiraLogo className="h-6 w-6" />;
    case "Brain":
      return <Brain className="h-6 w-6 text-purple-400" />;
    case "Cpu":
      return <Cpu className="h-6 w-6 text-indigo-400" />;
    case "Database":
      return <Database className="h-6 w-6 text-emerald-400" />;
    case "Sparkles":
      return <Sparkles className="h-6 w-6 text-amber-400" />;
    case "Code2":
      return <Code2 className="h-6 w-6 text-blue-400" />;
    case "Palette":
      return <Palette className="h-6 w-6 text-pink-400" />;
    case "Layers":
      return <Layers className="h-6 w-6 text-cyan-400" />;
    case "Server":
      return <Server className="h-6 w-6 text-emerald-400" />;
    case "Zap":
      return <Zap className="h-6 w-6 text-amber-400" />;
    case "Box":
      return <Box className="h-6 w-6 text-blue-400" />;
    case "Cloud":
      return <Cloud className="h-6 w-6 text-sky-400" />;
    case "Gauge":
      return <Gauge className="h-6 w-6 text-rose-400" />;
    default:
      return <Code2 className="h-6 w-6 text-blue-400" />;
  }
}

function SkillsComponent() {
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
    <section id="skills" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Interactive Cursor Grid Background */}
      <CursorGrid />

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
          {featuredSkills.map((skill: Skill, idx: number) => (
            <div key={skill.name} className="h-full">
              <AnimatedBorderCard className="h-full flex flex-col justify-between p-6">
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <AnimatedBorderGlow
                      glowColor={getSkillIconGlow(skill.category, idx)}
                      containerClassName="h-11 w-11 shrink-0 rounded-xl p-[1.5px] shadow-md"
                      className="p-0 h-full w-full rounded-[calc(0.75rem-1.5px)] bg-slate-950/90 flex items-center justify-center"
                    >
                      {renderTechIcon(skill.iconName)}
                    </AnimatedBorderGlow>
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

              </AnimatedBorderCard>
            </div>
          ))}
        </div>

        {/* 2. "Explore All Skills" Glow Border CTA Button */}
        <div className="mt-14 flex justify-center">
          <GlowBorderButton
            onClick={() => setIsModalOpen(true)}
            glowColor="cyber"
            size="md"
            innerClassName="px-8 py-4 text-base sm:text-lg font-bold gap-3"
          >
            <Grid className="h-5 w-5 text-blue-400 transition-transform duration-300 group-hover:rotate-90" />
            <span>Explore All Skills & Technical Stack</span>
            <ArrowRight className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
          </GlowBorderButton>
        </div>
      </div>

      {/* 4. Full-Page, Non-Restricted Canvas Overlay without internal box scrollbars */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999] flex flex-col w-screen h-screen overflow-hidden bg-slate-950/95 backdrop-blur-2xl text-slate-100"
          >
            {/* Multi-color Lightfall Beams Background inside All Skills Modal - Fixed Canvas */}
            <LightfallBackground count={65} speed={1.5} />

            {/* Prominent Floating Close Button at Top Right with Border Glow */}
            <GlowBorderButton
              onClick={() => setIsModalOpen(false)}
              aria-label="Close skills overlay"
              glowColor="rainbow"
              size="sm"
              className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[1000] rounded-full shadow-2xl"
              innerClassName="h-10 w-10 sm:h-12 sm:w-12 rounded-full p-0 flex items-center justify-center bg-slate-950/90 text-white hover:scale-110 active:scale-95 transition-all"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </GlowBorderButton>

            {/* Fixed Header Section (Title, Subtitle, Search & Category Filter Pills) */}
            <div className="relative z-30 shrink-0 bg-slate-950/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 pt-4 pb-4 sm:pt-6 sm:pb-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6 pr-14 md:pr-0">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <AnimatedBorderGlow
                      glowColor="cyan-blue"
                      containerClassName="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-xl sm:rounded-2xl p-[1.5px] shadow-lg shadow-blue-500/20"
                      className="p-0 h-full w-full rounded-[calc(0.75rem-1.5px)] sm:rounded-[calc(1rem-1.5px)] bg-slate-950/90 flex items-center justify-center text-blue-400"
                    >
                      <Grid className="h-5 w-5 sm:h-6 sm:w-6" />
                    </AnimatedBorderGlow>
                    <div>
                      <h2 className="text-xl sm:text-3xl font-extrabold text-white">
                        <ShinyText>All Skills & Technical Stack</ShinyText>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1">
                        Comprehensive technology matrix across languages, frontend, backend, APIs & tools.
                      </p>
                    </div>
                  </div>

                  {/* Quick Search Input with Animated Border Glow */}
                  <AnimatedBorderGlow
                    glowColor="cyber"
                    containerClassName="w-full md:w-72 shrink-0 rounded-2xl p-[1.5px]"
                    className="p-0 rounded-[calc(1rem-1.5px)] bg-slate-950/90"
                  >
                    <div className="relative w-full">
                      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-20" />
                      <input
                        suppressHydrationWarning
                        type="text"
                        placeholder="Search skills..."
                        value={modalSearch}
                        onChange={(e) => setModalSearch(e.target.value)}
                        className="w-full rounded-2xl bg-slate-950/90 pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 outline-none backdrop-blur-xl transition-all focus:bg-slate-900"
                      />
                    </div>
                  </AnimatedBorderGlow>
                </div>

                {/* Category Filter Pills Bar - Single Row Horizontal Scroll with Left/Right Navigation */}
                <div className="relative mt-3 sm:mt-5 flex items-start gap-1.5 sm:gap-2">
                  <button
                    suppressHydrationWarning
                    type="button"
                    onClick={() => {
                      const container = document.getElementById("skills-modal-category-scroll");
                      if (container) container.scrollBy({ left: -160, behavior: "smooth" });
                    }}
                    className="flex lg:hidden h-[34px] w-[34px] sm:h-[36px] sm:w-[36px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900/90 text-slate-300 hover:text-white hover:border-blue-500/40 transition-colors mt-[1px]"
                    aria-label="Scroll categories left"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div
                    id="skills-modal-category-scroll"
                    className="flex flex-nowrap items-center gap-1.5 sm:gap-2.5 overflow-x-auto max-w-full pb-2.5 styled-category-scrollbar scroll-smooth"
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
                            <AnimatedBorderGlow
                              glowColor="cyber"
                              containerClassName="rounded-xl p-[1.5px]"
                              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[calc(0.75rem-1.5px)] bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white font-bold text-[11px] sm:text-xs shadow-lg shadow-blue-500/30 whitespace-nowrap flex items-center justify-center"
                            >
                              <span className="whitespace-nowrap">{cat}</span>
                            </AnimatedBorderGlow>
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
                    className="flex lg:hidden h-[34px] w-[34px] sm:h-[36px] sm:w-[36px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900/90 text-slate-300 hover:text-white hover:border-blue-500/40 transition-colors mt-[1px]"
                    aria-label="Scroll categories right"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Skills Cards Grid Body - ONLY THIS CONTAINER SCROLLS */}
            <div ref={modalGridRef} className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="max-w-7xl mx-auto flex flex-col min-h-full justify-between">
                <div>
                  {modalFilteredSkills.length === 0 ? (
                    <div className="py-24 text-center text-slate-400 text-base">
                      No matching skills found in <span className="text-white font-semibold">{modalCategory}</span>. Try clearing your search query.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {modalFilteredSkills.map((skill: Skill, idx: number) => (
                        <AnimatedBorderCard
                          key={skill.name}
                          glowColor={
                            skill.category === "Database" || skill.category === "Backend" || skill.category === "Backend & Database"
                              ? "emerald"
                              : skill.category === "Frameworks & Libraries" || skill.category === "Frontend" || skill.category === "Framework"
                                ? "cyan-blue"
                                : skill.category === "Dev Tools" || skill.category === "DevOps"
                                  ? "indigo"
                                  : "theme"
                          }
                          containerClassName="h-full"
                          className="h-full flex flex-col justify-between p-5 sm:p-6"
                        >
                          <div>
                            {/* Card Top Row */}
                            <div className="flex items-center justify-between mb-4">
                              <AnimatedBorderGlow
                                glowColor={getSkillIconGlow(skill.category, idx)}
                                containerClassName="h-11 w-11 shrink-0 rounded-xl p-[1.5px] shadow-md"
                                className="p-0 h-full w-full rounded-[calc(0.75rem-1.5px)] bg-slate-950/90 flex items-center justify-center"
                              >
                                {renderTechIcon(skill.iconName)}
                              </AnimatedBorderGlow>
                              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-400 border border-blue-500/20">
                                {skill.category}
                              </span>
                            </div>

                            {/* Skill Name & Description */}
                            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                              {skill.name}
                            </h3>
                            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                              {skill.description}
                            </p>
                          </div>
                        </AnimatedBorderCard>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Summary Bar */}
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
                  <GlowBorderButton
                    onClick={() => setIsModalOpen(false)}
                    glowColor="sunset"
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
      </AnimatePresence>
    </section>
  );
}

export const Skills = memo(SkillsComponent);
