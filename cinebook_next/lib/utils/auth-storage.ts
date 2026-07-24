const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export const setToken = (token: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        document.cookie = `token=${token}; path=/; max-age=${TOKEN_MAX_AGE}; SameSite=Lax`;
    }
};

export const getToken = (): string | null => {
    if (typeof window !== "undefined") {
        const localToken = localStorage.getItem("token");
        if (localToken) return localToken;
        const cookieToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];
        return cookieToken || null;
    }
    return null;
};

export const removeToken = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    }
};
