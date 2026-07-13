import axios from "axios";
import protectedAxios from "./axios-instance";
import { API } from "./endpoints";

export interface Cinema {
    _id: string;
    name: string;
    city?: string;
    address?: string;
    contactPhone?: string;
    contactEmail?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const fetchCinemas = async (): Promise<Cinema[]> => {
    try {
        const response = await protectedAxios.get(API.CINEMA.LIST);
        return response.data?.data ?? [];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to load cinemas");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to load cinemas");
        }
        throw new Error("Failed to load cinemas");
    }
};
