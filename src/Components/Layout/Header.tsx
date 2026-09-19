"use client";

import {
  MdNotificationsNone,
  MdAdd,
  MdMenu,
  MdLogout,
  MdEdit,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface HeaderProps {
  onMobileMenu?: () => void;
}

export default function Header({
  onMobileMenu,
}: Readonly<HeaderProps>) {
  const router = useRouter();
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => {
          if (!res.ok) {
              router.push("/login");
              return null;
          }
          return res.json();
      })
      .then(data => {
        if (data?.user) setUser(data.user);
      })
      .catch(console.error);
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const initials = user 
    ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "U"
    : "U";

  return (
    <>
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
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 text-slate-600 md:hidden"
            >
              <MdMenu size={23} />
            </button>

            <div className="hidden sm:block">
              <p className="text-xs text-slate-400">Welcome back</p>
              <h2 className="text-lg font-semibold text-slate-900">Quotation Portal</h2>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">

            {/* New Quotation */}
            <button className="hidden sm:flex items-center gap-2 rounded-2xl bg-linear-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5">
              <MdAdd size={20} />
              New Quotation
            </button>

            {/* Notification */}
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/40 bg-white/50 text-slate-600 backdrop-blur-xl transition hover:bg-white/80">
              <MdNotificationsNone size={21} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Profile Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              {/* Profile Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-2xl border border-white/40 bg-white/50 p-1.5 pr-3 backdrop-blur-xl transition hover:bg-white/80"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-slate-700 to-slate-900 text-xs font-semibold text-white">
                  {initials}
                </div>
                <span className="hidden text-sm font-medium text-slate-700 lg:block">
                  {user?.firstName || "User"}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 z-50 rounded-2xl border border-white/40 bg-white/95 p-2 shadow-2xl backdrop-blur-3xl">
                      <div className="p-3 mb-2 border-b border-slate-200/50">
                          <p className="font-semibold text-slate-800 truncate">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      
                      <button 
                          onClick={() => { setIsDropdownOpen(false); router.push("/profile"); }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-white/60 hover:text-slate-900"
                      >
                          <MdEdit size={18} /> Edit Profile
                      </button>
                      
                      <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                      >
                          <MdLogout size={18} /> Logout
                      </button>
                  </div>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  );
}