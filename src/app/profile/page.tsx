"use client";

import QuotationLayout from "@/Components/Layout/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            return setError("New password and confirm password do not match");
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/profile/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update password");
            
            setSuccess("Password updated successfully");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update password");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <QuotationLayout>
            <div className="mx-auto max-w-2xl py-8">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6">Profile Settings</h1>
                
                <div className="rounded-3xl border border-white/60 bg-white/60 p-6 shadow-xl backdrop-blur-2xl sm:p-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Personal Information</h2>
                    
                    <div className="mb-8 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                            <p className="text-xs font-medium text-slate-400 mb-1">Full Name</p>
                            <p className="font-medium text-slate-800">{user?.firstName || "Unknown"} {user?.lastName}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                            <p className="text-xs font-medium text-slate-400 mb-1">Email Address</p>
                            <p className="font-medium text-slate-800 truncate">{user?.email}</p>
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Change Password</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
                        {success && <p className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">{success}</p>}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Old Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={e => setOldPassword(e.target.value)}
                                required
                                className="h-12 w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/70 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-indigo-200 hover:bg-white/90 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                            />
                        </div>
                        
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                                className="h-12 w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/70 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-indigo-200 hover:bg-white/90 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                className="h-12 w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/70 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-indigo-200 hover:bg-white/90 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-12 w-full max-w-md rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {isSubmitting ? "Updating Password..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </QuotationLayout>
    );
}
