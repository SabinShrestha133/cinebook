"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { fetchMovies } from "@/lib/actions/movie-action";
import { fetchAiMovieRecommendations, type AiMovieRecommendation } from "@/lib/api/ai-recommendation";
import { Movie } from "@/lib/api/movie";
import MovieCard from "@/app/frontend/_components/MovieCard";
import GenreModal from "@/components/GenreModal";
import { Loader2, Film, Sparkles, Search, Filter, X, FilmIcon, Calendar } from "lucide-react";

function SkeletonCard() {
    return (
        <div className="rounded-[2rem] border border-white/10 bg-[#111] overflow-hidden shadow-xl shadow-black/20 animate-pulse">
            <div className="h-full w-full bg-[#1a1a1a]" />
            <div className="absolute inset-x-0 bottom-0 p-5 space-y-3">
                <div className="h-4 w-20 rounded-full bg-white/5" />
                <div className="h-5 w-3/4 rounded bg-white/5" />
            </div>
        </div>
    );
}

export default function UserDashboardPage() {
    const { user, loading } = useAuth();
    const displayName = user?.name || user?.username || user?.email || "User";

    const [movies, setMovies] = useState<Movie[]>([]);
    const [moviesLoading, setMoviesLoading] = useState(true);
    const [moviesError, setMoviesError] = useState("");
    const [aiRecommendations, setAiRecommendations] = useState<AiMovieRecommendation[]>([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [genreModalOpen, setGenreModalOpen] = useState(false);

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

    const filteredMovies = useMemo(() => {
        return movies.filter((m) => {
            const matchesSearch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGenres = selectedGenres.length === 0 || (m.genres?.some((g) => selectedGenres.includes(g)) ?? false);
            return matchesSearch && matchesGenres;
        });
    }, [movies, searchQuery, selectedGenres]);

    const nowShowing = useMemo(() => filteredMovies.filter((m) => m.status === "now_showing"), [filteredMovies]);
    const upcoming = useMemo(() => filteredMovies.filter((m) => m.status === "upcoming"), [filteredMovies]);

    const handleGenreSave = (genres: string[]) => {
        setSelectedGenres(genres);
    };

    const removeGenre = (genre: string) => {
        setSelectedGenres((prev) => prev.filter((g) => g !== genre));
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setSelectedGenres([]);
    };

    const hasActiveFilters = searchQuery || selectedGenres.length > 0;

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

            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[220px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search movies by name…"
                        className="w-full bg-[#111] border border-white/10 rounded-full pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 transition"
                        aria-label="Search movies by name"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => setGenreModalOpen(true)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                        selectedGenres.length > 0
                            ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-300"
                            : "border-white/10 bg-white/5 text-gray-300 hover:border-yellow-400/50"
                    }`}
                    aria-label="Filter by genre"
                >
                    <Filter className="w-4 h-4" />
                    Genre
                    {selectedGenres.length > 0 && (
                        <span className="ml-1 rounded-full bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 leading-none">
                            {selectedGenres.length}
                        </span>
                    )}
                </button>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearAllFilters}
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-gray-400 transition hover:text-white"
                    >
                        <X className="w-3 h-3" />
                        Clear all
                    </button>
                )}
            </div>

            {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2">
                    {searchQuery && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 text-xs font-semibold text-yellow-300">
                            <Search className="w-3 h-3" />
                            &quot;{searchQuery}&quot;
                            <button type="button" onClick={clearSearch} className="hover:text-yellow-100 transition">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
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
                </div>
            )}

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
                            <Link
                                key={rec.movieId}
                                href={`/movies/${rec.movieId}`}
                                className="block rounded-[2rem] border border-white/10 bg-[#111] p-5 shadow-black/20 shadow-sm transition hover:border-yellow-400/40 hover:shadow-2xl hover:shadow-black/60"
                            >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <h3 className="text-base font-semibold text-white">{rec.title}</h3>
                                    <span className="shrink-0 rounded-full bg-yellow-400/10 px-2 py-0.5 text-xs font-semibold text-yellow-300">
                                        {rec.matchScore}% match
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">{rec.reason}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {moviesLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : moviesError ? (
                <div className="rounded-3xl border border-rose-500/20 bg-[#111] p-10 text-center text-rose-300">{moviesError}</div>
            ) : (
                <div className="space-y-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <FilmIcon className="w-5 h-5 text-emerald-400" />
                            <h2 className="text-xl font-semibold text-white">Now Showing</h2>
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/20">
                                {nowShowing.length}
                            </span>
                        </div>
                        {nowShowing.length === 0 ? (
                            <div className="rounded-3xl border border-white/10 bg-[#111] p-10 text-center text-gray-400">
                                {hasActiveFilters ? "No movies match your search or genre filters." : (
                                    <span className="flex items-center justify-center gap-2"><FilmIcon className="w-5 h-5" /> No movies currently showing.</span>
                                )}
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {nowShowing.map((movie) => (
                                    <MovieCard key={movie._id} movie={movie} />
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Calendar className="w-5 h-5 text-sky-400" />
                            <h2 className="text-xl font-semibold text-white">Upcoming</h2>
                            <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-300 border border-sky-500/20">
                                {upcoming.length}
                            </span>
                        </div>
                        {upcoming.length === 0 ? (
                            <div className="rounded-3xl border border-white/10 bg-[#111] p-10 text-center text-gray-400">
                                {hasActiveFilters ? "No movies match your search or genre filters." : (
                                    <span className="flex items-center justify-center gap-2"><Calendar className="w-5 h-5" /> No upcoming movies scheduled.</span>
                                )}
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {upcoming.map((movie) => (
                                    <MovieCard key={movie._id} movie={movie} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <GenreModal
                isOpen={genreModalOpen}
                onClose={() => setGenreModalOpen(false)}
                selectedGenres={selectedGenres}
                onSelect={handleGenreSave}
            />
        </div>
    );
}
