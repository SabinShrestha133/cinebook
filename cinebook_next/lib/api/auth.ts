import publicAxios from "./public-axios";
import protectedAxios from "./axios-instance";
import { API } from "./endpoints";
import { setToken, removeToken } from "@/lib/utils/auth-storage";

export interface User {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    email: string;
    phone?: string;
    profileImage?: string;
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

