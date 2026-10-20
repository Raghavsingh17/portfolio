"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Mail,
  CheckCircle2,
  Trash2,
  Search,
  LogOut,
  RefreshCw,
  Eye,
  X,
  Inbox,
  AlertCircle,
  Copy,
  Check,
  MessageSquare,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowLeft,
  User,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { adminApi } from "@/src/lib/api";
import {
  ContactMessage,
  DashboardStats,
  LeadSource,
  MessageStatus,
  AdminUser,
  ChatSessionItem,
  ChatSessionDetail,
  ChatStats,
  ChatSessionStatus,
} from "@/src/types/admin";

type RealtimeChatStatus = "live" | "browsing" | "inactive" | "ended";

function getSessionRealtimeStatus(session: {
  status: ChatSessionStatus;
  messageCount?: number;
  lastActivityAt?: string | Date;
  updatedAt?: string | Date;
  createdAt?: string | Date;
}): {
  key: RealtimeChatStatus;
  label: string;
  badgeClass: string;
  dotClass: string;
  pulse: boolean;
} {
  if (session.status === "ended") {
    return {
      key: "ended",
      label: "Ended",
      badgeClass: "bg-slate-500/15 border-slate-500/30 text-slate-400",
      dotClass: "bg-slate-400",
      pulse: false,
    };
  }

  if (session.status === "archived") {
    return {
      key: "ended",
      label: "Archived",
      badgeClass: "bg-zinc-500/15 border-zinc-500/30 text-zinc-400",
      dotClass: "bg-zinc-400",
      pulse: false,
    };
  }

  // Calculate age since last activity
  const now = Date.now();
  const lastTime = new Date(
    session.lastActivityAt || session.updatedAt || session.createdAt || now
  ).getTime();
  const diffSec = Math.floor((now - lastTime) / 1000);

  // If status is inactive or more than 5 minutes has elapsed without heartbeat
  if (session.status === "inactive" || diffSec > 300) {
    return {
      key: "inactive",
      label: "Inactive",
      badgeClass: "bg-amber-500/15 border-amber-500/30 text-amber-400",
      dotClass: "bg-amber-400",
      pulse: false,
    };
  }

  // If visitor has sent 0 messages (browsing / looking at chat)
  if ((session.messageCount ?? 0) === 0) {
    return {
      key: "browsing",
      label: "Browsing",
      badgeClass: "bg-yellow-400/15 border-yellow-400/30 text-yellow-300",
      dotClass: "bg-yellow-400",
      pulse: true,
    };
  }

  // Actively interacting with messages within last 5 minutes
  return {
    key: "live",
    label: "Live Now",
    badgeClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    dotClass: "bg-emerald-400",
    pulse: true,
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Authentication State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<"contacts" | "chat_sessions">("contacts");

  // ==========================================
  // Contact Messages State
  // ==========================================
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    unreadCount: 0,
    contactFormCount: 0,
    chatbotCount: 0,
  });
  const [contactSearchQuery, setContactSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | LeadSource>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | MessageStatus>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // ==========================================
  // Chatbot Sessions State
  // ==========================================
  const [chatSessions, setChatSessions] = useState<ChatSessionItem[]>([]);
  const [chatStats, setChatStats] = useState<ChatStats>({
    totalSessions: 0,
    activeSessions: 0,
    endedSessions: 0,
    sessionsWithLeads: 0,
    totalMessages: 0,
    avgMessagesPerSession: 0,
  });
  const [chatMeta, setChatMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasMore: false,
  });

  // Chat Sessions Filters
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [chatStatusFilter, setChatStatusFilter] = useState<"all" | ChatSessionStatus>("all");
  const [chatLeadFilter, setChatLeadFilter] = useState<"all" | "true" | "false">("all");
  const [chatStartDate, setChatStartDate] = useState("");
  const [chatEndDate, setChatEndDate] = useState("");
  const [chatSortBy, setChatSortBy] = useState<"lastActivityAt" | "startedAt" | "messageCount">("lastActivityAt");
  const [chatSortOrder, setChatSortOrder] = useState<"desc" | "asc">("desc");
  const [chatPage, setChatPage] = useState(1);
  const [chatLimit, setChatLimit] = useState(10);

  // Selected Session for Full Conversation View
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionDetail, setSessionDetail] = useState<ChatSessionDetail | null>(null);
  const [isLoadingSessionDetail, setIsLoadingSessionDetail] = useState(false);

  // Common UI State
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedSessionId, setCopiedSessionId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Verify Admin Session on Mount
  useEffect(() => {
    let isMounted = true;
    adminApi.getMe().then((meRes) => {
      if (!isMounted) return;
      if (!meRes.success || !meRes.user) {
        router.push("/login");
        return;
      }
      setAdminUser(meRes.user);
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Fetch Contact Messages & Stats
  const fetchContactsData = useCallback(async () => {
    try {
      const [contactsRes, statsRes] = await Promise.all([
        adminApi.getContacts(sourceFilter, statusFilter),
        adminApi.getStats(),
      ]);

      if (contactsRes.success && contactsRes.data) {
        setMessages(contactsRes.data);
      } else if (contactsRes.error?.includes("Unauthorized")) {
        router.push("/login");
        return;
      }

      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }
    } catch {
      setErrorMsg("Failed to fetch contact inquiries.");
    }
  }, [router, sourceFilter, statusFilter]);

  // Fetch Chatbot Sessions & Stats
  const fetchChatSessionsData = useCallback(async () => {
    try {
      const [sessionsRes, statsRes] = await Promise.all([
        adminApi.getChatSessions({
          page: chatPage,
          limit: chatLimit,
          search: chatSearchQuery,
          status: chatStatusFilter,
          hasLead: chatLeadFilter,
          startDate: chatStartDate || undefined,
          endDate: chatEndDate || undefined,
          sortBy: chatSortBy,
          sortOrder: chatSortOrder,
        }),
        adminApi.getChatStats(),
      ]);

      if (sessionsRes.success && sessionsRes.data) {
        setChatSessions(sessionsRes.data);
        if (sessionsRes.meta) {
          setChatMeta(sessionsRes.meta);
        }
      } else if (sessionsRes.error?.includes("Unauthorized")) {
        router.push("/login");
        return;
      }

      if (statsRes.success && statsRes.data?.stats) {
        setChatStats(statsRes.data.stats);
      }
    } catch {
      setErrorMsg("Failed to fetch chatbot conversation sessions.");
    }
  }, [
    router,
    chatPage,
    chatLimit,
    chatSearchQuery,
    chatStatusFilter,
    chatLeadFilter,
    chatStartDate,
    chatEndDate,
    chatSortBy,
    chatSortOrder,
  ]);

  // Master Data Loader triggered on filter change or tab switch
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        if (activeTab === "contacts") {
          await fetchContactsData();
          const res = await adminApi.getChatStats();
          if (isMounted && res.success && res.data?.stats) {
            setChatStats(res.data.stats);
          }
        } else {
          await fetchChatSessionsData();
          const res = await adminApi.getStats();
          if (isMounted && res.success && res.stats) {
            setStats(res.stats);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [activeTab, fetchContactsData, fetchChatSessionsData]);

  // Manual Refresh Handler
  const handleManualRefresh = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      if (activeTab === "contacts") {
        await fetchContactsData();
      } else {
        await fetchChatSessionsData();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      router.push("/login");
    }
  };

  // Open Chat Session Details Drawer
  const handleOpenSessionDetail = async (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setIsLoadingSessionDetail(true);
    try {
      const res = await adminApi.getChatSessionById(sessionId);
      if (res.success && res.data) {
        setSessionDetail(res.data);
      } else {
        setErrorMsg(res.error || "Failed to load session conversation details.");
      }
    } catch {
      setErrorMsg("Failed to load session conversation details.");
    } finally {
      setIsLoadingSessionDetail(false);
    }
  };

  // Close Session Details Drawer
  const handleCloseSessionDetail = () => {
    setSelectedSessionId(null);
    setSessionDetail(null);
  };

  // Update Chat Session Status
  const handleUpdateSessionStatus = async (
    sessionId: string,
    newStatus: ChatSessionStatus
  ) => {
    setIsUpdating(true);
    try {
      const res = await adminApi.updateChatSessionStatus(sessionId, newStatus);
      if (res.success) {
        setChatSessions((prev) =>
          prev.map((s) => (s.sessionId === sessionId ? { ...s, status: newStatus } : s))
        );
        if (sessionDetail && sessionDetail.sessionId === sessionId) {
          setSessionDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        // Refresh KPI stats
        const statsRes = await adminApi.getChatStats();
        if (statsRes.success && statsRes.data?.stats) {
          setChatStats(statsRes.data.stats);
        }
      } else {
        setErrorMsg(res.error || "Failed to update session status.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Chat Session
  const handleDeleteChatSession = async (sessionId: string) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete session ${sessionId}? This cannot be undone.`
      )
    )
      return;

    setIsUpdating(true);
    try {
      const res = await adminApi.deleteChatSession(sessionId);
      if (res.success) {
        setChatSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
        if (selectedSessionId === sessionId) {
          handleCloseSessionDetail();
        }
        // Refresh KPI stats
        const statsRes = await adminApi.getChatStats();
        if (statsRes.success && statsRes.data?.stats) {
          setChatStats(statsRes.data.stats);
        }
      } else {
        setErrorMsg(res.error || "Failed to delete chatbot session.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Copy Session ID Helper
  const handleCopySessionId = (sid: string) => {
    navigator.clipboard.writeText(sid);
    setCopiedSessionId(sid);
    setTimeout(() => setCopiedSessionId(null), 2000);
  };

  // Toggle Read / Unread Status for Contact Messages
  const handleToggleContactStatus = async (msg: ContactMessage, newStatus: MessageStatus) => {
    setIsUpdating(true);
    try {
      const res = await adminApi.updateStatus(msg._id, newStatus);
      if (res.success) {
        setMessages((prev) =>
          prev.map((item) => (item._id === msg._id ? { ...item, status: newStatus } : item))
        );
        if (selectedMessage && selectedMessage._id === msg._id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        const statsRes = await adminApi.getStats();
        if (statsRes.success && statsRes.stats) setStats(statsRes.stats);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Contact Message
  const handleDeleteContactMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    setIsUpdating(true);
    try {
      const res = await adminApi.deleteContact(id);
      if (res.success) {
        setMessages((prev) => prev.filter((item) => item._id !== id));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
        const statsRes = await adminApi.getStats();
        if (statsRes.success && statsRes.stats) setStats(statsRes.stats);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Client-side filtering for Contact Messages
  const filteredMessages = messages.filter((msg) => {
    const q = contactSearchQuery.toLowerCase();
    const matchesSearch =
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      (msg.subject && msg.subject.toLowerCase().includes(q)) ||
      msg.message.toLowerCase().includes(q);

    const matchesSource = sourceFilter === "all" || msg.source === sourceFilter;
    const matchesStatus = statusFilter === "all" || msg.status === statusFilter;

    return matchesSearch && matchesSource && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-white font-mono shadow-md shadow-cyan-500/20">
            PA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Portfolio Admin Center
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live MongoDB
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Manage Contact Form Inquiries & AI Chatbot Conversation Sessions
            </p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          {adminUser && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs">
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-slate-200">{adminUser.name || adminUser.email}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {adminUser.role || "Admin"}
              </span>
            </div>
          )}

          {/* Back to Live Portfolio Link */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 text-xs font-semibold transition-all cursor-pointer shadow-sm hover:shadow-cyan-500/10"
            title="Return to Main Portfolio"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Live Portfolio</span>
          </Link>

          <button
            onClick={handleManualRefresh}
            title="Refresh Live Data"
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
            {/* Tab 1: Contact Inquiries */}
            <button
              onClick={() => {
                setActiveTab("contacts");
                setIsLoading(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "contacts"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Contact Messages</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-mono ${
                  activeTab === "contacts"
                    ? "bg-white/20 text-white"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {stats.totalMessages}
              </span>
            </button>

            {/* Tab 2: Chatbot Conversation Sessions */}
            <button
              onClick={() => {
                setActiveTab("chat_sessions");
                setIsLoading(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "chat_sessions"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Chatbot Sessions</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-mono ${
                  activeTab === "chat_sessions"
                    ? "bg-white/20 text-white"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {chatStats.totalSessions}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Section:</span>
            <span className="font-semibold text-cyan-400 uppercase">
              {activeTab === "contacts" ? "Inquiries & Leads" : "Persistent Chatbot Sessions"}
            </span>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-semibold text-rose-300 text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: CHATBOT SESSIONS MANAGEMENT                                       */}
        {/* ========================================================================= */}
        {activeTab === "chat_sessions" && (
          <div className="space-y-6">
            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Card 1: Total Sessions */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Sessions
                  </span>
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Bot className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight">
                  {chatStats.totalSessions}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Unique visitor conversation threads</p>
              </div>

              {/* Card 2: Active Sessions */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Active Sessions
                  </span>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                  {chatStats.activeSessions}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Ongoing conversations in progress</p>
              </div>

              {/* Card 3: Sessions with Leads */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Captured Leads
                  </span>
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-purple-400 tracking-tight">
                  {chatStats.sessionsWithLeads}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Visitors who provided name/email</p>
              </div>

              {/* Card 4: Total Messages */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Messages
                  </span>
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-blue-400 tracking-tight">
                  {chatStats.totalMessages}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Avg {chatStats.avgMessagesPerSession} msgs per session
                </p>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="space-y-3 bg-slate-900/60 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={chatSearchQuery}
                    onChange={(e) => {
                      setChatSearchQuery(e.target.value);
                      setChatPage(1);
                      setIsLoading(true);
                    }}
                    placeholder="Search by Session ID (cs_...), visitor name, email, or message text..."
                    className="w-full bg-slate-950/80 border border-white/10 focus:border-cyan-500/60 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Dropdown */}
                  <select
                    value={chatStatusFilter}
                    onChange={(e) => {
                      setChatStatusFilter(e.target.value as "all" | ChatSessionStatus);
                      setChatPage(1);
                      setIsLoading(true);
                    }}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer hover:border-cyan-500/40"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive</option>
                    <option value="ended">Ended</option>
                    <option value="archived">Archived</option>
                  </select>

                  {/* Lead Dropdown */}
                  <select
                    value={chatLeadFilter}
                    onChange={(e) => {
                      setChatLeadFilter(e.target.value as "all" | "true" | "false");
                      setChatPage(1);
                      setIsLoading(true);
                    }}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer hover:border-cyan-500/40"
                  >
                    <option value="all">All Visitors</option>
                    <option value="true">With Contact Leads</option>
                    <option value="false">Anonymous Only</option>
                  </select>

                  {/* Sort By Dropdown */}
                  <select
                    value={chatSortBy}
                    onChange={(e) => {
                      setChatSortBy(e.target.value as "lastActivityAt" | "startedAt" | "messageCount");
                      setIsLoading(true);
                    }}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer hover:border-cyan-500/40"
                  >
                    <option value="lastActivityAt">Sort: Last Activity</option>
                    <option value="startedAt">Sort: Start Time</option>
                    <option value="messageCount">Sort: Message Count</option>
                  </select>

                  {/* Sort Direction Toggle */}
                  <button
                    onClick={() => {
                      setChatSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
                      setIsLoading(true);
                    }}
                    title={`Sort direction: ${chatSortOrder}`}
                    className="p-2 rounded-xl bg-slate-950 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>{chatSortOrder.toUpperCase()}</span>
                  </button>
                </div>
              </div>

              {/* Date Filters Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
                <div className="flex flex-wrap items-center gap-2 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Date Range:</span>
                  <input
                    type="date"
                    value={chatStartDate}
                    onChange={(e) => {
                      setChatStartDate(e.target.value);
                      setChatPage(1);
                      setIsLoading(true);
                    }}
                    className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300 outline-none"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={chatEndDate}
                    onChange={(e) => {
                      setChatEndDate(e.target.value);
                      setChatPage(1);
                      setIsLoading(true);
                    }}
                    className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300 outline-none"
                  />
                  {(chatStartDate || chatEndDate || chatSearchQuery || chatStatusFilter !== "all" || chatLeadFilter !== "all") && (
                    <button
                      onClick={() => {
                        setChatStartDate("");
                        setChatEndDate("");
                        setChatSearchQuery("");
                        setChatStatusFilter("all");
                        setChatLeadFilter("all");
                        setChatPage(1);
                        setIsLoading(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span>Show per page:</span>
                  <select
                    value={chatLimit}
                    onChange={(e) => {
                      setChatLimit(parseInt(e.target.value, 10));
                      setChatPage(1);
                      setIsLoading(true);
                    }}
                    className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-300 outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Chatbot Sessions Data Table */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden backdrop-blur-md shadow-xl">
              {isLoading ? (
                <div className="py-24 text-center space-y-3">
                  <div className="w-9 h-9 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Loading conversation sessions from MongoDB...</p>
                </div>
              ) : chatSessions.length === 0 ? (
                <div className="py-24 text-center space-y-2">
                  <Bot className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-300">No Chatbot Sessions Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {chatSearchQuery || chatStatusFilter !== "all" || chatStartDate
                      ? "No sessions match your filter criteria. Try clearing search or dates."
                      : "Whenever a visitor chats with Raghav's AI Assistant on the portfolio, the complete conversation session is saved here in real-time."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-slate-950/80 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold">Session ID</th>
                        <th className="py-3.5 px-4 font-semibold">Visitor & Lead Info</th>
                        <th className="py-3.5 px-4 font-semibold">Messages</th>
                        <th className="py-3.5 px-4 font-semibold">Linked Lead</th>
                        <th className="py-3.5 px-4 font-semibold">Started At</th>
                        <th className="py-3.5 px-4 font-semibold">Last Activity</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-slate-200">
                      {chatSessions.map((session) => (
                        <tr
                          key={session._id}
                          className="hover:bg-white/5 transition-colors group"
                        >
                          {/* Status Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {(() => {
                              const s = getSessionRealtimeStatus(session);
                              return (
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${s.badgeClass}`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${s.dotClass} ${
                                      s.pulse ? "animate-pulse" : ""
                                    }`}
                                  />
                                  {s.label}
                                </span>
                              );
                            })()}
                          </td>

                          {/* Session ID */}
                          <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <span className="text-cyan-400 font-semibold">
                                {session.sessionId}
                              </span>
                              <button
                                onClick={() => handleCopySessionId(session.sessionId)}
                                title="Copy Session ID"
                                className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-cyan-300 transition-colors"
                              >
                                {copiedSessionId === session.sessionId ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Visitor & Lead Info */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="space-y-0.5">
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <User className="w-3 h-3 text-slate-400" />
                                <span>{session.visitorInfo?.name || "Anonymous Visitor"}</span>
                              </div>
                              {session.visitorInfo?.email ? (
                                <a
                                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                                    session.visitorInfo.email
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] font-mono text-purple-300 hover:underline flex items-center gap-1"
                                  title="Send email via Gmail"
                                >
                                  <Mail className="w-2.5 h-2.5" />
                                  <span>{session.visitorInfo.email}</span>
                                </a>
                              ) : (
                                <span className="text-[10px] font-mono text-slate-500">
                                  No email provided
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Message Count */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono text-[11px] font-semibold">
                              <MessageSquare className="w-3 h-3" />
                              <span>{session.messageCount} msgs</span>
                            </span>
                          </td>

                          {/* Associated Contact Lead Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {session.associatedContactId ? (
                              <span
                                title="Linked with a direct contact form inquiry"
                                className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Linked Lead</span>
                              </span>
                            ) : session.visitorInfo?.email ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                                <Sparkles className="w-3 h-3" />
                                <span>Email Captured</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-500 font-mono">—</span>
                            )}
                          </td>

                          {/* Started At */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                            {new Date(session.startedAt || session.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </td>

                          {/* Last Activity */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                            {new Date(session.lastActivityAt || session.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenSessionDetail(session.sessionId)}
                                title="View Complete Conversation History"
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Chat</span>
                              </button>

                              {/* Quick Status Dropdown Menu */}
                              <select
                                value={session.status}
                                onChange={(e) =>
                                  handleUpdateSessionStatus(
                                    session.sessionId,
                                    e.target.value as ChatSessionStatus
                                  )
                                }
                                disabled={isUpdating}
                                className="bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-slate-300 outline-none cursor-pointer"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="ended">Ended</option>
                                <option value="archived">Archived</option>
                              </select>

                              <button
                                onClick={() => handleDeleteChatSession(session.sessionId)}
                                disabled={isUpdating}
                                title="Delete Conversation Session"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-rose-400 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              {chatMeta.totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 border-t border-white/10 bg-slate-950/60 text-xs">
                  <div className="text-slate-400 font-mono">
                    Showing {(chatMeta.page - 1) * chatMeta.limit + 1} to{" "}
                    {Math.min(chatMeta.page * chatMeta.limit, chatMeta.total)} of{" "}
                    {chatMeta.total} sessions
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setChatPage((p) => Math.max(1, p - 1));
                        setIsLoading(true);
                      }}
                      disabled={chatMeta.page <= 1}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/40 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>

                    <span className="font-mono text-cyan-400 px-2 font-bold">
                      Page {chatMeta.page} of {chatMeta.totalPages}
                    </span>

                    <button
                      onClick={() => {
                        setChatPage((p) => Math.min(chatMeta.totalPages, p + 1));
                        setIsLoading(true);
                      }}
                      disabled={chatMeta.page >= chatMeta.totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/40 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: CONTACT MESSAGES MANAGEMENT (EXISTING FLOW ENHANCED)              */}
        {/* ========================================================================= */}
        {activeTab === "contacts" && (
          <div className="space-y-6">
            {/* KPI Metrics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Card 1: Total Messages */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Submissions
                  </span>
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Inbox className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight">
                  {stats.totalMessages}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">All leads captured across portfolio</p>
              </div>

              {/* Card 2: Contact Form Submissions */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Contact Form Leads
                  </span>
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight">
                  {stats.contactFormCount}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Direct contact form inquiries</p>
              </div>

              {/* Card 3: Chatbot Leads */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    AI Chatbot Leads
                  </span>
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <Bot className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight">
                  {stats.chatbotCount}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Quick Connect card leads</p>
              </div>

              {/* Card 4: Unread Count */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Pending Unread
                  </span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-amber-400 tracking-tight">
                  {stats.unreadCount}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Messages requiring your response</p>
              </div>
            </div>

            {/* Filter Toolbar & Search */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={contactSearchQuery}
                  onChange={(e) => setContactSearchQuery(e.target.value)}
                  placeholder="Search by client name, email, subject, or message content..."
                  className="w-full bg-slate-950/80 border border-white/10 focus:border-cyan-500/60 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setSourceFilter("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      sourceFilter === "all"
                        ? "bg-cyan-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    All Sources
                  </button>
                  <button
                    onClick={() => setSourceFilter("contact_form")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      sourceFilter === "contact_form"
                        ? "bg-cyan-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Contact Form
                  </button>
                  <button
                    onClick={() => setSourceFilter("chatbot")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      sourceFilter === "chatbot"
                        ? "bg-cyan-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Chatbot
                  </button>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all" | MessageStatus)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none cursor-pointer hover:border-cyan-500/40"
                >
                  <option value="all">All Statuses</option>
                  <option value="unread">Unread Only</option>
                  <option value="read">Read Only</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Messages Data Table */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden backdrop-blur-md shadow-xl">
              {isLoading ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Fetching live leads from database...</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="py-20 text-center space-y-2">
                  <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-300">No Messages Found</h3>
                  <p className="text-xs text-slate-500">
                    {contactSearchQuery || sourceFilter !== "all" || statusFilter !== "all"
                      ? "Try adjusting your search query or filters."
                      : "Messages submitted via the contact form or chatbot will appear here."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-slate-950/80 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                        <th className="py-3.5 px-4 font-semibold">Source</th>
                        <th className="py-3.5 px-4 font-semibold">Client Name</th>
                        <th className="py-3.5 px-4 font-semibold">Email</th>
                        <th className="py-3.5 px-4 font-semibold">Subject / Preview</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold">Received Date</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-slate-200">
                      {filteredMessages.map((msg) => (
                        <tr
                          key={msg._id}
                          className={`hover:bg-white/5 transition-colors ${
                            msg.status === "unread" ? "bg-cyan-500/5 font-medium" : ""
                          }`}
                        >
                          {/* Source Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {msg.source === "chatbot" ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                                <Bot className="w-3 h-3" />
                                <span>Chatbot</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                                <Mail className="w-3 h-3" />
                                <span>Contact Form</span>
                              </span>
                            )}
                          </td>

                          {/* Name */}
                          <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                            {msg.name}
                          </td>

                          {/* Email */}
                          <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                            {msg.email}
                          </td>

                          {/* Subject / Message Snippet */}
                          <td className="py-3.5 px-4 max-w-xs truncate text-slate-400">
                            {msg.subject ? (
                              <span>
                                <strong className="text-slate-200">{msg.subject}: </strong>
                                {msg.message}
                              </span>
                            ) : (
                              msg.message
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {msg.status === "unread" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                                ● Unread
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                                ✓ Read
                              </span>
                            )}
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                            {new Date(msg.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {msg.chatSessionId && (
                                <button
                                  onClick={() => {
                                    setActiveTab("chat_sessions");
                                    handleOpenSessionDetail(msg.chatSessionId!);
                                  }}
                                  title="View Linked Chatbot Session"
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400 transition-colors cursor-pointer"
                                >
                                  <Bot className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => setSelectedMessage(msg)}
                                title="View Full Details"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() =>
                                  handleToggleContactStatus(
                                    msg,
                                    msg.status === "unread" ? "read" : "unread"
                                  )
                                }
                                disabled={isUpdating}
                                title={msg.status === "unread" ? "Mark as Read" : "Mark as Unread"}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteContactMessage(msg._id)}
                                disabled={isUpdating}
                                title="Delete Message"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-rose-400 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: COMPLETE CHATBOT CONVERSATION SESSION DRAWER                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedSessionId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border border-white/15 bg-slate-900 shadow-2xl shadow-cyan-500/10 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="border-b border-white/10 bg-slate-950/80 px-6 py-4 flex items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Bot className="w-4 h-4" />
                    </span>
                    <h2 className="text-base font-bold text-white tracking-tight truncate">
                      Chatbot Conversation Transcript
                    </h2>
                    {sessionDetail && (() => {
                      const s = getSessionRealtimeStatus(sessionDetail);
                      return (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border inline-flex items-center gap-1.5 ${s.badgeClass}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${s.dotClass} ${
                              s.pulse ? "animate-pulse" : ""
                            }`}
                          />
                          {s.label}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span>Session ID:</span>
                    <span className="text-cyan-400 font-semibold">{selectedSessionId}</span>
                    <button
                      onClick={() => handleCopySessionId(selectedSessionId)}
                      title="Copy Session ID"
                      className="p-0.5 hover:text-white"
                    >
                      {copiedSessionId === selectedSessionId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleCloseSessionDetail}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {isLoadingSessionDetail ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
                    <p className="text-xs text-slate-400">Loading full message history...</p>
                  </div>
                ) : sessionDetail ? (
                  <>
                    {/* Visitor Metadata Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Visitor Name</span>
                        <span className="font-bold text-white text-sm">
                          {sessionDetail.visitorInfo?.name || "Anonymous Visitor"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Visitor Email</span>
                        {sessionDetail.visitorInfo?.email ? (
                          <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                              sessionDetail.visitorInfo.email
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-purple-300 hover:underline block truncate"
                            title="Send email via Gmail"
                          >
                            {sessionDetail.visitorInfo.email}
                          </a>
                        ) : (
                          <span className="text-slate-500 font-mono">Not provided</span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Started & Last Active</span>
                        <span className="text-slate-300 font-mono text-[11px] block">
                          {new Date(sessionDetail.startedAt).toLocaleTimeString()} →{" "}
                          {new Date(sessionDetail.lastActivityAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    {/* Linked Contact Submission (if any) */}
                    {sessionDetail.associatedContactId && (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Linked Contact Inquiry Received</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-300/80">
                            {new Date(sessionDetail.associatedContactId.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {sessionDetail.associatedContactId.subject && (
                          <div className="text-xs font-semibold text-emerald-200">
                            Subject: {sessionDetail.associatedContactId.subject}
                          </div>
                        )}
                        {sessionDetail.associatedContactId.message && (
                          <p className="text-xs text-emerald-100/90 whitespace-pre-wrap leading-relaxed bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20">
                            {sessionDetail.associatedContactId.message}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Chronological Messages Transcript */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                          Chronological Conversation ({sessionDetail.messages?.length || 0} messages)
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          All exchanges stored securely
                        </span>
                      </div>

                      {sessionDetail.messages && sessionDetail.messages.length > 0 ? (
                        <div className="space-y-4 pt-2">
                          {sessionDetail.messages.map((msg, index) => {
                            const isUser = msg.sender === "user";
                            return (
                              <div
                                key={msg.id || index}
                                className={`flex flex-col ${
                                  isUser ? "items-end" : "items-start"
                                }`}
                              >
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mb-1">
                                  {isUser ? (
                                    <>
                                      <span>Visitor</span>
                                      <User className="w-3 h-3 text-blue-400" />
                                    </>
                                  ) : (
                                    <>
                                      <Bot className="w-3 h-3 text-cyan-400" />
                                      <span>Raghav&apos;s Assistant</span>
                                      {typeof msg.metadata?.source === "string" && (
                                        <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[9px]">
                                          {msg.metadata.source}
                                        </span>
                                      )}
                                    </>
                                  )}
                                  <span className="text-slate-500">
                                    • {new Date(msg.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>

                                <div
                                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-lg whitespace-pre-wrap ${
                                    isUser
                                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                                      : "bg-slate-950 border border-white/15 text-slate-200 rounded-bl-none shadow-black/40"
                                  }`}
                                >
                                  {msg.text}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-10 text-center text-xs text-slate-500">
                          No messages recorded in this session yet.
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-white/10 bg-slate-950/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Status:</span>
                  <button
                    onClick={() =>
                      handleUpdateSessionStatus(
                        sessionDetail!.sessionId,
                        sessionDetail?.status === "active" ? "ended" : "active"
                      )
                    }
                    disabled={isUpdating || !sessionDetail}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {sessionDetail?.status === "active" ? "Mark Ended" : "Mark Active"}
                  </button>

                  <button
                    onClick={() =>
                      handleUpdateSessionStatus(sessionDetail!.sessionId, "archived")
                    }
                    disabled={isUpdating || !sessionDetail}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-slate-950 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Archive
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteChatSession(sessionDetail!.sessionId)}
                    disabled={isUpdating || !sessionDetail}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Session</span>
                  </button>

                  <button
                    onClick={handleCloseSessionDetail}
                    className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: CONTACT MESSAGE DETAILS DRAWER                                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl border border-white/15 bg-slate-900 p-6 shadow-2xl space-y-5 relative"
            >
              <button
                onClick={() => setSelectedMessage(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      selectedMessage.source === "chatbot"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {selectedMessage.source === "chatbot" ? "Chatbot Lead" : "Contact Form Lead"}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedMessage.name}</h2>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    selectedMessage.email
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-cyan-400 hover:underline block"
                  title="Send email via Gmail"
                >
                  {selectedMessage.email}
                </a>
              </div>

              {selectedMessage.subject && (
                <div className="rounded-xl bg-slate-950 border border-white/10 p-3">
                  <span className="text-[10px] text-slate-400 font-mono block">SUBJECT</span>
                  <span className="text-xs font-semibold text-slate-200">
                    {selectedMessage.subject}
                  </span>
                </div>
              )}

              <div className="rounded-2xl bg-slate-950 border border-white/10 p-4 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">MESSAGE CONTENT</span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              {selectedMessage.chatSessionId && (
                <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 p-3 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-purple-300 font-semibold block">Originating Chat Session</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {selectedMessage.chatSessionId}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const sid = selectedMessage.chatSessionId!;
                      setSelectedMessage(null);
                      setActiveTab("chat_sessions");
                      handleOpenSessionDetail(sid);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500 text-purple-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Inspect Chat</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() =>
                    handleToggleContactStatus(
                      selectedMessage,
                      selectedMessage.status === "unread" ? "read" : "unread"
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {selectedMessage.status === "unread" ? "Mark as Read" : "Mark as Unread"}
                </button>

                <div className="flex items-center gap-2">
                  {/* Copy Email Button */}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedMessage.email);
                      setCopiedEmail(selectedMessage.email);
                      setTimeout(() => setCopiedEmail(null), 2000);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    title="Copy Email Address"
                  >
                    {copiedEmail === selectedMessage.email ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>

                  {/* Direct Web Gmail Compose */}
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                      selectedMessage.email
                    )}&su=${encodeURIComponent(
                      `Re: ${selectedMessage.subject || "Your message on Raghav's Portfolio"}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-500/20 inline-flex items-center gap-1.5 cursor-pointer"
                    title="Open Gmail in new tab to reply"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Gmail</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
