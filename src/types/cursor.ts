export type CursorMode = "default" | "pointer" | "magnetic" | "text" | "hidden";

export interface CursorContextType {
  cursorMode: CursorMode;
  cursorText: string | null;
  cursorEnabled: boolean;
  setCursorMode: (mode: CursorMode, text?: string | null) => void;
  toggleCursor: () => void;
}
