"use client";

import { useMemo, useState, useEffect } from "react";
import { Loader2, Trash2, ZoomIn, ZoomOut, Eye, Pencil } from "lucide-react";
import { handleCreateHall, handleUpdateHall, handleDeleteHall, handleGenerateHallLayout, handleGetSeatsByHall, type Hall, type Seat } from "@/lib/actions/hall-action";
import { toast } from "react-toastify";
import { handleUpdateSeatType, handleUpdateSeatStatus, handleBulkUpdateSeats } from "@/lib/actions/seat-action";
import { fetchCinemas, type Cinema } from "@/lib/api/cinema";

const SEAT_COLORS: Record<string, string> = {
    regular: "bg-gray-400 border-gray-500 text-gray-900",
    premium: "bg-amber-400 border-amber-500 text-amber-900",
    vip: "bg-indigo-400 border-indigo-500 text-indigo-900",
};

const SEAT_STATUS_COLORS: Record<string, string> = {
    active: "",
    disabled: "bg-gray-600 border-gray-700 text-gray-300 opacity-60 cursor-not-allowed",
    hidden: "invisible",
    missing: "bg-transparent border-transparent",
};

function CreateHallForm({ onCreated }: { onCreated: (hall: Hall) => void }) {
    const [form, setForm] = useState({
        name: "",
        cinemaId: "",
        totalRows: 10,
        seatsPerRow: 12,
        aisles: "4, 8",
    });
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCinemas()
            .then(setCinemas)
            .catch(() => toast.error("Failed to load cinemas"));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const aisles = form.aisles
            .split(",")
            .map((a) => parseInt(a.trim(), 10))
            .filter((n) => !isNaN(n) && n > 0);

        const payload = {
            name: form.name,
            cinemaId: form.cinemaId,
            totalRows: form.totalRows,
            seatsPerRow: form.seatsPerRow,
            aisles,
        };

        const res = await handleCreateHall(payload);
        setLoading(false);

        if (res.success && res.data) {
            toast.success("Hall created");
            onCreated(res.data);
        } else {
            toast.error(res.message || "Failed to create hall");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 space-y-4">
            <h2 className="text-white text-lg font-semibold">Hall Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Hall Name *">
                    <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required className={inputClass} placeholder="Hall 1" />
                </Field>
                <Field label="Cinema *">
                    <select value={form.cinemaId} onChange={(e) => setForm((p) => ({ ...p, cinemaId: e.target.value }))} required className={inputClass}>
                        <option value="">Select cinema</option>
                        {cinemas.map((c) => (
                            <option key={c._id} value={c._id}>{c.name}{c.city ? ` - ${c.city}` : ""}</option>
                        ))}
                    </select>
                </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Total Rows *">
                    <input type="number" value={form.totalRows} onChange={(e) => setForm((p) => ({ ...p, totalRows: parseInt(e.target.value, 10) || 0 }))} required min={1} max={50} className={inputClass} />
                </Field>
                <Field label="Seats Per Row *">
                    <input type="number" value={form.seatsPerRow} onChange={(e) => setForm((p) => ({ ...p, seatsPerRow: parseInt(e.target.value, 10) || 0 }))} required min={1} max={30} className={inputClass} />
                </Field>
                <Field label="Aisles (e.g. 4, 8)">
                    <input value={form.aisles} onChange={(e) => setForm((p) => ({ ...p, aisles: e.target.value }))} className={inputClass} placeholder="After which seat numbers" />
                </Field>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold py-3 rounded-lg tracking-widest uppercase transition">
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Creating…</span> : "Create Hall"}
            </button>
        </form>
    );
}

type EditMode = "edit" | "preview";

