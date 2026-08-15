"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { can, PERMISSIONS } from "@/lib/utils/permissions";
import { isSuperAdmin } from "@/lib/utils/roles";
import { LogOut, ChevronDown, Film, User, Shield, PlusCircle, CalendarDays, LayoutGrid, Building2, Ticket, Percent, KeyRound } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminNavbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user, logout } = useAuth();
    const canFn = (permission: string) => can(user?.role, user?.permissions, permission as never);

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

    const displayName = user?.name || user?.username || user?.email || "Admin";

    return (
        <nav className="bg-[var(--nav-bg)] border-b border-[var(--nav-border)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <Film className="w-6 h-6 text-[#e63329]" />
                        <Link href="/admin/dashboard" className="text-[var(--text-primary)] text-xl font-bold tracking-[0.15em] uppercase">
                            Cine<span className="text-[#e63329]">Book</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
                            >
                                <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-center">
                                    <User className="w-4 h-4 text-[var(--text-tertiary)]" />
                                </div>
                                <span className="hidden sm:block text-sm font-medium text-[var(--text-primary)]">{displayName}</span>
                                <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-[var(--dropdown-bg)] border border-[var(--border-color)] rounded-lg shadow-xl py-1 z-50">
                                    <div className="px-4 py-3 border-b border-[var(--border-color)]">
                                        <p className="text-sm text-[var(--text-primary)] font-medium truncate">{displayName}</p>
                                        <p className="text-xs text-[var(--text-tertiary)] truncate">{user?.email}</p>
                                    </div>

                                    <div className="py-1">
                                        <Link href="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--dropdown-hover)] transition">
                                            <Film className="w-4 h-4" /> Analytics
                                        </Link>
                                        {canFn(PERMISSIONS.USER_MANAGE) && (
                                            <Link href="/admin/users" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--dropdown-hover)] transition">
                                                <Shield className="w-4 h-4" /> Users
                                            </Link>
                                        )}
                                        {isSuperAdmin(user?.role) && (
                                            <Link href="/super-admin/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--dropdown-hover)] transition">
                                                <KeyRound className="w-4 h-4" /> Admin Panel
                                            </Link>
                                        )}
                                        {canFn(PERMISSIONS.BOOKING_VIEW) && (
                                            <Link href="/admin/bookings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--dropdown-hover)] transition">
                                                <Ticket className="w-4 h-4" /> Bookings
                                            </Link>
                                        )}
                                        {canFn(PERMISSIONS.MOVIE_CREATE) && (
                                            <Link href="/admin/movies/new" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--dropdown-hover)] transition">
                                                <PlusCircle className="w-4 h-4" /> New Movie
                                            </Link>
                                        )}
                                    {canFn(PERMISSIONS.SHOWTIME_CREATE) && (
                                            <>
                                                <Link href="/admin/showtimes/new" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--dropdown-hover)] transition">
                                                    <CalendarDays className="w-4 h-4" /> New Showtime
                                                </Link>
                                                <Link href="/admin/showtimes" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--dropdown-hover)] transition">
                                                    <CalendarDays className="w-4 h-4" /> Manage Showtimes
                                                </Link>
                                            </>
                                        )}
                                        {canFn(PERMISSIONS.DISCOUNT_MANAGE) && (
                                            <Link href="/admin/discounts" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--dropdown-hover)] transition">
                                                <Percent className="w-4 h-4" /> Discounts
                                            </Link>
                                        )}
                                        {canFn(PERMISSIONS.HALL_MANAGE) && (
                                            <>
                                                <Link href="/admin/halls/new" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--dropdown-hover)] transition">
                                                    <LayoutGrid className="w-4 h-4" /> New Hall
                                                </Link>
                                                <Link href="/admin/halls" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--dropdown-hover)] transition">
                                                    <LayoutGrid className="w-4 h-4" /> Manage Halls
                                                </Link>
                                            </>
                                        )}
                                        {canFn(PERMISSIONS.CINEMA_MANAGE) && (
                                            <Link href="/admin/cinemas/new" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--dropdown-hover)] transition">
                                                <Building2 className="w-4 h-4" /> New Cinema
                                            </Link>
                                        )}
                                    </div>

                                    <div className="border-t border-[var(--border-color)] mt-1 pt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[var(--error)] hover:text-red-300 hover:bg-[var(--dropdown-hover)] transition"
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
            </div>
        </nav>
    );
}
