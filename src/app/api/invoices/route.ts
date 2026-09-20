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

    const invoices = await prisma.quotation.findMany({
      where: { status: "WON" },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        quotationNumber: true,
        quotationDate: true,
        companyName: true,
        companyAddress: true,
        companyPhone: true,
        companyEmail: true,
        customerName: true,
        customerCompany: true,
        customerAddress: true,
        customerPhone: true,
        customerEmail: true,
        subtotal: true,
        discountPercent: true,
        discountAmount: true,
        taxPercent: true,
        taxAmount: true,
        grandTotal: true,
        items: {
          select: { id: true, serviceName: true, description: true, quantity: true, price: true, total: true },
        },
      },
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("Invoice list error:", error);
    return NextResponse.json({ message: "Failed to load invoices" }, { status: 500 });
  }
}
