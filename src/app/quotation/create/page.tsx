"use client";

import { useRef, useState } from "react";
import { MdDownload } from "react-icons/md";
import QuotationForm, { type Company, type Customer, type Quotation, type Service } from "@/Components/Dashboard/CreateQuotation";
import QuotationPDF from "@/Components/Dashboard/QuotationPDF";
import QuotationLayout from "@/Components/Layout/Layout";

const initialCompany: Company = {
    name: "Your Company", address: "Your company address", phone: "+91 00000 00000", email: "hello@yourcompany.com",
};
const initialCustomer: Customer = { name: "", company: "", address: "", phone: "", email: "" };
const initialQuotation: Quotation = {
    number: "QT-2026-0001",
    date: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()),
    validUntil: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
};
const initialService: Service = { id: 1, name: "", description: "", quantity: 1, price: 0 };

export default function CreateQuotationPage() {
    const pdfRef = useRef<HTMLDivElement>(null);
    const [company, setCompany] = useState<Company>(initialCompany);
    const [customer, setCustomer] = useState<Customer>(initialCustomer);
    const [quotation, setQuotation] = useState<Quotation>(initialQuotation);
    const [services, setServices] = useState<Service[]>([initialService]);
    const [tax, setTax] = useState(18);
    const [discount, setDiscount] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);

    const subtotal = services.reduce((total, service) => total + service.quantity * service.price, 0);
    const discountAmount = subtotal * (discount / 100);
    const taxAmount = (subtotal - discountAmount) * (tax / 100);
    const grandTotal = subtotal - discountAmount + taxAmount;

    const updateService = (id: number, field: keyof Service, value: string | number) => {
        setServices((current) => current.map((service) => service.id === id ? { ...service, [field]: value } : service));
    };
    const addService = () => {
        setServices((current) => [...current, { ...initialService, id: Math.max(0, ...current.map((service) => service.id)) + 1 }]);
    };
    const removeService = (id: number) => {
        setServices((current) => current.length === 1 ? current : current.filter((service) => service.id !== id));
    };

    const downloadPdf = async () => {
        if (!pdfRef.current || isDownloading) return;
        setIsDownloading(true);

        try {
            const saveResponse = await fetch("/api/quotations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quotation, company, customer, services, subtotal, discount, discountAmount, tax, taxAmount, grandTotal }),
            });
            const saveResult = await saveResponse.json();
            if (!saveResponse.ok) {
                throw new Error(saveResult.message || "Unable to save quotation");
            }

            const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
            const canvas = await html2canvas(pdfRef.current, { backgroundColor: "#ffffff", scale: 2, useCORS: true, logging: false });
            const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imageHeight = (canvas.height * pageWidth) / canvas.width;
            const image = canvas.toDataURL("image/png");

            for (let offset = 0; offset < imageHeight; offset += pageHeight) {
                if (offset > 0) pdf.addPage();
                pdf.addImage(image, "PNG", 0, -offset, pageWidth, imageHeight);
            }

            const filename = (quotation.number || "quotation").replace(/[^a-z0-9-_]/gi, "-").replace(/-+/g, "-");
            pdf.save(`${filename}.pdf`);
        } catch (error) {
            console.error("Unable to download quotation PDF", error);
            window.alert(error instanceof Error ? error.message : "The PDF could not be generated. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <QuotationLayout>
            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm text-slate-500">Quotations</p>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Create quotation</h1>
                    </div>
                    <button type="button" onClick={downloadPdf} disabled={isDownloading} className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
                        <MdDownload size={18} />
                        {isDownloading ? "Preparing PDF…" : "Download PDF"}
                    </button>
                </div>

                <QuotationForm company={company} customer={customer} quotation={quotation} services={services} tax={tax} discount={discount} subtotal={subtotal} discountAmount={discountAmount} taxAmount={taxAmount} grandTotal={grandTotal} setCompany={setCompany} setCustomer={setCustomer} setQuotation={setQuotation} setTax={setTax} setDiscount={setDiscount} addService={addService} removeService={removeService} updateService={updateService} />

                <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-100 p-4">
                    <div ref={pdfRef} className="mx-auto w-[794px] shadow-lg">
                        <QuotationPDF company={company} customer={customer} quotation={quotation} services={services} tax={tax} discount={discount} subtotal={subtotal} discountAmount={discountAmount} taxAmount={taxAmount} grandTotal={grandTotal} />
                    </div>
                </div>
            </div>
        </QuotationLayout>
    );
}
