"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchMyBookings, BookingHistoryItem } from "@/lib/api/booking-history";
import { Loader2 } from "lucide-react";

const asString = (val: unknown): string => (typeof val === "object" && val !== null ? String((val as any)._id ?? "") : String(val ?? ""));
const movieTitle = (v: unknown) => (typeof v === "object" && v !== null ? (v as any).title : "");
const cinemaName = (v: unknown) => (typeof v === "object" && v !== null ? (v as any).name : "");
const hallName = (v: unknown) => (typeof v === "object" && v !== null ? (v as any).name : "");

const formatShowDate = (d?: string) => {
    if (!d) return "";
    const date = new Date(d);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString();
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBookings = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await fetchMyBookings();
                setBookings(result);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load bookings");
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Your Bookings</h1>
                <p className="text-gray-400">Review your ticket reservations and booking status.</p>
            </div>

            {loading ? (
                <div className="rounded-3xl border border-white/10 bg-[#111] p-10 text-center text-gray-400">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-yellow-400" />
                    <p className="mt-4">Loading your bookings…</p>
                </div>
            ) : error ? (
                <div className="rounded-3xl border border-rose-500/20 bg-[#111] p-10 text-center text-rose-300">
                    {error}
                </div>
            ) : bookings.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-[#111] p-10 text-center text-gray-400">
                    You don&apos;t have any bookings yet. Book a movie to see it here.
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="rounded-[2rem] border border-white/10 bg-[#111] p-6 shadow-black/20 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Booking code</p>
                                    <p className="text-lg font-semibold text-white">{booking.bookingCode}</p>
                                </div>
                                <div className="rounded-full bg-yellow-400/10 px-4 py-2 text-sm uppercase tracking-[0.2em] text-yellow-300">
                                    {booking.bookingStatus}
                                </div>
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Seats</p>
                                    <p className="mt-1 text-white">{booking.seatCount} seats</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Total paid</p>
                                    <p className="mt-1 text-white">${booking.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-gray-400 space-y-2">
                                <p>Movie: <Link href={`/movies/${asString(booking.movieId)}`} className="text-white hover:text-yellow-400 transition">{movieTitle(booking.movieId) || asString(booking.movieId)}</Link></p>
                                <p>Cinema: <span className="text-white">{cinemaName(booking.cinemaId) || asString(booking.cinemaId)}</span></p>
                                <p>Hall: <span className="text-white">{hallName(booking.hallId) || asString(booking.hallId)}</span></p>
                                <p>
                                    Showtime:{" "}
                                    <span className="text-white">
                                        {typeof booking.showtimeId === "object" && booking.showtimeId
                                            ? `${formatShowDate(booking.showtimeId.showDate)} ${booking.showtimeId.startTime ?? ""}${booking.showtimeId.endTime ? ` - ${booking.showtimeId.endTime}` : ""}`
                                            : asString(booking.showtimeId)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
