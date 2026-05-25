"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import logo from "@/app/assets/LogoCB.png";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ title: string; desc: string; type: string } | null>(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (title: string, desc: string, type = "default") => {
    setToast({ title, desc, type });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Missing fields", "Please fill in all fields.", "destructive");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
      }
      showToast("Welcome back!", "Login successful.", "default");
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid email or password.";
      showToast("Login failed", msg, "destructive");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative">
      {/* Subtle film grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
            toast.type === "destructive" ? "bg-red-600 text-white" : "bg-yellow-400 text-black"
          }`}
        >
          <p className="font-semibold text-sm">{toast.title}</p>
          <p className="text-xs opacity-80 mt-0.5">{toast.desc}</p>
        </div>
      )}

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm bg-[#1a1a1a] rounded-2xl shadow-2xl px-8 py-10 border border-white/5">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-3">
            <Image src={logo} alt="CineBook Logo" width={52} height={52} />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-[0.15em] uppercase">
            Cine<span className="text-[#e63329]">Book</span>
          </h1>
          <p className="text-gray-500 text-[10px] tracking-[0.25em] uppercase mt-1">Movie Ticket Booking System</p>
          <div className="w-8 h-px bg-[#e63329] mt-3" />
        </div>

        {/* Heading */}
        <div className="text-center mb-7">
          <h2 className="text-white text-lg font-semibold">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">Please enter your details to sign in</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Email */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide uppercase">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                  rememberMe ? "bg-yellow-400 border-yellow-400" : "border-white/20 bg-transparent"
                }`}
              >
                {rememberMe && (
                  <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 10 10">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-gray-400 text-xs">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-yellow-400 text-xs hover:text-yellow-300 transition hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold py-3 rounded-lg tracking-widest uppercase transition shadow-lg shadow-yellow-400/10 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-gray-600 text-xs">or</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Register link */}
        <p className="text-center text-gray-500 text-sm">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/frontend/register")}
            className="text-yellow-400 font-semibold hover:text-yellow-300 hover:underline transition"
          >
            Sign up now
          </button>
        </p>
      </div>
    </div>
  );
}