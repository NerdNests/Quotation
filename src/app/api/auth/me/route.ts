import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/libs/prisma";
import { verifySessionToken, SESSION_COOKIE } from "@/libs/session";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const payload = await verifySessionToken(token);
    
    if (!payload || !payload.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, firstName: true, lastName: true, email: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json({ message: "Unable to fetch profile" }, { status: 500 });
  }
}
