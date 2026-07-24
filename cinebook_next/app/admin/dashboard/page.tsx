"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { handleGetDashboard } from "@/lib/actions/admin-action";
import { type DashboardSummary } from "@/lib/api/admin";
import { Loader2, Ticket, Film, Building2, DollarSign, PlusCircle, CalendarPlus } from "lucide-react";

function AdminDashboardContent() {
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
              {
                  label: "Revenue (Paid)",
                  value: `Rs. ${summary.revenue.toLocaleString()}`,
                  icon: DollarSign,
              },
          ]
        : [];

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-white text-3xl font-bold tracking-wide">Analytics</h1>
                    <p className="text-gray-500 text-sm mt-1">Platform overview and statistics</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/movies/new"
                        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold px-4 py-2.5 rounded-lg transition"
                    >
                        <PlusCircle className="w-4 h-4" /> New Movie
                    </Link>
                    <Link
                        href="/admin/showtimes/new"
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
                    >
                        <CalendarPlus className="w-4 h-4" /> New Showtime
                    </Link>
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
