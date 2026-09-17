"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
    MdAdd,
    MdSearch,
    MdFilterList,
    MdFolderOpen,
    MdPerson,
    MdCalendarToday,
    MdCurrencyRupee,
    MdVisibility,
    MdCheckCircle,
    MdClose,
    MdMoreVert,
    MdChevronLeft,
    MdChevronRight,
    MdKeyboardArrowDown,
    MdOutlinePendingActions,
} from "react-icons/md";

type ProjectStatus =
    | "Available"
    | "In Progress"
    | "Quotation Created"
    | "Won"
    | "Dropped";

type Project = {
    id: string;
    name: string;
    customer: string;
    description: string;
    value: number;
    status: ProjectStatus;
    deadline: string;
    createdDate: string;
};

const projects: Project[] = [
    {
        id: "PRJ-2026-00125",
        name: "Website Development",
        customer: "ABC Industries",
        description:
            "Corporate website with CMS and admin dashboard",
        value: 250000,
        status: "Available",
        deadline: "30 Sep 2026",
        createdDate: "16 Sep 2026",
    },
    {
        id: "PRJ-2026-00124",
        name: "Mobile Application",
        customer: "XYZ Technologies",
        description:
            "React Native application for customer management",
        value: 420000,
        status: "Quotation Created",
        deadline: "05 Oct 2026",
        createdDate: "15 Sep 2026",
    },
    {
        id: "PRJ-2026-00123",
        name: "ERP Development",
        customer: "Demo Corporation",
        description:
            "Business ERP with inventory, sales and accounting",
        value: 680000,
        status: "In Progress",
        deadline: "20 Oct 2026",
        createdDate: "14 Sep 2026",
    },
    {
        id: "PRJ-2026-00122",
        name: "Cloud Migration",
        customer: "Global Solutions",
        description:
            "Migration of existing infrastructure to cloud",
        value: 345000,
        status: "Won",
        deadline: "15 Oct 2026",
        createdDate: "13 Sep 2026",
    },
    {
        id: "PRJ-2026-00121",
        name: "DevOps Setup",
        customer: "Tech Systems",
        description:
            "CI/CD, Docker and Kubernetes infrastructure setup",
        value: 195000,
        status: "Dropped",
        deadline: "25 Sep 2026",
        createdDate: "12 Sep 2026",
    },
    {
        id: "PRJ-2026-00120",
        name: "E-Commerce Platform",
        customer: "Smart Retail",
        description:
            "Online shopping platform with payment integration",
        value: 525000,
        status: "Available",
        deadline: "30 Oct 2026",
        createdDate: "11 Sep 2026",
    },
];

const statusConfig: Record<
    ProjectStatus,
    {
        className: string;
    }
