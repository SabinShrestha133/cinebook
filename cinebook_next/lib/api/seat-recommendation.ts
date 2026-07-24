import axios from "axios";
import protectedAxios from "./axios-instance";
import { API } from "./endpoints";

export interface RecommendedSeat {
    seatId: string;
    label: string;
    rowLabel: string;
    seatNumber: number;
    seatType: string;
}

export interface SeatRecommendation {
    seats: RecommendedSeat[];
    reason: string;
    score: number;
}

export interface SeatRecommendationResponse {
    success: boolean;
    data?: SeatRecommendation[];
    message?: string;
    error?: boolean;
}

export const fetchSeatRecommendations = async (
    showtimeId: string,
    count: number = 2
): Promise<SeatRecommendationResponse> => {
    try {
        const response = await protectedAxios.get(API.SEAT_RECOMMENDATION.RECOMMEND, {
            params: { showtimeId, count },
        });
        const data = response.data?.data ?? response.data;
        if (data && typeof data === "object" && Array.isArray((data as any).data)) {
            return { success: true, data: (data as any).data };
        }
        if (Array.isArray(data)) {
            return { success: true, data };
        }
        return { success: false, message: "Unexpected response format" };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Failed to load seat recommendations";
            return { success: false, message, error: true };
        }
        if (error instanceof Error) {
            return { success: false, message: error.message, error: true };
        }
        return { success: false, message: "Failed to load seat recommendations", error: true };
    }
};
