import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/libs/prisma";
import { verifySessionToken, SESSION_COOKIE } from "@/libs/session";
import { hashPassword } from "@/libs/password";

const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

async function requireAdmin(request: NextRequest) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const payload = await verifySessionToken(token);
    if (!payload || !payload.userId) return null;
    
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (user?.role !== "ADMIN") return null;
    return user;
}

export async function GET(request: NextRequest) {
    try {
        const admin = await requireAdmin(request);
        if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const users = await prisma.user.findMany({
            select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true },
            orderBy: { createdAt: "desc" }
        });
        
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error("Fetch users error:", error);
        return NextResponse.json({ message: "Failed to load users" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const admin = await requireAdmin(request);
        if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const body = await request.json();
        const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
        const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
        const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
        const password = typeof body?.password === "string" ? body.password : "";
        const role = ["ADMIN", "FINANCE", "SALES_EXECUTIVE"].includes(body?.role) ? body.role : "SALES_EXECUTIVE";

        if (!firstName || !lastName) {
            return NextResponse.json({ message: "Provide a first and last name" }, { status: 400 });
        }

        if (!validEmail(email) || password.length < 8) {
            return NextResponse.json({ message: "Provide a valid email and a password with at least 8 characters" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
        if (existingUser) return NextResponse.json({ message: "An account already exists for this email" }, { status: 409 });

        const user = await prisma.user.create({ 
            data: { firstName, lastName, email, role, passwordHash: await hashPassword(password) }, 
            select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true } 
        });
        
        return NextResponse.json({ user }, { status: 201 });
    } catch (error) {
        console.error("Create user error:", error);
        return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
    }
}
