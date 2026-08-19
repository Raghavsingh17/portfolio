"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeId = "dark" | "tokyo-night" | "cyberpunk" | "dracula";

export interface ThemePreset {
  id: ThemeId;
  name: string;
  description: string;
  badgeBg: string;
  badgeDots: [string, string];
  colors: {
    background: string;
    foreground: string;
    cardBg: string;
    cardBorder: string;
    primary: string;
    primaryGlow: string;
    accent: string;
    conicGradient: string;
    beamHue: number;
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "dark",
    name: "Modern Dark",
    description: "Deep Slate & Cyan/Indigo Glow",
    badgeBg: "#0f172a",
    badgeDots: ["#06b6d4", "#3b82f6"],
    colors: {
      background: "#090a0f",
      foreground: "#f8fafc",
      cardBg: "rgba(15, 23, 42, 0.7)",
      cardBorder: "rgba(255, 255, 255, 0.1)",
      primary: "#3b82f6",
      primaryGlow: "rgba(59, 130, 246, 0.35)",
      accent: "#06b6d4",
      conicGradient: "conic-gradient(from 0deg, transparent 0%, transparent 75%, #06b6d4 90%, #3b82f6 100%)",
      beamHue: 215,
    },
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    description: "Deep Purple-Navy & Soft Pink Accent",
    badgeBg: "#1a1b26",
    badgeDots: ["#f7768e", "#bb9af7"],
    colors: {
      background: "#1a1b26",
      foreground: "#c0caf5",
      cardBg: "rgba(36, 40, 59, 0.75)",
      cardBorder: "rgba(187, 154, 247, 0.15)",
      primary: "#bb9af7",
      primaryGlow: "rgba(187, 154, 247, 0.35)",
      accent: "#f7768e",
      conicGradient: "conic-gradient(from 0deg, transparent 0%, transparent 75%, #f7768e 90%, #bb9af7 100%)",
      beamHue: 270,
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk Synth",
    description: "Pitch Black & Neon Cyan/Pink",
    badgeBg: "#0d0e15",
    badgeDots: ["#ff007f", "#00f0ff"],
    colors: {
      background: "#0d0e15",
      foreground: "#f3f4f6",
      cardBg: "rgba(22, 24, 38, 0.85)",
      cardBorder: "rgba(0, 240, 255, 0.2)",
      primary: "#00f0ff",
      primaryGlow: "rgba(0, 240, 255, 0.4)",
      accent: "#ff007f",
      conicGradient: "conic-gradient(from 0deg, transparent 0%, transparent 75%, #ff007f 90%, #00f0ff 100%)",
      beamHue: 190,
    },
  },
  {
    id: "dracula",
    name: "Dracula Theme",
    description: "Charcoal Dark & Purple/Green Glow",
    badgeBg: "#282a36",
    badgeDots: ["#50fa7b", "#bd93f9"],
    colors: {
      background: "#282a36",
      foreground: "#f8f8f2",
      cardBg: "rgba(68, 71, 90, 0.7)",
      cardBorder: "rgba(189, 147, 249, 0.2)",
      primary: "#bd93f9",
      primaryGlow: "rgba(189, 147, 249, 0.35)",
      accent: "#50fa7b",
      conicGradient: "conic-gradient(from 0deg, transparent 0%, transparent 75%, #50fa7b 90%, #bd93f9 100%)",
      beamHue: 265,
    },
  },
];

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
