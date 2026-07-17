"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchMovies } from "@/lib/actions/movie-action";
import { Movie } from "@/lib/api/movie";
import MovieCard from "@/app/frontend/_components/MovieCard";
import Link from "next/link";

type Tab = "now_showing" | "upcoming";

export default function MoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<Tab>("now_showing");

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

    const displayedMovies = useMemo(() => {
        const base = movies.filter((m) => m.status !== "archived");
        return base.filter((m) => m.status === activeTab);
    }, [movies, activeTab]);

    const nowShowingCount = movies.filter((m) => m.status === "now_showing").length;
    const upcomingCount = movies.filter((m) => m.status === "upcoming").length;

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

                <div className="mb-8">
                    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
                        <button
                            onClick={() => setActiveTab("now_showing")}
                            className={`rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition ${
                                activeTab === "now_showing"
                                    ? "bg-yellow-400 text-black"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            Now Showing ({nowShowingCount})
                        </button>
                        <button
                            onClick={() => setActiveTab("upcoming")}
                            className={`rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition ${
                                activeTab === "upcoming"
                                    ? "bg-yellow-400 text-black"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            Upcoming ({upcomingCount})
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-3xl border border-white/10 bg-[#111] p-10 text-center text-gray-400">Loading movies…</div>
                ) : error ? (
                    <div className="rounded-3xl border border-rose-500/20 bg-[#111] p-10 text-center text-rose-300">{error}</div>
                ) : displayedMovies.length === 0 ? (
                    <div className="rounded-3xl border border-white/10 bg-[#111] p-10 text-center text-gray-400">
                        {activeTab === "now_showing" ? "No movies showing right now." : "No upcoming movies scheduled."}
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {displayedMovies.map((movie) => (
                            <MovieCard key={movie._id} movie={movie} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
