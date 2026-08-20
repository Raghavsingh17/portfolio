"use client";

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MousePointer, } from "lucide-react";
import { ThemeToggle } from "@/src/components/ui/ThemeToggle";
import { useCursor } from "@/src/context/CursorContext";
import { GlowBorderButton } from "@/src/components/reactbits/GlowBorderButton";
import { AnimatedBorderGlow } from "@/src/components/reactbits/AnimatedBorderGlow";

import { useTheme } from "@/src/context/ThemeContext";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  onOpenResume?: () => void;
}

function NavbarComponent({ onOpenResume }: NavbarProps) {
  const { currentPreset } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { cursorEnabled, toggleCursor, setCursorMode } = useCursor();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Close the mobile menu drawer immediately
    setMobileMenuOpen(false);

    const targetId = href.replace("#", "");

    // Delay scrolling slightly (120ms) so Framer Motion drawer height collapse
    // does not cancel the browser's smooth scroll engine.
    setTimeout(() => {
      if (targetId === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.hash = href;
      }
    }, 120);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Section intersection detection
      const sections = ["hero", "about", "skills", "projects", "experience", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "border-b border-white/10 bg-slate-950/80 backdrop-blur-xl py-3 shadow-2xl dark:border-white/10 dark:bg-slate-950/80 light:border-slate-200 light:bg-white/80"
          : "bg-transparent py-5"
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Animated 'R' Avatar Badge */}
        <motion.a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          whileHover={{ scale: 1.08, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onMouseEnter={() => setCursorMode("pointer")}
          onMouseLeave={() => setCursorMode("default")}
          className="group flex items-center gap-3 text-xl font-bold tracking-tight text-[var(--text-primary)] cursor-pointer"
        >
          <AnimatedBorderGlow
            glowColor="theme"
            duration={4}
            interactive={true}
            containerClassName="w-10 h-10 rounded-xl p-[1.5px] shrink-0 shadow-lg shadow-blue-500/20"
            className="w-full h-full rounded-[calc(0.75rem-1.5px)] border-0 bg-slate-950 p-0 flex items-center justify-center text-white font-extrabold text-lg leading-none light:bg-white light:text-slate-900"
          >
            <span className="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-extrabold text-xl font-mono">
              R
            </span>
          </AnimatedBorderGlow>
        </motion.a>

        {/* Desktop Navigation Links */}
        <AnimatedBorderGlow
          glowColor="theme"
          containerClassName="hidden md:flex rounded-full p-[1.5px] shadow-xl shadow-blue-500/10"
          className="p-1 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/10 flex items-center gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                onMouseEnter={() => setCursorMode("pointer")}
                onMouseLeave={() => setCursorMode("default")}
                className="relative group transition-all duration-300 focus:outline-none cursor-pointer"
              >
                {isActive ? (
                  <AnimatedBorderGlow
                    glowColor="theme"
                    containerClassName="rounded-full p-[1.5px] shadow-md shadow-cyan-500/20"
                    style={{ background: `linear-gradient(135deg, ${currentPreset.colors.accent}, ${currentPreset.colors.primary})` }}
                    className="px-4 py-1.5 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-lg"
                  >
                    <span>{item.label}</span>
                  </AnimatedBorderGlow>
                ) : (
                  <div className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all">
                    <span>{item.label}</span>
                  </div>
                )}
              </a>
            );
          })}
        </AnimatedBorderGlow>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Custom Cursor Toggle */}
          <button
            suppressHydrationWarning
            onClick={toggleCursor}
            onMouseEnter={() => setCursorMode("pointer")}
            onMouseLeave={() => setCursorMode("default")}
            title={cursorEnabled ? "Disable Custom Cursor" : "Enable Custom Cursor"}
            className={`hidden sm:flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${cursorEnabled
                ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                : "border-white/10 bg-slate-900/60 text-slate-400 light:border-slate-300 light:bg-slate-100 light:text-slate-600"
              }`}
          >
            <MousePointer className="h-3.5 w-3.5" />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Hire Me CTA Button */}
          <GlowBorderButton
            as="a"
            href="#contact"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, "#contact")}
            glowColor="theme"
            className="hidden md:inline-flex"
            innerClassName="px-4 py-2 text-xs font-semibold"
          >
            <span>Hire Me</span>
          </GlowBorderButton>

          {/* Mobile Hamburger Toggle */}
          <button
            suppressHydrationWarning
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-white shadow-lg transition-transform active:scale-95 light:border-slate-300 light:bg-slate-100 light:text-slate-800"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-blue-400" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Clean & Classic Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-b border-white/10 bg-slate-950/95 backdrop-blur-2xl light:bg-white light:border-slate-200"
          >
            <div className="space-y-1.5 px-4 py-5">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="block w-full text-left focus:outline-none cursor-pointer select-none"
                  >
                    {isActive ? (
                      <AnimatedBorderGlow
                        glowColor="theme"
                        containerClassName="rounded-xl p-[1.5px] my-1 pointer-events-none"
                        style={{ background: `linear-gradient(135deg, ${currentPreset.colors.accent}, ${currentPreset.colors.primary})` }}
                        className="w-full px-4 py-3 rounded-[calc(0.75rem-1.5px)] text-white font-bold text-base flex items-center justify-between shadow-md"
                      >
                        <span>{item.label}</span>
                      </AnimatedBorderGlow>
                    ) : (
                      <div className="pointer-events-none block rounded-xl px-4 py-3 text-base font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                        <span>{item.label}</span>
                      </div>
                    )}
                  </a>
                );
              })}

              <div className="pt-4 border-t border-white/10 light:border-slate-200">
                <GlowBorderButton
                  as="a"
                  href="#contact"
                  glowColor="theme"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, "#contact")}
                  className="w-full"
                  innerClassName="w-full py-3.5 justify-center text-sm font-bold"
                >
                  <span>Get In Touch</span>
                </GlowBorderButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export const Navbar = memo(NavbarComponent);
