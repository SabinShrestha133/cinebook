import Link from "next/link";
import { Movie } from "@/lib/api/movie";

function formatDuration(minutes?: number) {
    if (!minutes) return "—";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h ? `${h}h ${m}m` : `${m}m`;
}

export default function MovieCard({ movie }: { movie: Movie }) {
    const genreList = movie.genres?.join(", ") ?? "Drama";
    const poster = movie.posterUrl || "/uploads/default-movie-poster.png";
    const statusLabel = movie.status?.replace("_", " ") ?? "Now showing";

    return (
        <Link
            href={`/movies/${movie._id}`}
            className="group relative block h-72 bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-xl shadow-black/20 transition-all duration-500 hover:z-10 hover:scale-[1.02] hover:border-yellow-400/40 hover:shadow-2xl hover:shadow-black/60"
        >
            <img
                src={poster}
                alt={movie.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 transition-opacity duration-300 group-hover:opacity-0">
                <p className="text-xs uppercase tracking-[0.3em] text-yellow-300 mb-1">{statusLabel}</p>
                <h2 className="text-white text-lg font-semibold">{movie.title}</h2>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 translate-y-8 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-xs uppercase tracking-[0.3em] text-yellow-300 mb-1">{statusLabel}</p>
                <h2 className="text-white text-lg font-semibold mb-2">{movie.title}</h2>
                <p className="text-gray-300 text-sm line-clamp-3 mb-3">{movie.description || "No description available."}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.2em] text-gray-400">
                    <span className="text-yellow-300">{genreList}</span>
                    {movie.language && <span>{movie.language}</span>}
                    <span>{formatDuration(movie.duration)}</span>
                </div>
            </div>
        </Link>
    );
}
