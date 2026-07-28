"use client";

import { useEffect, useState, type FormEvent } from "react";
import { handleListDayDiscounts, handleCreateDayDiscount, handleUpdateDayDiscount, handleDeleteDayDiscount } from "@/lib/actions/admin-action";
import { type DayDiscount } from "@/lib/api/day-discount";
import { Loader2, Plus, Trash2, Edit, X } from "lucide-react";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function DiscountForm({ discount, onClose, onSubmit }: { discount?: DayDiscount; onClose: () => void; onSubmit: () => void }) {
    const [form, setForm] = useState({
        dayOfWeek: discount?.dayOfWeek ?? 0,
        discountType: discount?.discountType ?? "percentage",
        discountValue: discount?.discountValue ?? 0,
        isActive: discount?.isActive ?? true,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            if (discount?._id) {
                await handleUpdateDayDiscount(discount._id, form);
            } else {
                await handleCreateDayDiscount(form);
            }
            onSubmit();
        } catch (err: unknown) {
            setMessage({ type: "error", text: (err as Error).message || "Failed to save discount" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-semibold">{discount ? "Edit Day Discount" : "New Day Discount"}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                {message && (
                    <div className={`p-3 rounded text-sm mb-4 ${message.type === "success" ? "bg-green-500/10 border border-green-500/50 text-green-400" : "bg-red-500/10 border border-red-500/50 text-red-400"}`}>
                        {message.text}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Day of Week</label>
                        <select value={form.dayOfWeek} onChange={(e) => setForm((prev) => ({ ...prev, dayOfWeek: Number(e.target.value) }))} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 transition">
                            {DAY_NAMES.map((name, idx) => (
                                <option key={idx} value={idx}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Discount Type</label>
                        <select value={form.discountType} onChange={(e) => setForm((prev) => ({ ...prev, discountType: e.target.value as "percentage" | "fixed" }))} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 transition">
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (Rs.)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Discount Value</label>
                        <input type="number" value={form.discountValue} onChange={(e) => setForm((prev) => ({ ...prev, discountValue: Number(e.target.value) }))} min={0} required className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 transition" placeholder={form.discountType === "percentage" ? "10" : "50"} />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))} className="w-4 h-4 rounded border-white/20 bg-[#111] text-yellow-400 focus:ring-yellow-400" />
                        <label htmlFor="isActive" className="text-sm text-gray-300">Active</label>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold py-3 rounded-lg tracking-widest uppercase transition">
                        {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving…</span> : discount ? "Update Discount" : "Create Discount"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function AdminDiscountsPage() {
    const [discounts, setDiscounts] = useState<DayDiscount[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState<DayDiscount | undefined>();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this discount?")) return;
        const res = await handleDeleteDayDiscount(id);
        if (res.success) {
            setMessage({ type: "success", text: "Discount deleted" });
            refresh();
        } else {
            setMessage({ type: "error", text: res.message || "Failed to delete discount" });
        }
    };

    const handleSave = () => {
        setShowForm(false);
        setEditingDiscount(undefined);
        setMessage({ type: "success", text: editingDiscount ? "Discount updated" : "Discount created" });
        refresh();
    };

    const handleEdit = (discount: DayDiscount) => {
        setEditingDiscount(discount);
        setShowForm(true);
    };

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            const res = await handleListDayDiscounts();
            if (res.success && res.data) {
                setDiscounts(res.data);
            } else {
                setMessage({ type: "error", text: res.message || "Failed to load discounts" });
            }
            setLoading(false);
        };
        run();
    }, []);

    const refresh = async () => {
        const res = await handleListDayDiscounts();
        if (res.success && res.data) {
            setDiscounts(res.data);
        } else {
            setMessage({ type: "error", text: res.message || "Failed to load discounts" });
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-white text-2xl font-bold tracking-wide">Day Discounts</h1>
                    <p className="text-gray-500 text-sm">Configure permanent discounts for specific days of the week</p>
                </div>
                <button onClick={() => { setEditingDiscount(undefined); setShowForm(true); }} className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold px-4 py-2.5 rounded-lg transition">
                    <Plus className="w-4 h-4" /> Add Discount
                </button>
            </div>

            {message && (
                <div className={`p-3 rounded text-sm ${message.type === "success" ? "bg-green-500/10 border border-green-500/50 text-green-400" : "bg-red-500/10 border border-red-500/50 text-red-400"}`}>
                    {message.text}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                </div>
            ) : (
                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-6 py-4 text-gray-400 font-medium uppercase tracking-wider text-xs">Day</th>
                                <th className="text-left px-6 py-4 text-gray-400 font-medium uppercase tracking-wider text-xs">Type</th>
                                <th className="text-left px-6 py-4 text-gray-400 font-medium uppercase tracking-wider text-xs">Value</th>
                                <th className="text-left px-6 py-4 text-gray-400 font-medium uppercase tracking-wider text-xs">Status</th>
                                <th className="text-right px-6 py-4 text-gray-400 font-medium uppercase tracking-wider text-xs">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discounts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No day discounts configured yet.</td>
                                </tr>
                            ) : (
                                discounts.map((discount) => (
                                    <tr key={discount._id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition">
                                        <td className="px-6 py-4 text-white font-medium">{DAY_NAMES[discount.dayOfWeek]}</td>
                                        <td className="px-6 py-4 text-gray-300 capitalize">{discount.discountType}</td>
                                        <td className="px-6 py-4 text-gray-300">{discount.discountType === "percentage" ? `${discount.discountValue}%` : `Rs. ${discount.discountValue}`}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${discount.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                                                {discount.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(discount)} className="p-2 text-gray-400 hover:text-yellow-400 transition"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(discount._id)} className="p-2 text-gray-400 hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <DiscountForm discount={editingDiscount} onClose={() => { setShowForm(false); setEditingDiscount(undefined); }} onSubmit={handleSave} />
            )}
        </div>
    );
}
