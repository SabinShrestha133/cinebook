"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { handleGetDashboard } from "@/lib/actions/admin-action";
import { type DashboardSummary } from "@/lib/api/admin";
import { Loader2, Ticket, Film, Building2, DollarSign, CalendarPlus, Users, LayoutGrid, BarChart3, Percent, KeyRound } from "lucide-react";
import { isSuperAdmin } from "@/lib/utils/roles";
import { useAuth } from "@/lib/contexts/AuthContext";

function AdminDashboardContent() {
    const { user } = useAuth();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            const res = await handleGetDashboard();
            if (res.success && res.data) {
                setSummary(res.data);
            } else {
                setError(res.message || "Failed to load dashboard");
            }
            setLoading(false);
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    const stats = summary
        ? [
              { label: "Total Bookings", value: summary.totalBookings, icon: Ticket },
              { label: "Total Movies", value: summary.totalMovies, icon: Film },
{ label: "Total Cinemas", value: summary.totalCinemas, icon: Building2 },
            { label: "Total Showtimes", value: summary.totalShowtimes, icon: CalendarPlus },
            {
                label: "Revenue (Paid)",
                  value: `Rs. ${summary.revenue.toLocaleString()}`,
                  icon: DollarSign,
              },
          ]
        : [];

    const quickActions = [
        { href: "/admin/dashboard", label: "Analytics", icon: BarChart3, primary: true },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/movies", label: "Movies", icon: Film },
        { href: "/admin/cinemas", label: "Cinemas", icon: Building2 },
        { href: "/admin/showtimes", label: "Showtimes", icon: CalendarPlus },
        { href: "/admin/halls", label: "Halls", icon: LayoutGrid },
        { href: "/admin/discounts", label: "Discounts", icon: Percent },
        ...(isSuperAdmin(user?.role) ? [{ href: "/super-admin/dashboard", label: "Admin Panel", icon: KeyRound, superAdmin: true as const }] : []),
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-white text-3xl font-bold tracking-wide">Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Platform overview and management</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={action.href}
                                href={action.href}
                                className={`flex flex-col items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-center transition ${
                                    action.primary
                                        ? "bg-yellow-400 border-yellow-400 text-black hover:bg-yellow-300"
                                        : action.superAdmin
                                            ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-300 hover:border-yellow-400 hover:text-yellow-200"
                                            : "bg-white/5 border-white/10 text-white hover:border-yellow-400 hover:text-yellow-300"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-xs font-bold uppercase tracking-wide">{action.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6"
                        >
                            <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center mb-4">
                                <Icon className="w-5 h-5 text-yellow-400" />
                            </div>
                            <p className="text-gray-500 text-xs uppercase tracking-wide">{stat.label}</p>
                            <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    return <AdminDashboardContent />;
}
