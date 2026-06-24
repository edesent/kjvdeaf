import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "kjvdeaf_session";

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET not set");
  return new TextEncoder().encode(s);
}

export function editorEmails(): string[] {
  return (process.env.EDITOR_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isEditor(email: string | null | undefined): boolean {
  if (!email) return false;
  return editorEmails().includes(email.trim().toLowerCase());
}

export async function signToken(
  payload: Record<string, unknown>,
  expires: string,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(secret());
}

export async function verifyToken<T = Record<string, unknown>>(
  token: string,
): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as T;
  } catch {
    return null;
  }
}

/** Returns the logged-in editor email from a session cookie value, or null. */
export async function sessionEmail(cookieValue: string | undefined): Promise<string | null> {
  if (!cookieValue) return null;
  const payload = await verifyToken<{ email?: string; t?: string }>(cookieValue);
  if (!payload || payload.t !== "session" || !payload.email) return null;
  if (!isEditor(payload.email)) return null;
  return payload.email;
}
