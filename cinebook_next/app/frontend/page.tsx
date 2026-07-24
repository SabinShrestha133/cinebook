import Link from "next/link";

export default function FrontendLandingPage() {
    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-[#111] p-10 shadow-2xl shadow-black/40">
                <div className="flex flex-col items-center gap-4 text-center">
                    <h1 className="text-4xl font-bold tracking-[0.15em] uppercase">CineBook</h1>
                    <p className="max-w-2xl text-gray-400">Fast movie discovery, secure booking, and account management for every film fan.</p>
                    <div className="grid w-full gap-4 sm:grid-cols-3 mt-8">
                        <Link
                            href="/login"
                            className="rounded-3xl bg-yellow-400 px-5 py-4 text-black font-semibold text-sm uppercase tracking-[0.25em] text-center hover:bg-yellow-300 transition"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/register"
                            className="rounded-3xl border border-white/10 px-5 py-4 text-white font-semibold text-sm uppercase tracking-[0.25em] text-center hover:border-yellow-300 transition"
                        >
                            Register
                        </Link>
                        <Link
                            href="/movies"
                            className="rounded-3xl border border-white/10 px-5 py-4 text-white font-semibold text-sm uppercase tracking-[0.25em] text-center hover:border-yellow-300 transition"
                        >
                            Browse movies
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
