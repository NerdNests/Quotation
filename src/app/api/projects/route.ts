import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export const dynamic = "force-dynamic";

const projectStatus = {
  DRAFT: "Available",
  SENT: "Quotation Created",
  WON: "Won",
  DROPPED: "Dropped",
} as const;

export async function GET() {
  try {
    const quotations = await prisma.quotation.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        quotationNumber: true,
        customerName: true,
        customerCompany: true,
        grandTotal: true,
        status: true,
        validUntil: true,
        quotationDate: true,
        items: { select: { description: true, serviceName: true } },
      },
    });

    const projects = quotations.map((quotation) => ({
      id: quotation.quotationNumber,
      name: quotation.customerCompany || quotation.quotationNumber,
      customer: quotation.customerName,
      description: quotation.items.map((item) => item.description || item.serviceName).filter(Boolean).join(", "),
      value: quotation.grandTotal,
      status: projectStatus[quotation.status],
      deadline: quotation.validUntil,
      createdDate: quotation.quotationDate,
    }));

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Project list error:", error);
    return NextResponse.json({ message: "Failed to load projects" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (typeof body?.id !== "string" || !body.id.trim() || body.status !== "DROPPED") {
      return NextResponse.json({ message: "A project id and supported status are required" }, { status: 400 });
    }

    await prisma.quotation.update({
      where: { quotationNumber: body.id.trim() },
      data: { status: "DROPPED" },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json({ message: "Failed to update project" }, { status: 500 });
  }
}
