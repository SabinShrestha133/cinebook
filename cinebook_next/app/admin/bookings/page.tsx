"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { handleListAllBookings } from "@/lib/actions/admin-action";
import { AdminBooking } from "@/lib/api/admin";
import { Ticket, RefreshCw, Search, Loader2 } from "lucide-react";

export default function AdminBookingsPage() {
    return <BookingsContent />;
}

function BookingsContent() {
    const [bookings, setBookings] = useState<AdminBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const loadBookings = async () => {
        setLoading(true);
        setError("");
        const res = await handleListAllBookings();
        if (res.success && res.data) {
            setBookings(res.data);
        } else {
            setError(res.message || "Failed to load bookings");
        }
        setLoading(false);
    };

    useEffect(() => {
        const init = async () => {
            await loadBookings();
        };
        init();
    }, []);

    const filtered = bookings.filter((b) => {
        const term = search.toLowerCase();
        return (
            b.user.name.toLowerCase().includes(term) ||
            b.user.email.toLowerCase().includes(term) ||
            b.movieTitle.toLowerCase().includes(term) ||
            b.cinemaName.toLowerCase().includes(term) ||
            b.bookingCode.toLowerCase().includes(term)
        );
    });

    const statusClass = (status: string) => {
        switch (status) {
            case "confirmed":
            case "paid":
            case "checked_in":
                return "bg-green-500/10 text-green-400";
            case "cancelled":
            case "refunded":
            case "failed":
            case "expired":
                return "bg-red-500/10 text-red-400";
            case "reserved":
            case "pending_payment":
                return "bg-yellow-500/10 text-yellow-400";
            default:
                return "bg-gray-500/10 text-gray-400";
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                        <Ticket className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                        <h1 className="text-white text-2xl font-bold tracking-wide">Bookings</h1>
                        <p className="text-gray-500 text-sm">See who booked which movie, seat and showtime</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadBookings}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
                    >
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search bookings..."
                            className="pl-9 bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 transition"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">{error}</div>
            )}

            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[920px]">
                        <thead>
                            <tr className="text-gray-500 text-xs uppercase tracking-wide border-b border-white/5">
                                <th className="text-left font-medium px-4 py-3">User</th>
                                <th className="text-left font-medium px-4 py-3">Movie</th>
                                <th className="text-left font-medium px-4 py-3">Cinema</th>
                                <th className="text-left font-medium px-4 py-3">Showtime</th>
                                <th className="text-left font-medium px-4 py-3">Seats</th>
                                <th className="text-right font-medium px-4 py-3">Amount</th>
                                <th className="text-center font-medium px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-10">
                                        <Loader2 className="w-6 h-6 animate-spin text-yellow-400 mx-auto" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center text-gray-500 px-6 py-8">No bookings found</td>
                                </tr>
                            ) : (
                                filtered.map((b) => (
                                    <tr key={b._id} className="border-b border-white/5 last:border-0 align-top">
                                        <td className="px-4 py-3 text-white">
                                            {b.user.name}
                                            <div className="text-xs text-gray-500">{b.user.email}</div>
                                            <div className="text-[11px] text-gray-600">{b.bookingCode}</div>
                                        </td>
                                        <td className="px-4 py-3 text-white">
                                            <Link href={`/movies/${b.movieSlug}`} className="hover:text-yellow-400 transition">
                                                {b.movieTitle}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400">{b.cinemaName}</td>
                                        <td className="px-4 py-3 text-gray-400">
                                            {b.showtime.showDate ? new Date(b.showtime.showDate).toLocaleDateString() : "—"}
                                            <div className="text-xs text-gray-500">
                                                {b.showtime.startTime}{b.showtime.endTime ? ` - ${b.showtime.endTime}` : ""}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-300">
                                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                                                {b.seats.map((s) => (
                                                    <span key={s.seatId} className="px-2 py-0.5 rounded bg-white/5 text-xs text-gray-200">
                                                        {s.label || s.seatId}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="text-[11px] text-gray-500 mt-1">{b.seatCount} seat(s)</div>
                                        </td>
                                        <td className="px-4 py-3 text-right text-yellow-400 font-medium">Rs. {b.totalAmount.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClass(b.bookingStatus)}`}>
                                                    {b.bookingStatus}
                                                </span>
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium ${statusClass(b.paymentStatus)}`}>
                                                    {b.paymentStatus}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
