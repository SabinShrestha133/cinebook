"use client";

import { useForm } from "react-hook-form";
import { passwordSchema, type PasswordFormData } from "@/app/frontend/_components/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { handleUpdateUser } from "@/lib/actions/auth-action";
import { Lock, Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";

export default function PasswordPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmit = useCallback(async (data: PasswordFormData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("currentPassword", data.currentPassword);
            formData.append("password", data.newPassword);

            const result = await handleUpdateUser(formData);
            if (result.success) {
                toast.success("Password updated successfully");
                router.push("/dashboard");
            } else {
                toast.error(result.message || "Failed to update password");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || "Failed to update password");
            } else {
                toast.error("Failed to update password");
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [router]);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-white text-2xl font-bold tracking-wide">Change Password</h1>
                <p className="text-gray-500 text-sm mt-1">Update your password to keep your account secure</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6 sm:p-8">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">
                                Current Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input
                                    type="password"
                                    {...register("currentPassword")}
                                    className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
                                />
                            </div>
                            {errors.currentPassword && <span className="text-red-400 text-xs mt-1 block">{errors.currentPassword.message}</span>}
                        </div>

                        <div>
                            <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">
                                New Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input
                                    type="password"
                                    {...register("newPassword")}
                                    className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
                                />
                            </div>
                            {errors.newPassword && <span className="text-red-400 text-xs mt-1 block">{errors.newPassword.message}</span>}
                        </div>

                        <div>
                            <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input
                                    type="password"
                                    {...register("confirmPassword")}
                                    className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
                                />
                            </div>
                            {errors.confirmPassword && <span className="text-red-400 text-xs mt-1 block">{errors.confirmPassword.message}</span>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-gray-400 hover:text-white text-sm transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold py-3 px-8 rounded-lg tracking-widest uppercase transition shadow-lg shadow-yellow-400/10 flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating…
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Update Password
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
