export const SESSION_COOKIE = "quotation_session";

type SessionPayload = {
  userId: string;
  exp: number;
};

const encoder = new TextEncoder();

const encode = (value: string) => btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
const decode = (value: string) => atob(value.replace(/-/g, "+").replace(/_/g, "/"));

async function signingKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not configured");
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function sign(value: string) {
  const signature = await crypto.subtle.sign("HMAC", await signingKey(), encoder.encode(value));
  return encode(String.fromCharCode(...new Uint8Array(signature)));
}

export async function createSessionToken(userId: string, rememberMe: boolean) {
  const expiresIn = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
  const payload: SessionPayload = { userId, exp: Math.floor(Date.now() / 1000) + expiresIn };
  const encodedPayload = encode(JSON.stringify(payload));
  return { token: `${encodedPayload}.${await sign(encodedPayload)}`, expiresIn };
}

export async function verifySessionToken(token: string | undefined) {
  try {
    if (!token) return null;
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;
    const valid = await crypto.subtle.verify("HMAC", await signingKey(), Uint8Array.from(decode(signature), (character) => character.charCodeAt(0)), encoder.encode(encodedPayload));
    if (!valid) return null;
    const payload = JSON.parse(decode(encodedPayload)) as SessionPayload;
    return payload.exp > Math.floor(Date.now() / 1000) ? payload : null;
  } catch {
    return null;
  }
}
