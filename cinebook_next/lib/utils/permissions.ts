export const PERMISSIONS = {
    MOVIE_CREATE: "movie:create",
    MOVIE_UPDATE: "movie:update",
    SHOWTIME_CREATE: "showtime:create",
    CINEMA_MANAGE: "cinema:manage",
    HALL_MANAGE: "hall:manage",
    BOOKING_VIEW: "booking:view",
    USER_MANAGE: "user:manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_LABELS: Record<Permission, string> = {
    [PERMISSIONS.MOVIE_CREATE]: "Add Movies",
    [PERMISSIONS.MOVIE_UPDATE]: "Edit Movies",
    [PERMISSIONS.SHOWTIME_CREATE]: "Add Showtimes",
    [PERMISSIONS.CINEMA_MANAGE]: "Manage Cinemas",
    [PERMISSIONS.HALL_MANAGE]: "Manage Halls",
    [PERMISSIONS.BOOKING_VIEW]: "View Bookings",
    [PERMISSIONS.USER_MANAGE]: "Manage Users",
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

/** Super admins bypass permission checks; regular admins must hold the permission. */
export const can = (
    role: string | undefined,
    permissions: string[] | undefined,
    permission: Permission
): boolean => {
    if (role === "super_admin") return true;
    return (permissions ?? []).includes(permission);
};
