import {
  AdminUser,
  ContactsResponse,
  LoginResponse,
  RegisterResponse,
  DashboardStats,
  ChatStatsResponse,
  ChatSessionsListResponse,
  ChatSessionDetailResponse,
  ChatSessionDetail,
  ChatSessionStatus,
} from "@/src/types/admin";

export const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
};

// Standard Anti-CSRF and content headers for all admin requests
const getAdminHeaders = (): HeadersInit => {
  return {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "X-Admin-Client": "portfolio-web",
  };
};

// ==========================================
// 1. Admin Management APIs (Protected)
// ==========================================
export const adminApi = {
  // Check Setup Status (Initial setup required or web registration enabled)
  async getSetupStatus(): Promise<{ success: boolean; isSetupRequired?: boolean; registrationEnabled?: boolean; hasAdmin?: boolean }> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/auth/setup-status`, {
        method: "GET",
        headers: getAdminHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      return { success: res.ok, ...(data.data || {}) };
    } catch {
      return { success: false, registrationEnabled: false, hasAdmin: true };
    }
  },

  // Login Admin (Sets HttpOnly session cookie)
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/auth/login`, {
        method: "POST",
        headers: getAdminHeaders(),
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      return {
        success: res.ok && data.success !== false,
        user: data.user || data.data?.user,
        error: res.ok ? undefined : (data.error || data.message || "Invalid credentials"),
      };
    } catch {
      return { success: false, error: "Network error connecting to backend server." };
    }
  },

  // Register Admin (Gated initial setup only)
  async register(name: string, email: string, password: string, adminSecret: string): Promise<RegisterResponse> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/auth/register`, {
        method: "POST",
        headers: getAdminHeaders(),
        credentials: "include",
        body: JSON.stringify({ name, email, password, adminSecret }),
      });
      const data = await res.json();
      return {
        success: res.ok && data.success !== false,
        user: data.user || data.data?.user,
        message: data.message,
        error: res.ok ? undefined : (data.error || data.message || "Registration failed"),
      };
    } catch {
      return { success: false, error: "Network error connecting to backend server." };
    }
  },

  // Verify Current Admin Profile via HttpOnly Cookie
  async getMe(): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/auth/me`, {
        method: "GET",
        headers: getAdminHeaders(),
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        return { success: false, error: "Unauthorized" };
      }

      const data = await res.json();
      return {
        success: res.ok && data.success !== false,
        user: data.user || data.data?.user,
        error: res.ok ? undefined : (data.error || data.message || "Unauthorized"),
      };
    } catch {
      return { success: false, error: "Failed to verify admin session." };
    }
  },

  // Logout Admin (Clears HttpOnly cookie and invalidates session server-side)
  async logout(): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/auth/logout`, {
        method: "POST",
        headers: getAdminHeaders(),
        credentials: "include",
      });
      return { success: res.ok };
    } catch {
      return { success: false };
    }
  },

  // Fetch all contact messages & leads
  async getContacts(filterSource?: string, filterStatus?: string): Promise<ContactsResponse> {
    try {
      const params = new URLSearchParams();
      if (filterSource && filterSource !== "all") params.append("source", filterSource);
      if (filterStatus && filterStatus !== "all") params.append("status", filterStatus);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`${getBackendUrl()}/api/admin/contacts${queryString}`, {
        method: "GET",
        headers: getAdminHeaders(),
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        return { success: false, error: "Unauthorized. Please login again." };
      }

      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: "Failed to fetch contact messages." };
    }
  },

  // Fetch Contact Stats Overview
  async getStats(): Promise<{ success: boolean; stats?: DashboardStats; error?: string }> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/admin/stats`, {
        method: "GET",
        headers: getAdminHeaders(),
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        return { success: false, error: "Unauthorized" };
      }

      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: "Failed to fetch dashboard statistics." };
    }
  },

  // Update Status (unread/read/archived/replied)
  async updateStatus(id: string, status: "unread" | "read" | "archived" | "replied"): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: getAdminHeaders(),
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: "Failed to update status." };
    }
  },

  // Delete message
  async deleteContact(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/admin/contacts/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
        credentials: "include",
      });

      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: "Failed to delete message." };
    }
  },

  // ==========================================
  // Chatbot Session Admin APIs
  // ==========================================

  // Fetch Chatbot KPI Stats
  async getChatStats(): Promise<ChatStatsResponse> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/admin/chat/stats`, {
        method: "GET",
        headers: getAdminHeaders(),
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        return { success: false, error: "Unauthorized" };
      }

      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: "Failed to fetch chatbot statistics." };
    }
  },

  // List Chatbot Conversation Sessions with search, date filters, pagination
  async getChatSessions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    hasLead?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ChatSessionsListResponse> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      if (params?.search && params.search.trim()) searchParams.append("search", params.search.trim());
      if (params?.status && params.status !== "all") searchParams.append("status", params.status);
      if (params?.hasLead && params.hasLead !== "all") searchParams.append("hasLead", params.hasLead);
      if (params?.startDate) searchParams.append("startDate", params.startDate);
      if (params?.endDate) searchParams.append("endDate", params.endDate);
      if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);

      const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";
      const res = await fetch(`${getBackendUrl()}/api/admin/chat/sessions${qs}`, {
        method: "GET",
        headers: getAdminHeaders(),
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        return { success: false, error: "Unauthorized. Please login again." };
      }

      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: "Failed to fetch chatbot conversation sessions." };
    }
  },

  // Get full chronological conversation history and details for a session
  async getChatSessionById(sessionId: string): Promise<ChatSessionDetailResponse> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/admin/chat/sessions/${encodeURIComponent(sessionId)}`, {
        method: "GET",
        headers: getAdminHeaders(),
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        return { success: false, error: "Unauthorized" };
      }

      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: "Failed to retrieve chatbot session history." };
    }
  },

  // Update session status (active, ended, archived)
  async updateChatSessionStatus(
    sessionId: string,
    status: ChatSessionStatus
  ): Promise<{ success: boolean; data?: { sessionId: string; status: ChatSessionStatus }; error?: string }> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/admin/chat/sessions/${encodeURIComponent(sessionId)}/status`, {
        method: "PATCH",
        headers: getAdminHeaders(),
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: "Failed to update session status." };
    }
  },

  // Delete chatbot session
  async deleteChatSession(sessionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/admin/chat/sessions/${encodeURIComponent(sessionId)}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
        credentials: "include",
      });

      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: "Failed to delete chatbot session." };
    }
  },
};

// ==========================================
// 2. Visitor Chatbot APIs (Public / Visitor)
// ==========================================
export const chatApi = {
  // Explicitly initialize a new visitor session
  async initSession(params?: {
    visitorId?: string;
    visitorName?: string;
    visitorEmail?: string;
  }): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/chat/session/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params || {}),
      });

      const data = await res.json();
      return {
        success: res.ok && data.success !== false,
        sessionId: data.data?.sessionId || data.sessionId,
        error: res.ok ? undefined : data.message,
      };
    } catch {
      return { success: false, error: "Network error initializing chat session." };
    }
  },

  // Send message to AI Chatbot with session tracking
  async sendMessage(params: {
    message: string;
    sessionId?: string | null;
    visitorId?: string | null;
    visitorName?: string | null;
    visitorEmail?: string | null;
    history?: Array<{ id: string; sender: "user" | "bot" | "system"; text: string }>;
  }): Promise<{
    success: boolean;
    sessionId?: string;
    response?: string;
    reply?: string;
    source?: string;
    error?: string;
  }> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.message || "Failed to process chat message.",
        };
      }

      return {
        success: true,
        sessionId: data.sessionId || data.data?.sessionId,
        response: data.response || data.reply || data.data?.reply,
        reply: data.reply || data.response || data.data?.reply,
        source: data.data?.source,
      };
    } catch {
      return { success: false, error: "Network error sending chat message." };
    }
  },

  // Retrieve chat session history for visitor reconnection / refresh
  async getSessionHistory(sessionId: string): Promise<{ success: boolean; session?: ChatSessionDetail; error?: string }> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/chat/session/${encodeURIComponent(sessionId)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        return { success: false, error: "Session history not found." };
      }

      const data = await res.json();
      return {
        success: true,
        session: data.data || data.session,
      };
    } catch {
      return { success: false, error: "Network error fetching session history." };
    }
  },

  // Update visitor details on ongoing session
  async updateVisitor(
    sessionId: string,
    details: { name?: string; email?: string }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/chat/session/${encodeURIComponent(sessionId)}/visitor`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });

      const data = await res.json();
      return { success: res.ok, error: res.ok ? undefined : data.message };
    } catch {
      return { success: false, error: "Network error updating visitor details." };
    }
  },
};

