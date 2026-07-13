import axios from "axios";
import protectedAxios from "./axios-instance";
import { API } from "./endpoints";
import { Seat } from "./hall";

export type { Seat } from "./hall";

export const updateSeatType = async (seatId: string, seatType: Seat["seatType"]): Promise<Seat> => {
    try {
        const response = await protectedAxios.patch(API.SEAT.UPDATE_TYPE(seatId), { seatId, seatType });
        return response.data?.data ?? ({} as Seat);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update seat type");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to update seat type");
        }
        throw new Error("Failed to update seat type");
    }
};

export const updateSeatStatus = async (seatId: string, status: Seat["status"]): Promise<Seat> => {
    try {
        const response = await protectedAxios.patch(API.SEAT.UPDATE_STATUS(seatId), { seatId, status });
        return response.data?.data ?? ({} as Seat);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update seat status");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to update seat status");
        }
        throw new Error("Failed to update seat status");
    }
};

export const bulkUpdateSeats = async (hallId: string, updates: Array<{ seatId: string; seatType?: string; status?: string }>): Promise<{ updatedCount: number }> => {
    try {
        const response = await protectedAxios.post(API.SEAT.BULK_UPDATE, { hallId, updates });
        return response.data?.data ?? { updatedCount: 0 };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update seats");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to update seats");
        }
        throw new Error("Failed to update seats");
    }
};
