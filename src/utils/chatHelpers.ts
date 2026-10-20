/**
 * Frontend Chat UI Utilities & Client-Side Intelligence Engine
 * Provides static default chatbot configuration and an autonomous,
 * 100% resilient fallback knowledge engine that operates seamlessly
 * whether the backend is online, sleeping, rate-limited, or deployed on Vercel.
 */

import { ChatConfig, ChatActionType } from "../types/chat";

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

// Default chatbot configuration used immediately on initial render and during offline fallback
export const DEFAULT_CHAT_CONFIG: ChatConfig = {
  title: "Raghav's AI Assistant",
  subtitle: "Portfolio & Career Assistant",
  welcome: {
    greeting: "Hey there! 👋",
    title: "I'm Raghav's AI Assistant.",
    description:
      "Curious about Raghav's work, technical skills, or experience? I'm here to help you explore his portfolio and professional background.",
    prompt: "What would you like to know?",
  },
  placeholder: "Ask me anything about Raghav...",
  quickPrompts: [
    { label: "About Raghav", query: "About Raghav", icon: "🧑‍💻" },
    { label: "Technical Skills", query: "Technical Skills", icon: "⚡" },
    { label: "Work Experience", query: "Work Experience", icon: "💼" },
    { label: "Education", query: "Education", icon: "🎓" },
  ],
};

const FULL_INTRO_PITCH = [
  "Hi, I'm **Raghav Singh**, a **Frontend Developer and UI Engineer** with **2+ years of enterprise experience** working on **HP Inc.** projects through **Tenarai** and **TEKsystems**. I specialize in **React.js, Next.js, TypeScript, and AG Grid**, with a focus on building high-performance, scalable web applications and delivering great user experiences.",
  "",
  "• **Core Tech Stack:** `React.js`, `Next.js`, `TypeScript`, `AG Grid`, `GraphQL`, `Tailwind CSS`, and `Node.js`.",
  "• **Education:** Bachelor of Computer Applications (BCA) — **Presidency College**.",
  "• **Focus:** Passionate about writing clean, maintainable code, optimizing frontend performance, and delivering exceptional user experiences.",
].join("\n");

/**
 * Robust Client-Side Portfolio Response Generator.
 * Guarantees that visitors on Vercel or mobile always get accurate,
 * formatted responses even if the backend is waking up or offline.
 */
