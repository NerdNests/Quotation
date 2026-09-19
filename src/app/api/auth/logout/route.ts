import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/libs/session";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
