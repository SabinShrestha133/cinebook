// centralized path definitions for API endpoints
export const API = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
    }
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";
