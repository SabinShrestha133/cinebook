"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { getHall, updateHall, deleteHall, type Hall } from "@/lib/api/admin";
import { Loader2, ArrowLeft, Trash2, Save } from "lucide-react";
import { fetchCinemas, type Cinema } from "@/lib/api/cinema";

export default function AdminEditHallPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params.id;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [form, setForm] = useState({
        name: "",
        cinemaId: "",
        totalRows: 10,
        seatsPerRow: 12,
        aisles: "",
    });

    const [cinemas, setCinemas] = useState<Cinema[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                if (!id || id === "undefined" || !/^[0-9a-fA-F]{24}$/.test(id)) {
                    throw new Error("Invalid hall ID");
                }
                const [cinemaData, hallData] = await Promise.all([
                    fetchCinemas(),
                    getHall(id),
                ]);
                setCinemas(cinemaData);
                if (hallData) {
                    setForm({
                        name: hallData.name || "",
                        cinemaId: hallData.cinemaId || "",
                        totalRows: hallData.totalRows || 10,
                        seatsPerRow: hallData.seatsPerRow || 12,
                        aisles: (hallData.aisles || []).join(", "),
                    });
                }
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load hall");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        const payload: Record<string, unknown> = {
            name: form.name,
            cinemaId: form.cinemaId,
            totalRows: form.totalRows,
            seatsPerRow: form.seatsPerRow,
            aisles: form.aisles ? form.aisles.split(",").map((a) => parseInt(a.trim(), 10)).filter((n: number) => !isNaN(n) && n > 0) : [],
        };
        const res = await updateHall(id, payload);
        setSaving(false);
        if (res.success) {
            setMessage({ type: "success", text: "Hall updated successfully" });
        } else {
            setMessage({ type: "error", text: res.message || "Failed to update hall" });
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this hall?")) return;
        setDeleting(true);
        const res = await deleteHall(id);
        setDeleting(false);
        if (res.success) {
            router.push("/admin/halls");
        } else {
            setMessage({ type: "error", text: res.message || "Failed to delete hall" });
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
                    <h1 className="text-white text-2xl font-bold tracking-wide">Edit Hall</h1>
                    <p className="text-gray-500 text-sm">Update hall details</p>
                </div>
            </div>

            {message && (
                <div className={`p-3 rounded text-sm ${message.type === "success" ? "bg-green-500/10 border border-green-500/50 text-green-400" : "bg-red-500/10 border border-red-500/50 text-red-400"}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
                <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Hall Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition" placeholder="Hall 1" />
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Total Rows *</label>
                        <input name="totalRows" type="number" value={form.totalRows} onChange={handleChange} required min={1} max={50} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Seats Per Row *</label>
                        <input name="seatsPerRow" type="number" value={form.seatsPerRow} onChange={handleChange} required min={1} max={30} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition" />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Aisles (comma separated)</label>
                    <input name="aisles" value={form.aisles} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition" placeholder="4, 8" />
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