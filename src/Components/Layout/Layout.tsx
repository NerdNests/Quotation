"use client";

import Header from "@/Components/Layout/Header";
import Sidebar from "@/Components/Layout/Sidebar";
import { useState } from "react";

export default function QuotationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 via-white to-indigo-50">
            {/* Background Glassmorphism Effects */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl" />

                <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-violet-300/20 blur-3xl" />

                <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />
            </div>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />

            {/* Main Content */}
            <main
                className={`
          relative min-h-screen
          transition-all duration-300 ease-in-out
          ${collapsed
                        ? "md:pl-25.5"
                        : "md:pl-68.5"
                    }
        `}
            >
                {/* Header */}
                <Header onMobileMenu={() => setMobileMenuOpen(true)} />

                {/* Page Content */}
                <div className="px-4 pb-6 pt-6 sm:px-6">
                    {children}
                </div>
            </main>
        </div>
    );
}