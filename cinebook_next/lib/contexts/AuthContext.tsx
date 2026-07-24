"use client";

import { createContext, useContext, useEffect, useState, type ReactNode, useRef } from "react";
import { type User } from "@/lib/api/auth";
import { login as apiLogin, logout as apiLogout, whoami } from "@/lib/api/auth";

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const mountedRef = useRef(false);

    const refreshUser = async () => {
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!storedToken) {
            setLoading(false);
            return;
        }
        setToken(storedToken);
        try {
            const res = await whoami();
            const payload = res as { data?: { user?: unknown }; user?: unknown } | unknown;
            const userData = (payload as { data?: { user?: unknown }; user?: unknown })?.data?.user ?? (payload as { user?: unknown })?.user ?? payload;
            if (userData && typeof userData === "object" && "_id" in userData) {
                setUser(userData as unknown as User);
            } else {
                setUser(null);
                if (typeof window !== "undefined") {
                    localStorage.removeItem("token");
                }
                setToken(null);
            }
        } catch {
            setUser(null);
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
            }
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        mountedRef.current = true;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        refreshUser();
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const login = async (email: string, password: string) => {
        const result = await apiLogin({ email, password });
        const payload = result as { data?: { token?: string; user?: User } };
        if (payload?.data?.token && payload.data.user) {
            localStorage.setItem("token", payload.data.token);
            localStorage.setItem("user", JSON.stringify(payload.data.user));
            setToken(payload.data.token);
            setUser(payload.data.user);
        }
    };

    const logout = () => {
        apiLogout();
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
