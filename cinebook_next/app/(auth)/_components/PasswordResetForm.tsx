"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleResetPassword } from "@/lib/actions/auth-action";
import { toast } from "react-toastify";
import z from "zod";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import logo from "@/app/assets/LogoCB.png";

export const ResetPasswordSchema = z
    .object({
        password: z.string().min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm({
    token,
}: {
    token?: string | string[] | undefined;
}) {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const resolvedToken = typeof token === "string" ? token : searchParams.get("token") || "";
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordDTO>({
        resolver: zodResolver(ResetPasswordSchema),
    });

    const onSubmit = useCallback(
        (data: ResetPasswordDTO) => {
            if (!resolvedToken) {
                toast.error("Missing or invalid reset token");
                return;
            }
            startTransition(async () => {
                try {
                    const response = await handleResetPassword(resolvedToken, data.password);
                    if (response.success) {
                        setSuccess(true);
                        toast.success("Password has been reset");
                        setTimeout(() => router.replace("/login"), 2000);
                    } else {
                        toast.error(response.message || "Failed to reset password");
                    }
                } catch {
                    toast.error("An unexpected error occurred");
                }
            });
        },
        [resolvedToken, startTransition, router]
    );

    if (success) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 relative">
                <div
                    className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "repeat",
                        backgroundSize: "128px 128px",
                        }}
                />
                <div className="relative z-10 w-full max-w-sm bg-[#1a1a1a] rounded-2xl shadow-2xl px-8 py-10 border border-white/5 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-green-400" />
                        </div>
                    </div>
                    <h2 className="text-white text-xl font-bold mb-2">Password Updated</h2>
                    <p className="text-gray-400 text-sm mb-6">
                        Redirecting you to sign in…
                    </p>
                    <button
                        type="button"
                        onClick={() => router.replace("/login")}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold py-3 rounded-lg tracking-widest uppercase transition shadow-lg shadow-yellow-400/10"
                    >
                        Continue to Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative">
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "128px 128px",
                }}
            />

            <div className="relative z-10 w-full max-w-sm bg-[#1a1a1a] rounded-2xl shadow-2xl px-8 py-10 border border-white/5">
                <div className="flex flex-col items-center mb-8">
                    <div className="mb-3">
                        <Image src={logo} alt="CineBook Logo" width={52} height={52} className="w-auto h-auto" />
                    </div>
                    <h1 className="text-white text-2xl font-bold tracking-[0.15em] uppercase">
                        Cine<span className="text-[#e63329]">Book</span>
                    </h1>
                    <p className="text-gray-500 text-[10px] tracking-[0.25em] uppercase mt-1">Movie Ticket Booking System</p>
                    <div className="w-8 h-px bg-[#e63329] mt-3" />
                </div>

                <div className="text-center mb-7">
                    <h2 className="text-white text-lg font-semibold">Reset Password</h2>
                    <p className="text-gray-500 text-sm mt-1">Enter your new password below</p>
                </div>

                {!resolvedToken && (
                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/50 rounded text-yellow-300 text-sm">
                        No reset token provided. Please use the link from your email.
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">
                            New Password
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                                <Lock className="w-4 h-4" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password")}
                                className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-10 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                        )}
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
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("confirmPassword")}
                                className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-10 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || isPending || !resolvedToken}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold py-3 rounded-lg tracking-widest uppercase transition shadow-lg shadow-yellow-400/10 mt-6"
                    >
                        {isSubmitting || isPending ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating…
                            </span>
                        ) : (
                            "Update Password"
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="text-yellow-400 hover:text-yellow-300 font-semibold transition"
                    >
                        Back to sign in
                    </button>
                </p>
            </div>
        </div>
    );
}
