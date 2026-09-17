"use client";

import {
  MdNotificationsNone,
  MdSearch,
  MdAdd,
  MdMenu,
} from "react-icons/md";

interface HeaderProps {
  onMobileMenu?: () => void;
}

export default function Header({
  onMobileMenu,
}: Readonly<HeaderProps>) {
  return (
    <header
      className="
        sticky top-4 z-40
        mx-4
        h-18
        rounded-3xl
        border border-white/40
        bg-white/60
        px-5
        backdrop-blur-2xl
        shadow-[0_8px_40px_rgba(0,0,0,0.06)]
      "
    >
      <div className="flex h-full items-center justify-between gap-4">

        {/* Left */}
        <div className="flex items-center gap-3">

          <button
            onClick={onMobileMenu}
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-white/60
              text-slate-600
              md:hidden
            "
          >
            <MdMenu size={23} />
          </button>

          <div className="hidden sm:block">
            <p className="text-xs text-slate-400">
              Welcome back
            </p>

            <h2 className="text-lg font-semibold text-slate-900">
              Quotation Portal
            </h2>
          </div>
        </div>

        {/* Search */}
        <div className="hidden max-w-md flex-1 md:flex">
          <div
            className="
              flex w-full
              items-center gap-3
              rounded-2xl
              border border-white/50
              bg-white/40
              px-4 py-2.5
              backdrop-blur-xl
              transition

              focus-within:bg-white/70
              focus-within:shadow-lg
            "
          >
            <MdSearch
              size={21}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="Search quotations, projects..."
              className="
                w-full
                bg-transparent
                text-sm
                text-slate-800
                outline-none
                placeholder:text-slate-400
              "
            />

            <kbd
              className="
                hidden
                rounded-lg
                bg-slate-100/80
                px-2 py-1
                text-[10px]
                text-slate-400
                lg:block
              "
            >
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">

          {/* New Quotation */}
          <button
            className="
              hidden sm:flex
              items-center gap-2
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
            <MdAdd size={20} />

            New Quotation
          </button>

          {/* Notification */}
          <button
            className="
              relative
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              border border-white/40
              bg-white/50
              text-slate-600
              backdrop-blur-xl
              transition
              hover:bg-white/80
            "
          >
            <MdNotificationsNone size={21} />

            <span
              className="
                absolute right-2 top-2
                h-2 w-2
                rounded-full
                bg-red-500
                ring-2 ring-white
              "
            />
          </button>

          {/* Profile */}
          <button
            className="
              flex items-center gap-2
              rounded-2xl
              border border-white/40
              bg-white/50
              p-1.5 pr-3
              backdrop-blur-xl
              transition
              hover:bg-white/80
            "
          >
            <div
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                bg-linear-to-br
                from-slate-700
                to-slate-900
                text-xs font-semibold
                text-white
              "
            >
              V
            </div>

            <span className="hidden text-sm font-medium text-slate-700 lg:block">
              Vishnu
            </span>
          </button>

        </div>
      </div>
    </header>
  );
}