"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchMovieById, type Movie } from "@/lib/api/movie";
import { handleUpdateMovie } from "@/lib/actions/admin-action";
import { Loader2, Film, ArrowLeft } from "lucide-react";
import GenreModal from "@/components/GenreModal";

function EditMovieContent() {
    const params = useParams();
    const router = useRouter();
    const movieId = params?.id as string;

    const [form, setForm] = useState({
        title: "",
        slug: "",
        description: "",
        genres: [] as string[],
        language: "",
        duration: "",
        releaseDate: "",
        featured: false,
        status: "upcoming" as Movie["status"],
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [error, setError] = useState("");
    const [genreModalOpen, setGenreModalOpen] = useState(false);

    useEffect(() => {
        if (!movieId) return;

        const load = async () => {
            try {
                const movie = await fetchMovieById(movieId);
                if (!movie) {
                    setError("Movie not found");
                    return;
                }
                 setForm({
                    title: movie.title || "",
                    slug: movie.slug || "",
                    description: movie.description || "",
                    genres: movie.genres || [],
                    language: movie.language || "",
                    duration: movie.duration ? String(movie.duration) : "",
                    releaseDate: movie.releaseDate || "",
                    featured: movie.featured || false,
                    status: movie.status || "upcoming",
                });
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Unable to load movie");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [movieId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleGenresSelect = (genres: string[]) => {
        setForm((prev) => ({ ...prev, genres }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const payload: Partial<Movie> = {
            title: form.title,
            slug: form.slug,
            description: form.description,
            genres: form.genres,
            language: form.language,
            duration: form.duration ? Number(form.duration) : undefined,
            releaseDate: form.releaseDate,
            featured: form.featured,
            status: form.status,
        };

        const res = await handleUpdateMovie(movieId, payload);
        setSaving(false);

        if (res.success) {
            setMessage({ type: "success", text: "Movie updated successfully" });
            setTimeout(() => router.push("/admin/dashboard"), 800);
        } else {
            setMessage({ type: "error", text: res.message || "Failed to update movie" });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400 text-sm">
                    {error}
                </div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> Go back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                    <Film className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                    <h1 className="text-white text-2xl font-bold tracking-wide">Edit Movie</h1>
                    <p className="text-gray-500 text-sm">Update movie information</p>
                </div>
            </div>

            {message && (
                <div
                    className={`p-3 rounded text-sm ${
                        message.type === "success"
                            ? "bg-green-500/10 border border-green-500/50 text-green-400"
                            : "bg-red-500/10 border border-red-500/50 text-red-400"
                    }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
                <Field label="Title *">
                    <input name="title" value={form.title} onChange={handleChange} required
                        className={inputClass} placeholder="Movie title" />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Slug">
                        <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} placeholder="movie-slug" />
                    </Field>
                    <Field label="Language">
                        <input name="language" value={form.language} onChange={handleChange} className={inputClass} placeholder="English" />
                    </Field>
                </div>

                <Field label="Description">
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                        className={inputClass} placeholder="Short description" />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Genres">
                    <button
                        type="button"
                        onClick={() => setGenreModalOpen(true)}
                        className={`${inputClass} text-left flex flex-wrap gap-2 items-center`}
                    >
                        {form.genres.length === 0 && <span className="text-gray-600">Select genres</span>}
                        {form.genres.map((genre) => (
                            <span
                                key={genre}
                                className="inline-block rounded-full border border-yellow-400/50 bg-yellow-400/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-yellow-300"
                            >
                                {genre}
                            </span>
                        ))}
                    </button>
                </Field>
                    <Field label="Duration (minutes)">
                        <input name="duration" type="number" value={form.duration} onChange={handleChange} className={inputClass} placeholder="120" />
                    </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Release Date">
                        <input name="releaseDate" type="date" value={form.releaseDate} onChange={handleChange} className={inputClass} />
                    </Field>
                    <Field label="Status">
                        <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                            <option value="now_showing">Now Showing</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="archived">Archived</option>
                        </select>
                    </Field>
                </div>

                <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                        className="w-4 h-4 accent-yellow-400" />
                    Featured movie
                </label>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold py-3 rounded-lg tracking-widest uppercase transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold py-3 rounded-lg tracking-widest uppercase transition"
                    >
                        {saving ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving…</span> : "Save Changes"}
                    </button>
                </div>
            </form>
            <GenreModal
                isOpen={genreModalOpen}
                onClose={() => setGenreModalOpen(false)}
                selectedGenres={form.genres}
                onSelect={handleGenresSelect}
            />
        </div>
    );
}

const inputClass =
    "w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">{label}</label>
            {children}
        </div>
    );
}

export default function EditMoviePage() {
    return <EditMovieContent />;
}
