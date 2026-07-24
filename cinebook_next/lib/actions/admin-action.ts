import { getDashboardSummary, createMovie, createShowtime, listUsers, getUserDetails, updateUser, deleteUser } from "../api/admin";
import { type DashboardSummary, type AdminUser, type UserDetails } from "../api/admin";

export const handleGetDashboard = async (): Promise<{ success: boolean; data?: DashboardSummary; message?: string }> => {
    try {
        const data = await getDashboardSummary();
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleCreateMovie = async (
    formData: FormData
): Promise<{ success: boolean; data?: unknown; message?: string }> => {
    try {
        const data = await createMovie(formData);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleCreateShowtime = async (
    data: Record<string, unknown>
): Promise<{ success: boolean; data?: unknown; message?: string }> => {
    try {
        const dataOut = await createShowtime(data);
        return { success: true, data: dataOut };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleListUsers = async (): Promise<{ success: boolean; data?: AdminUser[]; message?: string }> => {
    try {
        const data = await listUsers();
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleGetUserDetails = async (id: string): Promise<{ success: boolean; data?: UserDetails; message?: string }> => {
    try {
        const data = await getUserDetails(id);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleUpdateUser = async (
    id: string,
    data: Partial<AdminUser>
): Promise<{ success: boolean; data?: unknown; message?: string }> => {
    try {
        const dataOut = await updateUser(id, data);
        return { success: true, data: dataOut };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleDeleteUser = async (
    id: string
): Promise<{ success: boolean; message?: string }> => {
    try {
        await deleteUser(id);
        return { success: true };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};
