"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { GridBackground } from "@/src/components/ui/GridBackground";
import { Navbar } from "@/src/components/sections/Navbar";
import { Hero } from "@/src/components/sections/Hero";
import { About } from "@/src/components/sections/About";
import { Skills } from "@/src/components/sections/Skills";
import { Projects } from "@/src/components/sections/Projects";
import { Experience } from "@/src/components/sections/Experience";
import { Contact } from "@/src/components/sections/Contact";
import { Footer } from "@/src/components/sections/Footer";

const ResumeModal = dynamic(
  () => import("@/src/components/ui/ResumeModal").then((mod) => mod.ResumeModal),
  { ssr: false }
);
const HeroAboutBackground = dynamic(
  () => import("@/src/components/reactbits/HeroAboutBackground").then((mod) => mod.HeroAboutBackground),
  { ssr: false }
);
const AIChatWidget = dynamic(
  () => import("@/src/components/ui/AIChatWidget").then((mod) => mod.AIChatWidget),
  { ssr: false }
);

export default function Home() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  const handleOpenResume = useCallback(() => {
    setIsResumeOpen(true);
  }, []);

  const handleCloseResume = useCallback(() => {
    setIsResumeOpen(false);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Linear Vercel style subtle grid overlay */}
      <GridBackground />

      {/* Global AI Assistant Chatbot */}
      <AIChatWidget onOpenResume={handleOpenResume} />

      {/* Global Resume Modal Viewer & Downloader */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={handleCloseResume}
      />

      {/* Navigation Header */}
      <Navbar onOpenResume={handleOpenResume} />

      {/* Main Sections - Multi-Layered Continuous Background (Lightfall +  Particles) */}
      <div className="relative w-full overflow-hidden">
        <HeroAboutBackground />
        <Hero onOpenResume={handleOpenResume} />
        <About onOpenResume={handleOpenResume} />
      </div>

      <Skills />
      <Projects />
      <Experience />
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}

