"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/src/components/layout/Navbar";
import { Hero } from "@/src/components/sections/Hero";
import { About } from "@/src/components/sections/About";
import { Skills } from "@/src/components/sections/Skills";
import { Projects } from "@/src/components/sections/Projects";
import { Experience } from "@/src/components/sections/Experience";
import { Contact } from "@/src/components/sections/Contact";
import { Footer } from "@/src/components/layout/Footer";
import { CosmicProvider } from "@/src/context/CosmicContext";
import { CosmicBackground } from "@/src/components/backgrounds/CosmicBackground";

const ResumeModal = dynamic(
  () => import("@/src/components/ui/ResumeModal").then((mod) => mod.ResumeModal),
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
    <CosmicProvider>
      <main className="relative min-h-screen">
        {/* Persistent 3D Animated Cosmic Background (remains active and fixed across all scrolls) */}
        <CosmicBackground />

        {/* Global AI Assistant Chatbot */}
        <AIChatWidget onOpenResume={handleOpenResume} isResumeOpen={isResumeOpen} />

        {/* Global Resume Modal Viewer & Downloader */}
        <ResumeModal
          isOpen={isResumeOpen}
          onClose={handleCloseResume}
        />

        {/* Fixed Navigation Header */}
        <Navbar onOpenResume={handleOpenResume} />

        {/* Foreground Content Stream: Hero text & buttons scroll smoothly over the 3D Canvas */}
        <div className="relative z-10 w-full">
          <Hero onOpenResume={handleOpenResume} />
          <About onOpenResume={handleOpenResume} />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
          <Footer />
        </div>
      </main>
    </CosmicProvider>
  );
}
