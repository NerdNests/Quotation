import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/libs/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        quotation: {
          select: {
            id: true,
            quotationNumber: true,
            quotationDate: true,
            customerName: true,
            customerCompany: true,
            grandTotal: true,
          },
        },
      },
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("Payments list error:", error);
    return NextResponse.json({ message: "Failed to load payments" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { invoiceId, paymentStatus } = body;

    if (!invoiceId || !["PAID", "UNPAID"].includes(paymentStatus)) {
      return NextResponse.json({ message: "Invalid request payload" }, { status: 400 });
    }

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { paymentStatus },
    });

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error("Payment status update error:", error);
    return NextResponse.json({ message: "Failed to update payment status" }, { status: 500 });
  }
}
