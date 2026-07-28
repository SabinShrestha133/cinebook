"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { browseMovies, type Movie } from "@/lib/api/movie";
import { Loader2, Pencil, PlusCircle } from "lucide-react";

function AdminMoviesContent() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await browseMovies();
                setMovies(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load movies");
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
                    <h1 className="text-white text-2xl font-bold tracking-wide">Movies</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your movie catalog</p>
                </div>
                <Link
                    href="/admin/movies/new"
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold px-4 py-2.5 rounded-lg transition"
                >
                    <PlusCircle className="w-4 h-4" /> New Movie
                </Link>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
                    {error}
                </div>
            )}

            {movies.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-[#111] p-10 text-center text-gray-400">
                    No movies available yet.
                </div>
            ) : (
                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 text-xs uppercase tracking-wide border-b border-white/5">
                                <th className="text-left font-medium px-6 py-4">Title</th>
                                <th className="text-left font-medium px-6 py-4">Genre</th>
                                <th className="text-left font-medium px-6 py-4">Language</th>
                                <th className="text-left font-medium px-6 py-4">Duration</th>
                                <th className="text-left font-medium px-6 py-4">Status</th>
                                <th className="text-right font-medium px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map((movie) => (
                                <tr key={movie._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-white font-medium">{movie.title}</p>
                                            <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{movie.description || ""}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        <div className="flex flex-wrap gap-1">
                                            {(movie.genres || []).slice(0, 2).map((g) => (
                                                <span key={g} className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] text-gray-300">{g}</span>
                                            ))}
                                            {(movie.genres || []).length > 2 && (
                                                <span className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] text-gray-500">+{movie.genres.length - 2}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{movie.language || "—"}</td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : "—"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${movie.status === "now_showing" ? "bg-emerald-500/10 text-emerald-400" : movie.status === "upcoming" ? "bg-amber-500/10 text-amber-400" : "bg-gray-500/10 text-gray-400"}`}>
                                            {movie.status?.replace("_", " ") ?? "Unknown"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/movies/${movie._id}/edit`}
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

export default function AdminMoviesPage() {
    return <AdminMoviesContent />;
}
