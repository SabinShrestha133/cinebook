"use client";

import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "@/app/frontend/_components/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import logo from "@/app/assets/LogoCB.png";

export default function LoginPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = useCallback(async (data: LoginFormData) => {
        setError("");
        startTransition(async () => {
            try {
                await login(data.email, data.password);
                const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
                const role = stored ? JSON.parse(stored)?.role : undefined;
                const destination =
                    role === "super_admin"
                        ? "/super-admin/dashboard"
                        : role === "admin"
                        ? "/admin/dashboard"
                        : role === "user"
                        ? "/user/dashboard"
                        : "/user/dashboard";
                router.push(destination);
            } catch (error: unknown) {
                let message = "Login failed";
                if (error instanceof Error) {
                    message = error.message;
                }
                setError(message);
            }
        });
    }, [router, startTransition, login]);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6 relative">
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "128px 128px",
                }}
            />

            <div className="relative z-10 w-full max-w-sm bg-[var(--card-bg)] rounded-2xl shadow-2xl px-8 py-10 border border-[var(--card-border)]">
                <div className="flex flex-col items-center mb-8">
                    <div className="mb-3">
                        <Image src={logo} alt="CineBook Logo" width={52} height={52} className="w-auto h-auto" />
                    </div>
                    <h1 className="text-[var(--text-primary)] text-2xl font-bold tracking-[0.15em] uppercase">
                        Cine<span className="text-[#e63329]">Book</span>
                    </h1>
                    <p className="text-[var(--text-tertiary)] text-[10px] tracking-[0.25em] uppercase mt-1">Movie Ticket Booking System</p>
                    <div className="w-8 h-px bg-[#e63329] mt-3" />
                </div>

                <div className="text-center mb-7">
                    <h2 className="text-[var(--text-primary)] text-lg font-semibold">Welcome Back</h2>
                    <p className="text-[var(--text-tertiary)] text-sm mt-1">Please enter your details to sign in</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-[var(--error)]/10 border border-[var(--error)]/50 rounded text-[var(--error)] text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-[var(--text-secondary)] text-xs font-medium mb-1.5 tracking-wide uppercase">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                                <Mail className="w-4 h-4" />
                            </span>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                {...register("email")}
                                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
                            />
                        </div>
                        {errors.email && <span className="text-[var(--error)] text-xs mt-1 block">{errors.email.message}</span>}
                    </div>

                    <div>
                        <label className="block text-[var(--text-secondary)] text-xs font-medium mb-1.5 tracking-wide uppercase">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                                <Lock className="w-4 h-4" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password")}
                                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg pl-10 pr-10 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <span className="text-[var(--error)] text-xs mt-1 block">{errors.password.message}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || isPending}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold py-3 rounded-lg tracking-widest uppercase transition shadow-lg shadow-yellow-400/10 mt-6"
                    >
                        {isPending || isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Signing in…
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-[var(--border-color)]" />
                    <span className="text-[var(--text-tertiary)] text-xs">or</span>
                    <div className="flex-1 h-px bg-[var(--border-color)]" />
                </div>

                <p className="text-center text-[var(--text-tertiary)] text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-yellow-400 hover:text-yellow-300 font-semibold transition">
                        Create one
                    </Link>
                </p>
                <p className="text-center text-[var(--text-tertiary)] text-sm mt-2">
                    <Link href="/forget-password" className="text-yellow-400 hover:text-yellow-300 font-semibold transition">
                        Forgot password?
                    </Link>
                </p>
            </div>
        </div>
    );
}
