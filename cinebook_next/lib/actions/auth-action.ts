import { login, register, whoami, updateProfile, requestPasswordReset, resetPassword } from "../api/auth";

export const handleLoginUser = async (data: { email: string; password: string }) => {
    try {
        const result = await login(data);
        return {
            success: true,
            message: "Login successful",
            data: result,
        };
    } catch (error: unknown) {
        let message = "Login failed";
        if (error instanceof Error) {
            message = error.message;
        }
        return {
            success: false,
            message,
        };
    }
};

export const handleRegisterUser = async (data: Record<string, unknown>) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword: _confirmPassword, ...userData } = data;
        const result = await register(userData);
        return {
            success: true,
            message: "Registration successful",
            data: result,
        };
    } catch (error: unknown) {
        let message = "Registration failed";
        if (error instanceof Error) {
            message = error.message;
        }
        return {
            success: false,
            message,
        };
    }
};

export const handleWhoami = async () => {
    try {
        const result = await whoami();
        return {
            success: true,
            message: "User fetched",
            data: result,
        };
    } catch (error: unknown) {
        let message = "Failed to fetch user";
        if (error instanceof Error) {
            message = error.message;
        }
        return {
            success: false,
            message,
        };
    }
};

export const handleUpdateUser = async (formData: FormData) => {
    try {
        const result = await updateProfile(formData);
        if (result?.success) {
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result?.message || "Update user failed" };
    } catch (error: unknown) {
        let message = "Update user failed";
        if (error instanceof Error) {
            message = error.message;
        }
        return { success: false, message };
    }
};

export const handleRequestPasswordReset = async (email: string) => {
    try {
        const result = await requestPasswordReset(email);
        if (result.success) {
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Request password reset failed" };
    } catch (error: unknown) {
        let message = "Request password reset failed";
        if (error instanceof Error) {
            message = error.message;
        }
        return { success: false, message };
    }
};

export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const result = await resetPassword(token, newPassword);
        if (result.success) {
            return { success: true, message: result.message };
        }
        return { success: false, message: result.message || "Reset password failed" };
    } catch (error: unknown) {
        let message = "Reset password failed";
        if (error instanceof Error) {
            message = error.message;
        }
        return { success: false, message };
    }
};