"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdDescription,
  MdCheckCircle,
  MdPending,
  MdCancel,
  MdChevronLeft,
  MdChevronRight,
  MdKeyboardArrowDown,
  MdPerson,
} from "react-icons/md";

type QuotationStatus =
  | "Draft"
  | "Submitted"
  | "Won"
  | "Dropped";

type Quotation = {
  id: string;
  customer: string;
  project: string;
  amount: number;
  status: QuotationStatus;
  date: string;
  validUntil: string;
  createdBy: string;
  dropReason: string | null;
};

const formatDate = (value: string) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
const displayStatus = (status: string): QuotationStatus => ({ DRAFT: "Draft", SENT: "Submitted", WON: "Won", DROPPED: "Dropped" }[status] as QuotationStatus ?? "Draft");

const statusConfig: Record<
  QuotationStatus,
  {
    icon: typeof MdCheckCircle;
    className: string;
  }
> = {
  Won: {
    icon: MdCheckCircle,
    className:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  Submitted: {
    icon: MdPending,
    className:
      "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  Draft: {
    icon: MdDescription,
    className:
      "bg-slate-500/10 text-slate-600 border-slate-500/20",
  },
  Dropped: {
    icon: MdCancel,
    className:
      "bg-red-500/10 text-red-600 border-red-500/20",
  },
};

export default function QuotationListPage() {
  const { user } = useAuth();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    QuotationStatus | "All"
  >("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openStatusId, setOpenStatusId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [dropModalQuotation, setDropModalQuotation] = useState<Quotation | null>(null);
  const [dropReason, setDropReason] = useState("");

  const itemsPerPage = 6;

  useEffect(() => {
    const loadQuotations = async () => {
      try {
        const response = await fetch("/api/quotations");
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Failed to load quotations");
        setQuotations(result.quotations.map((item: any) => ({
          id: item.quotationNumber, customer: item.customerName, project: item.customerCompany || "—", amount: item.grandTotal, status: displayStatus(item.status), date: formatDate(item.quotationDate), validUntil: formatDate(item.validUntil), createdBy: item.createdBy ? `${item.createdBy.firstName} ${item.createdBy.lastName}` : "Unknown", dropReason: item.dropReason || null
        })));
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Failed to load quotations");
      }
    };
    void loadQuotations();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const filteredQuotations = useMemo(() => {
    return quotations.filter((quotation) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        quotation.id
          .toLowerCase()
          .includes(searchValue) ||
        quotation.customer
          .toLowerCase()
          .includes(searchValue) ||
        quotation.project
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        status === "All" ||
        quotation.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [quotations, search, status]);

  const updateQuotationStatus = async (id: string, nextStatus: QuotationStatus, reason?: string) => {
    const databaseStatus = { Draft: "DRAFT", Submitted: "SENT", Won: "WON", Dropped: "DROPPED" }[nextStatus];
    setUpdatingStatusId(id);
    setLoadError("");
    try {
      const response = await fetch("/api/quotations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: databaseStatus, dropReason: reason }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update quotation status");
      setQuotations((current) => current.map((quotation) => quotation.id === id ? { ...quotation, status: nextStatus } : quotation));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Failed to update quotation status");
    } finally {
      setUpdatingStatusId(null);
      setOpenStatusId(null);
      setDropModalQuotation(null);
    }
  };

  const handleStatusChange = (quotation: Quotation, nextStatus: QuotationStatus) => {
    if (nextStatus === "Dropped") {
      setDropModalQuotation(quotation);
      setDropReason("");
    } else {
      void updateQuotationStatus(quotation.id, nextStatus);
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredQuotations.length / itemsPerPage
    )
  );

  const paginatedQuotations =
    filteredQuotations.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  const totalValue = filteredQuotations.reduce(
    (sum, quotation) =>
      sum + quotation.amount,
    0
  );

  const statusCount = (value: QuotationStatus) =>
    quotations.filter(
      (quotation) => quotation.status === value
    ).length;

  return (
      <div className="space-y-6">

      {loadError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{loadError}</p>}

      {/* PAGE HEADER */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div>
          <p className="text-sm text-slate-400">
            Quotations
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Quotation List
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track all your quotations.
          </p>
        </div>

        <Link
          href="/quotation/create"
          className="
            flex w-fit
            items-center gap-2
            rounded-2xl
            bg-linear-to-r
            from-indigo-500
            to-violet-500
            px-5 py-3
            text-sm font-medium
            text-white
            shadow-lg
            shadow-indigo-500/20
            transition
            hover:-translate-y-0.5
          "
        >
          <MdAdd size={20} />
          Create Quotation
        </Link>

      </div>

      {/* SUMMARY CARDS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          title="Total Quotations"
          value={quotations.length.toString()}
          icon={<MdDescription size={21} />}
        />

        <SummaryCard
          title="Submitted"
          value={statusCount("Submitted").toString()}
          icon={<MdPending size={21} />}
        />

        <SummaryCard
          title="Won"
          value={statusCount("Won").toString()}
          icon={<MdCheckCircle size={21} />}
        />

        <SummaryCard
          title="Total Value"
          value={formatCurrency(totalValue)}
          icon={<MdDescription size={21} />}
        />

      </div>

      {/* FILTER AREA */}

      <div
        className="
          relative z-50
          rounded-3xl
          border border-white/50
          bg-white/55
          p-4
          shadow-[0_8px_30px_rgba(0,0,0,0.05)]
          backdrop-blur-2xl
        "
      >

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

          {/* SEARCH */}

          <div
            className="
              flex flex-1
              items-center gap-3
              rounded-2xl
              border border-white/60
              bg-white/50
              px-4 py-3
              backdrop-blur-xl
              focus-within:bg-white/80
            "
          >
            <MdSearch
              size={21}
              className="text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search quotation, customer or project..."
              className="
                w-full
                bg-transparent
                text-sm
                text-slate-800
                outline-none
                placeholder:text-slate-400
              "
            />

          </div>

          {/* STATUS */}

          <div className="relative">

            <MdFilterList
              size={19}
              className="
                pointer-events-none
                absolute left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <button
              type="button"
              onClick={() => setIsFilterOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={isFilterOpen}
              className="
                flex min-w-44 items-center justify-between
                rounded-2xl border border-white/60 bg-white/50
                py-3 pl-10 pr-4 text-sm text-slate-700 outline-none
                backdrop-blur-xl hover:bg-white/80
              "
            >
              {status === "All" ? "All Status" : status}
              <MdKeyboardArrowDown size={18} />
            </button>

            {isFilterOpen && (
              <div role="listbox" className="absolute right-0 z-[100] mt-2 w-full min-w-44 overflow-hidden rounded-2xl border border-white/70 bg-white p-1 shadow-xl">
                {(["All", "Draft", "Submitted", "Won", "Dropped"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={status === option}
                    onClick={() => {
                      setStatus(option);
                      setCurrentPage(1);
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full rounded-xl px-3 py-2 text-left text-sm ${status === option ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {option === "All" ? "All Status" : option}
                  </button>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* TABLE */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          border border-white/50
          bg-white/55
          shadow-[0_8px_30px_rgba(0,0,0,0.05)]
          backdrop-blur-2xl
        "
      >

        {/* TABLE HEADER */}

        <div className="flex flex-col justify-between gap-2 border-b border-white/40 px-6 py-5 sm:flex-row sm:items-center">

          <div>
            <h2 className="font-semibold text-slate-900">
              All Quotations
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {filteredQuotations.length} quotations found
            </p>
          </div>

        </div>

        {/* RESPONSIVE TABLE */}

        <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">

          <table className="w-full min-w-[900px]">

            <thead>

              <tr className="border-b border-white/40 bg-white/25">

                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Quotation
                </th>

                <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Customer
                </th>

                <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Project
                </th>

                <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Created By
                </th>

                <th className="px-4 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Amount
                </th>

                <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {paginatedQuotations.map(
                (quotation) => (
                  <QuotationRow
                    key={quotation.id}
                    quotation={quotation}
                    formatCurrency={
                      formatCurrency
                    }
                    isFinance={user?.role === "FINANCE"}
                    isStatusOpen={openStatusId === quotation.id}
                    isUpdatingStatus={updatingStatusId === quotation.id}
                    onToggleStatus={() => setOpenStatusId((openId) => openId === quotation.id ? null : quotation.id)}
                    onStatusChange={(nextStatus) => handleStatusChange(quotation, nextStatus)}
                  />
                )
              )}

              {paginatedQuotations.length ===
                0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">

                      <div
                        className="
                          flex h-14 w-14
                          items-center justify-center
                          rounded-2xl
                          bg-slate-100
                          text-slate-400
                        "
                      >
                        <MdSearch size={26} />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-slate-800">
                        No quotations found
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Try changing your search or filter.
                      </p>

                    </div>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}

        <div className="flex flex-col justify-between gap-3 border-t border-white/40 px-6 py-4 sm:flex-row sm:items-center">

          <p className="text-xs text-slate-400">
            Showing{" "}
            <span className="font-medium text-slate-600">
              {filteredQuotations.length === 0
                ? 0
                : (currentPage - 1) *
                    itemsPerPage +
                  1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-slate-600">
              {Math.min(
                currentPage * itemsPerPage,
                filteredQuotations.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-600">
              {filteredQuotations.length}
            </span>
          </p>

          <div className="flex items-center gap-2">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  (page) => page - 1
                )
              }
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                border border-white/60
                bg-white/50
                text-slate-500
                transition
                hover:bg-white
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <MdChevronLeft size={19} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`
                  flex h-9 w-9
                  items-center justify-center
                  rounded-xl
                  text-xs font-medium
                  transition

                  ${
                    currentPage === page
                      ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                      : "border border-white/60 bg-white/50 text-slate-500 hover:bg-white"
                  }
                `}
              >
                {page}
              </button>
            ))}

            <button
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) => page + 1
                )
              }
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                border border-white/60
                bg-white/50
                text-slate-500
                transition
                hover:bg-white
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <MdChevronRight size={19} />
            </button>

          </div>

        </div>

      </div>

      {dropModalQuotation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">Drop Quotation</h3>
            <p className="mt-2 text-sm text-slate-500">
              You are about to drop quotation <strong>{dropModalQuotation.id}</strong>. Please provide a reason (required).
            </p>
            <div className="mt-4">
              <textarea
                value={dropReason}
                onChange={(e) => setDropReason(e.target.value)}
                placeholder="Enter the reason here..."
                className="h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDropModalQuotation(null)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!dropReason.trim() || updatingStatusId === dropModalQuotation.id}
                onClick={() => void updateQuotationStatus(dropModalQuotation.id, "Dropped", dropReason)}
                className="flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updatingStatusId === dropModalQuotation.id ? "Dropping..." : "Drop Quotation"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* -------------------------------- */
/* SUMMARY CARD                     */
/* -------------------------------- */

function SummaryCard({
  title,
  value,
  icon,
}: Readonly<{
  title: string;
  value: string;
  icon: React.ReactNode;
}>) {
  return (
    <div
      className="
        relative overflow-hidden
        rounded-3xl
        border border-white/50
        bg-white/55
        p-5
        shadow-[0_8px_30px_rgba(0,0,0,0.05)]
        backdrop-blur-2xl
        transition
        hover:-translate-y-1
      "
    >

      <div
        className="
          absolute -right-8 -top-8
          h-24 w-24
          rounded-full
          bg-indigo-400/10
          blur-2xl
        "
      />

      <div
        className="
          flex h-10 w-10
          items-center justify-center
          rounded-xl
          bg-indigo-500/10
          text-indigo-600
        "
      >
        {icon}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

/* -------------------------------- */
/* TABLE ROW                        */
/* -------------------------------- */

function QuotationRow({
  quotation,
  formatCurrency,
  isFinance,
  isStatusOpen,
  isUpdatingStatus,
  onToggleStatus,
  onStatusChange,
}: Readonly<{
  quotation: Quotation;
  formatCurrency: (value: number) => string;
  isFinance: boolean;
  isStatusOpen: boolean;
  isUpdatingStatus: boolean;
  onToggleStatus: () => void;
  onStatusChange: (status: QuotationStatus) => void;
}>) {
  const config =
    statusConfig[quotation.status];
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  const StatusIcon = config.icon;

  useEffect(() => {
    if (!isStatusOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!statusButtonRef.current?.contains(target) && !statusMenuRef.current?.contains(target)) {
        onToggleStatus();
      }
    };
    const closeOnScroll = () => onToggleStatus();

    document.addEventListener("mousedown", closeOnOutsideClick);
    window.addEventListener("scroll", closeOnScroll, true);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      window.removeEventListener("scroll", closeOnScroll, true);
    };
  }, [isStatusOpen, onToggleStatus]);

  return (
    <tr
      className="
        border-b border-white/30
        transition
        hover:bg-white/40
      "
    >

      {/* QUOTATION */}

      <td className="px-6 py-4">

        <Link
          href={`/quotation/${quotation.id}`}
          className="group"
        >
          <p
            className="
              text-sm
              font-semibold
              text-slate-800
              group-hover:text-indigo-600
            "
          >
            {quotation.id}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Valid until {quotation.validUntil}
          </p>
        </Link>

      </td>

      {/* CUSTOMER */}

      <td className="px-4 py-4">

        <p className="text-sm font-medium text-slate-700">
          {quotation.customer}
        </p>

      </td>

      {/* PROJECT */}

      <td className="px-4 py-4">

        <p className="text-sm text-slate-600">
          {quotation.project}
        </p>

      </td>

      {/* CREATED BY */}

      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <MdPerson size={16} className="text-slate-400" />
          <p className="text-sm text-slate-600">
            {quotation.createdBy}
          </p>
        </div>
      </td>

      {/* AMOUNT */}

      <td className="px-4 py-4 text-right">

        <p className="text-sm font-semibold text-slate-800">
          {formatCurrency(quotation.amount)}
        </p>

      </td>

      {/* STATUS */}

      <td className="px-4 py-4">

        <button
          ref={statusButtonRef}
          type="button"
          onClick={() => {
            const rect = statusButtonRef.current?.getBoundingClientRect();
            if (rect && !isStatusOpen) {
              const menuHeight = 144;
              const top = rect.bottom + 8 + menuHeight > window.innerHeight
                ? rect.top - menuHeight - 8
                : rect.bottom + 8;
              setMenuPosition({ top, left: rect.left });
            }
            onToggleStatus();
          }}
          disabled={isUpdatingStatus || isFinance}
          title={isFinance ? "Finance users cannot change quotation status" : ""}
          aria-haspopup="listbox"
          aria-expanded={isStatusOpen}
          className={`
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            px-2.5 py-1
            text-[11px]
            font-medium
            ${config.className}
            disabled:cursor-wait
          `}
        >
          <StatusIcon size={13} />
          {isUpdatingStatus ? "Updating..." : quotation.status}
          <MdKeyboardArrowDown size={14} />
        </button>

        {isStatusOpen && menuPosition && createPortal(
          <div
            role="listbox"
            ref={statusMenuRef}
            className="fixed z-50 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
            style={{ top: menuPosition.top, left: menuPosition.left }}
          >
            {(["Draft", "Submitted", "Won", "Dropped"] as QuotationStatus[]).map((option) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={quotation.status === option}
                onClick={() => onStatusChange(option)}
                className={`block w-full rounded-lg px-3 py-1.5 text-left text-xs ${quotation.status === option ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {option}
              </button>
            ))}
          </div>,
          document.body,
        )}

      </td>

      {/* DATE */}

      <td className="px-4 py-4">

        <p className="text-xs text-slate-500">
          {quotation.date}
        </p>

      </td>

    </tr>
  );
}
