"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { handleRequestPasswordReset } from "@/lib/actions/auth-action";
import { toast } from "react-toastify";
import z from "zod";
import { Mail, Loader2 } from "lucide-react";
import Image from "next/image";
import logo from "@/app/assets/LogoCB.png";

export const RequestPasswordResetSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export type RequestPasswordResetDTO = z.infer<typeof RequestPasswordResetSchema>;

export default function ForgetForm() {
    const [isPending, startTransition] = useTransition();
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RequestPasswordResetDTO>({
        resolver: zodResolver(RequestPasswordResetSchema),
    });

    const onSubmit = useCallback(
        (data: RequestPasswordResetDTO) => {
            startTransition(async () => {
                try {
                    const response = await handleRequestPasswordReset(data.email);
                    if (response.success) {
                        setSubmitted(true);
                        toast.success("If an account exists, a reset link has been sent.");
                    } else {
                        toast.error(response.message || "Something went wrong");
                    }
                } catch (error) {
                    toast.error((error as Error).message || "Something went wrong");
                }
            });
        },
        [startTransition]
    );

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
                    <h2 className="text-white text-lg font-semibold">Forgot Password?</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Enter your email and we’ll send you a reset link.
                    </p>
                </div>

                {submitted && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded text-green-300 text-sm">
                        If an account with that email exists, a reset link has been sent.
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                                <Mail className="w-4 h-4" />
                            </span>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                {...register("email")}
                                className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || isPending}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-black text-sm font-bold py-3 rounded-lg tracking-widest uppercase transition shadow-lg shadow-yellow-400/10 mt-6"
                    >
                        {isSubmitting || isPending ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending reset link…
                            </span>
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Remember your password?{" "}
                    <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="text-yellow-400 hover:text-yellow-300 font-semibold transition"
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
}
