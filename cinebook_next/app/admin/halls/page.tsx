"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listHalls, deleteHall, type Hall } from "@/lib/api/admin";
import { Loader2, Pencil, PlusCircle, Trash2 } from "lucide-react";

function AdminHallsContent() {
    const [halls, setHalls] = useState<Hall[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await listHalls();
                setHalls(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load halls");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this hall?")) return;
        try {
            await deleteHall(id);
            setHalls((prev) => prev.filter((h) => h._id !== id));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to delete hall");
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
                    <h1 className="text-white text-2xl font-bold tracking-wide">Halls</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage cinema halls and seat layouts</p>
                </div>
                <Link
                    href="/admin/halls/new"
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold px-4 py-2.5 rounded-lg transition"
                >
                    <PlusCircle className="w-4 h-4" /> New Hall
                </Link>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
                    {error}
                </div>
            )}

            {halls.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-[#111] p-10 text-center text-gray-400">
                    No halls available yet. Create one to get started.
                </div>
            ) : (
                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 text-xs uppercase tracking-wide border-b border-white/5">
                                <th className="text-left font-medium px-6 py-4">Name</th>
                                <th className="text-left font-medium px-6 py-4">Cinema</th>
                                <th className="text-left font-medium px-6 py-4">Rows</th>
                                <th className="text-left font-medium px-6 py-4">Seats / Row</th>
                                <th className="text-left font-medium px-6 py-4">Total Seats</th>
                                <th className="text-right font-medium px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {halls.map((hall) => (
                                <tr key={hall._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition">
                                    <td className="px-6 py-4 text-white font-medium">{hall.name}</td>
                                    <td className="px-6 py-4 text-gray-400">{hall.cinemaId || "—"}</td>
                                    <td className="px-6 py-4 text-gray-400">{hall.totalRows}</td>
                                    <td className="px-6 py-4 text-gray-400">{hall.seatsPerRow}</td>
                                    <td className="px-6 py-4 text-gray-400">{hall.totalRows * hall.seatsPerRow}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/halls/${hall._id}/edit`}
                                                className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-yellow-300 hover:border-yellow-400 transition"
                                            >
                                                <Pencil className="w-3 h-3" /> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(hall._id)}
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

export default function AdminHallsPage() {
    return <AdminHallsContent />;
}