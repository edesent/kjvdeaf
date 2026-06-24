import { Resend } from "resend";
import { isEditor, signToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FROM = process.env.CONTACT_FROM || "KJV for the Deaf <contact@elijahdesent.com>";

export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const email = (body.email || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  // Always respond the same way — don't reveal who is allowed.
  if (isEditor(email)) {
    const token = await signToken({ t: "login", email }, "20m");
    const origin = new URL(req.url).origin;
    const link = `${origin}/api/auth/callback?token=${encodeURIComponent(token)}`;
    const key = process.env.RESEND_API_KEY;
    if (key) {
      const resend = new Resend(key);
      await resend.emails.send({
        from: FROM,
        to: [email],
        subject: "Your sign-in link — KJV for the Deaf",
        text: `Click to sign in to KJV for the Deaf:\n\n${link}\n\nThis link works once and expires in 20 minutes. If you did not request it, you can ignore this email.`,
        html: `<p>Click to sign in to <strong>KJV for the Deaf</strong>:</p><p><a href="${link}">Sign in</a></p><p style="color:#888;font-size:13px">This link expires in 20 minutes. If you did not request it, ignore this email.</p>`,
      }).catch((e) => console.error("login email error", e));
    }
  }

  return Response.json({ ok: true });
}