> = {
    Available: {
        className:
            "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },

    "In Progress": {
        className:
            "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },

    "Quotation Created": {
        className:
            "bg-violet-500/10 text-violet-600 border-violet-500/20",
    },

    Won: {
        className:
            "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    },

    Dropped: {
        className:
            "bg-red-500/10 text-red-600 border-red-500/20",
    },
};

export default function ProjectsPage() {
    const [search, setSearch] = useState("");

    const [status, setStatus] = useState<
        ProjectStatus | "All"
    >("All");

    const [currentPage, setCurrentPage] = useState(1);

    const [selectedProject, setSelectedProject] =
        useState<Project | null>(null);

    const [showDropModal, setShowDropModal] =
        useState(false);

    const [dropReason, setDropReason] =
        useState("");

    const itemsPerPage = 6;

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value);

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const searchValue =
                search.toLowerCase();

            const matchesSearch =
                project.id
                    .toLowerCase()
                    .includes(searchValue) ||
                project.name
                    .toLowerCase()
                    .includes(searchValue) ||
                project.customer
                    .toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                status === "All" ||
                project.status === status;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [search, status]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredProjects.length /
            itemsPerPage
        )
    );

    const paginatedProjects =
        filteredProjects.slice(
            (currentPage - 1) *
            itemsPerPage,
            currentPage * itemsPerPage
        );

    const totalValue = projects.reduce(
        (sum, project) =>
            sum + project.value,
        0
    );

    const availableCount =
        projects.filter(
            (project) =>
                project.status === "Available"
        ).length;

    const quotationCount =
        projects.filter(
            (project) =>
                project.status ===
                "Quotation Created"
        ).length;

    const inProgressCount =
        projects.filter(
            (project) =>
                project.status ===
                "In Progress"
        ).length;

    const openDropModal = (
        project: Project
    ) => {
        setSelectedProject(project);
        setDropReason("");
        setShowDropModal(true);
    };

    const closeDropModal = () => {
        setShowDropModal(false);
        setSelectedProject(null);
        setDropReason("");
    };

    const handleDropProject = () => {
        if (!selectedProject) return;

        console.log({
            projectId: selectedProject.id,
            reason: dropReason,
        });

        closeDropModal();
    };

    return (
        <div className="space-y-6">

            {/* PAGE HEADER */}

            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

                <div>
                    <p className="text-sm text-slate-400">
                        Project Management
                    </p>

                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                        Projects
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        View available projects and manage project opportunities.
                    </p>
                </div>

                <button
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

                    Add Project
                </button>

            </div>

            {/* SUMMARY */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <SummaryCard
                    title="Total Projects"
                    value={projects.length.toString()}
                    icon={<MdFolderOpen size={21} />}
                />

                <SummaryCard
                    title="Available"
                    value={availableCount.toString()}
                    icon={<MdOutlinePendingActions size={21} />}
                />

                <SummaryCard
                    title="Quotation Created"
                    value={quotationCount.toString()}
                    icon={<MdCheckCircle size={21} />}
                />

                <SummaryCard
                    title="Total Project Value"
                    value={formatCurrency(totalValue)}
                    icon={<MdCurrencyRupee size={21} />}
                />

            </div>

            {/* SEARCH + FILTER */}

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

                <div className="flex flex-col gap-3 lg:flex-row">

                    {/* Search */}

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
                                setSearch(
                                    event.target.value
                                );
                                setCurrentPage(1);
                            }}
                            placeholder="Search project, customer..."
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

                    {/* Status */}

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
                                    | ProjectStatus
                                    | "All"
                                );

                                setCurrentPage(1);
                            }}
                            className="
                w-full
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
                lg:w-52
              "
                        >

                            <option value="All">
                                All Status
                            </option>

                            <option value="Available">
                                Available
                            </option>

                            <option value="Quotation Created">
                                Quotation Created
                            </option>

                            <option value="In Progress">
                                In Progress
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

            {/* PROJECT TABLE */}

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

                <div className="border-b border-white/40 px-6 py-5">

                    <h2 className="font-semibold text-slate-900">
                        Project Opportunities
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        {filteredProjects.length} projects found
                    </p>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1100px]">

                        <thead>

                            <tr className="border-b border-white/40 bg-white/25">

                                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Project
                                </th>

                                <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Customer
                                </th>

                                <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Value
                                </th>

                                <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Deadline
                                </th>

                                <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {paginatedProjects.map(
                                (project) => (
                                    <ProjectRow
                                        key={project.id}
                                        project={project}
                                        formatCurrency={
                                            formatCurrency
                                        }
                                        onDrop={() =>
                                            openDropModal(
                                                project
                                            )
                                        }
                                    />
                                )
                            )}

                            {paginatedProjects.length ===
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
                                                    No projects found
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
                            {filteredProjects.length === 0
                                ? 0
                                : (currentPage - 1) *
                                itemsPerPage +
                                1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium text-slate-600">
                            {Math.min(
                                currentPage *
                                itemsPerPage,
                                filteredProjects.length
                            )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-slate-600">
                            {filteredProjects.length}
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

                  ${currentPage === page
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

            {/* DROP PROJECT MODAL */}

            {showDropModal && selectedProject && (
                <div
                    className="
            fixed inset-0 z-[100]
            flex items-center justify-center
            bg-slate-900/30
            p-4
            backdrop-blur-sm
          "
                >

                    <div
                        className="
              w-full max-w-md
              rounded-3xl
              border border-white/50
              bg-white/80
              p-6
              shadow-[0_20px_80px_rgba(0,0,0,0.15)]
              backdrop-blur-2xl
            "
                    >

                        {/* Modal Header */}

                        <div className="flex items-start justify-between">

                            <div>

                                <div
                                    className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-2xl
                    bg-red-500/10
                    text-red-500
                  "
                                >
                                    <MdClose size={23} />
                                </div>

                                <h2 className="mt-4 text-lg font-bold text-slate-900">
                                    Drop Project
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Are you sure you want to drop this project?
                                </p>

                            </div>

                            <button
                                onClick={closeDropModal}
                                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-xl
                  text-slate-400
                  transition
                  hover:bg-white
                  hover:text-slate-700
                "
                            >
                                <MdClose size={20} />
                            </button>

                        </div>

                        {/* Project */}

                        <div
                            className="
                mt-5
                rounded-2xl
                border border-white/60
                bg-white/50
                p-4
              "
                        >

                            <p className="text-xs text-slate-400">
                                Project
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                {selectedProject.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {selectedProject.id} •{" "}
                                {selectedProject.customer}
                            </p>

                        </div>

                        {/* Reason */}

                        <div className="mt-5">

                            <label className="mb-2 block text-xs font-medium text-slate-600">
                                Reason for dropping
                            </label>

                            <textarea
                                value={dropReason}
                                onChange={(event) =>
                                    setDropReason(
                                        event.target.value
                                    )
                                }
                                rows={4}
                                placeholder="Enter the reason..."
                                className="
                  w-full
                  resize-none
                  rounded-2xl
                  border border-slate-200/70
                  bg-white/60
                  px-4 py-3
                  text-sm
                  text-slate-800
                  outline-none
                  placeholder:text-slate-400
                  focus:border-red-400
                  focus:ring-2
                  focus:ring-red-500/10
                "
                            />

                        </div>

                        {/* Buttons */}

                        <div className="mt-6 flex gap-3">

                            <button
                                onClick={closeDropModal}
                                className="
                  flex-1
                  rounded-2xl
                  border border-white/70
                  bg-white/60
                  px-4 py-3
                  text-sm font-medium
                  text-slate-600
                  transition
                  hover:bg-white
                "
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDropProject}
                                disabled={!dropReason.trim()}
                                className="
                  flex-1
                  rounded-2xl
                  bg-red-500
                  px-4 py-3
                  text-sm font-medium
                  text-white
                  shadow-lg
                  shadow-red-500/20
                  transition
                  hover:bg-red-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                            >
                                Drop Project
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
/* PROJECT ROW                      */
/* -------------------------------- */

function ProjectRow({
    project,
    formatCurrency,
    onDrop,
}: {
    project: Project;
    formatCurrency: (
        value: number
    ) => string;
    onDrop: () => void;
}) {
    const status =
        statusConfig[project.status];

    return (
        <tr
            className="
        border-b border-white/30
        transition
        hover:bg-white/40
      "
        >

            {/* PROJECT */}

            <td className="px-6 py-4">

                <div className="flex items-center gap-3">

                    <div
                        className="
              flex h-10 w-10
              shrink-0
              items-center justify-center
              rounded-xl
              bg-indigo-500/10
              text-indigo-600
            "
                    >
                        <MdFolderOpen size={21} />
                    </div>

                    <div>

                        <Link
                            href={`/quotation/projects/${project.id}`}
                            className="
                text-sm
                font-semibold
                text-slate-800
                transition
                hover:text-indigo-600
              "
                        >
                            {project.name}
                        </Link>

                        <p className="mt-1 text-[11px] text-slate-400">
                            {project.id}
                        </p>

                    </div>

                </div>

            </td>

            {/* CUSTOMER */}

            <td className="px-4 py-4">

                <div className="flex items-center gap-2">

                    <div
                        className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              bg-white/70
              text-slate-400
            "
                    >
                        <MdPerson size={17} />
                    </div>

                    <span className="text-sm text-slate-600">
                        {project.customer}
                    </span>

                </div>

            </td>

            {/* VALUE */}

            <td className="px-4 py-4">

                <p className="text-sm font-semibold text-slate-800">
                    {formatCurrency(project.value)}
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                    Estimated value
                </p>

            </td>

            {/* DEADLINE */}

            <td className="px-4 py-4">

                <div className="flex items-center gap-2">

                    <MdCalendarToday
                        size={15}
                        className="text-slate-400"
                    />

                    <span className="text-xs text-slate-500">
                        {project.deadline}
                    </span>

                </div>

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
            ${status.className}
          `}
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {project.status}
                </span>

            </td>

            {/* ACTIONS */}

            <td className="px-6 py-4">

                <div className="flex justify-end gap-1">

                    {/* View */}

                    <Link
                        href={`/quotation/projects/${project.id}`}
                        title="View Project"
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

                    {/* Get Project */}

                    {project.status ===
                        "Available" && (
                            <Link
                                href={`/quotation/create?project=${project.id}`}
                                title="Create Quotation"
                                className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                text-emerald-500
                transition
                hover:bg-emerald-500/10
              "
                            >
                                <MdCheckCircle size={19} />
                            </Link>
                        )}

                    {/* Drop */}

                    {project.status ===
                        "Available" && (
                            <button
                                onClick={onDrop}
                                title="Drop Project"
                                className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                text-red-400
                transition
                hover:bg-red-500/10
                hover:text-red-500
              "
                            >
                                <MdClose size={19} />
                            </button>
                        )}

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