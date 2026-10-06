import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Raghav Singh | Portfolio",
  description:
    "Personal portfolio of Raghav Singh, Full-Stack Developer specializing in Next.js, React.js, JavaScript, TypeScript, Tailwind CSS, Framer Motion, and high-performance Web Apps.",
  keywords: [
    "Raghav Singh",
    "Full Stack Developer",
    "React.js Developer",
    "Next.js Developer",
    "React Bits Portfolio",
    "Frontend Architect",
    "TypeScript",
    "Tailwind CSS",
  ],
  authors: [{ name: "Raghav Singh" }],
  openGraph: {
    title: "Raghav Singh | Full-Stack Developer",
    description: "Building next-gen digital experiences with Next.js, React.js & Reactbits animations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-500/30 selection:text-white dark:bg-slate-950 light:bg-slate-50 light:text-slate-900">
        {children}
      </body>
    </html>
  );
}
