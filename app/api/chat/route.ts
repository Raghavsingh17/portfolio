import { NextResponse } from "next/server";
import { PERSONAL_INFO, SKILLS, EXPERIENCES, PROJECTS } from "@/src/data/portfolio";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return fallback signal so client uses instant local Knowledge Engine
      return NextResponse.json({ fallback: true });
    }

    const systemPrompt = `You are the friendly, professional AI representative for Raghav Singh.
Here is Raghav's background:
- Role: Frontend Developer with 2.5+ years of experience.
- Location: ${PERSONAL_INFO.location}
- Bio: ${PERSONAL_INFO.bio}
- Core Skills: ${SKILLS.map((s) => s.name).join(", ")}
- Work Experience: ${EXPERIENCES.map((e) => `${e.role} at ${e.company} (${e.period})`).join("; ")}
- Projects: ${PROJECTS.map((p) => p.title).join(", ")}
- Email: ${PERSONAL_INFO.socials.emailRaw}
- LinkedIn: ${PERSONAL_INFO.socials.linkedin}
- GitHub: ${PERSONAL_INFO.socials.github}

Answer questions accurately, concisely, and professionally. Keep answers under 3-4 bullet points or short paragraphs.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }],
            },
          ],
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return NextResponse.json({ response: text });
      }
    }

    return NextResponse.json({ fallback: true });
  } catch (error) {
    return NextResponse.json({ fallback: true, error: (error as Error).message });
  }
}
