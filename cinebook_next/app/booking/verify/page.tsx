"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyBookingPayment } from "@/lib/actions/booking-action";
import { fetchShowtimeById, Showtime } from "@/lib/api/showtime";
import { fetchCinemas, Cinema } from "@/lib/api/cinema";
import { Loader2, CheckCircle2, XCircle, X, Ticket, Download } from "lucide-react";
import Link from "next/link";
import { API } from "@/lib/api/endpoints";

interface TicketData {
    bookingCode: string;
    qrUrl: string;
    cinemaName?: string;
    hallName?: string;
    showDate?: string;
    startTime?: string;
    endTime?: string;
    seats: string[];
    totalAmount: number;
}

export default function BookingVerifyPage() {
    const searchParams = useSearchParams();
    const [verifying, setVerifying] = useState(true);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [ticket, setTicket] = useState<TicketData | null>(null);
    const [qrError, setQrError] = useState(false);

    useEffect(() => {
        const verify = async () => {
            const pidx = searchParams.get("pidx");

            if (!pidx) {
                setMessage("Missing payment information. Please try booking again.");
                setVerifying(false);
                return;
            }

            try {
                const result = await verifyBookingPayment(pidx);
                if (result.booking?.bookingStatus === "confirmed") {
                    const booking = result.booking;
                    const qrUrl = API.BOOKING.QR(booking._id);

                    let cinemaName: string | undefined;
                    let hallName: string | undefined;
                    let showDate: string | undefined;
                    let startTime: string | undefined;
                    let endTime: string | undefined;

                    try {
                        const [showtime, cinemas] = await Promise.all([
                            fetchShowtimeById(booking.showtimeId),
                            fetchCinemas(),
                        ]);

                        if (showtime) {
                            const cinema = cinemas.find((c: Cinema) => c._id === showtime.cinemaId);
                            cinemaName = cinema?.name;
                            const hall = typeof showtime.hallId === "object" && showtime.hallId ? (showtime.hallId as any).name : undefined;
                            hallName = hall || String(showtime.hallId);
                            showDate = new Date(showtime.showDate).toLocaleDateString();
                            startTime = showtime.startTime;
                            endTime = showtime.endTime;
                        }
                    } catch (err) {
                        console.error("Failed to load ticket details:", err);
                    }

                    setSuccess(true);
                    setTicket({
                        bookingCode: booking.bookingCode,
                        qrUrl,
                        cinemaName,
                        hallName,
                        showDate,
                        startTime,
                        endTime,
                        seats: booking.seats.map((s: any) => s.seatId || s.label || s),
                        totalAmount: booking.totalAmount,
                    });
                    setMessage("Payment successful! Your ticket is ready.");
                } else {
                    setSuccess(false);
                    setMessage("Payment was not successful. Please try again.");
                }
            } catch (err: unknown) {
                setSuccess(false);
                setMessage(err instanceof Error ? err.message : "Verification failed");
            } finally {
                setVerifying(false);
            }
        };

        verify();
    }, [searchParams]);

    const closeModal = () => {
        if (typeof window !== "undefined") {
            window.location.href = "/movies";
        }
    };

    const handleDownload = () => {
        if (typeof window !== "undefined") {
            window.print();
        }
    };

    return (
        <div className="min-h-screen bg-black text-white px-6 py-14">
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .ticket-print-area, .ticket-print-area * {
                        visibility: visible;
                    }
                    .ticket-print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: white;
                        color: black;
                        padding: 2rem;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>
            <div className="max-w-2xl mx-auto rounded-3xl border border-white/10 bg-[#111] p-10 text-center">
                {verifying ? (
                    <>
                        <Loader2 className="mx-auto h-10 w-10 animate-spin text-yellow-400" />
                        <h1 className="mt-6 text-2xl font-semibold">Verifying Payment</h1>
                        <p className="mt-2 text-gray-400">Please wait while we confirm your payment with Khalti.</p>
                    </>
                ) : success && ticket ? (
                    <>
                        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                        <h1 className="mt-6 text-2xl font-semibold text-emerald-300">Booking Confirmed</h1>
                        <p className="mt-2 text-gray-300">{message}</p>

                        {/* Ticket Modal / Popup */}
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                                <div className="ticket-print-area relative w-full max-w-md rounded-3xl border border-white/10 bg-[#111] p-8 shadow-2xl">
                                <button
                                    onClick={closeModal}
                                    className="no-print absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:text-white transition"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                                        <Ticket className="h-8 w-8 text-emerald-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Your Ticket</h2>
                                    <p className="mt-1 text-sm text-gray-400">Show this QR at the cinema entrance</p>
                                </div>

                                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                                    {!qrError ? (
                                        <img
                                            src={ticket.qrUrl}
                                            alt="Ticket QR"
                                            className="mx-auto rounded-2xl border border-white/10 bg-white p-2"
                                            onError={() => setQrError(true)}
                                        />
                                    ) : (
                                        <p className="text-center text-gray-400 py-4">QR code unavailable</p>
                                    )}
                                </div>

                                <div className="mt-6 space-y-3 text-left">
                                    <div className="flex justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                        <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Booking Code</span>
                                        <span className="text-sm font-semibold text-yellow-300">{ticket.bookingCode}</span>
                                    </div>

                                    {ticket.cinemaName && (
                                        <div className="flex justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                            <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Cinema</span>
                                            <span className="text-sm font-semibold text-white">{ticket.cinemaName}</span>
                                        </div>
                                    )}

                                    {ticket.hallName && (
                                        <div className="flex justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                            <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Hall</span>
                                            <span className="text-sm font-semibold text-white">{ticket.hallName}</span>
                                        </div>
                                    )}

                                    {(ticket.showDate || ticket.startTime) && (
                                        <div className="flex justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                            <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Showtime</span>
                                            <span className="text-sm font-semibold text-white">
                                                {ticket.showDate} {ticket.startTime}{ticket.endTime ? ` - ${ticket.endTime}` : ""}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                        <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Seats</span>
                                        <span className="text-sm font-semibold text-white">{ticket.seats.join(", ")}</span>
                                    </div>

                                    <div className="flex justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                        <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Total</span>
                                        <span className="text-sm font-semibold text-white">Rs. {ticket.totalAmount}</span>
                                    </div>
                                </div>

                                <div className="no-print mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                                    <button onClick={handleDownload} className="rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 inline-flex items-center justify-center gap-2">
                                        <Download className="h-4 w-4" />
                                        Download Ticket
                                    </button>
                                    <Link href="/user/bookings" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 text-center">
                                        View My Tickets
                                    </Link>
                                    <button onClick={closeModal} className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <XCircle className="mx-auto h-12 w-12 text-rose-400" />
                        <h1 className="mt-6 text-2xl font-semibold text-rose-300">Payment Failed</h1>
                        <p className="mt-2 text-gray-300">{message}</p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/movies" className="rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300">
                                Try Again
                            </Link>
                            <Link href="/user/bookings" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30">
                                View My Bookings
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
