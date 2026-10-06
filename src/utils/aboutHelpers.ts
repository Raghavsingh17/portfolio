import { Briefcase, FileText, Smartphone, Palette } from "lucide-react";

export function getAboutHighlights(onOpenResume?: () => void) {
  return [
    {
      id: "experience",
      icon: Briefcase,
      title: "2 + Years Experience",
      badge: "Career Metric",
      description:
        "Developing production-grade frontend systems, scalable full-stack APIs, reusable component libraries, and real-time interactive web applications.",
      glowColor: "theme" as const,
      iconGlowColor: "theme" as const,
      iconColor: "text-cyan-400",
      isInteractive: false,
    },
    {
      id: "resume-hub",
      icon: FileText,
      title: "Interactive Resume",
      badge: "Live PDF Hub",
      description:
        "Explore full work history, tech stack breakdown, education, and certifications with live PDF preview or instant download.",
      glowColor: "theme" as const,
      iconGlowColor: "theme" as const,
      iconColor: "text-blue-400",
      isInteractive: true,
      onClick: onOpenResume,
    },
    {
      id: "responsive",
      icon: Smartphone,
      title: "Responsive & Scalable",
      badge: "Cross-Device",
      description:
        "Flawless mobile-first layouts with zero horizontal overflow, fluid typography, and sub-100ms Core Web Vitals performance.",
      glowColor: "theme" as const,
      iconGlowColor: "theme" as const,
      iconColor: "text-amber-400",
      isInteractive: false,
    },
    {
      id: "design-systems",
      icon: Palette,
      title: "Design Systems & UI",
      badge: "Pixel Perfect",
      description:
        "Translating Figma mockups into reactive React components with custom Tailwind CSS, Framer Motion physics, and Glassmorphism effects.",
      glowColor: "theme" as const,
      iconGlowColor: "theme" as const,
      iconColor: "text-purple-400",
      isInteractive: false,
    },
  ];
}
