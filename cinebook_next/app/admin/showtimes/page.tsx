"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listShowtimes, deleteShowtime, type Showtime } from "@/lib/api/admin";
import { Loader2, Pencil, PlusCircle, Trash2 } from "lucide-react";

function AdminShowtimesContent() {
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await listShowtimes();
                setShowtimes(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load showtimes");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this showtime?")) return;
        try {
            await deleteShowtime(id);
            setShowtimes((prev) => prev.filter((s) => s._id !== id));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to delete showtime");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-white text-2xl font-bold tracking-wide">Showtimes</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage showtimes for movies and halls</p>
                </div>
                <Link
                    href="/admin/showtimes/new"
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold px-4 py-2.5 rounded-lg transition"
                >
                    <PlusCircle className="w-4 h-4" /> New Showtime
                </Link>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
                    {error}
                </div>
            )}

            {showtimes.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-[#111] p-10 text-center text-gray-400">
                    No showtimes available yet. Create one to get started.
                </div>
            ) : (
                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 text-xs uppercase tracking-wide border-b border-white/5">
                                <th className="text-left font-medium px-6 py-4">Movie</th>
                                <th className="text-left font-medium px-6 py-4">Cinema / Hall</th>
                                <th className="text-left font-medium px-6 py-4">Date</th>
                                <th className="text-left font-medium px-6 py-4">Time</th>
                                <th className="text-left font-medium px-6 py-4">Price</th>
                                <th className="text-left font-medium px-6 py-4">Status</th>
                                <th className="text-right font-medium px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showtimes.map((st) => (
                                <tr key={st._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition">
                                    <td className="px-6 py-4 text-white font-medium">
                                        {typeof st.movieId === "string" ? st.movieId : st.movieId?.title ?? st.movieId?.slug ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        <div className="flex flex-col gap-0.5">
                                            <span>{typeof st.cinemaId === "string" ? st.cinemaId : st.cinemaId?.name ?? "—"}</span>
                                            <span className="text-xs text-gray-500">{typeof st.hallId === "string" ? st.hallId : st.hallId?.name ?? "—"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {st.showDate ? new Date(st.showDate).toLocaleDateString() : "—"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {st.startTime} {st.endTime ? `- ${st.endTime}` : ""}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">Rs. {st.ticketPrice}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${st.status === "active" ? "bg-emerald-500/10 text-emerald-400" : st.status === "cancelled" ? "bg-rose-500/10 text-rose-400" : "bg-gray-500/10 text-gray-400"}`}>
                                            {st.status || "active"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/showtimes/${st._id}/edit`}
                                                className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-yellow-300 hover:border-yellow-400 transition"
                                            >
                                                <Pencil className="w-3 h-3" /> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(st._id)}
                                                className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-rose-400 hover:border-rose-400 transition"
                                            >
                                                <Trash2 className="w-3 h-3" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default function AdminShowtimesPage() {
    return <AdminShowtimesContent />;
}