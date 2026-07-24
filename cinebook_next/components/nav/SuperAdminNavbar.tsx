"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { LogOut, ChevronDown, Shield, User, Film } from "lucide-react";

export default function SuperAdminNavbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const displayName = user?.name || user?.username || user?.email || "Super Admin";

    return (
        <nav className="bg-[#111] border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-[#e63329]" />
                        <Link href="/super-admin/dashboard" className="text-white text-xl font-bold tracking-[0.15em] uppercase">
                            Cine<span className="text-[#e63329]">Book</span>
                        </Link>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#222] border border-white/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-400" />
                            </div>
                            <span className="hidden sm:block text-sm font-medium">{displayName}</span>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl py-1 z-50">
                                <div className="px-4 py-3 border-b border-white/5">
                                    <p className="text-sm text-white font-medium truncate">{displayName}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>

                                <div className="py-1">
                                    <Link href="/super-admin/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">
                                        <Shield className="w-4 h-4" /> Admin Panel
                                    </Link>
                                    <Link href="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">
                                        <Film className="w-4 h-4" /> Admin Console
                                    </Link>
                                </div>

                                <div className="border-t border-white/5 mt-1 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
