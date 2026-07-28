export const PERMISSIONS = {
    MOVIE_CREATE: "movie:create",
    MOVIE_UPDATE: "movie:update",
    SHOWTIME_CREATE: "showtime:create",
    SHOWTIME_UPDATE: "showtime:update",
    SHOWTIME_DELETE: "showtime:delete",
    CINEMA_MANAGE: "cinema:manage",
    HALL_MANAGE: "hall:manage",
    BOOKING_VIEW: "booking:view",
    USER_MANAGE: "user:manage",
    DISCOUNT_MANAGE: "discount:manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_LABELS: Record<Permission, string> = {
    [PERMISSIONS.MOVIE_CREATE]: "Add Movies",
    [PERMISSIONS.MOVIE_UPDATE]: "Edit Movies",
    [PERMISSIONS.SHOWTIME_CREATE]: "Add Showtimes",
    [PERMISSIONS.SHOWTIME_UPDATE]: "Edit Showtimes",
    [PERMISSIONS.SHOWTIME_DELETE]: "Delete Showtimes",
    [PERMISSIONS.CINEMA_MANAGE]: "Manage Cinemas",
    [PERMISSIONS.HALL_MANAGE]: "Manage Halls",
    [PERMISSIONS.BOOKING_VIEW]: "View Bookings",
    [PERMISSIONS.USER_MANAGE]: "Manage Users",
    [PERMISSIONS.DISCOUNT_MANAGE]: "Manage Discounts",
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
