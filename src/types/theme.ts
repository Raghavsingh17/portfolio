export type ThemeId =
  | "dark"
  | "tokyo-night"
  | "cyberpunk"
  | "dracula"
  | "nord-ice"
  | "emerald-matrix"
  | "catppuccin"
  | "sunset-horizon";

export interface ThemePreset {
  id: ThemeId;
  name: string;
  description: string;
  badgeBg: string;
  badgeDots: string[];
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
