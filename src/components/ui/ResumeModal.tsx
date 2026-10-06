"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Award,
  CheckCircle2,
  Eye,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PERSONAL_INFO, EXPERIENCES, EDUCATION, SOCIAL_LINKS } from "@/src/data/portfolio";
import { GlowBorderButton } from "@/src/components/reactbits/GlowBorderButton";
import { ParticlesBackground } from "@/src/components/backgrounds/ParticlesBackground";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "pdf" | "experience" | "education" | "skills";

function ResumeModalComponent({ isOpen, onClose }: ResumeModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("pdf");
  const [showPdf, setShowPdf] = useState(false);
  const resumeBodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll modal body content to top whenever activeTab changes
  useEffect(() => {
    if (resumeBodyRef.current) {
      resumeBodyRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTab]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab !== "pdf") {
      setShowPdf(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-6 md:p-8 pt-3 sm:pt-16 bg-slate-950/85 backdrop-blur-xl"
        >
          {/* Colorful Particles Background across outer full-screen backdrop */}
          <ParticlesBackground colorful={true} />

          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 flex flex-col w-full max-w-5xl max-h-[90vh] rounded-2xl sm:rounded-3xl border border-white/15 bg-slate-900/95 shadow-2xl overflow-hidden text-white backdrop-blur-2xl"
          >

            {/* Modal Header */}
            <div className="relative z-10 flex items-center justify-between gap-2 sm:gap-4 p-3 sm:p-5 border-b border-white/10 bg-slate-950/80 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="h-9 w-9 sm:h-11 sm:w-11 shrink-0 rounded-xl sm:rounded-2xl border border-white/10 bg-slate-950/90 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-xl font-bold flex items-center gap-1.5 sm:gap-2 truncate">
                    <span className="truncate">{PERSONAL_INFO.name}</span>
                    <span className="hidden sm:inline-block rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-mono text-blue-400 border border-blue-500/30">
                      Curriculum Vitae
                    </span>
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-400 truncate">{PERSONAL_INFO.title} • {PERSONAL_INFO.location}</p>
                </div>
              </div>

              {/* Header Top-Right Action */}
              <div className="flex items-center gap-2 shrink-0">
                <GlowBorderButton
                  as="a"
                  href="/Raghav_Kumar_Resume.pdf"
                  download="Raghav_Kumar_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  glowColor="theme"
                  size="sm"
                  innerClassName="px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold gap-1 sm:gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline sm:inline">Download PDF</span>
                  <span className="xs:hidden sm:hidden">PDF</span>
                </GlowBorderButton>

                <GlowBorderButton
                  onClick={onClose}
                  aria-label="Close resume modal"
                  glowColor="theme"
                  size="sm"
                  className="rounded-full shadow-lg"
                  innerClassName="h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 flex items-center justify-center bg-slate-950/90 text-white hover:scale-110 active:scale-95 transition-all"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </GlowBorderButton>
              </div>
            </div>

            {/* Navigation Section Tabs - Single Row Horizontal Scroll with Left/Right Arrow Navigation */}
            <div className="relative z-10 flex items-start gap-1.5 sm:gap-2 px-3 sm:px-6 pt-2.5 border-b border-white/10 bg-slate-950/50 shrink-0">
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => {
                  const container = document.getElementById("resume-modal-tab-scroll");
                  if (container) container.scrollBy({ left: -160, behavior: "smooth" });
                }}
                className="flex lg:hidden h-[34px] w-[34px] sm:h-[36px] sm:w-[36px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900/90 text-slate-300 hover:text-white hover:border-blue-500/40 transition-colors mt-[1px]"
                aria-label="Scroll resume tabs left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div
                id="resume-modal-tab-scroll"
                className="flex flex-nowrap items-center gap-1.5 sm:gap-2.5 overflow-x-auto max-w-full pb-2.5 styled-category-scrollbar scroll-smooth"
              >
                {[
                  { id: "pdf" as TabType, label: "Resume Document", icon: <FileText className="h-3.5 w-3.5" /> },
                  { id: "experience" as TabType, label: "Work Experience", icon: <Briefcase className="h-3.5 w-3.5" /> },
                  { id: "education" as TabType, label: "Education & Credentials", icon: <GraduationCap className="h-3.5 w-3.5" /> },
                  { id: "skills" as TabType, label: "Tech Stack Matrix", icon: <Sparkles className="h-3.5 w-3.5" /> },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      suppressHydrationWarning
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className="relative group shrink-0 transition-all duration-300 focus:outline-none flex items-center"
                    >
                      {isActive ? (
                        <div
                          style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-white font-bold text-[11px] sm:text-xs shadow-md flex items-center gap-1.5 sm:gap-2 whitespace-nowrap justify-center"
                        >
                          {tab.icon}
                          <span className="whitespace-nowrap">{tab.label}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap justify-center">
                          {tab.icon}
                          <span>{tab.label}</span>
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
                  const container = document.getElementById("resume-modal-tab-scroll");
                  if (container) container.scrollBy({ left: 160, behavior: "smooth" });
                }}
                className="flex lg:hidden h-[34px] w-[34px] sm:h-[36px] sm:w-[36px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900/90 text-slate-300 hover:text-white hover:border-blue-500/40 transition-colors mt-[1px]"
                aria-label="Scroll resume tabs right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div ref={resumeBodyRef} className="relative z-10 flex-1 overflow-y-auto p-3.5 sm:p-5 bg-slate-900/40">
              {/* Tab 1: Resume Document View */}
              {activeTab === "pdf" && (
                showPdf ? (
                  /* Interactive Live PDF View Frame */
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="w-full flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-white/10">
                      <span className="text-xs font-mono text-slate-300">Live Preview — Raghav_Kumar_Resume.pdf</span>
                      <button
                        suppressHydrationWarning
                        onClick={() => setShowPdf(false)}
                        className="flex items-center gap-1.5 rounded-lg bg-blue-600/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition-colors"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to Overview</span>
                      </button>
                    </div>

                    <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl h-[520px]">
                      <iframe
                        src="/Raghav_Kumar_Resume.pdf#toolbar=0"
                        className="w-full h-full border-0"
                        title={`${PERSONAL_INFO.name} Resume PDF`}
                      />
                    </div>
                  </div>
                ) : (
                  /* Minimalist Overview Card with 3 Action Buttons - Zero Scrollbar */
                  <div className="w-full flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 p-5 sm:p-7 text-center">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border border-white/10 bg-slate-950/90 flex items-center justify-center text-cyan-400 mb-3 shadow-xl shadow-cyan-500/20">
                      <FileText className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-400" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                      {PERSONAL_INFO.name} — Resume Document
                    </h3>
                    <p className="max-w-md text-xs sm:text-sm text-slate-400 mb-5 leading-relaxed">
                      View complete career credentials, architecture achievements, and engineering impact in PDF format.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full">
                      {/* Button 1: Download PDF */}
                      <GlowBorderButton
                        as="a"
                        href="/Raghav_Kumar_Resume.pdf"
                        download="Raghav_Kumar_Resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        glowColor="theme"
                        size="md"
                        innerClassName="px-5 py-2.5 text-xs sm:text-sm font-bold gap-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Resume (PDF)</span>
                      </GlowBorderButton>

                      {/* Button 2: Interactive Live PDF View Toggle */}
                      <GlowBorderButton
                        onClick={() => setShowPdf(true)}
                        glowColor="theme"
                        size="md"
                        innerClassName="px-5 py-2.5 text-xs sm:text-sm font-bold gap-2 text-white"
                      >
                        <Eye className="h-4 w-4 text-purple-300" />
                        <span>Live PDF View</span>
                      </GlowBorderButton>

                      {/* Button 3: LinkedIn Profile Link */}
                      <GlowBorderButton
                        as="a"
                        href={SOCIAL_LINKS.linkedin || PERSONAL_INFO.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        glowColor="theme"
                        size="md"
                        innerClassName="px-5 py-2.5 text-xs sm:text-sm font-bold gap-2"
                      >
                        <ExternalLink className="h-4 w-4 text-blue-400" />
                        <span>View LinkedIn Profile</span>
                      </GlowBorderButton>
                    </div>
                  </div>
                )
              )}

              {/* Tab 2: Work Experience */}
              {activeTab === "experience" && (
                <div className="space-y-4 max-w-4xl mx-auto">
                  {/* Work History */}
                  <div className="space-y-4">
                    {EXPERIENCES.map((exp, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:p-5 backdrop-blur-xl"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <h3 className="text-base sm:text-lg font-bold text-white">{exp.role}</h3>
                          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-mono text-blue-400 border border-blue-500/20">
                            {exp.period}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-blue-400 mb-2.5">{exp.company} • {exp.location}</div>
                        <p className="text-xs sm:text-sm text-slate-300 mb-3 leading-relaxed">{exp.summary}</p>

                        <ul className="space-y-1.5 mb-3">
                          {exp.achievements.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                              <span className="text-blue-400 mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-white/10">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] sm:text-xs font-mono text-slate-300 border border-white/5"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Education & Credentials */}
              {activeTab === "education" && (
                <div className="max-w-3xl mx-auto space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:p-5 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-9 w-9 shrink-0 rounded-xl border border-white/10 bg-slate-950/90 flex items-center justify-center text-blue-400">
                        <GraduationCap className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white">{EDUCATION.degree}</h3>
                        <p className="text-xs text-slate-400">{EDUCATION.institution} • {EDUCATION.location}</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {EDUCATION.highlights}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:p-5 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-9 w-9 shrink-0 rounded-xl border border-white/10 bg-slate-950/90 flex items-center justify-center text-purple-400">
                        <Award className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white">Certifications & Specialized Expertise</h3>
                        <p className="text-xs text-slate-400">Verified Industry Credentials</p>
                      </div>
                    </div>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                      <li className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span>AWS Certified Solutions Architect — Associate</span>
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      </li>
                      <li className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span>Meta Front-End Developer Professional Certificate</span>
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Generative AI Engineering & Vector Search Architecture</span>
                        <span className="text-xs font-mono text-blue-400">Advanced</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 4: Tech Stack Matrix */}
              {activeTab === "skills" && (
                <div className="max-w-4xl mx-auto grid gap-3.5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:p-5 backdrop-blur-xl">
                    <h4 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Frontend & UI Architecture
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      React 19, Next.js 16 (App Router, Server Components), TypeScript, Tailwind CSS v4, AG Grid, Framer Motion, Redux Toolkit, Web Vitals Optimization, Glassmorphism, Micro-interactions.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:p-5 backdrop-blur-xl">
                    <h4 className="text-sm font-bold text-indigo-400 mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Backend & API Engineering
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Node.js, Express.js, RESTful APIs, GraphQL, PostgreSQL, MongoDB, Redis Caching, Firebase Auth & Firestore, Serverless Functions.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:p-5 backdrop-blur-xl">
                    <h4 className="text-sm font-bold text-purple-400 mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      DevOps & Tooling
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Docker, Git / GitHub Actions CI/CD, Vercel, AWS S3/CloudFront, Jest, React Testing Library, ESLint, Turbopack.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:p-5 backdrop-blur-xl">
                    <h4 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI & Advanced Concepts
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Gemini API Integration, LangChain, Vector Embeddings, RAG Architectures, Canvas Particle Systems, Custom Micro-interaction Engines.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer */}
            <div className="relative z-10 flex items-center justify-between p-3.5 px-5 sm:px-6 border-t border-white/10 bg-slate-950/90 text-xs text-slate-400 shrink-0">
              <span className="font-mono text-[11px] sm:text-xs">Document: Official PDF Version</span>
              <GlowBorderButton
                onClick={onClose}
                glowColor="theme"
                size="sm"
                innerClassName="px-4 py-1.5 text-xs font-bold gap-1.5"
              >
                <span>Close Preview</span>
              </GlowBorderButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const ResumeModal = memo(ResumeModalComponent);
