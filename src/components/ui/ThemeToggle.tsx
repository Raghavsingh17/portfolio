"use client";

import { useState, useRef, useEffect } from "react";
import { Palette, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, THEME_PRESETS, ThemeId } from "@/src/context/ThemeContext";
import { useCursor } from "@/src/context/CursorContext";

export function ThemeToggle() {
  const { theme, currentPreset, setTheme } = useTheme();
  const { setCursorMode } = useCursor();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        suppressHydrationWarning
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setCursorMode("pointer")}
        onMouseLeave={() => setCursorMode("default")}
        aria-label="Select VS Code Theme"
        title="Theme Switcher"
        className="group relative flex h-10 items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3.5 text-xs font-semibold text-slate-200 backdrop-blur-md transition-all hover:border-blue-500/40 hover:bg-slate-900 dark:border-white/10 dark:bg-slate-900/80 light:border-slate-300 light:bg-slate-100 light:text-slate-800"
      >
        <Palette className="h-4 w-4 text-blue-400 transition-transform group-hover:rotate-12" />
        <span className="hidden sm:inline-block tracking-wide">{currentPreset.name}</span>
        
        {/* Color Badge Indicator */}
        <span className="flex items-center gap-1">
          {currentPreset.badgeDots.map((color, idx) => (
            <span
              key={idx}
              className="h-2.5 w-2.5 rounded-full border border-white/20"
              style={{ backgroundColor: color }}
            />
          ))}
        </span>
      </button>

      {/* VS Code Theme Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border border-white/10 bg-slate-950/90 p-2 shadow-2xl backdrop-blur-2xl z-50 dark:border-white/15 dark:bg-slate-950/95 light:border-slate-200 light:bg-white"
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 light:border-slate-100 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 light:text-slate-500">
              Explore Color Themes
              </span>
            </div>

            <div className="space-y-1">
              {THEME_PRESETS.map((preset) => {
                const isSelected = theme === preset.id;
                return (
                  <button
                    suppressHydrationWarning
                    key={preset.id}
                    onClick={() => {
                      setTheme(preset.id as ThemeId);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setCursorMode("pointer")}
                    onMouseLeave={() => setCursorMode("default")}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-all ${
                      isSelected
                        ? "bg-blue-600/20 text-white font-bold border border-blue-500/30 light:bg-blue-50 light:text-blue-600"
                        : "text-slate-300 hover:bg-white/5 hover:text-white light:text-slate-700 light:hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20 p-0.5"
                        style={{ backgroundColor: preset.badgeBg }}
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: preset.badgeDots[0] }}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-[10px] text-slate-400 light:text-slate-500">
                          {preset.description}
                        </div>
                      </div>
                    </div>

                    {isSelected && <Check className="h-4 w-4 text-blue-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
