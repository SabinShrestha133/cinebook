import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/forget-password", "/reset-password"];
const PUBLIC_BROWSE_PATHS = ["/movies"];
const ROLE_HOME: Record<string, string> = {
    user: "/user/dashboard",
    admin: "/admin/dashboard",
    super_admin: "/super-admin/dashboard",
};

function getTokenFromRequest(request: NextRequest): string | null {
    const cookie = request.cookies.get("token")?.value || null;
    if (cookie) return cookie;
    const authHeader = request.headers.get("authorization") || null;
    if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
    return null;
}

function decodeRoleFromToken(token: string): string | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;
        const decoded = JSON.parse(Buffer.from(payload, "base64").toString());
        return decoded?.role || null;
    } catch {
        return null;
    }
}

function getRoleFromRequest(request: NextRequest): string | null {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    return decodeRoleFromToken(token);
}

function isAuthorized(pathname: string, role: string): boolean {
    if (pathname.startsWith("/super-admin")) return role === "super_admin";
    if (pathname.startsWith("/admin")) return role === "admin" || role === "super_admin";
    if (pathname.startsWith("/user")) return role === "user";
    if (pathname === "/movies" || pathname.startsWith("/movies/")) return true;
    if (pathname === "/booking/verify") return true;
    return false;
}

function roleHome(role: string): string {
    return ROLE_HOME[role] || "/login";
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const role = getRoleFromRequest(request);
    const isPublicAuthPath = PUBLIC_PATHS.includes(pathname);
    const isBrowsePath = PUBLIC_BROWSE_PATHS.includes(pathname) || pathname.startsWith("/movies/");

    if (!role) {
        if (isPublicAuthPath || isBrowsePath) return NextResponse.next();
        if (pathname.startsWith("/login") || pathname.startsWith("/register")) return NextResponse.next();
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isPublicAuthPath) {
        return NextResponse.redirect(new URL(roleHome(role), request.url));
    }

    if (!isAuthorized(pathname, role)) {
        return NextResponse.redirect(new URL(roleHome(role), request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|api|uploads|.*\\..*).*)"],
};
