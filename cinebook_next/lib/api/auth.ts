import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const register = async (data: any) => {
    try {
        const response = await axiosInstance.post(API.AUTH.REGISTER, data);
        return response.data; // response body
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Registration failed");
    }
};

export const login = async (data: any) => {
    try {
        const response = await axiosInstance.post(API.AUTH.LOGIN, data);
        // Store token and user in localStorage
        if (response.data?.data?.token) {
            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.data.user));
        }
        return response.data; // response body
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Login failed");
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};
