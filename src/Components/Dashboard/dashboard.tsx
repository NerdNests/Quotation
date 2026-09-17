"use client";

import Link from "next/link";
import {
    MdAdd,
    MdArrowForward,
    MdDescription,
    MdDownload,
    MdMoreVert,
    MdTrendingUp,
    MdCheckCircle,
    MdPending,
    MdCancel,
    MdFolderOpen,
    MdKeyboardArrowUp,
} from "react-icons/md";

const stats = [
    {
        title: "Total Quotations",
        value: "245",
        change: "+12.5%",
        description: "vs last month",
        icon: MdDescription,
    },
    {
        title: "Submitted",
        value: "84",
        change: "+8.2%",
        description: "vs last month",
        icon: MdPending,
    },
    {
        title: "Won",
        value: "96",
        change: "+15.4%",
        description: "vs last month",
        icon: MdCheckCircle,
    },
    {
        title: "Dropped",
        value: "33",
        change: "-4.8%",
        description: "vs last month",
        icon: MdCancel,
    },
];

const quotations = [
    {
        id: "QT-2026-00125",
        customer: "ABC Industries",
        project: "Website Development",
        amount: "₹1,12,100",
        status: "Won",
        date: "16 Sep 2026",
    },
    {
        id: "QT-2026-00124",
        customer: "XYZ Technologies",
        project: "Mobile Application",
        amount: "₹85,000",
        status: "Draft",
        date: "15 Sep 2026",
    },
    {
        id: "QT-2026-00123",
        customer: "Demo Corporation",
        project: "ERP Development",
        amount: "₹2,10,500",
        status: "Submitted",
        date: "14 Sep 2026",
    },
    {
        id: "QT-2026-00122",
        customer: "Global Solutions",
        project: "Cloud Migration",
        amount: "₹3,45,000",
        status: "Won",
        date: "13 Sep 2026",
    },
    {
        id: "QT-2026-00121",
        customer: "Tech Systems",
        project: "DevOps Setup",
        amount: "₹95,000",
        status: "Dropped",
        date: "12 Sep 2026",
    },
];

const projects = [
    {
        name: "Website Development",
        customer: "ABC Industries",
        status: "Available",
        value: "₹2,50,000",
    },
    {
        name: "Mobile Application",
        customer: "XYZ Technologies",
        status: "In Progress",
        value: "₹4,20,000",
    },
    {
        name: "ERP Development",
        customer: "Demo Corporation",
        status: "Available",
        value: "₹6,80,000",
    },
];

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

                            <div className="mt-1 flex items-end justify-between">
                                <h3 className="text-2xl font-bold text-slate-900">
                                    {stat.value}
                                </h3>

                                <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                                    <MdKeyboardArrowUp size={16} />
                                    {stat.change}
                                </span>
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

                            {[
                                { month: "Apr", value: 45 },
                                { month: "May", value: 65 },
                                { month: "Jun", value: 52 },
                                { month: "Jul", value: 78 },
                                { month: "Aug", value: 62 },
                                { month: "Sep", value: 88 },
                            ].map((item) => (
                                <div
                                    key={item.month}
                                    className="flex h-full flex-1 flex-col justify-end"
                                >
                                    <div className="mb-2 text-center text-[10px] text-slate-400">
                                        ₹{item.value}L
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
                                            height: `${item.value * 2}px`,
                                        }}
                                    />

                                    <div className="mt-3 text-center text-[11px] text-slate-400">
                                        {item.month}
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
                                    "conic-gradient(#6366f1 0% 39%, #22c55e 39% 70%, #f59e0b 70% 83%, #ef4444 83% 100%)",
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
                                    245
                                </span>

                                <span className="text-[11px] text-slate-400">
                                    Total
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-7 space-y-3">
                        {[
                            ["Won", "96", "bg-emerald-500"],
                            ["Submitted", "84", "bg-indigo-500"],
                            ["Draft", "32", "bg-amber-500"],
                            ["Dropped", "33", "bg-red-500"],
                        ].map(([label, value, color]) => (
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