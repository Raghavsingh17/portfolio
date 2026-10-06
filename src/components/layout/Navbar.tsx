"use client";

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { GlowBorderButton } from "@/src/components/reactbits/GlowBorderButton";

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
  void onOpenResume;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Close the mobile menu drawer immediately
    setMobileMenuOpen(false);

    const targetId = href.replace("#", "");

    // Dispatch global navigation event so listening sections (e.g. About) can re-trigger entrance animations
    window.dispatchEvent(
      new CustomEvent("portfolio-navigate", { detail: { targetId } })
    );

    // Delay scrolling slightly (120ms) so Framer Motion drawer height collapse
    // does not cancel the browser's smooth scroll engine.
    setTimeout(() => {
      if (targetId === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const element = document.getElementById(targetId);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top: y, behavior: "smooth" });
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
        {/* Brand Logo with Animated 'R' Avatar Badge & Dancing Script Brand */}
        <motion.a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl border border-white/15 bg-slate-950/80 backdrop-blur-md flex items-center justify-center text-white font-extrabold text-base leading-none shadow-lg shadow-blue-500/20 light:bg-white light:border-slate-300 light:text-slate-900">
            <span className="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-extrabold text-lg font-mono">
              R
            </span>
          </div>
          <span className="font-dancing text-2xl sm:text-3xl text-white font-bold tracking-wide">
            Raghav
          </span>
        </motion.a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex rounded-full p-1 bg-slate-950/80 backdrop-blur-xl border border-white/10 items-center gap-1 shadow-xl shadow-blue-500/10">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative group transition-all duration-300 focus:outline-none cursor-pointer"
              >
                {isActive ? (
                  <div
                    style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}
                    className="px-4 py-1.5 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-lg"
                  >
                    <span>{item.label}</span>
                  </div>
                ) : (
                  <div className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all">
                    <span>{item.label}</span>
                  </div>
                )}
              </a>
            );
          })}
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hire Me CTA Button */}
          <GlowBorderButton
            as="a"
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
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
                      <div
                        style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}
                        className="w-full px-4 py-3 rounded-xl text-white font-bold text-base flex items-center justify-between shadow-md my-1"
                      >
                        <span>{item.label}</span>
                      </div>
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
                  onClick={(e) => handleNavClick(e, "#contact")}
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
