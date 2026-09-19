import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [total, statusGroups, value, recentQuotations] = await Promise.all([
      prisma.quotation.count(),
      prisma.quotation.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.quotation.aggregate({ _sum: { grandTotal: true } }),
      prisma.quotation.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, quotationNumber: true, customerName: true, customerCompany: true, grandTotal: true, status: true, quotationDate: true } }),
    ]);
    const byStatus = Object.fromEntries(statusGroups.map((group) => [group.status, group._count._all]));
    return NextResponse.json({ total, totalValue: value._sum.grandTotal ?? 0, statusCounts: { draft: byStatus.DRAFT ?? 0, submitted: byStatus.SENT ?? 0, won: byStatus.WON ?? 0, dropped: byStatus.DROPPED ?? 0 }, recentQuotations });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ message: "Failed to load dashboard" }, { status: 500 });
  }
}
