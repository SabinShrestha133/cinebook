import axios from "axios";
import protectedAxios from "./axios-instance";
import { API } from "./endpoints";

export interface SeatSelection {
    seatId: string;
    label?: string;
    price: number;
}

export interface BookingPayload {
    showtimeId: string;
    movieId: string;
    cinemaId: string;
    hallId: string;
    seats: SeatSelection[];
}

export interface Booking {
    _id: string;
    showtimeId: string;
    movieId: string;
    cinemaId: string;
    hallId: string;
    seats: SeatSelection[];
    seatCount: number;
    totalAmount: number;
    bookingStatus: string;
    paymentStatus: string;
    bookingCode: string;
}

export const createBooking = async (payload: BookingPayload): Promise<Booking> => {
    try {
        const response = await protectedAxios.post(API.BOOKING.CREATE, payload);
        return response.data?.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Booking request failed");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Booking request failed");
        }
        throw new Error("Booking request failed");
    }
};
