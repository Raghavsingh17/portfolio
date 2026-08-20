"use client";

import { useEffect, useState, memo } from "react";
import { ArrowUp } from "lucide-react";
import { MagneticButton } from "@/src/components/reactbits/MagneticButton";
import { useCursor } from "@/src/context/CursorContext";
import { AnimatedBorderGlow } from "../reactbits/AnimatedBorderGlow";
import { GlowBorderButton } from "../reactbits/GlowBorderButton";
import { motion } from "framer-motion";

function FooterComponent() {
  const [time, setTime] = useState<string>("");
  const { setCursorMode } = useCursor();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950/80 py-10 pb-20 sm:pb-10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90 light:bg-slate-100 light:border-slate-200">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {/* Row 1: Brand Logo & Live Clock */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <motion.a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onMouseEnter={() => setCursorMode("pointer")}
              onMouseLeave={() => setCursorMode("default")}
              className="group flex items-center justify-center gap-3 text-xl font-bold tracking-tight text-white light:text-slate-900"
            >
              <AnimatedBorderGlow
                glowColor="theme"
                duration={4}
                interactive={true}
                containerClassName="w-9 h-9 rounded-xl p-[1.5px] shrink-0 shadow-lg shadow-blue-500/20"
                className="w-full h-full rounded-[calc(0.75rem-1.5px)] border-0 bg-slate-950 p-0 flex items-center justify-center text-white font-extrabold text-lg leading-none light:bg-white light:text-slate-900"
              >
                <span className="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-extrabold text-lg font-mono">
                  R
                </span>
              </AnimatedBorderGlow>
              <span className="text-lg font-extrabold tracking-tight text-white light:text-slate-900">
                Raghav<span className="text-blue-500">.dev</span>
              </span>
            </motion.a>

            {/* Live IST Time Clock with Pulsing Green Dot */}
            <div className="inline-flex items-center gap-2 text-xs text-slate-400 light:text-slate-600">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Bangalore, India • {time || "12:00 PM"} IST</span>
            </div>
          </div>

          {/* Row 2: Action Button & Copyright */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <MagneticButton>
              <GlowBorderButton
                onClick={scrollToTop}
                glowColor="theme"
                size="sm"
                innerClassName="px-5 py-2 text-xs font-semibold gap-2"
              >
                <span>Back to Top</span>
                <ArrowUp className="h-3.5 w-3.5 text-blue-400 transition-transform group-hover:-translate-y-0.5" />
              </GlowBorderButton>
            </MagneticButton>

            <p className="text-[11px] sm:text-xs text-slate-500 light:text-slate-600 max-w-md px-4 leading-relaxed">
              <span>@ Raghav Singh {new Date().getFullYear()}. All rights reserved.</span>
              <span className="block sm:inline sm:ml-1 mt-0.5 sm:mt-0">Designed & Developed with ❤️ in India.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const Footer = memo(FooterComponent);
