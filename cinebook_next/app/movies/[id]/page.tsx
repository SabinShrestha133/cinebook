"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Movie } from "@/lib/api/movie";
import { Showtime, ShowtimeHall } from "@/lib/api/showtime";
import { loadMovieDetail, loadShowtimesForMovie } from "@/lib/actions/detail-action";
import { submitBooking } from "@/lib/actions/booking-action";
import { getSeatsByHall, type Seat } from "@/lib/api/hall";
import { Loader2, ArrowLeft } from "lucide-react";

interface SeatView {
    seatId: string;
    label: string;
    rowLabel: string;
    seatNumber: number;
    seatType: string;
    status: string;
    available: boolean;
    booked: boolean;
}

export default function MovieDetailPage() {
    const params = useParams();
    const router = useRouter();
    const movieId = params?.id as string;

    const [movie, setMovie] = useState<Movie | null>(null);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingMessage, setBookingMessage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedShowtime = useMemo(() => {
        return showtimes.find((item) => item._id === selectedShowtimeId) ?? null;
    }, [showtimes, selectedShowtimeId]);

    useEffect(() => {
        if (!movieId) return;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [movieDetail, movieShowtimes] = await Promise.all([
                    loadMovieDetail(movieId),
                    loadShowtimesForMovie(movieId),
                ]);

                setMovie(movieDetail);
                setShowtimes(movieShowtimes);

                if (movieShowtimes.length > 0) {
                    setSelectedShowtimeId(movieShowtimes[0]._id);
                }
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Unable to load movie details");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [movieId]);

    useEffect(() => {
        if (!selectedShowtime) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSeats([]);
            return;
        }

        const hall = selectedShowtime.hallId as ShowtimeHall | string;
        if (!hall || typeof hall === "string") {
            setSeats([]);
            return;
        }

        const loadSeats = async () => {
            try {
                const hallSeats = await getSeatsByHall(hall._id);
                setSeats(hallSeats);
            } catch {
                setSeats([]);
            }
        };

        loadSeats();
    }, [selectedShowtime]);

    const seatLayout = useMemo<SeatView[]>(() => {
        const booked = new Set(selectedShowtime?.bookedSeats ?? []);
        return seats
            .sort((a, b) => a.positionIndex - b.positionIndex)
            .map((seat) => ({
                seatId: seat._id,
                label: seat.seatLabel,
                rowLabel: seat.rowLabel,
                seatNumber: seat.seatNumber,
                seatType: seat.seatType,
                status: seat.status,
                available: seat.status === "active" && !booked.has(seat._id),
                booked: booked.has(seat._id),
            }));
    }, [seats, selectedShowtime]);

    const totalAmount = useMemo(() => {
        if (!selectedShowtime || selectedSeats.length === 0) return 0;
        return selectedSeats.length * selectedShowtime.ticketPrice;
    }, [selectedShowtime, selectedSeats]);

    const handleSelectSeat = (seatId: string, available: boolean) => {
        if (!available) return;
        setSelectedSeats((current) => {
            if (current.includes(seatId)) {
                return current.filter((id) => id !== seatId);
            }
            return [...current, seatId];
        });
    };

    const handleBooking = async () => {
        if (!selectedShowtime || !movie) {
            setError("Please choose a showtime and seats before booking.");
            return;
        }
        if (selectedSeats.length === 0) {
            setError("Select at least one seat to continue.");
            return;
        }

        setSaving(true);
        setError(null);
        try {
            const seatsPayload = selectedSeats.map((seatId) => ({
                seatId,
                label: seatId,
                price: selectedShowtime.ticketPrice,
            }));

            const booking = await submitBooking({
                showtimeId: selectedShowtime._id,
                movieId: movie._id,
                cinemaId: selectedShowtime.cinemaId,
                hallId: typeof selectedShowtime.hallId === "string" ? selectedShowtime.hallId : selectedShowtime.hallId._id,
                seats: seatsPayload,
            });

            setBookingMessage(`Booking confirmed! Code: ${booking.bookingCode}`);
            setSelectedSeats([]);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Booking failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white px-6 py-14">
                <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-[#111] p-10 text-center">
                    <h1 className="text-2xl font-semibold">Oops</h1>
                    <p className="mt-4 text-gray-400">{error}</p>
                    <button onClick={() => router.back()} className="mt-6 rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-black">
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-black text-white px-6 py-14">
                <section className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-[#111] p-10 text-center">
                    <h1 className="text-2xl font-semibold">Movie not found</h1>
                    <p className="mt-4 text-gray-400">This movie does not exist or has been removed.</p>
                    <button onClick={() => router.back()} className="mt-6 rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-black">
                        Return to movies
                    </button>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white px-6 py-10">
            <div className="max-w-7xl mx-auto grid gap-8 xl:grid-cols-[2fr_1.2fr]">
                <div className="space-y-8">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <button onClick={() => router.back()} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 hover:border-yellow-400 transition">
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        <span>Back to movies</span>
                    </div>

                    <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-[#111] shadow-xl shadow-black/20">
                        <div className="relative h-[420px] bg-slate-950">
                            <img src={movie.posterUrl || "/uploads/default-movie-poster.png"} alt={movie.title} className="h-full w-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-white">
                                <p className="text-xs uppercase tracking-[0.3em] text-yellow-300">{movie.status?.replace("_", " ") ?? "Now showing"}</p>
                                <h1 className="mt-2 text-4xl font-bold">{movie.title}</h1>
                                <p className="mt-3 max-w-3xl text-sm text-gray-300">{movie.description || "No description available."}</p>
                            </div>
                        </div>

                        <div className="space-y-5 p-6 sm:p-8">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Genres</p>
                                    <p className="mt-2 text-sm text-gray-300">{movie.genres?.join(", ") ?? "Drama"}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Language</p>
                                    <p className="mt-2 text-sm text-gray-300">{movie.language || "English"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-white/10 bg-[#111] p-6 sm:p-8">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">Available showtimes</h2>
                                <p className="text-gray-500 text-sm">Pick a session and choose your seats.</p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3">
                            {showtimes.length === 0 ? (
                                <p className="text-gray-400">No showtimes published for this movie yet.</p>
                            ) : (
                                showtimes.map((item) => (
                                    <button
                                        key={item._id}
                                        onClick={() => {
                                            setSelectedShowtimeId(item._id);
                                            setSelectedSeats([]);
                                        }}
                                        className={`w-full rounded-3xl border px-4 py-4 text-left transition ${selectedShowtimeId === item._id ? "border-yellow-400 bg-yellow-400/5" : "border-white/10 bg-white/5 hover:border-white/30"}`}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-sm text-gray-300">{new Date(item.showDate).toLocaleDateString()}</p>
                                                <p className="mt-1 text-lg font-semibold text-white">{item.startTime} - {item.endTime || "TBD"}</p>
                                            </div>
                                            <div className="rounded-3xl bg-white/5 px-4 py-2 text-sm text-yellow-300">${item.ticketPrice.toFixed(2)}</div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-white/10 bg-[#111] p-6 sm:p-8">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">Select seats</h2>
                                <p className="text-gray-500 text-sm">Tap available seats to add them to your booking.</p>
                            </div>
                            <span className="text-sm text-gray-400">Price ${selectedShowtime?.ticketPrice?.toFixed(2) ?? 0} each</span>
                        </div>

                        <div className="mt-6">
                            {seatLayout.length === 0 ? (
                                <p className="text-gray-400">Seat layout is not available for the selected showtime.</p>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {seatLayout.map((seat) => (
                                        <button
                                            key={seat.seatId}
                                            type="button"
                                            disabled={!seat.available}
                                            onClick={() => handleSelectSeat(seat.seatId, seat.available)}
                                            className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${seat.available ? (seat.booked ? "border-rose-500 bg-rose-500/10 text-rose-300" : "border-white/10 bg-white/5 hover:border-yellow-400") : "border-rose-500 bg-rose-500/10 text-rose-300 cursor-not-allowed"} ${selectedSeats.includes(seat.seatId) && !seat.booked ? "border-yellow-400 bg-yellow-400/10" : ""}`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-white">{seat.label}</p>
                                                    <p className="text-xs text-gray-400">{seat.seatId} · {seat.seatType}</p>
                                                </div>
                                                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-gray-300">
                                                    {seat.booked ? "Booked" : seat.available ? "Available" : "Unavailable"}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="rounded-[2rem] border border-white/10 bg-[#111] p-6 sm:p-8">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Booking summary</p>
                                <h2 className="text-2xl font-semibold">Your order</h2>
                            </div>
                            <div className="rounded-full bg-yellow-400/10 px-3 py-2 text-xs uppercase tracking-[0.25em] text-yellow-300">Step 3</div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Movie</p>
                                <p className="text-base text-white">{movie.title}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Showtime</p>
                                <p className="text-base text-white">{selectedShowtime ? `${new Date(selectedShowtime.showDate).toLocaleDateString()} · ${selectedShowtime.startTime}` : "None"}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Seats</p>
                                <p className="text-base text-white">{selectedSeats.length} selected</p>
                            </div>
                            <div className="rounded-3xl bg-white/5 p-4 text-sm text-gray-300">
                                <p>Subtotal: ${totalAmount.toFixed(2)}</p>
                                <p className="text-xs text-gray-500">Payment is secured through CineBook.</p>
                            </div>

                            <button
                                type="button"
                                onClick={handleBooking}
                                disabled={saving || selectedSeats.length === 0}
                                className="w-full rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:bg-yellow-400/50"
                            >
                                {saving ? "Booking…" : "Confirm booking"}
                            </button>

                            {bookingMessage && (
                                <p className="text-sm text-emerald-300">{bookingMessage}</p>
                            )}
                            {error && (
                                <p className="text-sm text-rose-300">{error}</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
