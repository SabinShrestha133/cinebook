"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { handleCreateShowtime } from "@/lib/actions/admin-action";
import { Loader2, CalendarPlus } from "lucide-react";
import { browseMovies, type Movie } from "@/lib/api/movie";
import { fetchCinemas, type Cinema } from "@/lib/api/cinema";
import { listHalls, type Hall } from "@/lib/api/hall";

function CreateShowtimeContent() {
    const router = useRouter();
    const [form, setForm] = useState({
        movieId: "",
        cinemaId: "",
        hallId: "",
        showDate: "",
        startTime: "",
        endTime: "",
        ticketPrice: "",
        discountType: "none",
        discountValue: "",
    });
    const [movies, setMovies] = useState<Movie[]>([]);
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [halls, setHalls] = useState<Hall[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        browseMovies()
            .then(setMovies)
            .catch(() => {});
        fetchCinemas()
            .then(setCinemas)
            .catch(() => {});
        listHalls()
            .then((out) => setHalls(out.data))
            .catch(() => {});
    }, []);

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
        setLoading(true);
        setMessage(null);

        const payload: Record<string, unknown> = {
            movieId: form.movieId,
            cinemaId: form.cinemaId,
            hallId: form.hallId,
            showDate: form.showDate,
            startTime: form.startTime,
            ticketPrice: Number(form.ticketPrice),
        };
        if (form.endTime) payload.endTime = form.endTime;
        if (form.discountType && form.discountType !== "none") {
            payload.discountType = form.discountType;
            payload.discountValue = Number(form.discountValue);
        }

        const res = await handleCreateShowtime(payload);
        setLoading(false);

        if (res.success) {
            setMessage({ type: "success", text: "Showtime created successfully" });
            setTimeout(() => router.push("/admin/dashboard"), 800);
        } else {
            setMessage({ type: "error", text: res.message || "Failed to create showtime" });
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                    <CalendarPlus className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                    <h1 className="text-white text-2xl font-bold tracking-wide">Add New Showtime</h1>
                    <p className="text-gray-500 text-sm">Schedule a screening for a movie</p>
                </div>
            </div>

            {message && (
                <div
                    className={`p-3 rounded text-sm ${
                        message.type === "success"
                            ? "bg-green-500/10 border border-green-500/50 text-green-400"
                            : "bg-red-500/10 border border-red-500/50 text-red-400"
                    }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Movie ID *">
                        <select name="movieId" value={form.movieId} onChange={handleChange} required className={selectClass}>
                            <option value="">Select movie</option>
                            {movies.map((m) => (
                                <option key={m._id} value={m._id}>{m.title || m._id}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Cinema ID *">
                        <select name="cinemaId" value={form.cinemaId} onChange={handleChange} required className={selectClass}>
                            <option value="">Select cinema</option>
                            {cinemas.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}{c.city ? ` - ${c.city}` : ""}</option>
                            ))}
                        </select>
                    </Field>
                </div>

                <Field label="Hall ID *">
                    <select name="hallId" value={form.hallId} onChange={handleChange} required className={selectClass}>
                        <option value="">Select hall</option>
                        {filteredHalls.map((h) => (
                            <option key={h._id} value={h._id}>{h.name}</option>
                        ))}
                    </select>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Show Date *">
                        <input name="showDate" type="date" value={form.showDate} onChange={handleChange} required className={inputClass} />
                    </Field>
                    <Field label="Start Time *">
                        <input name="startTime" type="time" value={form.startTime} onChange={handleChange} required className={inputClass} />
                    </Field>
                    <Field label="End Time">
                        <input name="endTime" type="time" value={form.endTime} onChange={handleChange} className={inputClass} />
                    </Field>
                </div>

                <Field label="Ticket Price (Rs.) *">
                    <input name="ticketPrice" type="number" value={form.ticketPrice} onChange={handleChange} required min={0} className={inputClass} placeholder="120" />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Discount Type">
                        <select name="discountType" value={form.discountType} onChange={handleChange} className={selectClass}>
                            <option value="none">No Discount</option>
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </Field>
                    <Field label="Discount Value">
                        <input name="discountValue" type="number" value={form.discountValue} onChange={handleChange} min={0} className={inputClass} placeholder="e.g. 10 or 50" disabled={form.discountType === "none"} />
                    </Field>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold py-3 rounded-lg tracking-widest uppercase transition"
                >
                    {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Creating…</span> : "Create Showtime"}
                </button>
            </form>
        </div>
    );
}

const inputClass =
    "w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition";

const selectClass =
    "w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">{label}</label>
            {children}
        </div>
    );
}

export default function CreateShowtimePage() {
    return <CreateShowtimeContent />;
}
