import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/libs/prisma";
import { verifySessionToken, SESSION_COOKIE } from "@/libs/session";
import { hashPassword, verifyPassword } from "@/libs/password";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const payload = await verifySessionToken(token);
    
    if (!payload || !payload.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword || newPassword.length < 8) {
      return NextResponse.json({ message: "Provide valid old and new passwords (min 8 chars)" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValid = await verifyPassword(oldPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ message: "Incorrect old password" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(newPassword) }
    });

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json({ message: "Unable to update password" }, { status: 500 });
  }
}
