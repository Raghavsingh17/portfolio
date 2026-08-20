"use client";

import React, { createContext, useContext, useState } from "react";
import { CursorMode, CursorContextType } from "@/src/types/cursor";

export type { CursorMode, CursorContextType };

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [cursorMode, setModeState] = useState<CursorMode>("default");
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [cursorEnabled, setCursorEnabled] = useState<boolean>(true);

  const setCursorMode = (mode: CursorMode, text: string | null = null) => {
    setModeState(mode);
    setCursorText(text);
  };

  const toggleCursor = () => {
    setCursorEnabled((prev) => !prev);
  };

  return (
    <CursorContext.Provider
      value={{
        cursorMode,
        cursorText,
        cursorEnabled,
        setCursorMode,
        toggleCursor,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
}
