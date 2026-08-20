"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeId, ThemePreset } from "@/src/types/theme";
import { THEME_PRESETS } from "@/src/utils/themePresets";

export type { ThemeId, ThemePreset };
export { THEME_PRESETS };

interface ThemeContextType {
  theme: ThemeId;
  currentPreset: ThemePreset;
  setTheme: (themeId: ThemeId) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("dark");

  const applyThemeToDOM = (themeId: ThemeId) => {
    const preset = THEME_PRESETS.find((p) => p.id === themeId) || THEME_PRESETS[0];
    const root = document.documentElement;

    root.setAttribute("data-theme", themeId);
    root.classList.remove("light");

    // Set CSS custom variables
    root.style.setProperty("--background", preset.colors.background);
    root.style.setProperty("--foreground", preset.colors.foreground);
    root.style.setProperty("--card-bg", preset.colors.cardBg);
    root.style.setProperty("--card-border", preset.colors.cardBorder);
    root.style.setProperty("--primary", preset.colors.primary);
    root.style.setProperty("--primary-glow", preset.colors.primaryGlow);
    root.style.setProperty("--accent", preset.colors.accent);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme-id") as ThemeId;
    if (savedTheme && THEME_PRESETS.some((p) => p.id === savedTheme)) {
      setThemeState(savedTheme);
      applyThemeToDOM(savedTheme);
    } else {
      applyThemeToDOM("dark");
    }
  }, []);

  const setTheme = (themeId: ThemeId) => {
    setThemeState(themeId);
    localStorage.setItem("portfolio-theme-id", themeId);
    applyThemeToDOM(themeId);
  };

  const toggleTheme = () => {
    const currentIndex = THEME_PRESETS.findIndex((p) => p.id === theme);
    const nextIndex = (currentIndex + 1) % THEME_PRESETS.length;
    setTheme(THEME_PRESETS[nextIndex].id);
  };

  const currentPreset = THEME_PRESETS.find((p) => p.id === theme) || THEME_PRESETS[0];

  return (
    <ThemeContext.Provider value={{ theme, currentPreset, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
