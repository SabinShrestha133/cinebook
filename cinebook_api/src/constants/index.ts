export const ROLES = {
    USER: "user",
    ADMIN: "admin",
    SUPER_ADMIN: "super_admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

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

export const MOVIE_STATUS = {
    NOW_SHOWING: "now_showing",
    UPCOMING: "upcoming",
    ARCHIVED: "archived",
} as const;

export type MovieStatus = (typeof MOVIE_STATUS)[keyof typeof MOVIE_STATUS];

export const BOOKING_STATUS = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
    REFUNDED: "refunded",
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const PAYMENT_STATUS = {
    PENDING: "pending",
    PAID: "paid",
    FAILED: "failed",
    REFUNDED: "refunded",
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const SHOWTIME_STATUS = {
    SCHEDULED: "scheduled",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
} as const;

export type ShowtimeStatus = (typeof SHOWTIME_STATUS)[keyof typeof SHOWTIME_STATUS];

export const SEAT_TYPES = {
    REGULAR: "regular",
    PREMIUM: "premium",
    VIP: "vip",
} as const;

export type SeatType = (typeof SEAT_TYPES)[keyof typeof SEAT_TYPES];

export const SEAT_STATUSES = {
    ACTIVE: "active",
    DISABLED: "disabled",
    HIDDEN: "hidden",
    MISSING: "missing",
} as const;

export type SeatStatus = (typeof SEAT_STATUSES)[keyof typeof SEAT_STATUSES];

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

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;
