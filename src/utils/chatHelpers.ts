/**
 * Frontend Chat UI Pure Utilities
 * All chatbot content, knowledge base, prompts, and configurations
 * are exclusively fetched from the backend Single Source of Truth (/api/chat).
 */

let messageIdCounter = 0;

export function createMessageId(prefix: string = "msg"): string {
  messageIdCounter += 1;
  return `${prefix}-${Date.now()}-${messageIdCounter}`;
}

export function getFormattedTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
