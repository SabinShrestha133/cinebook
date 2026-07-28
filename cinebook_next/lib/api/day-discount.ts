import axios from "axios";
import protectedAxios from "./axios-instance";
import { API } from "./endpoints";

export interface DayDiscount {
    _id: string;
    dayOfWeek: number;
    discountType: "percentage" | "fixed";
    discountValue: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const fetchDayDiscounts = async (): Promise<DayDiscount[]> => {
    try {
        const response = await protectedAxios.get(API.DAY_DISCOUNT.LIST);
        return response.data?.data ?? [];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to load day discounts");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to load day discounts");
        }
        throw new Error("Failed to load day discounts");
    }
};

export const fetchDayDiscountById = async (id: string): Promise<DayDiscount | null> => {
    try {
        const response = await protectedAxios.get(API.DAY_DISCOUNT.DETAIL(id));
        return response.data?.data ?? null;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to load day discount");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to load day discount");
        }
        throw new Error("Failed to load day discount");
    }
};

export const createDayDiscount = async (data: Partial<DayDiscount>): Promise<DayDiscount> => {
    try {
        const response = await protectedAxios.post(API.DAY_DISCOUNT.CREATE, data);
        return response.data?.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create day discount");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to create day discount");
        }
        throw new Error("Failed to create day discount");
    }
};

export const updateDayDiscount = async (id: string, data: Partial<DayDiscount>): Promise<DayDiscount> => {
    try {
        const response = await protectedAxios.put(API.DAY_DISCOUNT.UPDATE(id), data);
        return response.data?.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update day discount");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to update day discount");
        }
        throw new Error("Failed to update day discount");
    }
};

export const deleteDayDiscount = async (id: string): Promise<void> => {
    try {
        await protectedAxios.delete(API.DAY_DISCOUNT.DELETE(id));
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete day discount");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to delete day discount");
        }
        throw new Error("Failed to delete day discount");
    }
};
