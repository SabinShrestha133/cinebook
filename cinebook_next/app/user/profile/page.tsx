"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleWhoami } from "@/lib/actions/auth-action";
import { Loader2, Pencil } from "lucide-react";
import Image from "next/image";

interface UserData {
    name?: string;
    username?: string;
    email?: string;
    phoneNumber?: string;
    profilePicture?: string;
    role?: string;
}

function getInitials(name?: string, email?: string) {
    const source = name || email || "";
    return source
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await handleWhoami();
                if (result.success && result.data) {
                    const rawData = result.data as Record<string, unknown>;
                    const userData = (rawData.data ?? rawData) as UserData;
                    setUser(userData);
                } else {
                    setError(result.message || "Failed to load profile");
                }
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="rounded-3xl border border-rose-500/20 bg-[#111] p-10 text-center text-rose-300">
                {error || "Unable to load profile"}
            </div>
        );
    }

    const displayName = user.name || user.username || user.email || "User";
    const phone = user.phoneNumber ?? "—";

    const fields = [
        { label: "Name", value: user.name || "—" },
        { label: "Username", value: user.username || "—" },
        { label: "Email", value: user.email || "—" },
        { label: "Phone", value: phone },
        { label: "Role", value: user.role || "—" },
    ];

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-white text-2xl font-bold tracking-wide">Profile</h1>
                    <p className="text-gray-500 text-sm mt-1">Your personal information</p>
                </div>
                <button
                    onClick={() => router.push("/user/profile/edit")}
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold py-2.5 px-5 rounded-lg tracking-wide transition"
                >
                    <Pencil className="w-4 h-4" />
                    Edit Profile
                </button>
            </div>

            <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6 sm:p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-24 h-24 rounded-full bg-[#222] border-2 border-white/10 overflow-hidden flex items-center justify-center">
                        {user.profilePicture ? (
                            <Image
                                src={user.profilePicture}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span className="text-gray-400 text-2xl font-semibold">
                                {getInitials(displayName, user.email)}
                            </span>
                        )}
                    </div>
                    <p className="text-white text-lg font-medium mt-4">{displayName}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                </div>

                <div className="space-y-5">
                    {fields.map((field) => (
                        <div key={field.label}>
                            <p className="block text-gray-500 text-xs font-medium mb-1.5 tracking-wide uppercase">
                                {field.label}
                            </p>
                            <p className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white">
                                {field.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
