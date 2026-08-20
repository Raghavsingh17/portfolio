"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, } from "lucide-react";
import { PERSONAL_INFO } from "@/src/data/portfolio";
import { GlowBorderButton } from "@/src/components/reactbits/GlowBorderButton";
import { DecryptText } from "@/src/components/reactbits/DecryptText";
import { ShinyText } from "@/src/components/reactbits/ShinyText";
import { BlurText } from "@/src/components/reactbits/BlurText";
import { MagneticButton } from "@/src/components/reactbits/MagneticButton";
import { InfiniteMarquee } from "@/src/components/reactbits/InfiniteMarquee";
import {
  ReactLogo,
  NextjsLogo,
  TypeScriptLogo,
  JavaScriptLogo,
  TailwindLogo,
  NodejsLogo,
  ExpressjsLogo,
  GraphQLLogo,
  ReactBitsLogo,
} from "@/src/components/ui/TechIcons";

// Tech Stack Marquee items for Hero section
const MARQUEE_SKILLS = [
  { name: "React 19", icon: <ReactLogo className="h-4 w-4" /> },
  { name: "Next.js 15", icon: <NextjsLogo className="h-4 w-4 text-white light:text-slate-900" /> },
  { name: "TypeScript", icon: <TypeScriptLogo className="h-4 w-4" /> },
  { name: "JavaScript", icon: <JavaScriptLogo className="h-4 w-4" /> },
  { name: "Tailwind CSS", icon: <TailwindLogo className="h-4 w-4" /> },
  { name: "Node.js", icon: <NodejsLogo className="h-4 w-4" /> },
  { name: "Express.js", icon: <ExpressjsLogo className="h-4 w-4" /> },
  { name: "GraphQL", icon: <GraphQLLogo className="h-4 w-4" /> },
  { name: "React Bits", icon: <ReactBitsLogo className="h-4 w-4" /> },
];

interface HeroProps {
  onOpenResume?: () => void;
}

function HeroComponent({ onOpenResume }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 scroll-mt-20"
    >
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 sm:mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-blue-300 light:text-blue-600 truncate">
            <DecryptText text="Available for new frontend & full stack roles" speed={30} />
          </span>
        </motion.div>

        {/* Main Headline - Responsive Mobile & Desktop Fitting with Crisp Text Shadow */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-white light:text-slate-900 leading-tight sm:leading-none break-words drop-shadow-2xl">
          <ShinyText>Raghav Singh <br />  Frontend Developer</ShinyText>
        </h1>

        {/* Subtitle / Bio */}
        <div className="mt-4 sm:mt-6">
          <BlurText
            text={PERSONAL_INFO.tagline}
            className="mx-auto max-w-3xl justify-center text-sm sm:text-lg md:text-xl text-slate-400 light:text-slate-600 leading-relaxed"
          />
        </div>

        {/* Action Buttons wrapped in MagneticButton */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full">
          <MagneticButton className="w-full sm:w-auto">
            <GlowBorderButton
              as="a"
              href="#projects"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              glowColor="theme"
              size="md"
              magnetic={false}
              className="w-full sm:w-auto"
              innerClassName="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-xs sm:text-sm lg:text-lg font-bold gap-2.5 sm:gap-3"
            >
              <span>Explore Featured Work</span>
              <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 transition-transform group-hover:translate-x-1" />
            </GlowBorderButton>
          </MagneticButton>

          <MagneticButton className="w-full sm:w-auto">
            <GlowBorderButton
              as="a"
              href="#contact"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              glowColor="theme"
              size="md"
              magnetic={false}
              className="w-full sm:w-auto"
              innerClassName="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-xs sm:text-sm lg:text-lg font-bold gap-2.5 sm:gap-3"
            >
              <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 text-blue-400" />
              <span>Let's Talk</span>
            </GlowBorderButton>
          </MagneticButton>
        </div>

        {/* Tech Stack Marquee Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 sm:mt-16 w-full max-w-full overflow-hidden"
        >
          <div className="text-center mb-3">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-400 light:text-slate-500">
              Core Tech Stack & Ecosystem
            </span>
          </div>
          <InfiniteMarquee items={MARQUEE_SKILLS} speed="medium" pauseOnHover={true} />
        </motion.div>
      </div>
    </section>
  );
}

export const Hero = memo(HeroComponent);