export default function CreateHallPage() {
    const [hall, setHall] = useState<Hall | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [editMode, setEditMode] = useState<EditMode>("edit");
    const [zoom, setZoom] = useState(1);
    const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
    const [bulkRow, setBulkRow] = useState<string | null>(null);
    const [generated, setGenerated] = useState(false);

    const rows = useMemo(() => {
        if (!seats.length) return [];
        const map = new Map<string, Seat[]>();
        seats.forEach((s) => {
            const arr = map.get(s.rowLabel) || [];
            arr.push(s);
            map.set(s.rowLabel, arr);
        });
        return Array.from(map.entries())
            .map(([label, seatList]) => ({ label, seats: seatList.sort((a, b) => a.seatNumber - b.seatNumber) }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [seats]);

    const hallSeatsPerRow = useMemo(() => {
        if (!hall) return 0;
        return hall.seatsPerRow;
    }, [hall]);

    const aisles = useMemo(() => {
        if (!hall) return [] as number[];
        return ((hall.aisles as number[]) || []).filter((a) => a > 0 && a < hallSeatsPerRow).sort((a, b) => a - b);
    }, [hall, hallSeatsPerRow]);

    const handleGenerated = async (h: Hall) => {
        setLoading(true);
        setMessage(null);
        const res = await handleGetSeatsByHall(h._id);
        setLoading(false);
        if (res.success && res.data) {
            setSeats(res.data);
            setHall(h);
            setGenerated(true);
            toast.success("Layout generated");
        } else {
            toast.error(res.message || "Failed to load seats");
        }
    };

    const handleGenerate = async () => {
        if (!hall) return;
        setLoading(true);
        setMessage(null);
        const res = await handleGenerateHallLayout(hall._id);
        setLoading(false);
        if (res.success && res.data) {
            setHall(res.data);
            await handleGenerated(res.data);
        } else {
            toast.error(res.message || "Failed to generate layout");
        }
    };

    const handleSaveSeat = async (seat: Seat, updates: Partial<Seat>) => {
        let res;
        if (updates.seatType) {
            res = await handleUpdateSeatType(seat._id, updates.seatType as Seat["seatType"]);
        } else if (updates.status) {
            res = await handleUpdateSeatStatus(seat._id, updates.status as Seat["status"]);
        }
        if (res?.success && res.data) {
            setSeats((prev) => prev.map((s) => (s._id === res.data._id ? res.data : s)));
            setSelectedSeat(null);
            toast.success("Seat updated");
        } else {
            toast.error(res?.message || "Failed to update seat");
        }
    };

    const handleRowBulkUpdate = async (rowLabel: string, seatType?: string, status?: string) => {
        if (!hall) return;
        const rowSeats = seats.filter((s) => s.rowLabel === rowLabel);
        const updates = rowSeats.map((s) => ({ seatId: s._id, ...(seatType !== undefined && { seatType }), ...(status !== undefined && { status }) }));
        const res = await handleBulkUpdateSeats(hall._id, updates);
        if (res.success) {
            if (seatType) setSeats((prev) => prev.map((s) => (s.rowLabel === rowLabel ? { ...s, seatType: seatType as Seat["seatType"] } : s)));
            if (status) setSeats((prev) => prev.map((s) => (s.rowLabel === rowLabel ? { ...s, status: status as Seat["status"] } : s)));
            setBulkRow(null);
            toast.success("Row updated");
        } else {
            toast.error(res.message || "Failed to update row");
        }
    };

    const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 2));
    const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.5));

    const seatTypeLabel = (type: string) => type.charAt(0).toUpperCase() + type.slice(1);
    const seatStatusLabel = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-white text-2xl font-bold tracking-wide">Cinema Hall Builder</h1>
                    <p className="text-gray-500 text-sm">Create and configure hall seat layouts</p>
                </div>
                {generated && (
                    <div className="flex items-center gap-2">
                        <button onClick={handleZoomOut} className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:border-yellow-400 transition">
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
                        <button onClick={handleZoomIn} className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:border-yellow-400 transition">
                            <ZoomIn className="w-4 h-4" />
                        </button>
                        <div className="h-6 w-px bg-white/10 mx-2" />
                        <button onClick={() => setEditMode((m) => (m === "edit" ? "preview" : "edit"))} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:border-yellow-400 transition">
                            {editMode === "edit" ? <Eye className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                            {editMode === "edit" ? "Preview" : "Edit"}
                        </button>
                    </div>
                )}
            </div>

            {message && (
                <div className={`p-3 rounded text-sm ${message.type === "success" ? "bg-green-500/10 border border-green-500/50 text-green-400" : "bg-red-500/10 border border-red-500/50 text-red-400"}`}>
                    {message.text}
                </div>
            )}

            {!hall ? (
                <CreateHallForm onCreated={(h) => { setHall(h); toast.success("Hall created. Update configuration and generate layout."); }} />
            ) : (
                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 space-y-4">
                    <h2 className="text-white text-lg font-semibold">Hall Configuration</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Field label="Hall Name">
                            <input value={hall.name} onChange={(e) => setHall((prev: Hall | null) => prev ? { ...prev, name: e.target.value } : prev)} className={inputClass} />
                        </Field>
                        <Field label="Total Rows">
                            <input type="number" value={hall.totalRows} onChange={(e) => setHall((prev: Hall | null) => prev ? { ...prev, totalRows: parseInt(e.target.value, 10) || 0 } : prev)} className={inputClass} />
                        </Field>
                        <Field label="Seats Per Row">
                            <input type="number" value={hall.seatsPerRow} onChange={(e) => setHall((prev: Hall | null) => prev ? { ...prev, seatsPerRow: parseInt(e.target.value, 10) || 0 } : prev)} className={inputClass} />
                        </Field>
                        <Field label="Aisles (comma separated)">
                            <input value={(hall.aisles as number[] || []).join(", ")} onChange={(e) => {
                                const aisles = e.target.value.split(",").map((a) => parseInt(a.trim(), 10)).filter((n) => !isNaN(n) && n > 0);
                                setHall((prev: Hall | null) => prev ? { ...prev, aisles } : prev);
                            }} className={inputClass} placeholder="4, 8" />
                        </Field>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={async () => {
                            if (!hall) return;
                            setLoading(true);
                            const res = await handleUpdateHall(hall._id, { name: hall.name, totalRows: hall.totalRows, seatsPerRow: hall.seatsPerRow, aisles: hall.aisles });
                            setLoading(false);
                            if (res.success) { toast.success("Hall updated"); }
                            else { toast.error(res.message || "Failed to update"); }
                        }} disabled={loading} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:border-yellow-400 transition">
                            Save Hall
                        </button>
                        <button onClick={handleGenerate} disabled={loading || generated} className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold transition">
                            {generated ? "Layout Generated" : "Generate Layout"}
                        </button>
                        <button onClick={async () => {
                            if (!hall) return;
                            setLoading(true);
                            const res = await handleDeleteHall(hall._id);
                            setLoading(false);
                            if (res.success) {
                                setHall(null);
                                setSeats([]);
                                setGenerated(false);
                                toast.success("Hall deleted");
                            } else {
                                toast.error(res.message || "Failed to delete");
                            }
                        }} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm hover:border-red-500 transition">
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    </div>
                </div>
            )}

            {generated && rows.length > 0 && (
                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-white text-lg font-semibold">Seat Layout</h2>
                            <p className="text-gray-500 text-xs mt-1">Click a seat to edit. Click a row label to bulk edit.</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-400 border border-gray-500 inline-block" /> Regular</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-400 border border-amber-500 inline-block" /> Premium</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-400 border border-indigo-500 inline-block" /> VIP</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="min-w-max inline-block" style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
                            {rows.map((row) => (
                                <div key={row.label} className="flex items-center gap-2 mb-2">
                                    {editMode === "edit" ? (
                                        <button onClick={() => setBulkRow((r) => (r === row.label ? null : row.label))} className="w-8 text-white font-bold text-sm hover:text-yellow-400 transition">
                                            {row.label}
                                        </button>
                                    ) : (
                                        <span className="w-8 text-white font-bold text-sm">{row.label}</span>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                        {row.seats.map((seat) => {
                                            if (seat.status === "missing") {
                                                return <div key={seat._id} className="w-8 h-8" />;
                                            }

                                            const showAisle = aisles.includes(seat.seatNumber - 1) || aisles.includes(seat.seatNumber);
                                            const baseColor = SEAT_COLORS[seat.seatType] || SEAT_COLORS.regular;
                                            const statusColor = SEAT_STATUS_COLORS[seat.status] || "";
                                            const isSelected = selectedSeat?._id === seat._id || bulkRow === row.label;
                                            const borderClass = isSelected ? "ring-2 ring-yellow-400" : "border";

                                            if (seat.status === "hidden") {
                                                return <div key={seat._id} className="w-8 h-8 border border-transparent" title={`${seat.seatLabel} (Hidden)`} />;
                                            }

                                            return (
                                                <div key={seat._id} className="relative">
                                                    <button
                                                        disabled={editMode === "preview" || seat.status === "disabled"}
                                                        onClick={() => editMode === "edit" && setSelectedSeat(seat)}
                                                        title={`${seat.seatLabel} - ${seatTypeLabel(seat.seatType)} - ${seatStatusLabel(seat.status)}`}
                                                        className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-[10px] font-bold transition ${baseColor} ${statusColor} ${borderClass} ${seat.status === "disabled" ? "cursor-not-allowed" : "cursor-pointer hover:scale-110"}`}
                                                    >
                                                        {seat.seatNumber}
                                                    </button>
                                                    {showAisle && <div className="w-3" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-4 justify-end">
                        <div className="rounded-full bg-white/5 px-3 py-2 text-xs text-gray-400">Screen</div>
                        <div className="flex-1 h-2 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-full max-w-md mx-auto" />
                    </div>
                </div>
            )}

            {!generated && (
                <div className="text-center text-gray-500 py-10">
                    Create a hall, configure it, then click <span className="text-yellow-400 font-semibold">Generate Layout</span> to build the seat map.
                </div>
            )}

            {editMode === "edit" && selectedSeat && (
                <SeatEditor
                    seat={selectedSeat}
                    onClose={() => setSelectedSeat(null)}
                    onSave={handleSaveSeat}
                />
            )}

            {editMode === "edit" && bulkRow && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setBulkRow(null)}>
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-white text-lg font-semibold mb-4">Edit Row {bulkRow}</h3>
                        <p className="text-gray-400 text-sm mb-4">Update all seats in row {bulkRow}</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Seat Type</label>
                                <select className={inputClass} defaultValue="" onChange={(e) => {
                                    if (e.target.value) handleRowBulkUpdate(bulkRow, e.target.value);
                                }}>
                                    <option value="">Keep current</option>
                                    <option value="regular">Regular</option>
                                    <option value="premium">Premium</option>
                                    <option value="vip">VIP</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Status</label>
                                <select className={inputClass} defaultValue="" onChange={(e) => {
                                    if (e.target.value) handleRowBulkUpdate(bulkRow, undefined, e.target.value);
                                }}>
                                    <option value="">Keep current</option>
                                    <option value="active">Active</option>
                                    <option value="disabled">Disabled</option>
                                    <option value="hidden">Hidden</option>
                                    <option value="missing">Missing</option>
                                </select>
                            </div>
                            <button onClick={() => setBulkRow(null)} className="w-full bg-white/5 border border-white/10 text-white text-sm py-2 rounded-lg hover:border-yellow-400 transition">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SeatEditor({ seat, onSave, onClose }: { seat: Seat; onSave: (seat: Seat, updates: Partial<Seat>) => void; onClose: () => void }) {
    const [seatType, setSeatType] = useState(seat.seatType);
    const [status, setStatus] = useState(seat.status);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-white text-lg font-semibold mb-1">Edit Seat</h3>
                <p className="text-gray-400 text-sm mb-4">{seat.seatLabel}</p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Seat Type</label>
                        <select value={seatType} onChange={(e) => setSeatType(e.target.value as Seat["seatType"])} className={inputClass}>
                            <option value="regular">Regular</option>
                            <option value="premium">Premium</option>
                            <option value="vip">VIP</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value as Seat["status"])} className={inputClass}>
                            <option value="active">Active</option>
                            <option value="disabled">Disabled</option>
                            <option value="hidden">Hidden</option>
                            <option value="missing">Missing</option>
                        </select>
                    </div>
                    <button onClick={() => {
                        const updates: Partial<Seat> = {};
                        if (seatType !== seat.seatType) updates.seatType = seatType;
                        if (status !== seat.status) updates.status = status;
                        if (Object.keys(updates).length > 0) onSave(seat, updates);
                    }} className="w-full bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold py-3 rounded-lg transition">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

const inputClass = "w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">{label}</label>
            {children}
        </div>
    );
}
