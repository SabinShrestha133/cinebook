import axios from "axios";
import { API_BASE_URL } from "./endpoints";
import { getToken } from "@/lib/utils/auth-storage";

export const protectedAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

protectedAxios.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

protectedAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (typeof window !== "undefined") {
                window.location.href = "/frontend/login";
            }
        }
        return Promise.reject(error);
    }
);

export default protectedAxios;
