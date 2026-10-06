"use client";

import React, { useState } from "react";
import { Code2, Eye, Copy, CheckCircle2, Sparkles } from "lucide-react";

interface CodePlaygroundProps {
  title?: string;
  uiComponent: React.ReactNode;
  codeSnippet: string;
  language?: string;
}

export function CodePlayground({
  title = "Component Interactive Inspector",
  uiComponent,
  codeSnippet,
  language = "tsx",
}: CodePlaygroundProps) {
  const [activeTab, setActiveTab] = useState<"ui" | "code">("ui");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-white/15 bg-slate-950/80 overflow-hidden backdrop-blur-xl shadow-xl">
      {/* Tab Switcher Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-slate-900/90">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-bold text-white">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-800 p-1 border border-white/10">
            <button
              suppressHydrationWarning
              onClick={() => setActiveTab("ui")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                activeTab === "ui"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>UI View</span>
            </button>

            <button
              suppressHydrationWarning
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                activeTab === "code"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Source Code</span>
            </button>
          </div>

          {activeTab === "code" && (
            <button
              suppressHydrationWarning
              onClick={handleCopy}
              className="flex h-7 items-center gap-1.5 rounded-lg bg-white/10 px-2.5 text-[11px] font-semibold text-slate-300 hover:bg-white/20 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6">
        {activeTab === "ui" ? (
          <div className="flex items-center justify-center p-6 min-h-[160px] rounded-xl border border-white/10 bg-slate-900/60">
            {uiComponent}
          </div>
        ) : (
          <pre className="p-4 overflow-x-auto rounded-xl border border-white/10 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed max-h-[300px]">
            <code className={`language-${language}`}>{codeSnippet}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
