"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { fetchMovies } from "@/lib/actions/movie-action";
import { Movie } from "@/lib/api/movie";
import MovieCard from "@/app/frontend/_components/MovieCard";
import { Loader2, Film } from "lucide-react";

export default function UserDashboardPage() {
    const { user, loading } = useAuth();
    const displayName = user?.name || user?.username || user?.email || "User";

    const [movies, setMovies] = useState<Movie[]>([]);
    const [moviesLoading, setMoviesLoading] = useState(true);
    const [moviesError, setMoviesError] = useState("");

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
