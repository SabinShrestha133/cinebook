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
    pidx?: string;
    paymentUrl?: string;
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

export const initiatePayment = async (bookingId: string, customerInfo: { name: string; email: string; phone: string }) => {
    try {
        const response = await protectedAxios.post(API.BOOKING.INITIATE_PAYMENT(bookingId), { customerInfo });
        return response.data?.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Payment initiation failed");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Payment initiation failed");
        }
        throw new Error("Payment initiation failed");
    }
};

export const verifyPayment = async (bookingId: string, pidx: string) => {
    try {
        const response = await protectedAxios.post(API.BOOKING.VERIFY_PAYMENT, { bookingId, pidx });
        return response.data?.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Payment verification failed");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Payment verification failed");
        }
        throw new Error("Payment verification failed");
    }
};

export const cancelBooking = async (bookingId: string) => {
    try {
        const response = await protectedAxios.patch(API.BOOKING.CANCEL(bookingId));
        return response.data?.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Booking cancellation failed");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Booking cancellation failed");
        }
        throw new Error("Booking cancellation failed");
    }
};
