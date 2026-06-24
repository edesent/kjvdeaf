import { cookies } from "next/headers";
import { SESSION_COOKIE, sessionEmail } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const jar = await cookies();
  const email = await sessionEmail(jar.get(SESSION_COOKIE)?.value);
  return Response.json({ editor: !!email, email: email || null });
}
