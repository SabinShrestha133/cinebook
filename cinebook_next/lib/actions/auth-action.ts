import { login, register } from "../api/auth";

export const handleLoginUser = async (data: any) => {
    try {
        const result = await login(data);
        return {
            success: true,
            message: "Login successful",
            data: result,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Login failed",
        };
    }
};

export const handleRegisterUser = async (data: any) => {
    try {
        // Remove confirmPassword before sending to backend
        const { confirmPassword, ...userData } = data;
        const result = await register(userData);
        return {
            success: true,
            message: "Registration successful",
            data: result,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Registration failed",
        };
    }
};
