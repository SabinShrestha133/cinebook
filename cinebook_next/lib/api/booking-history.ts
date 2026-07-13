import axios from "axios";
import protectedAxios from "./axios-instance";
import { API } from "./endpoints";

export interface BookingHistoryItem {
    _id: string;
    showtimeId: string;
    movieId: string;
    cinemaId: string;
    hallId: string;
    seats: { seatId: string; label?: string; price: number }[];
    seatCount: number;
    totalAmount: number;
    bookingStatus: string;
    paymentStatus: string;
    bookingCode: string;
    createdAt: string;
}

export const fetchMyBookings = async (): Promise<BookingHistoryItem[]> => {
    try {
        const response = await protectedAxios.get(API.BOOKING.MY_BOOKINGS);
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
