"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { handleCreateMovie } from "@/lib/actions/admin-action";
import { Loader2, Film, CheckCircle2 } from "lucide-react";

function CreateMovieContent() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        slug: "",
        description: "",
        genres: "",
        language: "",
        duration: "",
        releaseDate: "",
        featured: false,
    });
    const [poster, setPoster] = useState<File | null>(null);
    const [posterName, setPosterName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setPoster(file);
        setPosterName(file?.name ?? "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const fd = new FormData();
        fd.append("title", form.title);
        if (form.slug) fd.append("slug", form.slug);
        if (form.description) fd.append("description", form.description);
        if (form.genres) {
            form.genres.split(",").map((g) => g.trim()).filter(Boolean).forEach((g) => fd.append("genres", g));
        }
        if (form.language) fd.append("language", form.language);
        if (form.duration) fd.append("duration", form.duration);
        if (form.releaseDate) fd.append("releaseDate", form.releaseDate);
        fd.append("featured", String(form.featured));
        if (poster) fd.append("poster", poster);

        const res = await handleCreateMovie(fd);
        setLoading(false);

        if (res.success) {
            setMessage({ type: "success", text: "Movie created successfully" });
            setTimeout(() => router.push("/admin/dashboard"), 800);
        } else {
            setMessage({ type: "error", text: res.message || "Failed to create movie" });
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                    <Film className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                    <h1 className="text-white text-2xl font-bold tracking-wide">Add New Movie</h1>
                    <p className="text-gray-500 text-sm">Create a movie entry with poster</p>
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
                    <Field label="Genres (comma separated)">
                        <input name="genres" value={form.genres} onChange={handleChange} className={inputClass} placeholder="action, drama" />
                    </Field>
                    <Field label="Duration (minutes)">
                        <input name="duration" type="number" value={form.duration} onChange={handleChange} className={inputClass} placeholder="120" />
                    </Field>
                </div>

                <Field label="Release Date">
                    <input name="releaseDate" type="date" value={form.releaseDate} onChange={handleChange} className={inputClass} />
                </Field>

                <Field label="Poster Image">
                    <input type="file" accept="image/*" onChange={handleFile}
                        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-yellow-400 file:text-black file:text-xs file:font-bold" />
                    {posterName && (
                        <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-400" /> {posterName}
                        </p>
                    )}
                </Field>

                <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                        className="w-4 h-4 accent-yellow-400" />
                    Featured movie
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold py-3 rounded-lg tracking-widest uppercase transition"
                >
                    {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Creating…</span> : "Create Movie"}
                </button>
            </form>
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

export default function CreateMoviePage() {
    return <CreateMovieContent />;
}
