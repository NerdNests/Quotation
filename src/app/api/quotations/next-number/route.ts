import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/libs/prisma";
import { verifySessionToken, SESSION_COOKIE } from "@/libs/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const payload = await verifySessionToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const latestQuotation = await prisma.quotation.findFirst({
      orderBy: { createdAt: "desc" },
      select: { quotationNumber: true },
    });

    let nextNumber = "0001";
    if (latestQuotation && latestQuotation.quotationNumber) {
      const match = latestQuotation.quotationNumber.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10) + 1;
        const paddedNum = num.toString().padStart(match[1].length, "0");
        nextNumber = latestQuotation.quotationNumber.replace(/\d+$/, paddedNum);
      }
    }

    return NextResponse.json({ nextNumber });
  } catch (error) {
    console.error("Next quotation number error:", error);
    return NextResponse.json({ message: "Failed to get next number" }, { status: 500 });
  }
}
