import axios from "axios";
import protectedAxios from "./axios-instance";
import publicAxios from "./public-axios";
import { API } from "./endpoints";

export interface Cinema {
    _id: string;
    name: string;
    address?: string;
    city?: string;
    description?: string;
    contactPhone?: string;
    contactEmail?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const fetchCinemas = async (): Promise<Cinema[]> => {
    try {
        const response = await publicAxios.get(API.CINEMA.LIST);
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

export interface CreateCinemaPayload {
    name: string;
    address?: string;
    city?: string;
    description?: string;
    contactEmail?: string;
    contactPhone?: string;
    isActive?: boolean;
}

export const createCinema = async (payload: CreateCinemaPayload): Promise<Cinema> => {
    try {
        const response = await protectedAxios.post(API.CINEMA.CREATE, payload);
        return response.data?.data ?? ({} as Cinema);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create cinema");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to create cinema");
        }
        throw new Error("Failed to create cinema");
    }
};

export const updateCinema = async (id: string, data: Partial<Cinema>): Promise<Cinema> => {
    try {
        const response = await protectedAxios.put(API.CINEMA.UPDATE(id), data);
        return response.data?.data ?? ({} as Cinema);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update cinema");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to update cinema");
        }
        throw new Error("Failed to update cinema");
    }
};
