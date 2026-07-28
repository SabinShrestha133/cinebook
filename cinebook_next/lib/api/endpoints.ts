// centralized path definitions for API endpoints
export const API = {
    AUTH: {
        REGISTER: "/api/v1/auth/register",
        LOGIN: "/api/v1/auth/login",
        WHOAMI: "/api/v1/auth/whoami",
        UPDATE_PROFILE: "/api/v1/auth/update",
        REQUEST_PASSWORD_RESET: "/api/v1/auth/request-password-reset",
        RESET_PASSWORD: (token: string): string => `/api/v1/auth/reset-password/${token}`,
    },
    MOVIE: {
        BROWSE: "/api/v1/movies",
        DETAIL: (id: string) => `/api/v1/movies/${id}`,
        CREATE: "/api/v1/movies",
        UPDATE: (id: string) => `/api/v1/movies/${id}`,
    },
    SHOWTIME: {
        LIST: "/api/v1/showtimes",
        DETAIL: (id: string) => `/api/v1/showtimes/${id}`,
        CREATE: "/api/v1/showtimes",
    },
    ADMIN: {
        DASHBOARD: "/api/v1/admin/dashboard",
        USERS: "/api/v1/admin/users",
        USER_DETAIL: (id: string) => `/api/v1/admin/users/${id}`,
        BOOKINGS: "/api/v1/admin/bookings",
        SHOWTIMES: "/api/v1/admin/showtimes",
        SHOWTIME_DETAIL: (id: string) => `/api/v1/admin/showtimes/${id}`,
        HALLS: "/api/v1/admin/halls",
        HALL_DETAIL: (id: string) => `/api/v1/admin/halls/${id}`,
    },
    SUPER_ADMIN: {
        LIST_ADMINS: "/api/v1/super-admin/admins",
        CREATE_ADMIN: "/api/v1/super-admin/admins",
        SET_ACTIVE: (id: string) => `/api/v1/super-admin/admins/${id}/active`,
        UPDATE: (id: string) => `/api/v1/super-admin/admins/${id}`,
    },
    BOOKING: {
        CREATE: "/api/v1/bookings",
        MY_BOOKINGS: "/api/v1/bookings/me",
        DETAIL: (id: string) => `/api/v1/bookings/${id}`,
        INITIATE_PAYMENT: (id: string) => `/api/v1/bookings/${id}/initiate-payment`,
        VERIFY_PAYMENT: "/api/v1/bookings/verify-payment",
        CANCEL: (id: string) => `/api/v1/bookings/${id}/cancel`,
        QR: (id: string) => `/api/v1/bookings/${id}/qr`,
    },
    CINEMA: {
        LIST: "/api/v1/cinemas",
        CREATE: "/api/v1/cinemas",
        UPDATE: (id: string) => `/api/v1/cinemas/${id}`,
    },
    HALL: {
        LIST: "/api/v1/halls",
        DETAIL: (id: string) => `/api/v1/halls/${id}`,
        CREATE: "/api/v1/halls",
        UPDATE: (id: string) => `/api/v1/halls/${id}`,
        DELETE: (id: string) => `/api/v1/halls/${id}`,
        GENERATE: (id: string) => `/api/v1/halls/${id}/generate`,
        SEATS: (id: string) => `/api/v1/seats/hall/${id}`,
    },
    SEAT: {
        UPDATE_TYPE: (id: string) => `/api/v1/seats/${id}/type`,
        UPDATE_STATUS: (id: string) => `/api/v1/seats/${id}/status`,
        BULK_UPDATE: "/api/v1/seats/bulk-update",
        BY_HALL: (hallId: string) => `/api/v1/seats/hall/${hallId}`,
    },
    SEAT_RECOMMENDATION: {
        RECOMMEND: "/api/v1/seat-recommendations",
    },
    AI_RECOMMENDATION: {
        MOVIES: "/api/v1/ai/recommendations/movies",
    },
    DAY_DISCOUNT: {
        LIST: "/api/v1/day-discounts",
        DETAIL: (id: string) => `/api/v1/day-discounts/${id}`,
        CREATE: "/api/v1/day-discounts",
        UPDATE: (id: string) => `/api/v1/day-discounts/${id}`,
        DELETE: (id: string) => `/api/v1/day-discounts/${id}`,
    },
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/";
