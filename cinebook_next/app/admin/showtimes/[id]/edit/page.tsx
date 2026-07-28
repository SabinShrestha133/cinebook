"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { getShowtime, deleteShowtime, updateShowtime, type Showtime } from "@/lib/api/admin";
import { Loader2, ArrowLeft, Trash2, Save } from "lucide-react";
import { browseMovies, type Movie } from "@/lib/api/movie";
import { fetchCinemas, type Cinema } from "@/lib/api/cinema";
import { listHalls, type Hall } from "@/lib/api/hall";

export default function AdminEditShowtimePage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const { id } = params;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [form, setForm] = useState({
        movieId: "",
        cinemaId: "",
        hallId: "",
        showDate: "",
        startTime: "",
        endTime: "",
        ticketPrice: "",
        discountType: "none" as const,
        discountValue: "",
        status: "active" as const,
    });

    const [movies, setMovies] = useState<Movie[]>([]);
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [halls, setHalls] = useState<Hall[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [movieData, cinemaData, hallData, showtimeData] = await Promise.all([
                    browseMovies(),
                    fetchCinemas(),
                    listHalls(),
                    getShowtime(id),
                ]);
                setMovies(movieData);
                setCinemas(cinemaData);
                setHalls(hallData.data);
                if (showtimeData) {
                    setForm({
                        movieId: showtimeData.movieId,
                        cinemaId: showtimeData.cinemaId,
                        hallId: showtimeData.hallId,
                        showDate: showtimeData.showDate?.substring(0, 10) || "",
                        startTime: showtimeData.startTime,
                        endTime: showtimeData.endTime || "",
                        ticketPrice: String(showtimeData.ticketPrice),
                        discountType: (showtimeData.discountType || "none") as typeof form.discountType,
                        discountValue: String(showtimeData.discountValue || ""),
                        status: showtimeData.status || "active",
                    });
                }
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load showtime");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const filteredHalls = form.cinemaId ? halls.filter((h) => h.cinemaId === form.cinemaId) : halls;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const next = { ...prev, [name]: value };
            if (name === "cinemaId") {
                const hallForCinema = halls.find((h) => h.cinemaId === value);
                if (hallForCinema) {
                    next.hallId = hallForCinema._id;
                } else {
                    next.hallId = "";
                }
            }
            return next;
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        const payload: Record<string, unknown> = {
            movieId: form.movieId,
            cinemaId: form.cinemaId,
            hallId: form.hallId,
            showDate: form.showDate,
            startTime: form.startTime,
            endTime: form.endTime || undefined,
            ticketPrice: Number(form.ticketPrice),
            status: form.status,
        };
        if (form.discountType && form.discountType !== "none") {
            payload.discountType = form.discountType;
            payload.discountValue = Number(form.discountValue);
        }
        const res = await updateShowtime(id, payload);
        setSaving(false);
        if (res.success) {
            setMessage({ type: "success", text: "Showtime updated successfully" });
        } else {
            setMessage({ type: "error", text: res.message || "Failed to update showtime" });
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this showtime?")) return;
        setDeleting(true);
        const res = await deleteShowtime(id);
        setDeleting(false);
        if (res.success) {
            router.push("/admin/showtimes");
        } else {
            setMessage({ type: "error", text: res.message || "Failed to delete showtime" });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <h1 className="text-white text-2xl font-bold tracking-wide">Edit Showtime</h1>
                    <p className="text-gray-500 text-sm">Update showtime details</p>
                </div>
            </div>

            {message && (
                <div className={`p-3 rounded text-sm ${message.type === "success" ? "bg-green-500/10 border border-green-500/50 text-green-400" : "bg-red-500/10 border border-red-500/50 text-red-400"}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Movie *</label>
                        <select name="movieId" value={form.movieId} onChange={handleChange} required className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition">
                            <option value="">Select movie</option>
                            {movies.map((m) => (
                                <option key={m._id} value={m._id}>{m.title || m._id}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Cinema *</label>
                        <select name="cinemaId" value={form.cinemaId} onChange={handleChange} required className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition">
                            <option value="">Select cinema</option>
                            {cinemas.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}{c.city ? ` - ${c.city}` : ""}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Hall *</label>
                    <select name="hallId" value={form.hallId} onChange={handleChange} required className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition">
                        <option value="">Select hall</option>
                        {filteredHalls.map((h) => (
                            <option key={h._id} value={h._id}>{h.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Show Date *</label>
                        <input name="showDate" type="date" value={form.showDate} onChange={handleChange} required className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Start Time *</label>
                        <input name="startTime" type="time" value={form.startTime} onChange={handleChange} required className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">End Time</label>
                        <input name="endTime" type="time" value={form.endTime} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Ticket Price (Rs.) *</label>
                        <input name="ticketPrice" type="number" value={form.ticketPrice} onChange={handleChange} required min={0} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition" placeholder="120" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Status</label>
                        <select name="status" value={form.status} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition">
                            <option value="active">Active</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Discount Type</label>
                        <select name="discountType" value={form.discountType} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition">
                            <option value="none">No Discount</option>
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </div>
                    {form.discountType !== "none" && (
                        <div>
                            <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Discount Value</label>
                            <input name="discountValue" type="number" value={form.discountValue} onChange={handleChange} min={0} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition" />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button type="submit" disabled={saving} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold px-6 py-3 rounded-lg tracking-widest uppercase transition">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                    </button>
                    <button type="button" onClick={handleDelete} disabled={deleting} className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-sm font-bold px-6 py-3 rounded-lg tracking-widest uppercase transition">
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
                    </button>
                </div>
            </form>
        </div>
    );
}