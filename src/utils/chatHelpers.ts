import { PROJECTS, EXPERIENCES, EDUCATION } from "@/src/data/portfolio";

export const QUICK_PROMPTS = [
  "About Me >",
  "Technical Skills >",
  "Work Experience >",
  "Education & Credentials >",
];

export function getFormattedTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Pure Client-side Rich Intent & Knowledge Engine
export function generateLocalResponse(query: string): {
  text: string;
  actionType?: "resume" | "contact";
  suggestions?: string[];
} {
  const q = query.toLowerCase().replace(">", "").trim();

  // 1. About Me
  if (
    q.includes("about me") ||
    q.includes("who is") ||
    q.includes("about raghav") ||
    q.includes("summary") ||
    q.includes("bio") ||
    q.includes("intro")
  ) {
    return {
      text: `👋 **About Raghav Kumar:**\n\nFrontend Engineer with 2+ years of experience building enterprise web applications. Specializes in React.js, Next.js, TypeScript, AG Grid, and GraphQL. Experienced in engineering complex pricing workflows for HP Inc. (via Tenarai & TEKsystems), optimizing web performance, and delivering scalable UI architectures. Based in Bengaluru, India.`,
    };
  }

  // 2. Technical Skills Matrix
  if (
    q.includes("technical skill") ||
    q.includes("skill") ||
    q.includes("tech") ||
    q.includes("stack") ||
    q.includes("react") ||
    q.includes("next") ||
    q.includes("language") ||
    q.includes("frontend") ||
    q.includes("backend") ||
    q.includes("tools")
  ) {
    return {
      text: `💻 **Frontend & Core:**\n\`React.js\` \`Next.js\` \`TypeScript\` \`JavaScript (ES6+)\` \`Tailwind CSS\` \`Redux\` \`Context API\` \`Material UI\` \`Storybook\` \`HTML5 / SCSS\`\n\n⚡ **API, GraphQL & State:**\n\`GraphQL\` \`Apollo Client\` \`REST APIs\`\n\n🗄️ **Backend & Database:**\n\`Node.js\` \`Express.js\` \`MongoDB\` \`SQLite\`\n\n📊 **Enterprise & Tables:**\n\`AG Grid\` *(Large dataset virtualization, filtering & custom cells)*\n\n🧪 **Testing & QA:**\n\`Jest\` \`Vitest\` \`React Testing Library\` \`Unit Testing\`\n\n🛠️ **Build & Dev Tools:**\n\`Git\` \`GitHub\` \`Webpack\` \`CI/CD\` \`Postman\` \`Figma\` \`Cursor\` \`GitHub Copilot\``,
      suggestions: [
        "Ask about my HP Inc. work experience",
        "View Resume (PDF)",
      ],
    };
  }

  // 3. Education & Credentials / Certificates
  if (
    q.includes("education") ||
    q.includes("credential") ||
    q.includes("degree") ||
    q.includes("college") ||
    q.includes("university") ||
    q.includes("academic") ||
    q.includes("certificate")
  ) {
    return {
      text: `🎓 **Education & Academic Background:**\n\n• **Degree:** ${EDUCATION.degree}\n• **Institution:** ${EDUCATION.institution} (${EDUCATION.location})\n• **Focus Area:** ${EDUCATION.highlights}\n\n📜 **Certifications & Training:**\n• Modern React & Next.js Enterprise Ecosystem\n• Advanced TypeScript & Data Structure Architectures`,
    };
  }

  // 4. Resume & CV PDF
  if (q.includes("resume") || q.includes("cv") || q.includes("download") || q.includes("pdf")) {
    return {
      text: `📄 **Raghav's Resume:**\n\nRaghav's complete resume covers detailed project metrics, technical capabilities, and career achievements. You can view or download the live PDF directly below!`,
      actionType: "resume",
    };
  }

  // 5. Work Experience & Career History
  if (
    q.includes("experience") ||
    q.includes("work") ||
    q.includes("history") ||
    q.includes("company") ||
    q.includes("role") ||
    q.includes("job") ||
    q.includes("career") ||
    q.includes("tenarai") ||
    q.includes("tek") ||
    q.includes("hp")
  ) {
    const expList = EXPERIENCES.map(
      (e) => `🏢 **${e.role}** at *${e.company}* (${e.period})\n  └ *Summary:* ${e.summary}\n  └ *Key Tech:* ${e.technologies.slice(0, 6).join(", ")}`
    ).join("\n\n");
    return {
      text: `💼 **Professional Work Experience (2.5+ Years):**\n\n${expList}`,
    };
  }

  // 6. Projects
  if (
    q.includes("project") ||
    q.includes("portfolio") ||
    q.includes("built") ||
    q.includes("work sample") ||
    q.includes("apps")
  ) {
    const projectList = PROJECTS.slice(0, 3)
      .map((p) => `🚀 **${p.title}** (${p.category})\n  └ ${p.description}`)
      .join("\n\n");
    return {
      text: `🛠️ **Featured Key Projects:**\n\n${projectList}\n\nYou can explore interactive live demos and GitHub repositories in the **Projects** section!`,
    };
  }

  // 7. Contact & Hiring
  if (
    q.includes("contact") ||
    q.includes("hire") ||
    q.includes("email") ||
    q.includes("reach") ||
    q.includes("available") ||
    q.includes("location") ||
    q.includes("remote")
  ) {
    return {
      text: `📬 **Contact & Availability:**\n\n• **Email:** [raghavsingh7631@gmail.com](mailto:raghavsingh7631@gmail.com)\n• **LinkedIn:** [linkedin.com/in/hiraghavsingh](https://www.linkedin.com/in/hiraghavsingh)\n• **GitHub:** [github.com/Raghavsingh17](https://github.com/Raghavsingh17)\n• **Current Location:** Bengaluru, India (Open for Remote / Worldwide roles)`,
      actionType: "contact",
    };
  }

  // Default Fallback
  return {
    text: `I can help answer questions about Raghav's **About Me, full technical skills, work experience, education, projects, resume, or contact details**.\n\nPlease choose one of the quick action chips below or type your question!`,
  };
}
