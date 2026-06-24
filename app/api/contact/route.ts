import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TO = process.env.CONTACT_TO || "biblebaptistnb@gmail.com";
// Until a sending domain is verified in Resend, onboarding@resend.dev is used.
const FROM = process.env.CONTACT_FROM || "KJV for the Deaf <onboarding@resend.dev>";

function clean(v: unknown, max = 5000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const firstName = clean(body.firstName, 100);
  const lastName = clean(body.lastName, 100);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);
  const honeypot = clean(body.company, 200); // spam trap — real users leave this empty

  if (honeypot) return Response.json({ ok: true }); // silently drop bots
  if (!firstName || !message) {
    return Response.json({ error: "Please add your name and a message." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Email is not set up yet. Please try again later." }, { status: 503 });
  }

  const name = `${firstName} ${lastName}`.trim();
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to: [TO],
    replyTo: email,
    subject: `New message from ${name} — KJV for the Deaf`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
  });

  if (error) {
    console.error("Resend error:", error);
    return Response.json({ error: "Sorry, the message could not be sent. Please email us directly." }, { status: 502 });
  }
  return Response.json({ ok: true });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