export function generateLocalResponse(
  query: string,
  visitorName?: string
): {
  text: string;
  actionType?: ChatActionType;
} {
  const q = (query || "").toLowerCase().replace(">", "").trim();

  // 1. Greetings
  if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening))[\s!.,?]*$/i.test(q)) {
    const greetingPrefix =
      visitorName && visitorName !== "Anonymous Visitor"
        ? `Hi, **${visitorName}**! `
        : "Hi there! ";
    return {
      text: `${greetingPrefix}How can I help you today?\n\nI can share Raghav's **introduction**, **Technical Skills**, **Work Experience**, **Featured Projects**, or help you **view his Resume**.`,
    };
  }

  // 2. Connect / Contact / Hiring Intent
  if (
    q.includes("connect") ||
    q.includes("contact") ||
    q.includes("hire") ||
    q.includes("reach") ||
    q.includes("collaborate") ||
    q.includes("work together") ||
    q.includes("get in touch") ||
    q.includes("talk to") ||
    q.includes("message") ||
    q.includes("touch base") ||
    q.includes("freelance") ||
    q.includes("opportunity") ||
    q.includes("available")
  ) {
    return {
      text: "I'd love to connect! Please share your details in the quick form below and Raghav will reach out to you directly:",
      actionType: "connect-card",
    };
  }

  // 3. Resume / CV PDF
  if (q.includes("resume") || q.includes("cv") || q.includes("download") || q.includes("pdf")) {
    return {
      text: "📄 **Raghav's Resume:**\n\nYou can view and download Raghav's latest resume directly using the **View Resume (PDF)** button below, or explore his featured projects right here!",
      actionType: "resume",
    };
  }

  // 4. Technical Skills
  if (
    q.includes("skill") ||
    q.includes("tech") ||
    q.includes("stack") ||
    q.includes("react") ||
    q.includes("frontend") ||
    q.includes("backend") ||
    q.includes("language") ||
    q.includes("tools")
  ) {
    return {
      text: [
        "💻 **Raghav's Technical Stack & Expertise:**",
        "",
        "💻 **Frontend & Core:**\n`React.js` `Next.js` `TypeScript` `JavaScript (ES6+)` `Tailwind CSS` `Redux` `Context API` `Material UI` `Storybook` `HTML5 / SCSS`",
        "",
        "⚡ **API, GraphQL & State:**\n`GraphQL` `Apollo Client` `REST APIs` `State Virtualization`",
        "",
        "🗄️ **Backend & Database:**\n`Node.js` `Express.js` `MongoDB` `SQLite`",
        "",
        "📊 **Enterprise & Tables:**\n`AG Grid` *(Large dataset virtualization, filtering & custom cells)*",
        "",
        "🧪 **Testing & QA:**\n`Jest` `Vitest` `React Testing Library` `Unit & Integration Testing`",
        "",
        "🛠️ **Build & Dev Tools:**\n`Git` `GitHub` `Webpack` `Vite` `CI/CD` `Postman` `Figma` `Cursor`",
      ].join("\n"),
    };
  }

  // 5. Work Experience & Career History
  if (
    q.includes("experience") ||
    q.includes("work") ||
    q.includes("job") ||
    q.includes("career") ||
    q.includes("company") ||
    q.includes("history") ||
    q.includes("hp") ||
    q.includes("tenarai") ||
    q.includes("tek")
  ) {
    return {
      text: [
        "💼 **Professional Work Experience (2+ Years):**",
        "",
        "🏢 **UI Engineer** — *Tenarai (HP Inc.)* (July 2025 - Sept. 2026)",
        "📍 Bengaluru, India • Status: `Completed`",
        "Contributed to HP Inc.'s enterprise PriceHub platform, engineering high-performance UI workflows, enterprise data grids, and real-time GraphQL integrations.",
        "⚡ **Tech:** `React.js`, `TypeScript`, `AG Grid`, `GraphQL`, `Tailwind CSS`",
        "",
        "🏢 **Jr FullStack Developer** — *TEKsystems (HP Inc.)* (May 2024 - July 2025)",
        "📍 Bengaluru, India • Status: `Completed`",
        "Developed enterprise pricing and compliance workflows, microservices, and interactive frontend interfaces for high-volume client systems.",
        "⚡ **Tech:** `React.js`, `TypeScript`, `SCSS`, `GraphQL`, `Jest`, `React Testing Library`",
        "",
        "🏢 **Self Employed** — *Code and build something in everyday.* (Jan 2023 - Present)",
        "📍 Remote • Status: `Current`",
        "Building modern web applications, scalable interfaces, and high-performance full-stack architectures.",
        "⚡ **Tech:** `React.js`, `Next.js`, `TypeScript`, `Node.js`, `Tailwind CSS`",
      ].join("\n"),
    };
  }

  // 6. Projects
  if (q.includes("project") || q.includes("portfolio") || q.includes("built") || q.includes("work sample") || q.includes("apps")) {
    return {
      text: [
        "🚀 **Featured Production Projects:**",
        "",
        "🚀 **Enterprise Pricing & Analytics Platform** (Full Stack)",
        "High-throughput enterprise pricing platform handling complex calculation matrices, AG Grid dataset virtualization, and GraphQL state management.",
        "🛠️ **Built with:** `React.js`, `TypeScript`, `AG Grid`, `GraphQL`, `Tailwind CSS`",
        "",
        "🚀 **Cosmic 3D Portfolio & AI Assistant** (Web App)",
        "Next.js 16 portfolio featuring WebGL cosmic shaders, interactive 3D elements, ASCII portrait animations, and an intelligent visitor chat engine.",
        "🛠️ **Built with:** `Next.js`, `React.js`, `TypeScript`, `Three.js`, `Framer Motion`, `MongoDB`",
        "",
        "You can explore interactive live demos directly in the **Projects** section of this portfolio!",
      ].join("\n"),
    };
  }

  // 7. Education & Credentials
  if (
    q.includes("education") ||
    q.includes("degree") ||
    q.includes("college") ||
    q.includes("university") ||
    q.includes("academic") ||
    q.includes("credential")
  ) {
    return {
      text: "🎓 **Education & Academic Background:**\n\n• **Degree:** Bachelor of Computer Applications (BCA)\n• **Institution:** Presidency College (Bengaluru, India)\n• **Focus Area:** Specialized in Computer Science, Software Engineering, and Web Architectures",
    };
  }

  // 8. About Raghav / Bio / Intro
  if (
    q.includes("about") ||
    q.includes("who is") ||
    q.includes("bio") ||
    q.includes("summary") ||
    q.includes("intro") ||
    q.includes("tell me") ||
    q.includes("yourself") ||
    q.includes("background")
  ) {
    return {
      text: FULL_INTRO_PITCH,
    };
  }

  // Default Fallback
  return {
    text: "I am Raghav's Portfolio AI Assistant! You can ask me anything about Raghav's **About Me**, **Technical Skills**, **Work Experience**, **Projects**, **Education**, or **Resume**.",
  };
}
