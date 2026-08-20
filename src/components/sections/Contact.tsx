"use client";

import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle2, Copy, MessageSquare } from "lucide-react";
import confetti from "canvas-confetti";
import { Github, Linkedin, Instagram } from "@/src/components/ui/Icons";
import { PERSONAL_INFO } from "@/src/data/portfolio";
import { ScrollReveal } from "@/src/components/reactbits/ScrollReveal";
import { SpotlightCard } from "@/src/components/reactbits/SpotlightCard";
import { ShinyText } from "@/src/components/reactbits/ShinyText";
import { GlowBorderButton } from "@/src/components/reactbits/GlowBorderButton";
import { AnimatedBorderGlow } from "@/src/components/reactbits/AnimatedBorderGlow";
import { MagneticButton } from "@/src/components/reactbits/MagneticButton";
import { SparklesBackground } from "@/src/components/reactbits/SparklesBackground";
import { useCursor } from "@/src/context/CursorContext";


function ContactComponent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setCursorMode } = useCursor();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.socials.emailRaw || "raghavsingh7631@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitting(false);
        setIsSubmitted(true);

        // Trigger Confetti Celebration
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#3b82f6", "#8b5cf6", "#60a5fa", "#ffffff", "#10b981"],
        });
      } else {
        throw new Error(data.error || "Failed to deliver message. Please try again.");
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="relative py-12 sm:py-28 pb-28 sm:pb-36 overflow-hidden scroll-mt-20">
      {/* ReactBits Sparkles Canvas Background */}
      <SparklesBackground
        count={220}
        speed={1.1}
        colors={["#60a5fa", "#a855f7", "#38bdf8", "#f472b6", "#fbbf24", "#10b981", "#ffffff"]}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="text-center">
          <span className="rounded-full bg-blue-500/10 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wider text-blue-400 border border-blue-500/20 uppercase">
            Get In Touch
          </span>
          <h2 className="mt-3 sm:mt-4 text-2xl font-extrabold text-white light:text-slate-900 sm:text-5xl tracking-tight">
            <ShinyText>Let's build something extraordinary</ShinyText>.
          </h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-xs sm:text-base text-slate-400 light:text-slate-600 px-2">
            Have a project in mind, a question, or an opportunity? Feel free to reach out directly.
          </p>
        </ScrollReveal>

        <div className="mt-8 sm:mt-16 grid gap-6 sm:gap-10 lg:grid-cols-12">
          {/* Contact Details & Copy Card */}
          <ScrollReveal direction="left" className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <AnimatedBorderGlow glowColor="theme" containerClassName="h-full" className="p-0">
              <SpotlightCard className="h-full flex flex-col justify-between p-4 sm:p-8 border-0 dark:bg-slate-950/80 light:bg-white/80">
                <div>
                  <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-4 sm:mb-6">
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span>Direct Communication</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white light:text-slate-900 mb-3 sm:mb-4 leading-tight">
                    Open for new challenges & full-time opportunities.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 light:text-slate-600 leading-relaxed mb-6 sm:mb-8">
                    I'm available for technical consultation, full-stack application development, and leading frontend architectural rewrites.
                  </p>

                  {/* Email Copy Card */}
                  <div className="relative rounded-2xl border border-white/10 bg-slate-900/90 p-3.5 sm:p-4 mb-6 dark:bg-slate-900/90 light:bg-slate-100 light:border-slate-200">
                    <div className="text-[11px] sm:text-xs text-slate-400 light:text-slate-500 mb-1.5 font-medium">Direct Email</div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <span className="font-mono text-xs sm:text-base font-bold text-blue-400 break-all sm:truncate">
                        {PERSONAL_INFO.socials.emailRaw || "raghavsingh7631@gmail.com"}
                      </span>
                      <button
                        suppressHydrationWarning
                        onClick={handleCopyEmail}
                        onMouseEnter={() => setCursorMode("pointer")}
                        onMouseLeave={() => setCursorMode("default")}
                        className="flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-xl bg-blue-600/20 px-3 text-xs font-semibold text-blue-300 border border-blue-500/30 transition-colors hover:bg-blue-600 hover:text-white shrink-0 self-start sm:self-auto"
                      >
                        {copiedEmail ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Location info */}
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 light:text-slate-600 mb-6">
                    <AnimatedBorderGlow
                      glowColor="theme"
                      containerClassName="h-10 w-10 shrink-0 rounded-xl p-[1.5px] shadow-lg shadow-emerald-500/20"
                      className="p-0 h-full w-full rounded-[calc(0.75rem-1.5px)] bg-slate-950/90 flex items-center justify-center text-emerald-400"
                    >
                      <MapPin className="h-4.5 w-4.5" />
                    </AnimatedBorderGlow>
                    <div>
                      <div className="font-semibold text-white light:text-slate-900">Location</div>
                      <div>{PERSONAL_INFO.location}</div>
                    </div>
                  </div>

                  {/* Social Channels Row with Tooltips */}
                  <div className="pt-5 sm:pt-6 border-t border-white/10 light:border-slate-200">
                    <div className="text-xs font-semibold text-slate-400 light:text-slate-500 mb-3">
                      Social Channels & Networks
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                      {[
                        {
                          name: "GitHub Profile",
                          href: PERSONAL_INFO.socials.github,
                          icon: <Github className="h-4.5 w-4.5 sm:h-5 sm:w-5" />,
                          glowColor: "cyber",
                        },
                        {
                          name: "Connect on LinkedIn",
                          href: PERSONAL_INFO.socials.linkedin,
                          icon: <Linkedin className="h-4.5 w-4.5 sm:h-5 sm:w-5" />,
                          glowColor: "cyan-blue",
                        },
                        {
                          name: "Follow on Instagram",
                          href: PERSONAL_INFO.socials.instagram,
                          icon: <Instagram className="h-4.5 w-4.5 sm:h-5 sm:w-5" />,
                          glowColor: "sunset",
                        },
                        {
                          name: "Send Email",
                          href: `mailto:${PERSONAL_INFO.socials.email}`,
                          icon: <Mail className="h-4.5 w-4.5 sm:h-5 sm:w-5" />,
                          glowColor: "gold",
                        },
                      ].map((item) => (
                        <MagneticButton key={item.name} href={item.href} target="_blank" rel="noopener noreferrer">
                          <motion.div
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="group/tooltip relative"
                          >
                            <AnimatedBorderGlow
                              glowColor={item.glowColor}
                              containerClassName="rounded-full p-[1.5px] shadow-md"
                              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full p-0 flex items-center justify-center bg-slate-950/90 text-slate-300 hover:text-white transition-all"
                            >
                              {item.icon}
                            </AnimatedBorderGlow>
                            {/* Hover Tooltip */}
                            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg border border-white/10 transition-all duration-200 group-hover/tooltip:opacity-100 group-hover/tooltip:-top-10 light:bg-slate-800 z-30">
                              {item.name}
                            </span>
                          </motion.div>
                        </MagneticButton>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status Pill */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 flex items-center gap-2.5 sm:gap-3">
                  <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-emerald-400">
                    Response time: Usually within 24 hours
                  </span>
                </div>
              </SpotlightCard>
            </AnimatedBorderGlow>
          </ScrollReveal>

          {/* Contact Form Card */}
          <ScrollReveal direction="right" className="lg:col-span-7">
            <AnimatedBorderGlow glowColor="theme" containerClassName="h-full" className="p-0">
              <SpotlightCard className="h-full border-0 p-4 sm:p-8 dark:bg-slate-950/95 light:bg-white/95 flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex h-full flex-col items-center justify-center py-8 sm:py-12 text-center"
                    >
                      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-4 sm:mb-6">
                        <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white light:text-slate-900">
                        Message Sent Successfully!
                      </h3>
                      <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-300 light:text-slate-600">
                        Thank you for reaching out. I've received your message and will get back to you shortly.
                      </p>
                      <button
                        suppressHydrationWarning
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({ name: "", email: "", subject: "", message: "" });
                        }}
                        className="mt-6 rounded-full bg-slate-800 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-700"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form key="form" onSubmit={handleSubmit} className="flex flex-col justify-between h-full space-y-4 sm:space-y-6">
                      <div className="space-y-4 sm:space-y-5">
                        {errorMessage && (
                          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-300 text-center">
                            {errorMessage}
                          </div>
                        )}
                        {/* Row 1: Full Name */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
                            Your Full Name <span className="text-blue-500">*</span>
                          </label>
                          <input
                            suppressHydrationWarning
                            type="text"
                            required
                            placeholder="e.g. Alex Johnson"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/80 px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm text-white placeholder-slate-400 outline-none transition-colors focus:border-blue-500/60 light:border-slate-300 light:bg-slate-100 light:text-slate-900"
                          />
                        </div>

                        {/* Row 2: Email Address */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
                            Your Email Address <span className="text-blue-500">*</span>
                          </label>
                          <input
                            suppressHydrationWarning
                            type="email"
                            required
                            placeholder="e.g. alex@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/80 px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm text-white placeholder-slate-400 outline-none transition-colors focus:border-blue-500/60 light:border-slate-300 light:bg-slate-100 light:text-slate-900"
                          />
                        </div>

                        {/* Row 3: Subject */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
                            Subject <span className="text-blue-500">*</span>
                          </label>
                          <input
                            suppressHydrationWarning
                            type="text"
                            required
                            placeholder="e.g., Custom Web App / Freelance Project"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/80 px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm text-white placeholder-slate-400 outline-none transition-colors focus:border-blue-500/60 light:border-slate-300 light:bg-slate-100 light:text-slate-900"
                          />
                        </div>

                        {/* Row 4: Message */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
                            Message <span className="text-blue-500">*</span>
                          </label>
                          <textarea
                            suppressHydrationWarning
                            required
                            rows={4}
                            placeholder="Tell me about your project scope, timeline, budget, or objectives..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full min-h-[110px] sm:min-h-[150px] rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/80 px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm text-white placeholder-slate-400 outline-none transition-colors focus:border-blue-500/60 light:border-slate-300 light:bg-slate-100 light:text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Row 5: Action & Trust Badge */}
                      <div className="pt-2">
                        <GlowBorderButton
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full"
                          innerClassName="w-full px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-bold gap-2"
                          glowColor="theme"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              <span>Sending Message...</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Send className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                              <span>Send Message</span>
                            </span>
                          )}
                        </GlowBorderButton>
                      </div>
                    </form>
                  )}
                </AnimatePresence>
              </SpotlightCard>
            </AnimatedBorderGlow>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export const Contact = memo(ContactComponent);
