"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Shield, Loader2 } from "lucide-react";
import Image from "next/image";
import logo from "@/app/assets/LogoCB.png";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    if (!name || !email || !password || !confirmPassword) {
      showToast("Missing fields", "Please fill in all fields.", "destructive");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Password mismatch", "Passwords do not match.", "destructive");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name, email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
      }
      showToast("Account created", "Welcome to CineBook.", "default");
      router.push("frontend/login");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      showToast("Registration failed", msg, "destructive");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${toast.type === "destructive" ? "bg-red-600 text-white" : "bg-yellow-400 text-black"}`}>
          <p className="font-semibold text-sm">{toast.title}</p>
          <p className="text-xs opacity-80 mt-0.5">{toast.desc}</p>
        </div>
      )}

      {/* Card */}
      <div className="w-full max-w-sm bg-[#1c1c1e] rounded-2xl shadow-2xl px-8 py-9 border border-white/8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-2">
            <Image src={logo} alt="CineBook Logo" width={52} height={52} />
          </div>
          <h1 className="text-white text-xl font-bold tracking-[0.15em] uppercase">
            Cine<span className="text-[#e63329]">Book</span>
          </h1>
          <p className="text-gray-600 text-[9px] tracking-[0.25em] uppercase mt-0.5">Movie Ticket Booking System</p>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-white text-2xl font-bold">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">Join the community and experience cinema like never before.</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 tracking-wide">Full Name</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 tracking-wide">Email Address</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 tracking-wide">Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 tracking-wide">Confirm Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                <Shield className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold py-3 rounded-lg tracking-wider uppercase transition shadow-lg shadow-yellow-400/10 mt-1"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating…
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/frontend/login")}
              className="text-yellow-400 font-semibold hover:text-yellow-300 hover:underline transition"
            >
              Login
            </button>
          </p>
          <p className="text-gray-700 text-xs">
            <button type="button" className="hover:text-gray-500 transition">Terms of Service</button>
            {" • "}
            <button type="button" className="hover:text-gray-500 transition">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
}