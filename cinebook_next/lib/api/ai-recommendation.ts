import axios from "axios";
import protectedAxios from "./axios-instance";
import { API } from "./endpoints";

export interface AiMovieRecommendation {
    movieId: string;
    title: string;
    reason: string;
    matchScore: number;
}

export interface AiRecommendationResponse {
    success: boolean;
    recommendations?: AiMovieRecommendation[];
    message?: string;
    error?: boolean;
}

export const fetchAiMovieRecommendations = async (): Promise<AiRecommendationResponse> => {
    try {
        const response = await protectedAxios.get(API.AI_RECOMMENDATION.MOVIES);
        const data = response.data?.data ?? response.data;
        if (data && typeof data === "object" && "success" in data) {
            return data as AiRecommendationResponse;
        }
        return { success: false, message: "Unexpected response format" };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.response?.data?.error?.message || "Failed to load AI recommendations";
            return { success: false, message, error: true };
        }
        if (error instanceof Error) {
            return { success: false, message: error.message, error: true };
        }
        return { success: false, message: "Failed to load AI recommendations", error: true };
    }
};
