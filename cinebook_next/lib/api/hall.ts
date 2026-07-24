import axios from "axios";
import protectedAxios from "./axios-instance";
import { API } from "./endpoints";

export interface Hall {
    _id: string;
    name: string;
    cinemaId: string;
    totalRows: number;
    seatsPerRow: number;
    aisles: number[];
    createdAt?: string;
    updatedAt?: string;
}

export interface HallRow {
    _id: string;
    hallId: string;
    rowLabel: string;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Seat {
    _id: string;
    hallId: string;
    rowId: string;
    rowLabel: string;
    seatNumber: number;
    seatLabel: string;
    seatType: "regular" | "premium" | "vip";
    status: "active" | "disabled" | "hidden" | "missing";
    positionIndex: number;
    createdAt?: string;
    updatedAt?: string;
}

export const createHall = async (payload: Partial<Hall>): Promise<Hall> => {
    try {
        const response = await protectedAxios.post(API.HALL.CREATE, payload);
        return response.data?.data ?? ({} as Hall);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create hall");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to create hall");
        }
        throw new Error("Failed to create hall");
    }
};

export const getHall = async (id: string): Promise<Hall | null> => {
    try {
        const response = await protectedAxios.get(API.HALL.DETAIL(id));
        return response.data?.data ?? null;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to load hall");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to load hall");
        }
        throw new Error("Failed to load hall");
    }
};

export const listHalls = async (params?: { page?: number; limit?: number; search?: string }): Promise<{ data: Hall[]; total: number; page: number; limit: number }> => {
    try {
        const response = await protectedAxios.get(API.HALL.LIST, { params });
        return {
            data: response.data?.data ?? [],
            total: response.data?.pagination?.total ?? 0,
            page: response.data?.pagination?.page ?? 1,
            limit: response.data?.pagination?.limit ?? 10,
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to load halls");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to load halls");
        }
        throw new Error("Failed to load halls");
    }
};

export const updateHall = async (id: string, payload: Partial<Hall>): Promise<Hall> => {
    try {
        const response = await protectedAxios.put(API.HALL.UPDATE(id), payload);
        return response.data?.data ?? ({} as Hall);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update hall");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to update hall");
        }
        throw new Error("Failed to update hall");
    }
};

export const deleteHall = async (id: string): Promise<void> => {
    try {
        await protectedAxios.delete(API.HALL.DELETE(id));
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete hall");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to delete hall");
        }
        throw new Error("Failed to delete hall");
    }
};

export const generateHallLayout = async (hallId: string): Promise<Hall> => {
    try {
        const response = await protectedAxios.post(API.HALL.GENERATE(hallId));
        return response.data?.data ?? ({} as Hall);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to generate hall layout");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to generate hall layout");
        }
        throw new Error("Failed to generate hall layout");
    }
};

export const getSeatsByHall = async (hallId: string): Promise<Seat[]> => {
    try {
        const response = await protectedAxios.get(API.HALL.SEATS(hallId));
        return response.data?.data ?? [];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to load seats");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to load seats");
        }
        throw new Error("Failed to load seats");
    }
};
