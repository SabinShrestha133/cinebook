import { UserRole } from "@/lib/api/auth";

export const isAdmin = (role?: string): boolean =>
    role === "admin" || role === "super_admin";

export const isSuperAdmin = (role?: string): boolean =>
    role === "super_admin";

export const ROLE_LABELS: Record<UserRole, string> = {
    user: "User",
    admin: "Admin",
    super_admin: "Super Admin",
};
