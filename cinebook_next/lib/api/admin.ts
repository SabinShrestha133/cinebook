import axios from "axios";
import protectedAxios from "./axios-instance";
import { API } from "./endpoints";

export interface DashboardSummary {
    totalBookings: number;
    totalMovies: number;
    totalCinemas: number;
    revenue: number;
}

export interface AdminUser {
    _id: string;
    name?: string;
    email: string;
    username?: string;
    phoneNumber?: string;
    role: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt?: string;
}

export interface UserMovieStat {
    movieId: string;
    title: string;
    slug: string;
    genres: string[];
    timesWatched: number;
    totalSpent: number;
    lastWatched: string;
}

export interface UserBooking {
    _id: string;
    movieTitle: string;
    movieSlug: string;
    cinemaName: string;
    totalAmount: number;
    seatCount: number;
    seats: Array<{ seatId: string; label?: string; price: number }>;
    bookingStatus: string;
    paymentStatus: string;
    bookingCode: string;
    createdAt: string;
    showtimeStartTime?: string;
}

export interface UserDetails {
    user: {
        _id: string;
        name: string;
        email: string;
        username: string;
        phoneNumber: string;
        role: string;
        isActive: boolean;
        isVerified: boolean;
        profilePicture?: string;
        createdAt?: string;
    };
    stats: {
        totalMoviesWatched: number;
        totalTickets: number;
        totalSpent: number;
    };
    movieStats: UserMovieStat[];
    bookings: UserBooking[];
}

export interface AdminBooking {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    movieTitle: string;
    movieSlug: string;
    cinemaName: string;
    showtime: {
        showDate?: string;
        startTime: string;
        endTime: string;
    };
    seats: Array<{ seatId: string; label?: string; price: number }>;
    seatCount: number;
    totalAmount: number;
    bookingStatus: string;
    paymentStatus: string;
    bookingCode: string;
    createdAt: string;
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
    try {
        const response = await protectedAxios.get(API.ADMIN.DASHBOARD);
        return response.data?.data ?? {
            totalBookings: 0,
            totalMovies: 0,
            totalCinemas: 0,
            revenue: 0,
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to load dashboard");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to load dashboard");
        }
        throw new Error("Failed to load dashboard");
    }
};

export const listUsers = async (): Promise<AdminUser[]> => {
    try {
        const response = await protectedAxios.get(API.ADMIN.USERS);
        return response.data?.data ?? [];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to load users");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to load users");
        }
        throw new Error("Failed to load users");
    }
};

export const getUserDetails = async (id: string): Promise<UserDetails> => {
    try {
        const response = await protectedAxios.get(API.ADMIN.USER_DETAIL(id));
        return response.data?.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to load user details");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to load user details");
        }
        throw new Error("Failed to load user details");
    }
};

export const updateUser = async (id: string, data: Partial<AdminUser>) => {
    try {
        const response = await protectedAxios.put(API.ADMIN.USER_DETAIL(id), data);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update user");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to update user");
        }
        throw new Error("Failed to update user");
    }
};

export const deleteUser = async (id: string) => {
    try {
        const response = await protectedAxios.delete(API.ADMIN.USER_DETAIL(id));
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete user");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to delete user");
        }
        throw new Error("Failed to delete user");
    }
};

export const listAllBookings = async (params?: { cinemaId?: string; movieId?: string; userId?: string }): Promise<AdminBooking[]> => {
    try {
        const response = await protectedAxios.get(API.ADMIN.BOOKINGS, { params });
        return response.data?.data ?? [];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to load bookings");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to load bookings");
        }
        throw new Error("Failed to load bookings");
    }
};

export const createMovie = async (formData: FormData) => {
    try {
        const response = await protectedAxios.post(API.MOVIE.CREATE, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create movie");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to create movie");
        }
        throw new Error("Failed to create movie");
    }
};

export const createShowtime = async (data: Record<string, unknown>) => {
    try {
        const response = await protectedAxios.post(API.SHOWTIME.CREATE, data);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create showtime");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to create showtime");
        }
        throw new Error("Failed to create showtime");
    }
};
