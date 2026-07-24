"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { ROLE_LABELS } from "@/lib/utils/roles";
import {
    handleListUsers,
    handleGetUserDetails,
    handleUpdateUser,
    handleDeleteUser,
} from "@/lib/actions/admin-action";
import {
    AdminUser,
    UserDetails,
} from "@/lib/api/admin";
import {
    Users,
    Film,
    RefreshCw,
    Trash2,
    Check,
    X,
    Eye,
    ArrowLeft,
    Loader2,
    Search,
    Ticket,
    TrendingUp,
    Mail,
} from "lucide-react";

export default function UsersPage() {
    return <UsersContent />;
}

function UsersContent() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        username: "",
        phoneNumber: "",
        isActive: true,
    });
    const [saving, setSaving] = useState(false);
    const [editMsg, setEditMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadUsers = async () => {
        setLoading(true);
        setError("");
        const res = await handleListUsers();
        if (res.success && res.data) {
            setUsers(res.data);
        } else {
            setError(res.message || "Failed to load users");
        }
        setLoading(false);
    };

    useEffect(() => {
        const init = async () => {
            await loadUsers();
        };
        init();
    }, []);

    const filteredUsers = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.username?.toLowerCase().includes(search.toLowerCase()) ||
            u.phoneNumber?.toLowerCase().includes(search.toLowerCase())
    );

    const openDetails = async (id: string) => {
        setDetailsLoading(true);
        setSelectedUser(null);
        const res = await handleGetUserDetails(id);
        if (res.success && res.data) {
            setSelectedUser(res.data as UserDetails);
        } else {
            setError(res.message || "Failed to load user details");
        }
        setDetailsLoading(false);
    };

    const openEdit = (user: AdminUser) => {
        setEditingUser(user);
        setEditForm({
            name: user.name || "",
            email: user.email,
            username: user.username || "",
            phoneNumber: user.phoneNumber || "",
            isActive: user.isActive,
        });
        setEditMsg(null);
    };

    const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleEditSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        setSaving(true);
        setEditMsg(null);
        const res = await handleUpdateUser(editingUser._id, editForm);
        setSaving(false);
        if (res.success) {
            setEditMsg({ type: "success", text: "User updated" });
            setEditingUser(null);
            loadUsers();
            if (selectedUser) {
                openDetails(selectedUser.user._id);
            }
        } else {
            setEditMsg({ type: "error", text: res.message || "Failed to update user" });
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) return;
        setDeletingId(id);
        const res = await handleDeleteUser(id);
        setDeletingId(null);
        if (res.success) {
            setUsers((prev) => prev.filter((u) => u._id !== id));
            if (selectedUser && selectedUser.user._id === id) {
                setSelectedUser(null);
            }
        } else {
            setError(res.message || "Failed to delete user");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                        <h1 className="text-white text-2xl font-bold tracking-wide">User Management</h1>
                        <p className="text-gray-500 text-sm">View, edit and delete users</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadUsers}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
                    >
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search users..."
                            className="pl-9 bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 transition"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">{error}</div>
            )}

            {selectedUser && (
                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-white text-xl font-bold flex items-center gap-2">
                            <Eye className="w-5 h-5 text-yellow-400" /> User Details
                        </h2>
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to list
                        </button>
                    </div>

                    {detailsLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                        </div>
                    ) : selectedUser && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard label="Movies Watched" value={String(selectedUser.stats.totalMoviesWatched)} icon={Film} />
                                <StatCard label="Tickets Booked" value={String(selectedUser.stats.totalTickets)} icon={Ticket} />
                                <StatCard label="Total Spent" value={`Rs. ${selectedUser.stats.totalSpent.toLocaleString()}`} icon={TrendingUp} />
                                <StatCard label="Email" value={selectedUser.user.email} sub={selectedUser.user.username} icon={Mail} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-white font-semibold text-sm uppercase tracking-wide">Movie Statistics</h3>
                                    {selectedUser.movieStats.length === 0 ? (
                                        <p className="text-gray-500 text-sm">No movies watched yet</p>
                                    ) : (
                                        <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-gray-500 text-xs uppercase tracking-wide border-b border-white/5">
                                                        <th className="text-left font-medium px-4 py-3">Movie</th>
                                                        <th className="text-center font-medium px-4 py-3">Times Watched</th>
                                                        <th className="text-right font-medium px-4 py-3">Total Spent</th>
                                                        <th className="text-right font-medium px-4 py-3">Last Watched</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedUser.movieStats.map((m, i) => (
                                                        <tr key={m.movieId + i} className="border-b border-white/5 last:border-0">
                                                            <td className="px-4 py-3 text-white">
                                                                <Link href={`/movies/${m.slug || m.movieId}`} className="hover:text-yellow-400 transition">
                                                                    {m.title}
                                                                </Link>
                                                                <div className="text-xs text-gray-500">{m.genres?.slice(0, 2).join(", ")}</div>
                                                            </td>
                                                            <td className="px-4 py-3 text-center text-gray-300">{m.timesWatched}</td>
                                                            <td className="px-4 py-3 text-right text-yellow-400 font-medium">Rs. {m.totalSpent.toLocaleString()}</td>
                                                            <td className="px-4 py-3 text-right text-gray-400 text-xs">
                                                                {new Date(m.lastWatched).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-white font-semibold text-sm uppercase tracking-wide">Booking History</h3>
                                    {selectedUser.bookings.length === 0 ? (
                                        <p className="text-gray-500 text-sm">No bookings found</p>
                                    ) : (
                                        <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden max-h-[400px] overflow-y-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-gray-500 text-xs uppercase tracking-wide border-b border-white/5 sticky top-0 bg-[#111]">
                                                        <th className="text-left font-medium px-4 py-3">Movie</th>
                                                        <th className="text-left font-medium px-4 py-3">Cinema</th>
                                                        <th className="text-right font-medium px-4 py-3">Amount</th>
                                                        <th className="text-right font-medium px-4 py-3">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedUser.bookings.map((b) => (
                                                        <tr key={b._id} className="border-b border-white/5 last:border-0">
                                                            <td className="px-4 py-3 text-white">
                                                                <Link href={`/movies/${b.movieSlug}`} className="hover:text-yellow-400 transition">
                                                                    {b.movieTitle}
                                                                </Link>
                                                                <div className="text-xs text-gray-500">{b.bookingCode}</div>
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-400">{b.cinemaName}</td>
                                                            <td className="px-4 py-3 text-right text-yellow-400 font-medium">Rs. {b.totalAmount.toLocaleString()}</td>
                                                            <td className="px-4 py-3 text-right text-gray-400 text-xs">
                                                                {new Date(b.createdAt).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {editingUser && (
                <form onSubmit={handleEditSubmit} className="space-y-4 bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Name"><input name="name" value={editForm.name} onChange={handleEditChange} className={inputClass} /></Field>
                        <Field label="Username"><input name="username" value={editForm.username} onChange={handleEditChange} className={inputClass} /></Field>
                        <Field label="Email"><input name="email" value={editForm.email} onChange={handleEditChange} required className={inputClass} /></Field>
                        <Field label="Phone"><input name="phoneNumber" value={editForm.phoneNumber} onChange={handleEditChange} className={inputClass} /></Field>
                        <label className="flex items-center gap-3 text-sm text-gray-300">
                            <input type="checkbox" name="isActive" checked={editForm.isActive} onChange={handleEditChange} className="w-4 h-4 rounded bg-[#111] border-white/20 text-yellow-400 focus:ring-yellow-400" />
                            Active
                        </label>
                    </div>
                    {editMsg && (
                        <div className={`p-3 rounded text-sm ${editMsg.type === "success" ? "bg-green-500/10 border border-green-500/50 text-green-400" : "bg-red-500/10 border border-red-500/50 text-red-400"}`}>
                            {editMsg.text}
                        </div>
                    )}
                    <div className="flex gap-3">
                        <button type="submit" disabled={saving}
                            className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold py-3 rounded-lg tracking-widest uppercase transition">
                            {saving ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving…</span> : "Save Changes"}
                        </button>
                        <button type="button" onClick={() => setEditingUser(null)}
                            className="px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold py-3 rounded-lg transition">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {!selectedUser && !editingUser && (
                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 text-xs uppercase tracking-wide border-b border-white/5">
                                <th className="text-left font-medium px-6 py-4">Name</th>
                                <th className="text-left font-medium px-6 py-4">Email</th>
                                <th className="text-left font-medium px-6 py-4">Phone</th>
                                <th className="text-left font-medium px-6 py-4">Role</th>
                                <th className="text-left font-medium px-6 py-4">Status</th>
                                <th className="text-right font-medium px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin text-yellow-400 mx-auto" /></td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={6} className="text-center text-gray-500 px-6 py-8">No users found</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="border-b border-white/5 last:border-0">
                                        <td className="px-6 py-4 text-white">{user.name || user.username || "—"}</td>
                                        <td className="px-6 py-4 text-gray-400">{user.email}</td>
                                        <td className="px-6 py-4 text-gray-400">{user.phoneNumber || "—"}</td>
                                        <td className="px-6 py-4 text-gray-400">{ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] || user.role}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                                                {user.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                {user.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openDetails(user._id)}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEdit(user)}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition"
                                                    title="Edit"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    disabled={deletingId === user._id}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {deletingId === user._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, icon: Icon, sub }: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; sub?: string }) {
    return (
        <div className="bg-[#111] border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="min-w-0">
                    <p className="text-gray-500 text-[10px] uppercase tracking-wide">{label}</p>
                    <p className="text-white text-sm font-bold truncate">{value}</p>
                    {sub && <p className="text-gray-500 text-xs truncate">{sub}</p>}
                </div>
            </div>
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
