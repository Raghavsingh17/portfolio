import { Briefcase, FileText, Smartphone, Palette, type LucideIcon } from "lucide-react";

export interface AboutHighlight {
  id: string;
  icon: LucideIcon;
  title: string;
  badge: string;
  description: string;
  accent: "cyan" | "blue" | "amber" | "purple";
  borderClass: string;
  hoverBorderClass: string;
  shadowClass: string;
  topGradientClass: string;
  iconBgClass: string;
  iconShadowClass: string;
  iconColorClass: string;
  badgeClass: string;
  isInteractive: boolean;
  onClick?: () => void;
}

export function getAboutHighlights(onOpenResume?: () => void): AboutHighlight[] {
  return [
    {
      id: "experience",
      icon: Briefcase,
      title: "2+ Years Experience",
      badge: "Career Metric",
      description:
        "Developing production-grade frontend architectures, scalable web applications, and high-performance interactive user experiences.",
      accent: "cyan",
      borderClass: "border-cyan-400/40",
      hoverBorderClass: "hover:border-cyan-300",
      shadowClass: "shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_24px_rgba(6,182,212,0.18)]",
      topGradientClass: "via-cyan-400",
      iconBgClass: "border-cyan-400/60 bg-cyan-500/25 text-cyan-200",
      iconShadowClass: "shadow-[0_0_20px_rgba(6,182,212,0.5)]",
      iconColorClass: "text-cyan-300",
      badgeClass: "bg-cyan-500/25 text-cyan-200 border-cyan-400/50",
      isInteractive: false,
    },
    {
      id: "resume-hub",
      icon: FileText,
      title: "Interactive Resume",
      badge: "Live PDF Hub",
      description:
        "Explore full career timeline, technical proficiencies, education, and credentials with live interactive preview or one-click PDF download.",
      accent: "blue",
      borderClass: "border-blue-400/40",
      hoverBorderClass: "hover:border-blue-300",
      shadowClass: "shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_24px_rgba(59,130,246,0.18)]",
      topGradientClass: "via-blue-400",
      iconBgClass: "border-blue-400/60 bg-blue-500/25 text-blue-200",
      iconShadowClass: "shadow-[0_0_20px_rgba(59,130,246,0.5)]",
      iconColorClass: "text-blue-300",
      badgeClass: "bg-blue-500/25 text-blue-200 border-blue-400/50",
      isInteractive: true,
      onClick: onOpenResume,
    },
    {
      id: "responsive",
      icon: Smartphone,
      title: "Responsive & Scalable",
      badge: "Cross-Device",
      description:
        "Engineered mobile-first interfaces with zero horizontal overflow, fluid typography, and sub-100ms Core Web Vitals optimization.",
      accent: "amber",
      borderClass: "border-amber-400/40",
      hoverBorderClass: "hover:border-amber-300",
      shadowClass: "shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_24px_rgba(245,158,11,0.18)]",
      topGradientClass: "via-amber-400",
      iconBgClass: "border-amber-400/60 bg-amber-500/25 text-amber-200",
      iconShadowClass: "shadow-[0_0_20px_rgba(245,158,11,0.5)]",
      iconColorClass: "text-amber-300",
      badgeClass: "bg-amber-500/25 text-amber-200 border-amber-400/50",
      isInteractive: false,
    },
    {
      id: "design-systems",
      icon: Palette,
      title: "Design Systems & UI",
      badge: "Pixel Perfect",
      description:
        "Transforming Figma mockups into reactive React components with custom Tailwind CSS, Framer Motion physics, and glassmorphic polish.",
      accent: "purple",
      borderClass: "border-purple-400/40",
      hoverBorderClass: "hover:border-purple-300",
      shadowClass: "shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_24px_rgba(168,85,247,0.18)]",
      topGradientClass: "via-purple-400",
      iconBgClass: "border-purple-400/60 bg-purple-500/25 text-purple-200",
      iconShadowClass: "shadow-[0_0_20px_rgba(168,85,247,0.5)]",
      iconColorClass: "text-purple-300",
      badgeClass: "bg-purple-500/25 text-purple-200 border-purple-400/50",
      isInteractive: false,
    },
  ];
}
