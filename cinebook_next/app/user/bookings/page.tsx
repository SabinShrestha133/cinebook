"use client";

import { useEffect, useState } from "react";
import { fetchMyBookings, BookingHistoryItem } from "@/lib/api/booking-history";
import { Loader2 } from "lucide-react";

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
                                <p>Showtime ID: <span className="text-white">{booking.showtimeId}</span></p>
                                <p>Movie ID: <span className="text-white">{booking.movieId}</span></p>
                                <p>Hall ID: <span className="text-white">{booking.hallId}</span></p>
                                <p>Cinema ID: <span className="text-white">{booking.cinemaId}</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
