"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    MdAdd,
    MdArrowForward,
    MdDescription,
    MdDownload,
    MdMoreVert,
    MdTrendingUp,
    MdCheckCircle,
    MdPending,
    MdFolderOpen,
} from "react-icons/md";

function StatusBadge({ status }: Readonly<{ status: string }>) {
    const styles: Record<string, string> = {
        Won: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        Draft: "bg-slate-500/10 text-slate-600 border-slate-500/20",
        Submitted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        Dropped: "bg-red-500/10 text-red-600 border-red-500/20",
        Available: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        "In Progress":
            "bg-amber-500/10 text-amber-600 border-amber-500/20",
    };

    return (
        <span
            className={`
        inline-flex items-center
        rounded-full
        border
        px-2.5 py-1
        text-[11px]
        font-medium
        ${styles[status] ?? styles.Draft}
      `}
        >
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
}

export default function DashboardPage() {
    const [dashboard, setDashboard] = useState({
        total: 0,
        totalValue: 0,
        statusCounts: { draft: 0, submitted: 0, won: 0, dropped: 0 },
        recentQuotations: [] as { quotationNumber: string; customerName: string; customerCompany: string | null; grandTotal: number; status: string; quotationDate: string }[],
        monthlyTotals: [] as { month: string; value: number }[],
        recentProjects: [] as { quotationNumber: string; customerName: string; customerCompany: string | null; grandTotal: number; status: string }[],
    });

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const response = await fetch("/api/dashboard");
                if (response.ok) setDashboard(await response.json());
            } catch (error) {
                console.error("Unable to load dashboard", error);
            }
        };
        void loadDashboard();
    }, []);

    const formatCurrency = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
    const formatDate = (value: string) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
    const displayStatus = (status: string) => ({ DRAFT: "Draft", SENT: "Submitted", WON: "Won", DROPPED: "Dropped" }[status] ?? "Draft");
    const stats = [
        { title: "Total Quotations", value: dashboard.total.toString(), description: "All saved quotations", icon: MdDescription },
        { title: "Submitted", value: dashboard.statusCounts.submitted.toString(), description: "Sent to customers", icon: MdPending },
        { title: "Won", value: dashboard.statusCounts.won.toString(), description: "Accepted quotations", icon: MdCheckCircle },
        { title: "Total Value", value: formatCurrency(dashboard.totalValue), description: "Combined quotation value", icon: MdTrendingUp },
    ];
    const quotations = dashboard.recentQuotations.map((quotation) => ({
        id: quotation.quotationNumber,
        customer: quotation.customerName,
        project: quotation.customerCompany || "—",
        amount: formatCurrency(quotation.grandTotal),
        status: displayStatus(quotation.status),
        date: formatDate(quotation.quotationDate),
    }));
    const projects = dashboard.recentProjects.map((project) => ({
        name: project.customerCompany ?? project.quotationNumber,
        customer: project.customerName,
        status: displayStatus(project.status),
        value: formatCurrency(project.grandTotal),
    }));
    const maxMonthlyValue = Math.max(...dashboard.monthlyTotals.map((item) => item.value), 1);
    const statusItems = [
        ["Won", dashboard.statusCounts.won, "bg-emerald-500"],
        ["Submitted", dashboard.statusCounts.submitted, "bg-indigo-500"],
        ["Draft", dashboard.statusCounts.draft, "bg-amber-500"],
        ["Dropped", dashboard.statusCounts.dropped, "bg-red-500"],
    ] as const;
    const statusSegments = [
        ["#22c55e", dashboard.statusCounts.won],
        ["#6366f1", dashboard.statusCounts.submitted],
        ["#f59e0b", dashboard.statusCounts.draft],
        ["#ef4444", dashboard.statusCounts.dropped],
    ] as const;
    let accumulated = 0;
    const statusGradient = statusSegments.map(([color, count]) => {
        const start = (accumulated / Math.max(dashboard.total, 1)) * 100;
        accumulated += count;
        const end = (accumulated / Math.max(dashboard.total, 1)) * 100;
        return `${color} ${start}% ${end}%`;
    }).join(", ");

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm text-slate-500">
                        Overview
                    </p>

                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Track your quotations and projects from one place.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        className="
              flex items-center gap-2
              rounded-2xl
              border border-white/60
              bg-white/50
              px-4 py-2.5
              text-sm font-medium
              text-slate-700
              shadow-sm
              backdrop-blur-xl
              transition
              hover:bg-white/80
            "
                    >
                        <MdDownload size={18} />
                        Export
                    </button>

                    <Link
                        href="/quotation/create"
                        className="
              flex items-center gap-2
              rounded-2xl
              bg-linear-to-r
              from-indigo-500
              to-violet-500
              px-4 py-2.5
              text-sm font-medium
              text-white
              shadow-lg
              shadow-indigo-500/20
              transition
              hover:-translate-y-0.5
            "
                    >
                        <MdAdd size={19} />
                        Create Quotation
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="
                group
                relative overflow-hidden
                rounded-3xl
                border border-white/50
                bg-white/55
                p-5
                shadow-[0_8px_30px_rgba(0,0,0,0.05)]
                backdrop-blur-2xl
                transition
                hover:-translate-y-1
                hover:bg-white/70
              "
                        >
                            {/* Glow */}
                            <div
                                className="
                  pointer-events-none
                  absolute -right-8 -top-8
                  h-24 w-24
                  rounded-full
                  bg-indigo-400/10
                  blur-2xl
                "
                            />

                            <div className="flex items-start justify-between">
                                <div
                                    className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-2xl
                    bg-indigo-500/10
                    text-indigo-600
                  "
                                >
                                    <Icon size={22} />
                                </div>

                                <button className="text-slate-400 transition hover:text-slate-700">
                                    <MdMoreVert size={20} />
                                </button>
                            </div>

                            <p className="mt-5 text-sm text-slate-500">
                                {stat.title}
                            </p>

                            <div className="mt-1 flex items-end">
                                <h3 className="text-2xl font-bold text-slate-900">
                                    {stat.value}
                                </h3>

                            </div>

                            <p className="mt-1 text-[11px] text-slate-400">
                                {stat.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Main Analytics */}
            <div className="grid gap-6 xl:grid-cols-3">

                {/* Chart */}
                <div
                    className="
            xl:col-span-2
            rounded-3xl
            border border-white/50
            bg-white/55
            p-6
            shadow-[0_8px_30px_rgba(0,0,0,0.05)]
            backdrop-blur-2xl
          "
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Quotation Overview
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Quotation value for the last 6 months
                            </p>
                        </div>

                        <select
                            className="
                rounded-xl
                border border-white/60
                bg-white/50
                px-3 py-2
                text-xs
                text-slate-600
                outline-none
              "
                        >
                            <option>Last 6 months</option>
                            <option>Last 12 months</option>
                            <option>This year</option>
                        </select>
                    </div>

                    {/* Fake Chart */}
                    <div className="mt-8">

                        <div className="flex h-62.5 items-end gap-3 sm:gap-6">

                            {dashboard.monthlyTotals.map((item) => (
                                <div
                                    key={item.month}
                                    className="flex h-full flex-1 flex-col justify-end"
                                >
                                    <div className="mb-2 text-center text-[10px] text-slate-400">
                                        {formatCurrency(item.value)}
                                    </div>

                                    <div
                                        className="
                      w-full
                      rounded-t-2xl
                      bg-linear-to-t
                      from-indigo-500
                      to-violet-400
                      opacity-80
                      transition-all
                      hover:opacity-100
                    "
                                        style={{
                                            height: `${Math.max((item.value / maxMonthlyValue) * 200, 2)}px`,
                                        }}
                                    />

                                    <div className="mt-3 text-center text-[11px] text-slate-400">
                                        {new Intl.DateTimeFormat("en-GB", { month: "short" }).format(new Date(`${item.month}-01T00:00:00`))}
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>

                {/* Quotation Status */}
                <div
                    className="
            rounded-3xl
            border border-white/50
            bg-white/55
            p-6
            shadow-[0_8px_30px_rgba(0,0,0,0.05)]
            backdrop-blur-2xl
          "
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Quotation Status
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Current quotation distribution
                            </p>
                        </div>

                        <MdTrendingUp
                            size={22}
                            className="text-indigo-500"
                        />
                    </div>

                    {/* Progress */}
                    <div className="mt-8 flex justify-center">
                        <div
                            className="
                relative
                flex h-44 w-44
                items-center justify-center
                rounded-full
              "
                            style={{
                                background:
                                    `conic-gradient(${statusGradient})`,
                            }}
                        >
                            <div
                                className="
                  flex h-32 w-32
                  flex-col items-center
                  justify-center
                  rounded-full
                  bg-white/90
                "
                            >
                                <span className="text-3xl font-bold text-slate-900">
                                    {dashboard.total}
                                </span>

                                <span className="text-[11px] text-slate-400">
                                    Total
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-7 space-y-3">
                        {statusItems.map(([label, value, color]) => (
                            <div
                                key={label}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`h-2 w-2 rounded-full ${color}`}
                                    />

                                    <span className="text-xs text-slate-500">
                                        {label}
                                    </span>
                                </div>

                                <span className="text-xs font-semibold text-slate-800">
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid gap-6 xl:grid-cols-3">

                {/* Recent Quotations */}
                <div
                    className="
            xl:col-span-2
            overflow-hidden
            rounded-3xl
            border border-white/50
            bg-white/55
            shadow-[0_8px_30px_rgba(0,0,0,0.05)]
            backdrop-blur-2xl
          "
                >
                    <div className="flex items-center justify-between p-6">
                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Recent Quotations
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Latest quotation activity
                            </p>
                        </div>

                        <Link
                            href="/quotation/list"
                            className="
                flex items-center gap-1
                text-xs font-medium
                text-indigo-600
                hover:text-indigo-700
              "
                        >
                            View all
                            <MdArrowForward size={15} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-175">
                            <thead>
                                <tr className="border-y border-white/40 bg-white/20">
                                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Quotation
                                    </th>

                                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Customer
                                    </th>

                                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Amount
                                    </th>

                                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Status
                                    </th>

                                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {quotations.map((quotation) => (
                                    <tr
                                        key={quotation.id}
                                        className="
                      border-b border-white/30
                      transition
                      hover:bg-white/40
                    "
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {quotation.id}
                                                </p>

                                                <p className="mt-0.5 text-[11px] text-slate-400">
                                                    {quotation.project}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-sm text-slate-600">
                                            {quotation.customer}
                                        </td>

                                        <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                                            {quotation.amount}
                                        </td>

                                        <td className="px-4 py-4">
                                            <StatusBadge status={quotation.status} />
                                        </td>

                                        <td className="px-6 py-4 text-xs text-slate-400">
                                            {quotation.date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Projects */}
                <div
                    className="
            rounded-3xl
            border border-white/50
            bg-white/55
            p-6
            shadow-[0_8px_30px_rgba(0,0,0,0.05)]
            backdrop-blur-2xl
          "
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Projects
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Available projects
                            </p>
                        </div>

                        <MdFolderOpen
                            size={22}
                            className="text-indigo-500"
                        />
                    </div>

                    <div className="mt-6 space-y-3">
                        {projects.map((project) => (
                            <div
                                key={project.name}
                                className="
                  rounded-2xl
                  border border-white/50
                  bg-white/35
                  p-4
                  transition
                  hover:bg-white/60
                "
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-800">
                                            {project.name}
                                        </p>

                                        <p className="mt-1 text-[11px] text-slate-400">
                                            {project.customer}
                                        </p>
                                    </div>

                                    <StatusBadge status={project.status} />
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[11px] text-slate-400">
                                        Estimated value
                                    </span>

                                    <span className="text-sm font-semibold text-slate-800">
                                        {project.value}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/quotation/projects"
                        className="
              mt-5 flex w-full
              items-center justify-center gap-2
              rounded-2xl
              border border-white/60
              bg-white/40
              py-2.5
              text-xs font-medium
              text-slate-600
              transition
              hover:bg-white/70
            "
                    >
                        View Projects
                        <MdArrowForward size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
