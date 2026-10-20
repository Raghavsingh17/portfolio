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
  FileText,
  User,
  Mail,
  MessageSquare,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { ChatMessage, ChatConfig } from "@/src/types/chat";
import {
  createMessageId,
  getFormattedTime,
  DEFAULT_CHAT_CONFIG,
  generateLocalResponse,
} from "@/src/utils/chatHelpers";
import {
  getOrCreateVisitorId,
  getActiveSessionId,
  setActiveSessionId,
  startNewSessionId,
  clearCurrentSession,
  cacheMessages,
  getCachedMessages,
} from "@/src/utils/sessionManager";
import { chatApi, getBackendUrl } from "@/src/lib/api";

type Message = ChatMessage;

interface ChatConnectCardProps {
  sessionId?: string | null;
  onSent?: (name: string, email: string) => void;
}

function ChatConnectCard({ sessionId, onSent }: ChatConnectCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMsg = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMsg) {
      setErrorMsg("Please provide your name, email, and a short message.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const activeSession = sessionId || getActiveSessionId();
      const res = await fetch(`${getBackendUrl()}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMsg,
          source: "chatbot",
          sessionId: activeSession,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setIsSuccess(true);
        // Also update session visitor profile in backend
        if (activeSession) {
          chatApi.updateVisitor(activeSession, {
            name: trimmedName,
            email: trimmedEmail,
          }).catch(() => {});
        }
        if (onSent) {
          onSent(trimmedName, trimmedEmail);
        }
      } else {
        setErrorMsg(data.error || data.message || "Failed to deliver. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="mt-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs">
          <CheckCircle2 className="w-4 h-4" />
          <span>Message Sent Successfully!</span>
        </div>
        <p className="text-[11px] text-emerald-300/80">
          Raghav has received your message and will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2.5 space-y-2 rounded-xl bg-slate-950/85 border border-cyan-500/25 p-3 shadow-lg shadow-black/40 text-left"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>Quick Connect Card</span>
        </div>
        <span className="text-[9px] text-slate-400 font-mono">Direct Connect</span>
      </div>

      {errorMsg && (
        <div className="text-[10px] text-rose-300 bg-rose-500/10 border border-rose-500/30 px-2 py-1 rounded-md">
          {errorMsg}
        </div>
      )}

      {/* Name Input */}
      <div className="relative">
        <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          disabled={isSubmitting}
          className="w-full bg-slate-900/90 border border-white/10 focus:border-cyan-500/60 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
        />
      </div>

      {/* Email Input */}
      <div className="relative">
        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          disabled={isSubmitting}
          className="w-full bg-slate-900/90 border border-white/10 focus:border-cyan-500/60 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
        />
      </div>

      {/* Message Input */}
      <div className="relative">
        <MessageSquare className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What would you like to discuss?"
          disabled={isSubmitting}
          className="w-full bg-slate-900/90 border border-white/10 focus:border-cyan-500/60 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none resize-none transition-all"
        />
      </div>

      {/* Send Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/25 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Saving & Sending...</span>
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            <span>Send to Raghav</span>
          </>
        )}
      </button>
    </form>
  );
}

interface AIChatWidgetProps {
  onOpenResume?: () => void;
  isResumeOpen?: boolean;
}

const INITIAL_WELCOME_MSG: Message = {
  id: "welcome-init",
  sender: "ai",
  text: "",
  timestamp: "",
};

export function PortfolioChatbot({ onOpenResume, isResumeOpen }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [chatConfig, setChatConfig] = useState<ChatConfig>(DEFAULT_CHAT_CONFIG);
  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return getActiveSessionId() || startNewSessionId();
    }
    return null;
  });
  const [visitorName, setVisitorName] = useState<string | null>(null);
  const [nameInputValue, setNameInputValue] = useState("");
  const [isSubmittingName, setIsSubmittingName] = useState(false);

  // Fetch dynamic chatbot UI configuration from backend (/api/chat/config) on mount
  useEffect(() => {
    let isMounted = true;

    chatApi
      .getConfig()
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.config) {
          setChatConfig(res.config);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Derive chat window open state (automatically closed if resume modal is active)
  const isChatOpen = isOpen && !isResumeOpen;

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const activeId = getActiveSessionId();
      if (activeId) {
        const cached = getCachedMessages(activeId) as Message[] | null;
        if (cached && cached.length > 0) {
          // If only welcome message was cached (from previous old version), reset to fresh welcome
          if (cached.length === 1 && cached[0]?.id?.startsWith("welcome")) {
            return [INITIAL_WELCOME_MSG];
          }
          return cached;
        }
      }
    }
    return [INITIAL_WELCOME_MSG];
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync latest conversation history from backend asynchronously
  useEffect(() => {
    const activeId = sessionId || getActiveSessionId();
    if (!activeId) return;

    chatApi.getSessionHistory(activeId).then((res) => {
      if (res.success && res.session?.visitorInfo?.name && res.session.visitorInfo.name !== "Anonymous Visitor") {
        setVisitorName(res.session.visitorInfo.name);
      }
      if (res.success && res.session?.messages && res.session.messages.length > 0) {
        const restoredMessages: Message[] = res.session.messages.map(
          (m: {
            id?: string;
            sender: "user" | "bot" | "system";
            text: string;
            timestamp?: string;
            metadata?: {
              actionType?: "resume" | "contact" | "connect-card" | "name-capture";
              pendingMessage?: string;
              source?: string;
            };
          }) => ({
            id: m.id || createMessageId(m.sender),
            sender: m.sender === "bot" ? "ai" : "user",
            text: m.text,
            actionType: m.metadata?.actionType,
            pendingMessage: m.metadata?.pendingMessage,
            timestamp: m.timestamp
              ? new Date(m.timestamp).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : getFormattedTime(),
          })
        );

        setMessages(restoredMessages);
        cacheMessages(activeId, restoredMessages);
      } else if (res.success && !res.session) {
        // Clear stale session ID so it doesn't query dead sessions on future reloads
        clearCurrentSession();
      }
    });
  }, [sessionId]);

  // Check if visitor has actually interacted and sent at least one message
  const hasConversationStarted = messages.some((m) => m.sender === "user");

  const handleToggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setHasUnread(false);
      } else if (hasConversationStarted) {
        const currentSession = sessionId || getActiveSessionId();
        if (currentSession) {
          chatApi.sendLeave(currentSession);
        }
      }
      return next;
    });
  };

  // Heartbeat Ping: Maintain online presence only when conversation has started
  useEffect(() => {
    if (!isChatOpen || !hasConversationStarted) return;

    const sendPing = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        const currentSession = sessionId || getActiveSessionId();
        if (currentSession) {
          chatApi.sendHeartbeat(currentSession);
        }
      }
    };

    const initialTimer = setTimeout(sendPing, 8000);
    const interval = setInterval(sendPing, 45000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        sendPing();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isChatOpen, hasConversationStarted, sessionId]);

  // Tab Close / Unload tracking: Send leave beacon only if conversation was started
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isChatOpen && hasConversationStarted) {
        const currentSession = sessionId || getActiveSessionId();
        if (currentSession) {
          chatApi.sendLeave(currentSession);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isChatOpen, hasConversationStarted, sessionId]);

  useEffect(() => {
    if (isChatOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isChatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleLeadSent = (leadName: string, leadEmail: string) => {
    if (leadName && !visitorName) {
      setVisitorName(leadName);
    }
    setTimeout(() => {
      setMessages((prev) => {
        const next = [
          ...prev,
          {
            id: createMessageId("ai"),
            sender: "ai" as const,
            text: `🎉 Thank you **${leadName}**! Your message has been delivered directly to Raghav. He will review it and get back to you at \`${leadEmail}\` shortly.`,
            timestamp: getFormattedTime(),
            suggestions: ["View Resume (PDF)", "Technical Skills >", "Work Experience >"],
          },
        ];
        if (sessionId) {
          cacheMessages(sessionId, next);
        }
        return next;
      });
    }, 350);
  };

  const handleContinueNameCapture = async (nameToSubmit?: string, pendingMsg?: string) => {
    const trimmed = (nameToSubmit || nameInputValue).trim();
    if (!trimmed || isSubmittingName) return;

    setIsSubmittingName(true);

    let activeSession = sessionId || getActiveSessionId();
    if (!activeSession) {
      activeSession = startNewSessionId();
      setSessionId(activeSession);
    }

    const visitorId = getOrCreateVisitorId();

    const userMsg: Message = {
      id: createMessageId("user"),
      sender: "user",
      text: trimmed,
      timestamp: getFormattedTime(),
    };

    setMessages((prev) => {
      const next = [...prev, userMsg];
      if (activeSession) cacheMessages(activeSession, next);
      return next;
    });

    setNameInputValue("");
    setInput("");
    setIsTyping(true);

    try {
      const chatRes = await chatApi.sendMessage({
        message: trimmed,
        sessionId: activeSession,
        visitorId,
        visitorName: trimmed,
        isNameCapture: true,
        pendingMessage: pendingMsg,
      });

      if (chatRes.success && (chatRes.response || chatRes.reply)) {
        const replyText = chatRes.response || chatRes.reply || "";
        const confirmedSessionId = chatRes.sessionId || activeSession;

        if (confirmedSessionId && confirmedSessionId !== sessionId) {
          setActiveSessionId(confirmedSessionId);
          setSessionId(confirmedSessionId);
        }

        setVisitorName(trimmed);

        setTimeout(() => {
          setMessages((prev) => {
            const next = [
              ...prev,
              {
                id: createMessageId("ai"),
                sender: "ai" as const,
                text: replyText,
                timestamp: getFormattedTime(),
                actionType: chatRes.actionType,
              },
            ];
            cacheMessages(confirmedSessionId, next);
            return next;
          });
          setIsTyping(false);
          setIsSubmittingName(false);
        }, 300);
        return;
      }
    } catch {}

    // Resilient fallback when backend is offline
    setVisitorName(trimmed);
    const firstName = trimmed.split(" ")[0];
    const pendingText = typeof pendingMsg === "string" ? pendingMsg.trim() : "";
    const isGreeting =
      !pendingText ||
      /^(hi|hello|hey|namaste|hola|greetings)[\s!.]*$/i.test(pendingText);

    let replyText = `Nice to meet you, **${firstName}**! 😊 How can I help you today? Feel free to ask about Raghav's **skills, work experience, projects, or resume**.`;
    let actionType: "resume" | "contact" | "connect-card" | "name-capture" | undefined = undefined;

    if (!isGreeting && pendingText) {
      const localAnswer = generateLocalResponse(pendingText, trimmed);
      replyText = `Nice to meet you, **${firstName}**! 😊\n\n${localAnswer.text}`;
      actionType = localAnswer.actionType;
    }

    setTimeout(() => {
      setMessages((prev) => {
        const next = [
          ...prev,
          {
            id: createMessageId("ai"),
            sender: "ai" as const,
            text: replyText,
            timestamp: getFormattedTime(),
            actionType,
          },
        ];
        if (activeSession) cacheMessages(activeSession, next);
        return next;
      });
      setIsTyping(false);
      setIsSubmittingName(false);
    }, 300);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isTyping) return;

    // If currently awaiting name capture and visitor sends message
    const pendingCaptureMsg = messages.slice().reverse().find((m) => m.actionType === "name-capture");
    if (pendingCaptureMsg && !visitorName) {
      handleContinueNameCapture(messageText, pendingCaptureMsg.pendingMessage);
      return;
    }

    // Ensure session ID is present
    let activeSession = sessionId || getActiveSessionId();
    if (!activeSession) {
      activeSession = startNewSessionId();
      setSessionId(activeSession);
    }

    const visitorId = getOrCreateVisitorId();

    const userMsg: Message = {
      id: createMessageId("user"),
      sender: "user",
      text: messageText,
      timestamp: getFormattedTime(),
    };

    setMessages((prev) => {
      const next = [...prev, userMsg];
      if (activeSession) cacheMessages(activeSession, next);
      return next;
    });
    setInput("");
    setIsTyping(true);

    try {
      // 1. Send message to backend with active session and visitor tracking
      const chatRes = await chatApi.sendMessage({
        message: messageText,
        sessionId: activeSession,
        visitorId,
        visitorName: visitorName || undefined,
      });

      if (chatRes.success && (chatRes.response || chatRes.reply)) {
        const replyText = chatRes.response || chatRes.reply || "";
        const confirmedSessionId = chatRes.sessionId || activeSession;

        if (confirmedSessionId && confirmedSessionId !== sessionId) {
          setActiveSessionId(confirmedSessionId);
          setSessionId(confirmedSessionId);
        }

        if (chatRes.visitorName) {
          setVisitorName(chatRes.visitorName);
        }

        const actionType = chatRes.actionType;
        const pendingMessage = chatRes.pendingMessage;

        setTimeout(() => {
          setMessages((prev) => {
            const next = [
              ...prev,
              {
                id: createMessageId("ai"),
                sender: "ai" as const,
                text: replyText,
                timestamp: getFormattedTime(),
                actionType,
                pendingMessage,
              },
            ];
            cacheMessages(confirmedSessionId, next);
            return next;
          });
          setIsTyping(false);
        }, 300);
        return;
      }
    } catch {
      // Backend temporarily unreachable or offline
    }

    // 2. Autonomous Client Fallback: Never display an error message to visitors or recruiters.
    // Instantly serve a rich, accurate portfolio answer using our built-in intelligence engine.
    const localResult = generateLocalResponse(messageText, visitorName || undefined);
    setTimeout(() => {
      setMessages((prev) => {
        const next = [
          ...prev,
          {
            id: createMessageId("ai"),
            sender: "ai" as const,
            text: localResult.text,
            timestamp: getFormattedTime(),
            actionType: localResult.actionType,
          },
        ];
        if (activeSession) cacheMessages(activeSession, next);
        return next;
      });
      setIsTyping(false);
    }, 350);
  };

  // Start a fresh conversation session
  const handleClearChat = () => {
    if (hasConversationStarted) {
      const oldSession = sessionId || getActiveSessionId();
      if (oldSession) {
        chatApi.sendLeave(oldSession);
      }
    }

    clearCurrentSession();
    const newSession = startNewSessionId();
    setSessionId(newSession);
    setVisitorName(null);
    setNameInputValue("");

    const resetMsg: Message = {
      id: "welcome-" + Date.now(),
      sender: "ai",
      text: "",
      timestamp: getFormattedTime(),
    };

    setMessages([resetMsg]);
    cacheMessages(newSession, [resetMsg]);
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
          onClick={handleToggleOpen}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="group relative flex items-center justify-center rounded-full"
        >
          <div className="w-14 h-14 rounded-full border-2 border-white/20 bg-slate-950 flex items-center justify-center text-white font-extrabold shadow-[0_0_25px_var(--accent-glow)] light:bg-white light:border-slate-300">
            <span className="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-extrabold text-2xl font-mono">
              R
            </span>
          </div>

          {/* Close X Badge when modal is open */}
          {isChatOpen && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white border-2 border-slate-950 shadow-md z-20">
              <X className="h-3.5 w-3.5 stroke-[3]" />
            </span>
          )}

          {/* Unread Pulsing Dot */}
          {hasUnread && !isChatOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 z-10">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </span>
          )}

          {/* Tooltip on Hover */}
          {!isChatOpen && (
            <span className="absolute right-16 hidden rounded-xl border border-white/10 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-lg group-hover:block whitespace-nowrap">
              Ask AI Assistant ✨
            </span>
          )}
        </motion.button>
      </div>

      {/* Glassmorphic Chat Modal Drawer */}
      <AnimatePresence>
        {isChatOpen && (
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
                  <div className="w-10 h-10 rounded-xl border border-white/15 bg-slate-950 flex items-center justify-center text-white font-extrabold text-base leading-none shadow-lg shadow-cyan-500/20 light:bg-white light:border-slate-300 light:text-slate-900">
                    <span className="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-extrabold text-base font-mono">
                      R
                    </span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 z-20 shadow-sm bg-emerald-500" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-white light:text-slate-900 truncate">
                      {chatConfig.title}
                    </h3>
                    <span className="rounded-full px-2 py-0.5 text-[9px] font-mono border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      Online
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 light:text-slate-500 truncate">
                    {visitorName ? `With ${visitorName} • ` : ""}
                    {chatConfig.subtitle}
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
                  onClick={() => {
                    if (hasConversationStarted) {
                      const currentSession = sessionId || getActiveSessionId();
                      if (currentSession) {
                        chatApi.sendLeave(currentSession);
                      }
                    }
                    setIsOpen(false);
                  }}
                  title="Close"
                  className="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
              {messages.map((msg) => {
                if (msg.id.startsWith("welcome")) {
                  return (
                    <div key={msg.id} className="flex flex-col items-start w-full space-y-4 pt-1 pb-2">
                      <div className="space-y-1.5 w-full">
                        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                          {chatConfig.welcome.greeting}
                        </h3>
                        <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                          {chatConfig.welcome.title}
                        </h2>
                      </div>

                      <div className="w-full">
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-[95%]">
                          {chatConfig.welcome.description}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm font-medium text-slate-300">
                          {chatConfig.welcome.prompt}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1 w-full">
                        {chatConfig.quickPrompts.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => handleSendMessage(item.query)}
                            className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-medium text-blue-300 transition-all hover:bg-blue-500/20 hover:text-white hover:border-blue-500/50 active:scale-95 cursor-pointer shadow-sm shadow-blue-500/5"
                          >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
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
                            onClick={() => {
                              setIsOpen(false);
                              onOpenResume();
                            }}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition-colors cursor-pointer"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Open Live Resume Modal</span>
                          </button>
                        </div>
                      )}

                      {/* Interactive Connect Form Card */}
                      {msg.actionType === "connect-card" && (
                        <div className="mt-3 pt-2 border-t border-white/10">
                          <ChatConnectCard sessionId={sessionId} onSent={handleLeadSent} />
                        </div>
                      )}

                      {/* Interactive Name Capture Card (Steps 3 & 4) */}
                      {msg.actionType === "name-capture" && (
                        <div className="mt-3 pt-2 border-t border-white/10 w-full">
                          {!visitorName ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleContinueNameCapture(nameInputValue, msg.pendingMessage);
                              }}
                              className="flex flex-col sm:flex-row gap-2 w-full pt-1"
                            >
                              <div className="relative flex-1">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-400" />
                                <input
                                  type="text"
                                  value={nameInputValue}
                                  onChange={(e) => setNameInputValue(e.target.value)}
                                  placeholder="Enter your name (e.g. Raghav Singh)"
                                  maxLength={50}
                                  autoFocus
                                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800/90 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                                />
                              </div>
                              <button
                                type="submit"
                                disabled={!nameInputValue.trim() || isSubmittingName}
                                className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
                              >
                                {isSubmittingName ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                                <span>Continue</span>
                              </button>
                            </form>
                          ) : (
                            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-300">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              <span>
                                Introduced as <strong className="text-white font-medium">{visitorName}</strong>
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <span className="mt-1 px-1 text-[10px] text-slate-500 light:text-slate-400">
                      {msg.timestamp}
                    </span>

                    {/* Suggestion Prompt Chips */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 w-full">
                        {msg.suggestions.map((prompt, pIdx) => {
                          const item = (chatConfig?.quickPrompts || []).find(
                            (i) => i.query === prompt || i.label === prompt
                          );
                          return (
                            <button
                              key={pIdx}
                              onClick={() => handleSendMessage(item ? item.query : prompt)}
                              className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-300 transition-all hover:bg-blue-500/20 hover:text-white hover:border-blue-500/50 active:scale-95 cursor-pointer shadow-sm shadow-blue-500/5"
                            >
                              {item?.icon && <span>{item.icon}</span>}
                              <span>{item?.label || prompt}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

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
                  placeholder={chatConfig?.placeholder || "Ask me anything about Raghav..."}
                  className="flex-1 bg-transparent py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none light:text-slate-900 light:placeholder-slate-400"
                />
                {input.trim() && !isTyping ? (
                  <button
                    type="submit"
                    className="h-8 w-8 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-md shadow-blue-500/20 focus:outline-none shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
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
