/**
 * Session Manager for Raghav's AI Chatbot Assistant
 * Ensures persistent, collision-free conversation sessions across reloads
 * while keeping distinct sessions per conversation.
 */

const VISITOR_ID_KEY = "raghav_portfolio_visitor_id";
const SESSION_ID_KEY = "raghav_portfolio_chat_session_id";
const SESSION_TIME_KEY = "raghav_portfolio_chat_session_time";
const MESSAGES_CACHE_KEY = "raghav_portfolio_chat_messages";

/**
 * Generate a random collision-free identifier
 */
function generateId(prefix: string): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}_${randomPart}`;
}

/**
 * Retrieve or create an anonymous device/visitor identifier
 */
export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "server_visitor";
  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = generateId("vis");
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  } catch {
    return generateId("vis");
  }
}

/**
 * Get active session ID if available in sessionStorage or localStorage
 */
export function getActiveSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const sessionFromStorage =
      sessionStorage.getItem(SESSION_ID_KEY) || localStorage.getItem(SESSION_ID_KEY);
    return sessionFromStorage;
  } catch {
    return null;
  }
}

/**
 * Persist active session ID across current session and backup storage
 */
export function setActiveSessionId(sessionId: string): void {
  if (typeof window === "undefined" || !sessionId) return;
  try {
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    localStorage.setItem(SESSION_ID_KEY, sessionId);
    localStorage.setItem(SESSION_TIME_KEY, Date.now().toString());
  } catch {
    // Ignore storage quota/security errors
  }
}

/**
 * Create and persist a brand new conversation session ID
 */
export function startNewSessionId(): string {
  const newId = generateId("cs");
  setActiveSessionId(newId);
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(MESSAGES_CACHE_KEY);
    } catch {}
  }
  return newId;
}

/**
 * Clear the current conversation session to force a new one
 */
export function clearCurrentSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(SESSION_ID_KEY);
    sessionStorage.removeItem(MESSAGES_CACHE_KEY);
  } catch {}
}

/**
 * Cache current messages in sessionStorage for immediate hydration on refresh
 */
export function cacheMessages(sessionId: string, messages: unknown[]): void {
  if (typeof window === "undefined" || !sessionId) return;
  try {
    sessionStorage.setItem(
      MESSAGES_CACHE_KEY,
      JSON.stringify({ sessionId, messages, timestamp: Date.now() })
    );
  } catch {}
}

/**
 * Retrieve cached messages for the given session ID
 */
export function getCachedMessages(sessionId: string): unknown[] | null {
  if (typeof window === "undefined" || !sessionId) return null;
  try {
    const raw = sessionStorage.getItem(MESSAGES_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.sessionId === sessionId && Array.isArray(parsed.messages)) {
      return parsed.messages;
    }
  } catch {}
  return null;
}
