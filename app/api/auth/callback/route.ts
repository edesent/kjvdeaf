import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, isEditor, signToken, verifyToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") || "";
  const payload = await verifyToken<{ t?: string; email?: string }>(token);

  if (!payload || payload.t !== "login" || !payload.email || !isEditor(payload.email)) {
    redirect("/login?error=expired");
  }

  const session = await signToken({ t: "session", email: payload!.email }, "30d");
  const jar = await cookies();
  jar.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/?signedin=1");
}
