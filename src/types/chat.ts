export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestions?: string[];
  actionType?: "resume" | "contact" | "connect-card" | "name-capture";
  pendingMessage?: string;
}

export interface QuickPromptItem {
  label: string;
  query: string;
  icon: string;
}

export interface ChatWelcomeConfig {
  greeting: string;
  title: string;
  description: string;
  prompt: string;
}

export interface ChatConfig {
  title: string;
  subtitle: string;
  welcome: ChatWelcomeConfig;
  placeholder: string;
  quickPrompts: QuickPromptItem[];
}
