import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { verifyPassword } from "@/libs/password";
import { createSessionToken, SESSION_COOKIE } from "@/libs/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const rememberMe = Boolean(body?.rememberMe);
    const user = email ? await prisma.user.findUnique({ where: { email } }) : null;

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const { token, expiresIn } = await createSessionToken(user.id, rememberMe);
    const response = NextResponse.json({ user: { id: user.id, email: user.email } });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: expiresIn,
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Unable to sign in" }, { status: 500 });
  }
}
