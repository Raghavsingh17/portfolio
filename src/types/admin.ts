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
  email: string;
  name?: string;
  role?: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: AdminUser;
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
