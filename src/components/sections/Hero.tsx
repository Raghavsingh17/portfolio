"use client";

import { memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, VolumeX } from "lucide-react";
import { PERSONAL_INFO } from "@/src/data/portfolio";
import { useCosmic } from "@/src/context/CosmicContext";
interface HeroProps {
  onOpenResume?: () => void;
}

function HeroComponent({ onOpenResume }: HeroProps) {
  void onOpenResume;
  const { isMuted, toggleSound } = useCosmic();

  // Scroll parallax for luxury creative agency feel
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 500], [0, -60]);
  const contentOpacity = useTransform(scrollY, [0, 420], [1, 0.05]);
  const indicatorsOpacity = useTransform(scrollY, [0, 220], [1, 0]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden bg-transparent pointer-events-auto"
    >
      {/* Center Content: Typographic Hero Stack */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8 -mt-[60px] md:-mt-[100px]"
      >
        {/* Raghav Singh Heading in Instrument Serif with text-glow */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-instrument text-white text-[42px] sm:text-7xl md:text-8xl lg:text-[104px] leading-[0.92] tracking-tight text-center text-glow select-none">
            {PERSONAL_INFO.name}
            <span className="block mt-2 sm:mt-3 text-2xl sm:text-4xl md:text-5xl font-light italic text-white/90 tracking-normal">
              {PERSONAL_INFO.title}
            </span>
          </h1>
        </motion.div>

        {/* Subtext: Raghav's Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/75 text-xs sm:text-sm md:text-base text-center mt-5 sm:mt-7 max-w-xl font-inter leading-relaxed select-none mx-auto"
        >
          {PERSONAL_INFO.tagline}
        </motion.p>

        {/* CTA Buttons: White Glow Pill + Liquid Glass Pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto"
        >
          {/* Primary CTA (White Glow Pill) */}
          <button
            suppressHydrationWarning
            onClick={() => handleScrollTo("projects")}
            className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-full font-medium text-xs sm:text-sm tracking-wide hover:bg-white/90 active:scale-95 transition-all duration-300 button-glow flex items-center justify-center gap-2 cursor-pointer select-none shadow-xl"
          >
            <span>Explore Featured Work</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary CTA (Liquid Glass Pill) */}
          <button
            suppressHydrationWarning
            onClick={() => handleScrollTo("contact")}
            className="w-full sm:w-auto liquid-glass text-white px-8 py-3.5 rounded-full font-medium text-xs sm:text-sm tracking-wide hover:bg-white/10 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            <Sparkles className="h-4 w-4 text-white/80" />
            <span>Let&apos;s Talk</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Sound Indicator (bottom-8 left-8) */}
      <motion.button
        type="button"
        style={{ opacity: indicatorsOpacity }}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        onClick={toggleSound}
        className="absolute bottom-8 left-6 md:left-8 z-20 flex items-center gap-3 cursor-pointer group select-none bg-transparent border-0 p-0 text-left focus:outline-none"
        title={isMuted ? "Experience with sound" : "Sound active"}
        aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
      >
        <div className={`h-10 w-10 rounded-full border transition-all duration-300 flex items-center justify-center liquid-glass ${
          isMuted ? "border-white/20 group-hover:border-white/40" : "border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
        }`}>
          {isMuted ? (
            <VolumeX className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
          ) : (
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-3 bg-cyan-300 rounded-full animate-pulse" />
              <span className="w-1 h-4 bg-white rounded-full animate-pulse delay-75" />
              <span className="w-1 h-2.5 bg-cyan-300 rounded-full animate-pulse delay-150" />
            </div>
          )}
        </div>
        <div className="text-left text-xs leading-tight hidden xs:block sm:block">
          <span className="block text-white/80 font-medium">Experience</span>
          <span className={`block text-[11px] transition-colors ${
            isMuted ? "text-white/45" : "text-cyan-300 font-medium"
          }`}>
            {isMuted ? "with sound" : "sound active"}
          </span>
        </div>
      </motion.button>

      {/* Minimalist Scroll Indicator (Bottom-Center) */}
      <motion.div
        style={{ opacity: indicatorsOpacity }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        onClick={() => handleScrollTo("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center cursor-pointer group select-none"
        title="Scroll down to About section"
      >
        <div className="relative h-9 w-5 rounded-full border-2 border-white/30 group-hover:border-white/70 p-1 flex justify-center transition-colors">
          <motion.div
            animate={{
              y: [0, 10, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-2 w-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          />
        </div>
      </motion.div>
    </section>
  );
}

export const Hero = memo(HeroComponent);
