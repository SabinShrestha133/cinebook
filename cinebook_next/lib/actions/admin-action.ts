import { getDashboardSummary, createMovie, createShowtime, listUsers, getUserDetails, updateUser, deleteUser, listAllBookings } from "../api/admin";
import { updateMovie, type Movie } from "../api/movie";
import { createCinema, updateCinema, type CreateCinemaPayload, type Cinema } from "../api/cinema";
import { type DashboardSummary, type AdminUser, type UserDetails, type AdminBooking } from "../api/admin";
import { createDayDiscount, updateDayDiscount, deleteDayDiscount, fetchDayDiscounts, type DayDiscount } from "../api/day-discount";

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

export const handleCreateCinema = async (
    data: CreateCinemaPayload
): Promise<{ success: boolean; data?: unknown; message?: string }> => {
    try {
        const dataOut = await createCinema(data);
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

export const handleUpdateMovie = async (
    id: string,
    data: Partial<Movie>
): Promise<{ success: boolean; data?: unknown; message?: string }> => {
    try {
        const dataOut = await updateMovie(id, data);
        return { success: true, data: dataOut };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleUpdateCinema = async (
    id: string,
    data: Partial<Cinema>
): Promise<{ success: boolean; data?: unknown; message?: string }> => {
    try {
        const dataOut = await updateCinema(id, data);
        return { success: true, data: dataOut };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleListAllBookings = async (
    params?: { cinemaId?: string; movieId?: string; userId?: string }
): Promise<{ success: boolean; data?: AdminBooking[]; message?: string }> => {
    try {
        const data = await listAllBookings(params);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleCreateDayDiscount = async (
    data: Partial<DayDiscount>
): Promise<{ success: boolean; data?: DayDiscount; message?: string }> => {
    try {
        const dataOut = await createDayDiscount(data);
        return { success: true, data: dataOut };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleUpdateDayDiscount = async (
    id: string,
    data: Partial<DayDiscount>
): Promise<{ success: boolean; data?: DayDiscount; message?: string }> => {
    try {
        const dataOut = await updateDayDiscount(id, data);
        return { success: true, data: dataOut };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleDeleteDayDiscount = async (
    id: string
): Promise<{ success: boolean; message?: string }> => {
    try {
        await deleteDayDiscount(id);
        return { success: true };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleListDayDiscounts = async (): Promise<{ success: boolean; data?: DayDiscount[]; message?: string }> => {
    try {
        const data = await fetchDayDiscounts();
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};
