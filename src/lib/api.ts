import { ContactsResponse, LoginResponse, RegisterResponse, DashboardStats } from "@/src/types/admin";

const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
};

// Helper for admin auth header
const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const adminApi = {
  // Login Admin
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_token", data.token);
        }
      }
      return data;
    } catch {
      return { success: false, error: "Network error connecting to backend server." };
    }
  },

  // Register Admin
  async register(name: string, email: string, password: string, adminSecret: string): Promise<RegisterResponse> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, adminSecret }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_token", data.token);
        }
      }
      return data;
    } catch {
      return { success: false, error: "Network error connecting to backend server." };
    }
  },

  // Check if logged in
  isLoggedIn(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("admin_token");
  },

  // Logout Admin
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
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
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        this.logout();
        return { success: false, error: "Unauthorized. Please login again." };
      }

      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: "Failed to fetch contact messages." };
    }
  },

  // Fetch Stats Overview
  async getStats(): Promise<{ success: boolean; stats?: DashboardStats; error?: string }> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/admin/stats`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        this.logout();
        return { success: false, error: "Unauthorized" };
      }

      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: "Failed to fetch dashboard statistics." };
    }
  },

  // Update Status (unread/read/archived)
  async updateStatus(id: string, status: "unread" | "read" | "archived"): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: "Failed to delete message." };
    }
  },
};
