"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdDownload,
  MdVisibility,
  MdEdit,
  MdMoreVert,
  MdDescription,
  MdCheckCircle,
  MdPending,
  MdCancel,
  MdChevronLeft,
  MdChevronRight,
  MdKeyboardArrowDown,
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
};

const quotations: Quotation[] = [
  {
    id: "QT-2026-00125",
    customer: "ABC Industries",
    project: "Website Development",
    amount: 112100,
    status: "Won",
    date: "16 Sep 2026",
    validUntil: "30 Sep 2026",
  },
  {
    id: "QT-2026-00124",
    customer: "XYZ Technologies",
    project: "Mobile Application",
    amount: 85000,
    status: "Draft",
    date: "15 Sep 2026",
    validUntil: "29 Sep 2026",
  },
  {
    id: "QT-2026-00123",
    customer: "Demo Corporation",
    project: "ERP Development",
    amount: 210500,
    status: "Submitted",
    date: "14 Sep 2026",
    validUntil: "28 Sep 2026",
  },
  {
    id: "QT-2026-00122",
    customer: "Global Solutions",
    project: "Cloud Migration",
    amount: 345000,
    status: "Won",
    date: "13 Sep 2026",
    validUntil: "27 Sep 2026",
  },
  {
    id: "QT-2026-00121",
    customer: "Tech Systems",
    project: "DevOps Setup",
    amount: 95000,
    status: "Dropped",
    date: "12 Sep 2026",
    validUntil: "26 Sep 2026",
  },
  {
    id: "QT-2026-00120",
    customer: "Smart Retail",
    project: "E-Commerce Platform",
    amount: 425000,
    status: "Submitted",
    date: "11 Sep 2026",
    validUntil: "25 Sep 2026",
  },
  {
    id: "QT-2026-00119",
    customer: "Prime Logistics",
    project: "Logistics Dashboard",
    amount: 175000,
    status: "Won",
    date: "10 Sep 2026",
    validUntil: "24 Sep 2026",
  },
  {
    id: "QT-2026-00118",
    customer: "Blue Ocean Ltd",
    project: "CRM Application",
    amount: 280000,
    status: "Draft",
    date: "09 Sep 2026",
    validUntil: "23 Sep 2026",
  },
];

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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    QuotationStatus | "All"
  >("All");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

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
  }, [search, status]);

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
            bg-gradient-to-r
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

            <select
              value={status}
              onChange={(event) => {
                setStatus(
                  event.target.value as
                    | QuotationStatus
                    | "All"
                );

                setCurrentPage(1);
              }}
              className="
                appearance-none
                rounded-2xl
                border border-white/60
                bg-white/50
                py-3
                pl-10 pr-10
                text-sm
                text-slate-700
                outline-none
                backdrop-blur-xl
                focus:bg-white/80
              "
            >
              <option value="All">
                All Status
              </option>

              <option value="Draft">
                Draft
              </option>

              <option value="Submitted">
                Submitted
              </option>

              <option value="Won">
                Won
              </option>

              <option value="Dropped">
                Dropped
              </option>
            </select>

            <MdKeyboardArrowDown
              size={18}
              className="
                pointer-events-none
                absolute right-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

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

          <button
            className="
              flex w-fit
              items-center gap-2
              rounded-xl
              border border-white/60
              bg-white/40
              px-3 py-2
              text-xs
              font-medium
              text-slate-600
              transition
              hover:bg-white/70
            "
          >
            <MdDownload size={17} />
            Export
          </button>

        </div>

        {/* RESPONSIVE TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

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

                <th className="px-4 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Amount
                </th>

                <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Date
                </th>

                <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Action
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
                  />
                )
              )}

              {paginatedQuotations.length ===
                0 && (
                <tr>
                  <td
                    colSpan={7}
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
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
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
}: {
  quotation: Quotation;
  formatCurrency: (value: number) => string;
}) {
  const config =
    statusConfig[quotation.status];

  const StatusIcon = config.icon;

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

      {/* AMOUNT */}

      <td className="px-4 py-4 text-right">

        <p className="text-sm font-semibold text-slate-800">
          {formatCurrency(quotation.amount)}
        </p>

      </td>

      {/* STATUS */}

      <td className="px-4 py-4">

        <span
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
          `}
        >
          <StatusIcon size={13} />
          {quotation.status}
        </span>

      </td>

      {/* DATE */}

      <td className="px-4 py-4">

        <p className="text-xs text-slate-500">
          {quotation.date}
        </p>

      </td>

      {/* ACTIONS */}

      <td className="px-6 py-4">

        <div className="flex justify-end gap-1">

          {/* View */}

          <Link
            href={`/quotation/${quotation.id}`}
            title="View"
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              text-slate-400
              transition
              hover:bg-indigo-500/10
              hover:text-indigo-600
            "
          >
            <MdVisibility size={19} />
          </Link>

          {/* Edit */}

          <Link
            href={`/quotation/${quotation.id}/edit`}
            title="Edit"
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              text-slate-400
              transition
              hover:bg-amber-500/10
              hover:text-amber-600
            "
          >
            <MdEdit size={18} />
          </Link>

          {/* More */}

          <button
            title="More"
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              text-slate-400
              transition
              hover:bg-white/80
              hover:text-slate-700
            "
          >
            <MdMoreVert size={19} />
          </button>

        </div>

      </td>

    </tr>
  );
}