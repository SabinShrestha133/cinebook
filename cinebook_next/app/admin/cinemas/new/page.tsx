"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleCreateCinema } from "@/lib/actions/admin-action";
import { Loader2, Building2 } from "lucide-react";

function CreateCinemaContent() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        address: "",
        city: "",
        description: "",
        contactEmail: "",
        contactPhone: "",
        isActive: true,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const payload = {
            name: form.name,
            address: form.address || undefined,
            city: form.city || undefined,
            description: form.description || undefined,
            contactEmail: form.contactEmail || undefined,
            contactPhone: form.contactPhone || undefined,
            isActive: form.isActive,
        };

        const res = await handleCreateCinema(payload);
        setLoading(false);

        if (res.success) {
            setMessage({ type: "success", text: "Cinema created successfully" });
            setTimeout(() => router.push("/admin/dashboard"), 800);
        } else {
            setMessage({ type: "error", text: res.message || "Failed to create cinema" });
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                    <h1 className="text-white text-2xl font-bold tracking-wide">Add New Cinema</h1>
                    <p className="text-gray-500 text-sm">Create a cinema entry for your platform</p>
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
                <Field label="Cinema Name *">
                    <input name="name" value={form.name} onChange={handleChange} required
                        className={inputClass} placeholder="Cineplex Downtown" />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="City">
                        <input name="city" value={form.city} onChange={handleChange} className={inputClass} placeholder="Kathmandu" />
                    </Field>
                    <Field label="Contact Phone">
                        <input name="contactPhone" value={form.contactPhone} onChange={handleChange} className={inputClass} placeholder="+977 98XXXXXXXX" />
                    </Field>
                </div>

                <Field label="Address">
                    <textarea name="address" value={form.address} onChange={handleChange} rows={2}
                        className={inputClass} placeholder="Street address, landmark" />
                </Field>

                <Field label="Description">
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                        className={inputClass} placeholder="Brief description of the cinema" />
                </Field>

                <Field label="Contact Email">
                    <input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} className={inputClass} placeholder="info@cinema.com" />
                </Field>

                <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange}
                        className="w-4 h-4 accent-yellow-400" />
                    Active cinema
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold py-3 rounded-lg tracking-widest uppercase transition"
                >
                    {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Creating…</span> : "Create Cinema"}
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

export default function CreateCinemaPage() {
    return <CreateCinemaContent />;
}
