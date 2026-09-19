"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "ADMIN" | "FINANCE" | "SALES_EXECUTIVE";
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Skip auth check on login page
        if (pathname === "/login") {
            setIsLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (!res.ok) {
                    router.push("/login");
                    return;
                }
                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                console.error(err);
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [pathname, router]);

    return (
        <AuthContext.Provider value={{ user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
