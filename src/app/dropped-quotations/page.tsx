"use client";

import { useEffect, useState } from "react";
import QuotationLayout from "@/Components/Layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { MdSearch, MdCancel } from "react-icons/md";
import Link from "next/link";

type DroppedQuotation = {
    id: string;
    quotationNumber: string;
    customerName: string;
    customerCompany: string;
    grandTotal: number;
    dropReason: string;
    date: string;
    createdBy: string;
};

export default function DroppedQuotationsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [quotations, setQuotations] = useState<DroppedQuotation[]>([]);
    const [search, setSearch] = useState("");
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        if (!isLoading && user?.role !== "ADMIN") {
            router.replace("/");
        }
    }, [user, isLoading, router]);

    const loadQuotations = async () => {
        try {
            const res = await fetch("/api/quotations");
            if (res.ok) {
                const data = await res.json();
                const dropped = data.quotations
                    .filter((q: any) => q.status === "DROPPED")
                    .map((q: any) => ({
                        id: q.id,
                        quotationNumber: q.quotationNumber,
                        customerName: q.customerName,
                        customerCompany: q.customerCompany || "—",
                        grandTotal: q.grandTotal,
                        dropReason: q.dropReason || "No reason provided",
                        date: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(q.quotationDate)),
                        createdBy: q.createdBy ? `${q.createdBy.firstName} ${q.createdBy.lastName}` : "Unknown"
                    }));
                setQuotations(dropped);
            } else {
                setLoadError("Failed to load dropped quotations");
            }
        } catch (error) {
            console.error("Failed to fetch dropped quotations", error);
            setLoadError("Failed to load dropped quotations");
        }
    };

    useEffect(() => {
        if (user?.role === "ADMIN") {
            loadQuotations();
        }
    }, [user]);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value);

    const filteredQuotations = quotations.filter((q) => {
        const searchLower = search.toLowerCase();
        return (
            q.quotationNumber.toLowerCase().includes(searchLower) ||
            q.customerName.toLowerCase().includes(searchLower) ||
            q.customerCompany.toLowerCase().includes(searchLower)
        );
    });

    if (isLoading || user?.role !== "ADMIN") return null;

    return (
        <QuotationLayout>
            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                        <p className="text-sm text-slate-400">Quotations</p>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Dropped Quotations</h1>
                        <p className="mt-1 text-sm text-slate-500">Review dropped quotations and their reasoning.</p>
                    </div>
                </div>

                {loadError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{loadError}</p>}

                <div className="relative z-50 rounded-3xl border border-white/50 bg-white/55 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/60 bg-white/50 px-4 py-3 backdrop-blur-xl focus-within:bg-white/80">
                            <MdSearch size={21} className="text-slate-400" />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search quotation, customer or project..."
                                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/55 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
                    <div className="flex flex-col justify-between gap-2 border-b border-white/40 px-6 py-5 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-semibold text-slate-900">Dropped Records</h2>
                            <p className="mt-1 text-xs text-slate-400">{filteredQuotations.length} quotations found</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-white/40 bg-white/25">
                                    <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Quotation</th>
                                    <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Customer</th>
                                    <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Amount</th>
                                    <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Drop Reason</th>
                                    <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Created By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQuotations.map((quotation) => (
                                    <tr key={quotation.id} className="border-b border-white/30 transition hover:bg-white/40">
                                        <td className="px-6 py-4">
                                            <Link href={`/quotation/${quotation.quotationNumber}`} className="group">
                                                <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">{quotation.quotationNumber}</p>
                                                <p className="mt-1 text-[11px] text-slate-400">Dated {quotation.date}</p>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm font-medium text-slate-700">{quotation.customerName}</p>
                                            <p className="mt-1 text-xs text-slate-500">{quotation.customerCompany}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm font-semibold text-slate-800">{formatCurrency(quotation.grandTotal)}</p>
                                        </td>
                                        <td className="px-4 py-4 max-w-xs">
                                            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-500/10 rounded-xl px-3 py-2 border border-red-500/20">
                                                <MdCancel size={16} className="mt-0.5 shrink-0" />
                                                <p className="font-medium whitespace-pre-wrap">{quotation.dropReason}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm text-slate-600">{quotation.createdBy}</p>
                                        </td>
                                    </tr>
                                ))}
                                {filteredQuotations.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                                    <MdSearch size={26} />
                                                </div>
                                                <h3 className="mt-4 text-sm font-semibold text-slate-800">No dropped quotations</h3>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </QuotationLayout>
    );
}
