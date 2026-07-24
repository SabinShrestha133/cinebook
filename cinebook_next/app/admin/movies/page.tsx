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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {movies.map((movie) => (
                        <div
                            key={movie._id}
                            className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 flex flex-col gap-3"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-white font-semibold">{movie.title}</h3>
                                    <p className="text-gray-500 text-xs uppercase tracking-wide mt-1">
                                        {movie.status?.replace("_", " ") ?? "Unknown"}
                                    </p>
                                </div>
                                <Link
                                    href={`/admin/movies/${movie._id}/edit`}
                                    className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-yellow-300 hover:border-yellow-400 transition"
                                >
                                    <Pencil className="w-3 h-3" /> Edit
                                </Link>
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2">
                                {movie.description || "No description available."}
                            </p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.2em] text-gray-400">
                                <span className="text-yellow-300">{movie.genres?.join(", ") ?? "Drama"}</span>
                                {movie.language && <span>{movie.language}</span>}
                                <span>{movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : "—"}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AdminMoviesPage() {
    return <AdminMoviesContent />;
}
