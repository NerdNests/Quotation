import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5, 1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [total, statusGroups, value, recentQuotations, chartQuotations, recentProjects] = await Promise.all([
      prisma.quotation.count(),
      prisma.quotation.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.quotation.aggregate({ _sum: { grandTotal: true } }),
      prisma.quotation.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, quotationNumber: true, customerName: true, customerCompany: true, grandTotal: true, status: true, quotationDate: true } }),
      prisma.quotation.findMany({ where: { quotationDate: { gte: sixMonthsAgo } }, select: { quotationDate: true, grandTotal: true } }),
      prisma.quotation.findMany({ where: { customerCompany: { not: null } }, orderBy: { createdAt: "desc" }, take: 3, select: { quotationNumber: true, customerName: true, customerCompany: true, grandTotal: true, status: true } }),
    ]);
    const byStatus = Object.fromEntries(statusGroups.map((group) => [group.status, group._count._all]));
    const monthlyTotals = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + index, 1);
      return { month: date.toISOString().slice(0, 7), value: 0 };
    });
    for (const quotation of chartQuotations) {
      const month = quotation.quotationDate.toISOString().slice(0, 7);
      const item = monthlyTotals.find((total) => total.month === month);
      if (item) item.value += quotation.grandTotal;
    }
    return NextResponse.json({ total, totalValue: value._sum.grandTotal ?? 0, statusCounts: { draft: byStatus.DRAFT ?? 0, submitted: byStatus.SENT ?? 0, won: byStatus.WON ?? 0, dropped: byStatus.DROPPED ?? 0 }, recentQuotations, monthlyTotals, recentProjects });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ message: "Failed to load dashboard" }, { status: 500 });
  }
}
