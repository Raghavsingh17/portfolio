export type LeadSource = "contact_form" | "chatbot";
export type MessageStatus = "unread" | "read" | "archived";

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  source: LeadSource;
  status: MessageStatus;
  chatSessionId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalMessages: number;
  unreadCount: number;
  contactFormCount: number;
  chatbotCount: number;
}

export interface AdminUser {
  id?: string;
  email: string;
  name?: string;
  role?: string;
  lastLoginAt?: string;
  lastLoginIP?: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: AdminUser;
  message?: string;
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  token?: string;
  user?: AdminUser;
  message?: string;
  error?: string;
}

export interface ContactsResponse {
  success: boolean;
  data?: ContactMessage[];
  stats?: DashboardStats;
  total?: number;
  error?: string;
}

// ==========================================
// Chatbot Conversation Session Types
// ==========================================

export type ChatSessionStatus = "active" | "ended" | "archived";

export interface ChatSessionVisitorInfo {
  name: string;
  email?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface ChatSessionMessage {
  id: string;
  sender: "user" | "bot" | "system";
  text: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface AssociatedContact {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message?: string;
  status: string;
  source?: string;
  createdAt: string;
}

export interface ChatSessionItem {
  _id: string;
  sessionId: string;
  visitorId?: string | null;
  visitorInfo: ChatSessionVisitorInfo;
  messageCount: number;
  status: ChatSessionStatus;
  associatedContactId?: AssociatedContact | null;
  startedAt: string;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSessionDetail extends ChatSessionItem {
  messages: ChatSessionMessage[];
}

export interface ChatStats {
  totalSessions: number;
  activeSessions: number;
  endedSessions: number;
  sessionsWithLeads: number;
  totalMessages: number;
  avgMessagesPerSession: number;
}

export interface ChatSessionsListResponse {
  success: boolean;
  message?: string;
  data?: ChatSessionItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
  error?: string;
}

export interface ChatSessionDetailResponse {
  success: boolean;
  message?: string;
  data?: ChatSessionDetail;
  error?: string;
}

export interface ChatStatsResponse {
  success: boolean;
  message?: string;
  data?: {
    stats: ChatStats;
  };
  error?: string;
}

