"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, CornerDownLeft, Circle } from "lucide-react";
import { PERSONAL_INFO } from "@/src/data/portfolio";

interface HistoryEntry {
  command: string;
  output: React.ReactNode;
}

export function MiniTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: "whoami",
      output: `${PERSONAL_INFO.name} — ${PERSONAL_INFO.title} based in ${PERSONAL_INFO.location}.`,
    },
    {
      command: "help",
      output: (
        <div className="space-y-1 text-xs">
          <div className="text-blue-400 font-bold mb-1">Available CLI commands:</div>
          <div><span className="text-emerald-400 font-mono">whoami</span> — Display engineer bio & location</div>
          <div><span className="text-emerald-400 font-mono">skills</span> — List core frontend, backend & AI stack</div>
          <div><span className="text-emerald-400 font-mono">projects</span> — View featured web application portfolio</div>
          <div><span className="text-emerald-400 font-mono">contact</span> — Get direct email & LinkedIn links</div>
          <div><span className="text-emerald-400 font-mono">cat resume.pdf</span> — Summary of professional credentials</div>
          <div><span className="text-emerald-400 font-mono">clear</span> — Clear terminal output history</div>
        </div>
      ),
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    if (!trimmed) return;

    let outputNode: React.ReactNode = "";

    switch (trimmed) {
      case "help":
        outputNode = (
          <div className="space-y-1 text-xs">
            <div className="text-blue-400 font-bold mb-1">Available CLI commands:</div>
            <div><span className="text-emerald-400 font-mono">whoami</span> — Display engineer bio & location</div>
            <div><span className="text-emerald-400 font-mono">skills</span> — List core frontend, backend & AI stack</div>
            <div><span className="text-emerald-400 font-mono">projects</span> — View featured web application portfolio</div>
            <div><span className="text-emerald-400 font-mono">contact</span> — Get direct email & LinkedIn links</div>
            <div><span className="text-emerald-400 font-mono">cat resume.pdf</span> — Summary of professional credentials</div>
            <div><span className="text-emerald-400 font-mono">clear</span> — Clear terminal output history</div>
          </div>
        );
        break;
      case "whoami":
        outputNode = `${PERSONAL_INFO.name} — ${PERSONAL_INFO.title} based in ${PERSONAL_INFO.location}.`;
        break;
      case "skills":
        outputNode = "Core Stack: React 19, Next.js 16, TypeScript, Tailwind v4, Node.js, Express, GraphQL, Vector Search & AI Integrations.";
        break;
      case "projects":
        outputNode = "Featured Projects: AI Agent Orchestrator, E-Commerce Platform, Modern Portfolio Engine, Cloud Analytics Dashboard.";
        break;
      case "contact":
        outputNode = `Email: ${PERSONAL_INFO.socials.email} | GitHub: ${PERSONAL_INFO.socials.github} | LinkedIn: ${PERSONAL_INFO.socials.linkedin}`;
        break;
      case "cat resume.pdf":
      case "resume":
        outputNode = "Resume: B.Tech Computer Science | Full-Stack Architect | 5+ Years Experience Building Scalable Web Apps.";
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "sudo":
      case "sudo rm -rf /":
        outputNode = "Nice try! Permission denied: Access restricted to authorized recruiters only 😉";
        break;
      default:
        outputNode = `Command not recognized: '${trimmed}'. Type 'help' for available commands.`;
        break;
    }

    setHistory((prev) => [...prev, { command: cmdStr, output: outputNode }]);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
  };

  return (
    <div className="w-full rounded-2xl border border-white/15 bg-slate-950/90 shadow-2xl overflow-hidden font-mono text-xs text-slate-200 backdrop-blur-xl">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 bg-slate-900/80">
        <div className="flex items-center gap-2">
          <Circle className="h-3 w-3 fill-rose-500 text-rose-500" />
          <Circle className="h-3 w-3 fill-amber-500 text-amber-500" />
          <Circle className="h-3 w-3 fill-emerald-500 text-emerald-500" />
          <span className="ml-2 text-[11px] font-bold text-slate-400">developer-cli ~ bash</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-blue-400 font-semibold">
          <TerminalIcon className="h-3.5 w-3.5" />
          <span>Interactive CLI</span>
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div className="p-4 space-y-3 max-h-56 overflow-y-auto">
        {history.map((entry, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-emerald-400">guest@raghav-portfolio</span>
              <span>:~$</span>
              <span className="text-white font-bold">{entry.command}</span>
            </div>
            <div className="text-slate-300 pl-4 border-l border-blue-500/30">{entry.output}</div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Quick Command Chips */}
      <div className="px-4 py-2 border-t border-white/10 bg-slate-900/40 flex flex-wrap items-center gap-2 text-[10px]">
        <span className="text-slate-500 font-semibold">Quick Chips:</span>
        {["help", "whoami", "skills", "cat resume.pdf", "clear"].map((cmd) => (
          <button
            suppressHydrationWarning
            key={cmd}
            onClick={() => handleCommand(cmd)}
            className="rounded-md bg-slate-800/80 px-2 py-0.5 text-blue-300 hover:bg-blue-600 hover:text-white transition-colors border border-white/5"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Prompt Form */}
      <form onSubmit={handleSubmit} className="flex items-center border-t border-white/10 px-4 py-2.5 bg-slate-900/90">
        <span className="text-emerald-400 mr-2">guest@raghav-portfolio:~$</span>
        <input
          suppressHydrationWarning
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type 'help'..."
          className="flex-1 bg-transparent text-white outline-none placeholder-slate-500 font-mono"
        />
        <button type="submit" className="text-slate-400 hover:text-white">
          <CornerDownLeft className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
