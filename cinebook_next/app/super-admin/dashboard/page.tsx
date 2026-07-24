"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ROLE_LABELS } from "@/lib/utils/roles";
import { ALL_PERMISSIONS, PERMISSION_LABELS } from "@/lib/utils/permissions";
import {
    handleListAdmins,
    handleCreateAdmin,
    handleSetAdminActive,
    handleUpdateAdmin,
} from "@/lib/actions/super-admin-action";
import { type AdminUser } from "@/lib/api/super-admin";
import { Loader2, Shield, UserPlus, Check, X, RefreshCw, KeyRound } from "lucide-react";

function SuperAdminContent() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const [showCreate, setShowCreate] = useState(false);
    const [createForm, setCreateForm] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        phoneNumber: "",
        permissions: [] as string[],
    });
    const [creating, setCreating] = useState(false);
    const [createMsg, setCreateMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [editingPermissions, setEditingPermissions] = useState<AdminUser | null>(null);
    const [permForm, setPermForm] = useState<string[]>([]);
    const [savingPerms, setSavingPerms] = useState(false);

    const loadAdmins = async () => {
        setLoading(true);
        setError("");
        const res = await handleListAdmins();
        if (res.success && res.data) {
            setAdmins(res.data);
        } else {
            setError(res.message || "Failed to load admins");
        }
        setLoading(false);
    };

    useEffect(() => {
        const init = async () => {
            await loadAdmins();
        };
        init();
    }, []);

    const handleToggle = async (admin: AdminUser) => {
        setTogglingId(admin._id);
        const res = await handleSetAdminActive(admin._id, !admin.isActive);
        setTogglingId(null);
        if (res.success) {
            setAdmins((prev) =>
                prev.map((a) => (a._id === admin._id ? { ...a, isActive: !a.isActive } : a))
            );
        } else {
            setError(res.message || "Failed to update admin");
        }
    };

    const handleCreateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCreateForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleCreatePermission = (perm: string) => {
        setCreateForm((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(perm)
                ? prev.permissions.filter((p) => p !== perm)
                : [...prev.permissions, perm],
        }));
    };

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setCreateMsg(null);
        const res = await handleCreateAdmin({
            name: createForm.name,
            email: createForm.email,
            username: createForm.username,
            password: createForm.password,
            phoneNumber: createForm.phoneNumber,
            role: "admin",
            permissions: createForm.permissions,
        });
        setCreating(false);
        if (res.success) {
            setCreateMsg({ type: "success", text: "Admin created" });
            setCreateForm({ name: "", email: "", username: "", password: "", phoneNumber: "", permissions: [] });
            setShowCreate(false);
            loadAdmins();
        } else {
            setCreateMsg({ type: "error", text: res.message || "Failed to create admin" });
        }
    };

    const openPermissions = (admin: AdminUser) => {
        setEditingPermissions(admin);
        setPermForm(admin.permissions ?? []);
    };

    const togglePerm = (perm: string) => {
        setPermForm((prev) =>
            prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
        );
    };

    const handleSavePermissions = async () => {
        if (!editingPermissions) return;
        setSavingPerms(true);
        const res = await handleUpdateAdmin(editingPermissions._id, { permissions: permForm });
        setSavingPerms(false);
        if (res.success) {
            setAdmins((prev) =>
                prev.map((a) =>
                    a._id === editingPermissions._id ? { ...a, permissions: permForm } : a
                )
            );
            setEditingPermissions(null);
        } else {
            setError(res.message || "Failed to update permissions");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                        <h1 className="text-white text-2xl font-bold tracking-wide">Admin Panel</h1>
                        <p className="text-gray-500 text-sm">Manage admins, super admins and their functions</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadAdmins}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
                    >
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                    <button
                        onClick={() => setShowCreate((v) => !v)}
                        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold px-4 py-2.5 rounded-lg transition"
                    >
                        <UserPlus className="w-4 h-4" /> New Admin
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">{error}</div>
            )}

            {showCreate && (
                <form onSubmit={handleCreate} className="space-y-4 bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Name *"><input name="name" value={createForm.name} onChange={handleCreateChange} required className={inputClass} /></Field>
                        <Field label="Username *"><input name="username" value={createForm.username} onChange={handleCreateChange} required className={inputClass} /></Field>
                        <Field label="Email *"><input name="email" type="email" value={createForm.email} onChange={handleCreateChange} required className={inputClass} /></Field>
                        <Field label="Phone *"><input name="phoneNumber" value={createForm.phoneNumber} onChange={handleCreateChange} required className={inputClass} /></Field>
                        <Field label="Password *"><input name="password" type="password" value={createForm.password} onChange={handleCreateChange} required minLength={6} className={inputClass} /></Field>
                    </div>

                    <PermissionPicker selected={createForm.permissions} onToggle={toggleCreatePermission} />

                    {createMsg && (
                        <div className={`p-3 rounded text-sm ${createMsg.type === "success" ? "bg-green-500/10 border border-green-500/50 text-green-400" : "bg-red-500/10 border border-red-500/50 text-red-400"}`}>
                            {createMsg.text}
                        </div>
                    )}
                    <button type="submit" disabled={creating}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold py-3 rounded-lg tracking-widest uppercase transition">
                        {creating ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Creating…</span> : "Create Admin"}
                    </button>
                </form>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                </div>
            ) : (
                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 text-xs uppercase tracking-wide border-b border-white/5">
                                <th className="text-left font-medium px-6 py-4">Name</th>
                                <th className="text-left font-medium px-6 py-4">Email</th>
                                <th className="text-left font-medium px-6 py-4">Role</th>
                                <th className="text-left font-medium px-6 py-4">Functions</th>
                                <th className="text-left font-medium px-6 py-4">Status</th>
                                <th className="text-right font-medium px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.length === 0 && (
                                <tr><td colSpan={6} className="text-center text-gray-500 px-6 py-8">No admins found</td></tr>
                            )}
                            {admins.map((admin) => (
                                <tr key={admin._id} className="border-b border-white/5 last:border-0">
                                    <td className="px-6 py-4 text-white">{admin.name || admin.username || "—"}</td>
                                    <td className="px-6 py-4 text-gray-400">{admin.email}</td>
                                    <td className="px-6 py-4 text-gray-400">{ROLE_LABELS[admin.role]}</td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {admin.role === "super_admin" ? (
                                            <span className="text-xs text-gray-500">All functions</span>
                                        ) : (admin.permissions ?? []).length === 0 ? (
                                            <span className="text-xs text-rose-300">No functions assigned</span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1 max-w-[260px]">
                                                {(admin.permissions ?? []).map((p) => (
                                                    <span key={p} className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] text-gray-300">
                                                        {PERMISSION_LABELS[p as keyof typeof PERMISSION_LABELS] ?? p}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${admin.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                                            {admin.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                            {admin.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {admin.role !== "super_admin" && (
                                                <button
                                                    onClick={() => openPermissions(admin)}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition"
                                                    title="Manage functions"
                                                >
                                                    <KeyRound className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleToggle(admin)}
                                                disabled={togglingId === admin._id}
                                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition disabled:opacity-50"
                                            >
                                                {admin.isActive ? "Deactivate" : "Activate"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editingPermissions && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setEditingPermissions(null)}>
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-white text-lg font-semibold mb-1">Manage Functions</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            {editingPermissions.name || editingPermissions.username} · choose what this admin can do
                        </p>
                        <PermissionPicker selected={permForm} onToggle={togglePerm} />
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleSavePermissions}
                                disabled={savingPerms}
                                className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold py-3 rounded-lg tracking-widest uppercase transition"
                            >
                                {savingPerms ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving…</span> : "Save"}
                            </button>
                            <button
                                onClick={() => setEditingPermissions(null)}
                                className="px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold py-3 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PermissionPicker({ selected, onToggle }: { selected: string[]; onToggle: (perm: string) => void }) {
    return (
        <div>
            <p className="text-gray-400 text-xs font-medium mb-2 tracking-wide uppercase">Allowed Functions</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ALL_PERMISSIONS.map((perm) => {
                    const checked = selected.includes(perm);
                    return (
                        <label
                            key={perm}
                            className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition ${checked ? "border-yellow-400 bg-yellow-400/5 text-white" : "border-white/10 bg-white/5 text-gray-300 hover:border-white/30"}`}
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => onToggle(perm)}
                                className="w-4 h-4 rounded bg-[#111] border-white/20 text-yellow-400 focus:ring-yellow-400"
                            />
                            {PERMISSION_LABELS[perm as keyof typeof PERMISSION_LABELS]}
                        </label>
                    );
                })}
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

export default function SuperAdminDashboardPage() {
    return <SuperAdminContent />;
}
