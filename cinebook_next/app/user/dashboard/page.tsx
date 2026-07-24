"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { fetchMovies } from "@/lib/actions/movie-action";
import { fetchAiMovieRecommendations, type AiMovieRecommendation } from "@/lib/api/ai-recommendation";
import { Movie } from "@/lib/api/movie";
import MovieCard from "@/app/frontend/_components/MovieCard";
import { Loader2, Film, Sparkles } from "lucide-react";

export default function UserDashboardPage() {
    const { user, loading } = useAuth();
    const displayName = user?.name || user?.username || user?.email || "User";

    const [movies, setMovies] = useState<Movie[]>([]);
    const [moviesLoading, setMoviesLoading] = useState(true);
    const [moviesError, setMoviesError] = useState("");
    const [aiRecommendations, setAiRecommendations] = useState<AiMovieRecommendation[]>([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const result = await fetchMovies();
                setMovies(result);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setMoviesError(err.message);
                } else {
                    setMoviesError("Unable to load movie listings");
                }
            } finally {
                setMoviesLoading(false);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-white text-3xl font-bold tracking-wide">Welcome back, {displayName}</h1>
                    <p className="text-gray-500 text-sm mt-1">Browse the latest movies available for booking.</p>
                </div>
                <Link
                    href="/movies"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-yellow-400"
                >
                    <Film className="w-4 h-4" /> Browse Movies
                </Link>
            </div>

            {user && aiLoading && (
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
                    Finding your perfect matches…
                </div>
            )}

            {user && aiError && (
                <div className="mb-4 rounded-2xl border border-rose-500/20 bg-[#111] p-4 text-center text-sm text-rose-300">
                    {aiError}
                </div>
            )}

            {user && !aiLoading && aiRecommendations.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                        <h2 className="text-xl font-semibold text-white">Recommended for You</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {aiRecommendations.map((rec) => (
                            <div key={rec.movieId} className="rounded-[2rem] border border-white/10 bg-[#111] p-5 shadow-black/20 shadow-sm">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <h3 className="text-base font-semibold text-white">{rec.title}</h3>
                                    <span className="shrink-0 rounded-full bg-yellow-400/10 px-2 py-0.5 text-xs font-semibold text-yellow-300">
                                        {rec.matchScore}% match
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">{rec.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {moviesLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                </div>
            ) : moviesError ? (
                <div className="rounded-3xl border border-rose-500/20 bg-[#111] p-10 text-center text-rose-300">{moviesError}</div>
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
    );
}
