import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    // Direct real-time email dispatch to raghavsingh7631@gmail.com via FormSubmit AJAX service
    const response = await fetch("https://formsubmit.co/ajax/raghavsingh7631@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        subject: subject || `New Portfolio Contact Message from ${name}`,
        message,
        _subject: `Portfolio Contact: ${name} (${email})`,
        _replyto: email,
        _template: "table",
      }),
    });

    const data = await response.json();

    if (response.ok && data.success !== "false") {
      return NextResponse.json({ success: true, message: "Email delivered successfully!" });
    } else {
      return NextResponse.json(
        { error: data.message || "Failed to deliver email message." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred while processing email submission." },
      { status: 500 }
    );
  }
}
