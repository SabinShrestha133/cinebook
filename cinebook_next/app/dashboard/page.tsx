"use client";

import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { User, Camera, Lock, Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const displayName = user?.name || user?.username || user?.email || "User";

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-white text-3xl font-bold tracking-wide">Welcome back, {displayName}</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your profile and account settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/dashboard/profile"
                    className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition group"
                >
                    <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center mb-4 group-hover:bg-yellow-400/20 transition">
                        <User className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">Profile</h3>
                    <p className="text-gray-500 text-xs">View and edit your personal information</p>
                </Link>

                <Link
                    href="/dashboard/profile"
                    className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition group"
                >
                    <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center mb-4 group-hover:bg-yellow-400/20 transition">
                        <Camera className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">Update Profile</h3>
                    <p className="text-gray-500 text-xs">Change your avatar and profile details</p>
                </Link>

                <Link
                    href="/dashboard/password"
                    className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition group"
                >
                    <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center mb-4 group-hover:bg-yellow-400/20 transition">
                        <Lock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">Change Password</h3>
                    <p className="text-gray-500 text-xs">Update your password for better security</p>
                </Link>
            </div>
        </div>
    );
}
