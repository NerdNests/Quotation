"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdAddCircleOutline,
  MdDescription,
  MdFolderOpen,
  MdReceiptLong,
  MdChevronLeft,
  MdChevronRight,
  MdGroup,
  MdAttachMoney,
  MdCancel,
} from "react-icons/md";
import { useAuth } from "@/contexts/AuthContext";


interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const baseMenuItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: MdDashboard,
  },
  {
    label: "Create Quotation",
    href: "/quotation/create",
    icon: MdAddCircleOutline,
  },
  {
    label: "Quotations",
    href: "/quotation/list",
    icon: MdDescription,
  },
  {
    label: "Projects",
    href: "/quotation/projects",
    icon: MdFolderOpen,
  },
  {
    label: "Payments",
    href: "/payment",
    icon: MdAttachMoney,
  },
  {
    label: "Invoices",
    href: "/invoice",
    icon: MdReceiptLong,
  },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
}: Readonly<SidebarProps>) {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    ...baseMenuItems,
    ...(user?.role === "ADMIN" ? [
      { label: "Dropped Quotes", href: "/dropped-quotations", icon: MdCancel },
      { label: "Users", href: "/users", icon: MdGroup }
    ] : [])
  ];

  return (
    <aside
      className={`
        fixed left-4 top-4 bottom-4 z-50
        flex flex-col
        rounded-3xl
        border border-white/40
        bg-white/60
        backdrop-blur-2xl
        shadow-[0_8px_40px_rgba(0,0,0,0.08)]
        transition-all duration-300
        ${collapsed ? "w-19.5" : "w-62.5"}
      `}
    >
      {/* Logo */}
      <div
        className={`
          flex h-20 items-center
          border-b border-white/30
          px-5
          ${collapsed ? "justify-center" : "justify-between"}
        `}
      >
        {!collapsed ? (
          <Link
            href="/quotation/dashboard"
            className="flex items-center gap-3"
          >
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-2xl
                bg-linear-to-br
                from-indigo-500 to-violet-600
                text-lg font-bold text-white
                shadow-lg shadow-indigo-500/20
              "
            >
              Q
            </div>

            <div>
              <h1 className="text-sm font-bold text-slate-900">
                Quotation
              </h1>

              <p className="text-[11px] text-slate-500">
                Management Portal
              </p>
            </div>
          </Link>
        ) : (
          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-2xl
              bg-linear-to-br
              from-indigo-500 to-violet-600
              font-bold text-white
              shadow-lg
            "
          >
            Q
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto min-h-0 space-y-2 px-3 py-6 no-scrollbar">
        {!collapsed && (
          <p
            className="
              mb-3 px-3
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            Workspace
          </p>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`
                group relative
                flex items-center gap-3
                rounded-2xl
                px-3 py-3
                transition-all duration-200

                ${isActive
                  ? `
                      bg-linear-to-r
                      from-indigo-500/90
                      to-violet-500/90
                      text-white
                      shadow-lg
                      shadow-indigo-500/20
                    `
                  : `
                      text-slate-600
                      hover:bg-white/70
                      hover:text-slate-900
                    `
                }

                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon
                size={21}
                className={`
                  shrink-0
                  transition-transform
                  group-hover:scale-105

                  ${isActive
                    ? "text-white"
                    : "text-slate-500"
                  }
                `}
              />

              {!collapsed && (
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              )}

              {isActive && !collapsed && (
                <span
                  className="
                    absolute right-3
                    h-1.5 w-1.5
                    rounded-full
                    bg-white
                    shadow-[0_0_10px_rgba(255,255,255,0.8)]
                  "
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-white/30 p-3">
        <div
          className={`
            flex items-center gap-3
            rounded-2xl
            bg-white/40
            p-3
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-xl
              bg-slate-900
              text-xs font-semibold
              text-white
            "
          >
            {(user?.firstName?.charAt(0) || "U") + (user?.lastName?.charAt(0) || "")}
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.firstName} {user?.lastName}
              </p>

              <p className="truncate text-[11px] text-slate-500">
                {user?.role === "SALES_EXECUTIVE" ? "Sales Executive" : user?.role === "FINANCE" ? "Finance" : "Administrator"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          absolute -right-3 top-24
          flex h-7 w-7
          items-center justify-center
          rounded-full
          border border-white/60
          bg-white/80
          text-slate-600
          shadow-lg
          backdrop-blur-xl
          transition
          hover:bg-white
        "
      >
        {collapsed ? (
          <MdChevronRight size={18} />
        ) : (
          <MdChevronLeft size={18} />
        )}
      </button>
    </aside>
  );
}
