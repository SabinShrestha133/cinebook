"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCinemas, type Cinema } from "@/lib/api/cinema";
import { Loader2, Pencil, PlusCircle } from "lucide-react";

function AdminCinemasContent() {
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchCinemas();
                setCinemas(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load cinemas");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

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
                    <h1 className="text-white text-2xl font-bold tracking-wide">Cinemas</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your cinema locations</p>
                </div>
                <Link
                    href="/admin/cinemas/new"
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold px-4 py-2.5 rounded-lg transition"
                >
                    <PlusCircle className="w-4 h-4" /> New Cinema
                </Link>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
                    {error}
                </div>
            )}

            {cinemas.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-[#111] p-10 text-center text-gray-400">
                    No cinemas available yet.
                </div>
            ) : (
                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 text-xs uppercase tracking-wide border-b border-white/5">
                                <th className="text-left font-medium px-6 py-4">Name</th>
                                <th className="text-left font-medium px-6 py-4">City</th>
                                <th className="text-left font-medium px-6 py-4">Contact</th>
                                <th className="text-left font-medium px-6 py-4">Status</th>
                                <th className="text-right font-medium px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cinemas.map((cinema) => (
                                <tr key={cinema._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-white font-medium">{cinema.name}</p>
                                            <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{cinema.address || "—"}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{cinema.city || "—"}</td>
                                    <td className="px-6 py-4 text-gray-400">
                                        <div className="flex flex-col gap-0.5">
                                            {cinema.contactPhone && <span>{cinema.contactPhone}</span>}
                                            {cinema.contactEmail && <span>{cinema.contactEmail}</span>}
                                            {!cinema.contactPhone && !cinema.contactEmail && <span>—</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cinema.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                                            {cinema.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/cinemas/${cinema._id}/edit`}
                                            className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-yellow-300 hover:border-yellow-400 transition"
                                        >
                                            <Pencil className="w-3 h-3" /> Edit
                                        </Link>
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

export default function AdminCinemasPage() {
    return <AdminCinemasContent />;
}
