"use client";

import React, { useState, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Send,
  RefreshCw,
  Minimize2,
  ArrowUpRight,
  ChevronRight,
  FileText,
} from "lucide-react";
import { AnimatedBorderGlow } from "@/src/components/reactbits/AnimatedBorderGlow";
import { ChatMessage } from "@/src/types/chat";
import {
  QUICK_PROMPTS,
  getFormattedTime,
  generateLocalResponse,
} from "@/src/utils/chatHelpers";

type Message = ChatMessage;

interface AIChatWidgetProps {
  onOpenResume?: () => void;
}

export function PortfolioChatbot({ onOpenResume }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: `👋 Hi! I'm **Raghav's AI Assistant**.\n\nI can answer any questions about Raghav's **2.5+ years of experience**, full technical skill matrix, education, projects, or how to hire him. How can I help you today?`,
      timestamp: getFormattedTime(),
      suggestions: QUICK_PROMPTS,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isTyping) return;

    // Special quick action check for Resume
    if (messageText.toLowerCase().includes("resume") && onOpenResume) {
      onOpenResume();
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: messageText,
      timestamp: getFormattedTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Attempt API Route call (if configured)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.response) {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: `ai-${Date.now()}`,
                sender: "ai",
                text: data.response,
                timestamp: getFormattedTime(),
              },
            ]);
            setIsTyping(false);
          }, 350);
          return;
        }
      }
    } catch {
      // Fallback silently to local NLP intent engine
    }

    // Local Instant Response
    setTimeout(() => {
      const responseObj = generateLocalResponse(messageText);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: responseObj.text,
          timestamp: getFormattedTime(),
          actionType: responseObj.actionType,
          suggestions: responseObj.suggestions,
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "ai",
        text: `Chat reset! Ask me anything about Raghav's background, skills, work experience, education, or resume.`,
        timestamp: getFormattedTime(),
        suggestions: QUICK_PROMPTS,
      },
    ]);
  };

  // Rich Formatting for bolding, glowing skill badges, and markdown links
  const formatMessage = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      const formattedParts = line.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g).map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-bold text-white light:text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <span
              key={pIdx}
              className="inline-block px-2.5 py-1 my-0.5 mr-1.5 text-xs font-semibold rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/30 font-mono shadow-[0_0_12px_rgba(59,130,246,0.2)] transition-all hover:scale-105 hover:bg-blue-500/25 hover:border-blue-400"
            >
              {part.slice(1, -1)}
            </span>
          );
        }
        if (part.startsWith("[") && part.includes("](")) {
          const match = part.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            return (
              <a
                key={pIdx}
                href={match[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-400 hover:underline inline-flex items-center gap-0.5"
              >
                <span>{match[1]}</span>
                <ArrowUpRight className="h-3 w-3 inline" />
              </a>
            );
          }
        }
        return part;
      });

      return (
        <React.Fragment key={idx}>
          {formattedParts}
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {/* Floating Action Button with Animated Border Glow */}
      <div className="fixed bottom-5 right-5 z-[9999]">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="group relative flex items-center justify-center rounded-full"
        >
          <AnimatedBorderGlow
            glowColor="theme"
            duration={3.5}
            interactive={true}
            containerClassName="w-14 h-14 rounded-full p-[2px] shadow-[0_0_25px_var(--accent-glow)]"
            className="w-full h-full rounded-full border-0 bg-slate-950 flex items-center justify-center text-white font-extrabold light:bg-white"
          >
            <span className="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-extrabold text-2xl font-mono">
              R
            </span>
          </AnimatedBorderGlow>

          {/* Close X Badge when modal is open */}
          {isOpen && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white border-2 border-slate-950 shadow-md z-20">
              <X className="h-3.5 w-3.5 stroke-[3]" />
            </span>
          )}

          {/* Unread Pulsing Dot */}
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 z-10">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </span>
          )}

          {/* Tooltip on Hover */}
          {!isOpen && (
            <span className="absolute right-16 hidden rounded-xl border border-white/10 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-lg group-hover:block whitespace-nowrap">
              Ask AI Assistant ✨
            </span>
          )}
        </motion.button>
      </div>

      {/* Glassmorphic Chat Modal Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-20 right-4 sm:right-6 z-[9998] flex h-[530px] max-h-[75vh] w-[92vw] sm:w-[410px] flex-col overflow-hidden rounded-3xl border border-white/15 bg-slate-950/95 shadow-2xl backdrop-blur-2xl dark:border-white/20 dark:bg-slate-950/95 light:border-slate-300 light:bg-white/95"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-3 light:border-slate-200 light:bg-slate-50">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative flex shrink-0">
                  <AnimatedBorderGlow
                    glowColor="theme"
                    duration={4}
                    containerClassName="w-10 h-10 rounded-xl p-[1.5px] shrink-0 shadow-lg shadow-cyan-500/20"
                    className="w-full h-full rounded-[calc(0.75rem-1.5px)] border-0 bg-slate-950 p-0 flex items-center justify-center text-white font-extrabold text-base leading-none light:bg-white light:text-slate-900"
                  >
                    <span className="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-extrabold text-base font-mono">
                      R
                    </span>
                  </AnimatedBorderGlow>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 z-20 shadow-sm" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-white light:text-slate-900 truncate">
                      Raghav's AI Assistant
                    </h3>
                    <span className="rounded-full bg-blue-500/20 px-1.5 py-0.2 text-[9px] font-mono text-blue-400 border border-blue-500/30">
                      Online
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 light:text-slate-500 truncate">
                    Portfolio Knowledge & Career AI
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 text-slate-400">
                <button
                  onClick={handleClearChat}
                  title="Clear Chat"
                  className="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-md leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                        : "bg-slate-900/80 border border-white/10 text-slate-200 rounded-bl-none light:bg-slate-100 light:text-slate-800 light:border-slate-200"
                    }`}
                  >
                    {formatMessage(msg.text)}

                    {/* Interactive Button for Resume Action */}
                    {msg.actionType === "resume" && onOpenResume && (
                      <div className="mt-3 pt-2 border-t border-white/10">
                        <button
                          onClick={onOpenResume}
                          className="flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>Open Live Resume Modal</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="mt-1 px-1 text-[10px] text-slate-500 light:text-slate-400">
                    {msg.timestamp}
                  </span>

                  {/* Suggestion Prompt Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 w-full">
                      {msg.suggestions.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSendMessage(prompt)}
                          className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-300 transition-all hover:bg-blue-500/20 hover:text-white hover:border-blue-500/50 light:border-blue-200 light:bg-blue-50 light:text-blue-700"
                        >
                          <span>{prompt}</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 w-fit text-slate-400">
                  <Bot className="h-4 w-4 text-blue-400 animate-spin" />
                  <span className="text-xs">Thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="border-t border-white/10 p-3 light:border-slate-200"
            >
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-1.5 focus-within:border-blue-500/50 light:border-slate-300 light:bg-slate-100">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about skills, experience, education..."
                  className="flex-1 bg-transparent py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none light:text-slate-900 light:placeholder-slate-400"
                />
                {input.trim() && !isTyping ? (
                  <AnimatedBorderGlow
                    glowColor="theme"
                    containerClassName="h-8 w-8 rounded-xl p-[1.5px] shrink-0 shadow-md shadow-cyan-500/20"
                    className="p-0 h-full w-full rounded-[calc(0.75rem-1.5px)] bg-slate-950/90 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all"
                  >
                    <button
                      type="submit"
                      className="w-full h-full flex items-center justify-center text-white focus:outline-none"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </AnimatedBorderGlow>
                ) : (
                  <button
                    type="submit"
                    disabled
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-500 opacity-40 cursor-not-allowed"
                  >
                    <Send className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Export PortfolioChatbot alias for backward compatibility
export const AIChatWidget = memo(PortfolioChatbot);
