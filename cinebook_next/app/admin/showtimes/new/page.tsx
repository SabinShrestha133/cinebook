"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { handleCreateShowtime } from "@/lib/actions/admin-action";
import { Loader2, CalendarPlus } from "lucide-react";

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
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
                        <input name="movieId" value={form.movieId} onChange={handleChange} required className={inputClass} placeholder="Movie ObjectId" />
                    </Field>
                    <Field label="Cinema ID *">
                        <input name="cinemaId" value={form.cinemaId} onChange={handleChange} required className={inputClass} placeholder="Cinema ObjectId" />
                    </Field>
                </div>

                <Field label="Hall ID *">
                    <input name="hallId" value={form.hallId} onChange={handleChange} required className={inputClass} placeholder="Hall ObjectId" />
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
