import axios from "axios";
import protectedAxios from "./axios-instance";
import { API } from "./endpoints";

export interface AdminUser {
    _id: string;
    name?: string;
    email: string;
    username?: string;
    role: "admin" | "super_admin";
    isActive: boolean;
}

export const listAdmins = async (): Promise<AdminUser[]> => {
    try {
        const response = await protectedAxios.get(API.SUPER_ADMIN.LIST_ADMINS);
        return response.data?.data ?? [];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to load admins");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to load admins");
        }
        throw new Error("Failed to load admins");
    }
};

export const createAdmin = async (data: Record<string, unknown>) => {
    try {
        const response = await protectedAxios.post(API.SUPER_ADMIN.CREATE_ADMIN, data);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create admin");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to create admin");
        }
        throw new Error("Failed to create admin");
    }
};

export const setAdminActive = async (id: string, isActive: boolean) => {
    try {
        const response = await protectedAxios.put(API.SUPER_ADMIN.SET_ACTIVE(id), { isActive });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update admin");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to update admin");
        }
        throw new Error("Failed to update admin");
    }
};
