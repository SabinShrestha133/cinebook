import axios from "axios";
import publicAxios from "./public-axios";
import protectedAxios from "./axios-instance";
import { API } from "./endpoints";
import { setToken, removeToken } from "@/lib/utils/auth-storage";

export type UserRole = "user" | "admin" | "super_admin";

export interface User {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    email: string;
    phone?: string;
    profileImage?: string;
    role?: UserRole;
    permissions?: string[];
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: User;
    };
}

export const register = async (data: Record<string, unknown>) => {
    try {
        const response = await publicAxios.post(API.AUTH.REGISTER, data);
        return response.data as AuthResponse;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Registration failed");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Registration failed");
        }
        throw new Error("Registration failed");
    }
};

export const login = async (data: { email: string; password: string }) => {
    try {
        const response = await publicAxios.post(API.AUTH.LOGIN, data);
        const result = response.data as AuthResponse;
        if (result?.data?.token) {
            setToken(result.data.token);
        }
        return result;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Login failed");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Login failed");
        }
        throw new Error("Login failed");
    }
};

export const whoami = async () => {
    try {
        const response = await protectedAxios.get(API.AUTH.WHOAMI);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch user");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to fetch user");
        }
        throw new Error("Failed to fetch user");
    }
};

export const updateProfile = async (formData: FormData) => {
    try {
        const response = await protectedAxios.put(API.AUTH.UPDATE_PROFILE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const result = response.data;
        if (result?.data?.token) {
            setToken(result.data.token);
        }
        return result;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Update user failed");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Update user failed");
        }
        throw new Error("Update user failed");
    } finally {
        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
        }
    }
};

export const logout = () => {
    removeToken();
};

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await publicAxios.post(
            API.AUTH.REQUEST_PASSWORD_RESET,
            { email }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Request password reset failed"
            );
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Request password reset failed");
        }
        throw new Error("Request password reset failed");
    }
};

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await publicAxios.post(
            API.AUTH.RESET_PASSWORD(token),
            { newPassword }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Reset password failed"
            );
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Reset password failed");
        }
        throw new Error("Reset password failed");
    }
};

