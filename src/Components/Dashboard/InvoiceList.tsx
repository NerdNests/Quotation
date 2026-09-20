"use client";

import { useEffect, useRef, useState } from "react";
import { MdDownload, MdReceiptLong } from "react-icons/md";
import InvoicePDF, { type Invoice } from "./InvoicePDF";

const formatCurrency = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);
const formatDate = (value: string) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));

export default function InvoiceList() {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const response = await fetch("/api/invoices");
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Failed to load invoices");
        setInvoices(result.invoices);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load invoices");
      }
    };
    void loadInvoices();
  }, []);

  const downloadInvoice = async (invoice: Invoice) => {
    if (isDownloading) return;
    setError("");
    setSelectedInvoice(invoice);
    setIsDownloading(invoice.quotationNumber);

    try {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      if (!pdfRef.current) throw new Error("Invoice preview is not ready");
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

      const filename = `invoice-${invoice.quotationNumber}`.replace(/[^a-z0-9-_]/gi, "-").replace(/-+/g, "-");
      pdf.save(`${filename}.pdf`);
    } catch (downloadError) {
      console.error("Unable to download invoice PDF", downloadError);
      setError(downloadError instanceof Error ? downloadError.message : "The invoice PDF could not be generated.");
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-400">Billing</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Invoices</h1>
        <p className="mt-1 text-sm text-slate-500">Invoices are created automatically from won quotations.</p>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/55 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
        <div className="flex items-center gap-3 border-b border-white/40 px-6 py-5"><div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-600"><MdReceiptLong size={21} /></div><div><h2 className="font-semibold text-slate-900">Won quotation invoices</h2><p className="mt-1 text-xs text-slate-400">{invoices.length} invoice{invoices.length === 1 ? "" : "s"} available</p></div></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[760px]"><thead><tr className="border-b border-white/40 bg-white/25 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400"><th className="px-6 py-4">Invoice</th><th className="px-4 py-4">Customer</th><th className="px-4 py-4">Date</th><th className="px-4 py-4 text-right">Amount</th><th className="px-6 py-4 text-right">Download</th></tr></thead><tbody>{invoices.map((invoice) => <tr key={invoice.quotationNumber} className="border-b border-white/30 last:border-0 hover:bg-white/40"><td className="px-6 py-4"><p className="text-sm font-semibold text-slate-800">INV-{invoice.quotationNumber}</p><p className="mt-1 text-xs text-slate-400">From {invoice.quotationNumber}</p></td><td className="px-4 py-4"><p className="text-sm font-medium text-slate-700">{invoice.customerName}</p><p className="mt-1 text-xs text-slate-400">{invoice.customerCompany || "—"}</p></td><td className="px-4 py-4 text-sm text-slate-600">{formatDate(invoice.quotationDate)}</td><td className="px-4 py-4 text-right text-sm font-semibold text-slate-800">{formatCurrency(invoice.grandTotal)}</td><td className="px-6 py-4 text-right"><button type="button" onClick={() => void downloadInvoice(invoice)} disabled={Boolean(isDownloading)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-600 disabled:cursor-wait disabled:opacity-60"><MdDownload size={16} />{isDownloading === invoice.quotationNumber ? "Preparing…" : "Download"}</button></td></tr>)}{!invoices.length && <tr><td colSpan={5} className="px-6 py-16 text-center text-sm text-slate-400">No invoices yet. Mark a quotation as won to create an invoice.</td></tr>}</tbody></table></div>
      </div>

      <div className="fixed left-[-10000px] top-0" aria-hidden="true"><div ref={pdfRef}>{selectedInvoice && <InvoicePDF invoice={selectedInvoice} />}</div></div>
    </div>
  );
}
