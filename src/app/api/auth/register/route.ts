import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { hashPassword } from "@/libs/password";

const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
    const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!firstName || !lastName) {
      return NextResponse.json({ message: "Provide a first and last name" }, { status: 400 });
    }

    if (!validEmail(email) || password.length < 8) {
      return NextResponse.json({ message: "Provide a valid email and a password with at least 8 characters" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existingUser) return NextResponse.json({ message: "An account already exists for this email" }, { status: 409 });

    const user = await prisma.user.create({ data: { firstName, lastName, email, passwordHash: await hashPassword(password) }, select: { id: true, firstName: true, lastName: true, email: true, createdAt: true } });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Unable to create account" }, { status: 500 });
  }
}
