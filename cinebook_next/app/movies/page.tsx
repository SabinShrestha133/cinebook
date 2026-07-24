"use client";

import { useEffect, useState } from "react";
import { fetchMovies } from "@/lib/actions/movie-action";
import { Movie } from "@/lib/api/movie";
import MovieCard from "@/app/frontend/_components/MovieCard";
import Link from "next/link";

export default function MoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const result = await fetchMovies();
                setMovies(result);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Unable to load movie listings");
                }
            } finally {
                setLoading(false);
            }
        };

        loadMovies();
    }, []);

    return (
        <div className="min-h-screen bg-black py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-yellow-400">CineBook</p>
                        <h1 className="text-4xl font-bold text-white">Browse Movies</h1>
                        <p className="mt-2 text-gray-500 max-w-2xl">Discover current and upcoming movies available for booking through the CineBook API.</p>
                    </div>
                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-yellow-300"
                    >
                        Create an account
                    </Link>
                </div>

                {loading ? (
                    <div className="rounded-3xl border border-white/10 bg-[#111] p-10 text-center text-gray-400">Loading movies…</div>
                ) : error ? (
                    <div className="rounded-3xl border border-rose-500/20 bg-[#111] p-10 text-center text-rose-300">{error}</div>
                ) : movies.length === 0 ? (
                    <div className="rounded-3xl border border-white/10 bg-[#111] p-10 text-center text-gray-400">
                        No movies available yet. Check back soon.
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {movies.map((movie) => (
                            <MovieCard key={movie._id} movie={movie} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
