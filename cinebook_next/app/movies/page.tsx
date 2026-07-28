"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchMovies } from "@/lib/actions/movie-action";
import { fetchAiMovieRecommendations, type AiMovieRecommendation } from "@/lib/api/ai-recommendation";
import { Movie } from "@/lib/api/movie";
import MovieCard from "@/app/frontend/_components/MovieCard";
import Link from "next/link";
import { Loader2, Sparkles, Filter, X } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import GenreModal from "@/components/GenreModal";

type Tab = "now_showing" | "upcoming";

export default function MoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<Tab>("now_showing");
    const [aiRecommendations, setAiRecommendations] = useState<AiMovieRecommendation[]>([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [genreModalOpen, setGenreModalOpen] = useState(false);
    const { user } = useAuth();

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

    useEffect(() => {
        const loadAiRecs = async () => {
            if (!user) return;
            setAiLoading(true);
            setAiError("");
            try {
                const result = await fetchAiMovieRecommendations();
                if (result.success && result.recommendations) {
                    setAiRecommendations(result.recommendations);
                } else {
                    setAiError(result.message || "Failed to load recommendations");
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setAiError(err.message);
                } else {
                    setAiError("Unable to load AI recommendations");
                }
            } finally {
                setAiLoading(false);
            }
        };

        loadAiRecs();
    }, [user]);

    const displayedMovies = useMemo(() => {
        const base = movies.filter((m) => m.status !== "archived");
        const filtered = base.filter((m) => m.status === activeTab);
        if (selectedGenres.length === 0) return filtered;
        return filtered.filter((m) => m.genres?.some((g) => selectedGenres.includes(g)) ?? false);
    }, [movies, activeTab, selectedGenres]);

    const nowShowingCount = movies.filter((m) => m.status === "now_showing").length;
    const upcomingCount = movies.filter((m) => m.status === "upcoming").length;

    const removeGenre = (genre: string) => {
        setSelectedGenres((prev) => prev.filter((g) => g !== genre));
    };

    const clearAllGenreFilters = () => {
        setSelectedGenres([]);
    };

    const hasActiveGenreFilters = selectedGenres.length > 0;

    return (
        <div className="min-h-screen bg-black py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-yellow-400">CineBook</p>
                        <h1 className="text-4xl font-bold text-white">Browse Movies</h1>
                        <p className="mt-2 text-gray-500 max-w-2xl">Discover current and upcoming movies available for booking through the CineBook API.</p>
                    </div>
                    {!user && (
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-yellow-300"
                        >
                            Create an account
                        </Link>
                    )}
                    {user && (
                        <Link
                            href="/user/dashboard"
                            className="inline-flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-yellow-300"
                        >
                            My Dashboard
                        </Link>
                    )}
                </div>

                {user && !aiLoading && aiRecommendations.length > 0 && (
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-yellow-400" />
                            <h2 className="text-2xl font-semibold text-white">Recommended for You</h2>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">Based on your watch history and preferences.</p>
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {aiRecommendations.map((rec) => (
                                <Link
                                    key={rec.movieId}
                                    href={`/movies/${rec.movieId}`}
                                    className="block rounded-[2rem] border border-white/10 bg-[#111] p-5 shadow-black/20 shadow-sm transition hover:border-yellow-400/40 hover:shadow-2xl hover:shadow-black/60"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                                        <span className="shrink-0 rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                                            {rec.matchScore}% match
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed">{rec.reason}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {user && aiLoading && (
                    <div className="mb-10 rounded-[2rem] border border-white/10 bg-[#111] p-10 text-center text-gray-400">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-yellow-400" />
                        <p className="mt-4">Finding your perfect matches…</p>
                    </div>
                )}

                {user && aiError && (
                    <div className="mb-10 rounded-[2rem] border border-rose-500/20 bg-[#111] p-6 text-center text-rose-300">
                        {aiError}
                    </div>
                )}

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

                {hasActiveGenreFilters && (
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        {selectedGenres.map((genre) => (
                            <span
                                key={genre}
                                className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 text-xs font-semibold text-yellow-300"
                            >
                                {genre}
                                <button type="button" onClick={() => removeGenre(genre)} className="hover:text-yellow-100 transition">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        <button
                            type="button"
                            onClick={clearAllGenreFilters}
                            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-400 transition hover:text-white"
                        >
                            <X className="w-3 h-3" />
                            Clear all
                        </button>
                    </div>
                )}

                <div className="mb-2 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setGenreModalOpen(true)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                            hasActiveGenreFilters
                                ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-300"
                                : "border-white/10 bg-white/5 text-gray-300 hover:border-yellow-400/50"
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        Filter by Genre
                        {hasActiveGenreFilters && (
                            <span className="rounded-full bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 leading-none">
                                {selectedGenres.length}
                            </span>
                        )}
                    </button>
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

            <GenreModal
                isOpen={genreModalOpen}
                onClose={() => setGenreModalOpen(false)}
                selectedGenres={selectedGenres}
                onSelect={setSelectedGenres}
            />
        </div>
    );
}
