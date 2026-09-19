import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export const dynamic = "force-dynamic";

type ServiceInput = { name?: unknown; description?: unknown; quantity?: unknown; price?: unknown };
type NormalizedService = { serviceName: string; description: string | null; quantity: number | null; price: number | null };

const asNumber = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const asDate = (value: unknown) => {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export async function GET() {
  try {
    const quotations = await prisma.quotation.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, quotationNumber: true, customerName: true, customerCompany: true, grandTotal: true, status: true, quotationDate: true, validUntil: true },
    });
    return NextResponse.json({ quotations });
  } catch (error) {
    console.error("Quotation list error:", error);
    return NextResponse.json({ message: "Failed to load quotations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quotation, company, customer } = body ?? {};
    const rawServices = Array.isArray(body?.services) ? body.services : [];
    if (typeof quotation?.number !== "string" || !quotation.number.trim()) return NextResponse.json({ message: "Quotation number is required" }, { status: 400 });
    if (typeof company?.name !== "string" || !company.name.trim()) return NextResponse.json({ message: "Company name is required" }, { status: 400 });
    if (typeof customer?.name !== "string" || !customer.name.trim()) return NextResponse.json({ message: "Customer name is required" }, { status: 400 });

    const quotationDate = asDate(quotation.date);
    const validUntil = asDate(quotation.validUntil);
    if (!quotationDate || !validUntil) return NextResponse.json({ message: "A valid quotation date and valid-until date are required" }, { status: 400 });

    const services: NormalizedService[] = rawServices.map((service: ServiceInput) => ({
      serviceName: typeof service.name === "string" ? service.name.trim() : "",
      description: typeof service.description === "string" && service.description.trim() ? service.description.trim() : null,
      quantity: asNumber(service.quantity),
      price: asNumber(service.price),
    }));
    if (!services.length || services.some((service) => !service.serviceName || service.quantity === null || service.quantity <= 0 || service.price === null || service.price < 0)) {
      return NextResponse.json({ message: "Add at least one service with a name, positive quantity, and valid price" }, { status: 400 });
    }

    const [subtotal, discountPercent, discountAmount, taxPercent, taxAmount, grandTotal] = [body.subtotal, body.discount, body.discountAmount, body.tax, body.taxAmount, body.grandTotal].map(asNumber);
    if ([subtotal, discountPercent, discountAmount, taxPercent, taxAmount, grandTotal].some((value) => value === null)) return NextResponse.json({ message: "Quotation totals are invalid" }, { status: 400 });

    const optional = (value: unknown) => typeof value === "string" && value.trim() ? value.trim() : null;
    const data = {
      quotationDate, validUntil, companyName: company.name.trim(), companyAddress: optional(company.address), companyPhone: optional(company.phone), companyEmail: optional(company.email),
      customerName: customer.name.trim(), customerCompany: optional(customer.company), customerAddress: optional(customer.address), customerPhone: optional(customer.phone), customerEmail: optional(customer.email),
      subtotal: subtotal!, discountPercent: discountPercent!, discountAmount: discountAmount!, taxPercent: taxPercent!, taxAmount: taxAmount!, grandTotal: grandTotal!,
    };
    const items = services.map((service) => ({ serviceName: service.serviceName, description: service.description, quantity: service.quantity!, price: service.price!, total: service.quantity! * service.price! }));
    const savedQuotation = await prisma.quotation.upsert({
      where: { quotationNumber: quotation.number.trim() },
      create: { quotationNumber: quotation.number.trim(), ...data, status: "SENT", items: { create: items } },
      update: { ...data, items: { deleteMany: {}, create: items } },
      include: { items: true },
    });
    return NextResponse.json({ success: true, quotationId: savedQuotation.id, quotationNumber: savedQuotation.quotationNumber, message: "Quotation saved successfully" });
  } catch (error) {
    console.error("Quotation save error:", error);
    return NextResponse.json({ success: false, message: "Failed to save quotation" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const statuses = ["DRAFT", "SENT", "WON", "DROPPED"] as const;

    if (typeof body?.id !== "string" || !body.id.trim() || !statuses.includes(body.status)) {
      return NextResponse.json({ message: "A quotation id and valid status are required" }, { status: 400 });
    }

    const quotation = await prisma.quotation.update({
      where: { quotationNumber: body.id.trim() },
      data: { status: body.status },
      select: { quotationNumber: true, status: true },
    });

    return NextResponse.json({ quotation });
  } catch (error) {
    console.error("Quotation status update error:", error);
    return NextResponse.json({ message: "Failed to update quotation status" }, { status: 500 });
  }
}
