"use client";

import { useEffect, useState } from "react";
import QuotationLayout from "@/Components/Layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { MdAdd, MdClose, MdKeyboardArrowDown } from "react-icons/md";
import { useRouter } from "next/navigation";

type UserType = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
};

export default function UsersPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<UserType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    
    const roles = [
        { value: "SALES_EXECUTIVE", label: "Sales Executive" },
        { value: "FINANCE", label: "Finance" },
        { value: "ADMIN", label: "Admin" }
    ];

    // Form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("SALES_EXECUTIVE");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isLoading && user?.role !== "ADMIN") {
            router.replace("/");
        }
    }, [user, isLoading, router]);

    const loadUsers = async () => {
        try {
            const res = await fetch("/api/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    useEffect(() => {
        if (user?.role === "ADMIN") {
            loadUsers();
        }
    }, [user]);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password, role }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create user");
            
            setIsModalOpen(false);
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setRole("SALES_EXECUTIVE");
            loadUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create user");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || user?.role !== "ADMIN") return null;

    return (
        <QuotationLayout>
            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage portal access and roles.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex w-fit items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
                    >
                        <MdAdd size={20} /> Add User
                    </button>
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/55 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="border-b border-slate-200 bg-slate-50/50 uppercase text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-medium text-slate-800">{u.firstName} {u.lastName}</td>
                                        <td className="px-6 py-4">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                u.role === 'FINANCE' ? 'bg-emerald-100 text-emerald-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {u.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-slate-800">Add New User</h2>
                            <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                <MdClose size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-slate-600">First Name</label>
                                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-slate-600">Last Name</label>
                                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-slate-600">Email Address</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10" />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-slate-600">Password</label>
                                <input type="text" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10" />
                            </div>
                            <div className="relative">
                                <label className="mb-1.5 block text-xs font-medium text-slate-600">Role</label>
                                <button
                                    type="button"
                                    onClick={() => setIsRoleOpen(!isRoleOpen)}
                                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
                                >
                                    {roles.find(r => r.value === role)?.label || "Select Role"}
                                    <MdKeyboardArrowDown size={18} className={`text-slate-400 transition-transform ${isRoleOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {isRoleOpen && (
                                    <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                                        {roles.map((r) => (
                                            <button
                                                key={r.value}
                                                type="button"
                                                onClick={() => {
                                                    setRole(r.value);
                                                    setIsRoleOpen(false);
                                                }}
                                                className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                                                    role === r.value 
                                                        ? "bg-indigo-50 text-indigo-700" 
                                                        : "text-slate-700 hover:bg-slate-50"
                                                }`}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="pt-2">
                                <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-indigo-500 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 active:bg-indigo-700 disabled:opacity-50">
                                    {isSubmitting ? "Creating..." : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </QuotationLayout>
    );
}
