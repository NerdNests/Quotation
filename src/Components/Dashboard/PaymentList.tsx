"use client";

import { useEffect, useState } from "react";
import { MdAttachMoney, MdCheckCircle, MdPendingActions, MdPayment } from "react-icons/md";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

interface Payment {
  id: string;
  invoiceNumber: string;
  paymentStatus: "PAID" | "UNPAID";
  quotation: {
    id: string;
    quotationNumber: string;
    quotationDate: string;
    customerName: string;
    customerCompany: string | null;
    grandTotal: number;
  };
}

export default function PaymentList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await fetch("/api/payments");
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to load payments");
      setPayments(result.invoices || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load payments");
    }
  };

  const togglePaymentStatus = async (paymentId: string, currentStatus: string) => {
    if (isUpdating) return;
    setError("");
    setIsUpdating(paymentId);
    try {
      const newStatus = currentStatus === "PAID" ? "UNPAID" : "PAID";
      const response = await fetch("/api/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: paymentId, paymentStatus: newStatus }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update payment status");
      
      setPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId ? { ...p, paymentStatus: newStatus } : p
        )
      );
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update payment status");
    } finally {
      setIsUpdating(null);
    }
  };

  const totalPaid = payments
    .filter((p) => p.paymentStatus === "PAID")
    .reduce((sum, p) => sum + (p.quotation?.grandTotal || 0), 0);

  const totalUnpaid = payments
    .filter((p) => p.paymentStatus === "UNPAID")
    .reduce((sum, p) => sum + (p.quotation?.grandTotal || 0), 0);

  const totalAmount = payments.reduce((sum, p) => sum + (p.quotation?.grandTotal || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-400">Billing</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Payments</h1>
        <p className="mt-1 text-sm text-slate-500">Track and manage payments for won quotations.</p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-3xl border border-white/50 bg-white/55 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-2xl transition hover:bg-white/70">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
            <MdAttachMoney size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Payment</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 rounded-3xl border border-white/50 bg-white/55 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-2xl transition hover:bg-white/70">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <MdCheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Paid</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(totalPaid)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-white/50 bg-white/55 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-2xl transition hover:bg-white/70">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <MdPendingActions size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Unpaid</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(totalUnpaid)}</p>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/55 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
        <div className="flex items-center gap-3 border-b border-white/40 px-6 py-5">
          <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-600">
            <MdPayment size={21} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Payment List</h2>
            <p className="mt-1 text-xs text-slate-400">
              {payments.length} payment{payments.length === 1 ? "" : "s"} available
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-white/40 bg-white/25 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Invoice / Quotation</th>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-white/30 last:border-0 hover:bg-white/40"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {payment.invoiceNumber}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      From {payment.quotation?.quotationNumber}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-700">
                      {payment.quotation?.customerName}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {payment.quotation?.customerCompany || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {payment.quotation?.quotationDate
                      ? formatDate(payment.quotation.quotationDate)
                      : "—"}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-semibold text-slate-800">
                    {formatCurrency(payment.quotation?.grandTotal || 0)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => void togglePaymentStatus(payment.id, payment.paymentStatus)}
                      disabled={isUpdating === payment.id}
                      className={`
                        inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition
                        disabled:cursor-wait disabled:opacity-60
                        ${
                          payment.paymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }
                      `}
                    >
                      {isUpdating === payment.id ? "Updating…" : payment.paymentStatus}
                    </button>
                  </td>
                </tr>
              ))}
              {!payments.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-sm text-slate-400"
                  >
                    No payments yet. Mark a quotation as won to track payments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
