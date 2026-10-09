"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { adminApi } from "@/src/lib/api";
import { ContactMessage, DashboardStats, LeadSource, MessageStatus } from "@/src/types/admin";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    unreadCount: 0,
    contactFormCount: 0,
    chatbotCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | LeadSource>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | MessageStatus>("all");

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch dashboard data asynchronously when dependencies change
  useEffect(() => {
    let isMounted = true;

    if (!adminApi.isLoggedIn()) {
      router.push("/login");
      return;
    }

    Promise.all([
      adminApi.getContacts(sourceFilter, statusFilter),
      adminApi.getStats(),
    ])
      .then(([contactsRes, statsRes]) => {
        if (!isMounted) return;

        if (contactsRes.success && contactsRes.data) {
          setMessages(contactsRes.data);
          setErrorMsg("");
        } else if (contactsRes.error) {
          if (contactsRes.error.includes("Unauthorized")) {
            router.push("/login");
            return;
          }
          setErrorMsg(contactsRes.error);
        }

        if (statsRes.success && statsRes.stats) {
          setStats(statsRes.stats);
        }
      })
      .catch(() => {
        if (isMounted) {
          setErrorMsg("Failed to load dashboard data.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [router, sourceFilter, statusFilter]);

  // Handle Manual Refresh button click
  const handleManualRefresh = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const [contactsRes, statsRes] = await Promise.all([
        adminApi.getContacts(sourceFilter, statusFilter),
        adminApi.getStats(),
      ]);

      if (contactsRes.success && contactsRes.data) {
        setMessages(contactsRes.data);
      } else if (contactsRes.error) {
        if (contactsRes.error.includes("Unauthorized")) {
          router.push("/login");
          return;
        }
        setErrorMsg(contactsRes.error);
      }

      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }
    } catch {
      setErrorMsg("Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    adminApi.logout();
    router.push("/login");
  };

  // Toggle Read / Unread Status
  const handleToggleStatus = async (msg: ContactMessage, newStatus: MessageStatus) => {
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
        // Refresh stats
        const statsRes = await adminApi.getStats();
        if (statsRes.success && statsRes.stats) setStats(statsRes.stats);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setIsUpdating(true);
    try {
      const res = await adminApi.deleteContact(id);
      if (res.success) {
        setMessages((prev) => prev.filter((item) => item._id !== id));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
        // Refresh stats
        const statsRes = await adminApi.getStats();
        if (statsRes.success && statsRes.stats) setStats(statsRes.stats);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter messages by search query
  const filteredMessages = messages.filter((msg) => {
    const q = searchQuery.toLowerCase();
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
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-extrabold text-white font-mono shadow-md shadow-cyan-500/20">
            PA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Portfolio Admin Center
              </h1>
              <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono text-cyan-400 font-semibold">
                Live Data
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Manage Contact Form Submissions & Chatbot Leads
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            title="Refresh Data"
            className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
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
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, email, subject, or message content..."
              className="w-full bg-slate-950/80 border border-white/10 focus:border-cyan-500/60 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Source Tabs & Status Filters */}
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

            {/* Status Filter */}
            <div className="relative">
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
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-semibold text-rose-300 text-center">
            {errorMsg}
          </div>
        )}

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
                {searchQuery || sourceFilter !== "all" || statusFilter !== "all"
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
                          <button
                            onClick={() => setSelectedMessage(msg)}
                            title="View Full Details"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() =>
                              handleToggleStatus(
                                msg,
                                msg.status === "unread" ? "read" : "unread"
                              )
                            }
                            disabled={isUpdating}
                            title={msg.status === "unread" ? "Mark as Read" : "Mark as Unread"}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteMessage(msg._id)}
                            disabled={isUpdating}
                            title="Delete Message"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-rose-400 transition-colors"
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
      </main>

      {/* Message Modal Drawer */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl border border-white/15 bg-slate-900 p-6 shadow-2xl space-y-5 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMessage(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
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
                  href={`mailto:${selectedMessage.email}`}
                  className="text-xs font-mono text-cyan-400 hover:underline block"
                >
                  {selectedMessage.email}
                </a>
              </div>

              {/* Subject */}
              {selectedMessage.subject && (
                <div className="rounded-xl bg-slate-950 border border-white/10 p-3">
                  <span className="text-[10px] text-slate-400 font-mono block">SUBJECT</span>
                  <span className="text-xs font-semibold text-slate-200">
                    {selectedMessage.subject}
                  </span>
                </div>
              )}

              {/* Message Content */}
              <div className="rounded-2xl bg-slate-950 border border-white/10 p-4 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">MESSAGE CONTENT</span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() =>
                    handleToggleStatus(
                      selectedMessage,
                      selectedMessage.status === "unread" ? "read" : "unread"
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all"
                >
                  {selectedMessage.status === "unread" ? "Mark as Read" : "Mark as Unread"}
                </button>

                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject || "Your message on Raghav's Portfolio"
                  )}`}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all"
                >
                  Reply via Email
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
