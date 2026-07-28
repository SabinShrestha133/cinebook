import axios from "axios";
import publicAxios from "./public-axios";
import { API } from "./endpoints";

export interface ShowtimeSeat {
    seatId: string;
    label: string;
    row?: string;
    number?: number;
    type?: string;
    priceMultiplier?: number;
}

export interface ShowtimeHall {
    _id: string;
    name?: string;
    seatLayout?: ShowtimeSeat[];
}

export interface Showtime {
    _id: string;
    movieId: string;
    cinemaId: string;
    hallId: string | ShowtimeHall;
    showDate: string;
    startTime: string;
    endTime?: string;
    ticketPrice: number;
    discountType?: "none" | "percentage" | "fixed";
    discountValue?: number;
    effectivePrice?: number;
    bookedSeats?: string[];
    status?: "active" | "cancelled" | "completed";
}

export const fetchShowtimeById = async (id: string): Promise<Showtime | null> => {
    try {
        const response = await publicAxios.get(API.SHOWTIME.DETAIL(id));
        return response.data?.data ?? null;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to load showtime");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to load showtime");
        }
        throw new Error("Failed to load showtime");
    }
};

export const fetchShowtimesByMovie = async (movieId: string): Promise<Showtime[]> => {
    try {
        const response = await publicAxios.get(API.SHOWTIME.LIST, { params: { movieId } });
        return response.data?.data ?? [];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to load showtimes");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to load showtimes");
        }
        throw new Error("Failed to load showtimes");
    }
};
