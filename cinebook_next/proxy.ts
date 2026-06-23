import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/frontend/login", "/frontend/register"];
const PROTECTED_PREFIX = "/dashboard";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value || null;

    const isPublic = PUBLIC_PATHS.includes(pathname) || pathname === "/";
    const isProtected = pathname.startsWith(PROTECTED_PREFIX);

    if (isProtected && !token) {
        const loginUrl = new URL("/frontend/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (isPublic && token) {
        const dashboardUrl = new URL("/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|woff2?|ttf|map|json)).*)"],
};
