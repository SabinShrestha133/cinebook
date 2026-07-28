import { listShowtimes as apiListShowtimes, getShowtime as apiGetShowtime, updateShowtime as apiUpdateShowtime, deleteShowtime as apiDeleteShowtime, type Showtime } from "@/lib/api/admin";
import { toast } from "react-toastify";

export const handleListShowtimes = async (params?: { cinemaId?: string; movieId?: string; hallId?: string }) => {
    try {
        const data = await apiListShowtimes(params);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: error instanceof Error ? error.message : "Failed to load showtimes" };
    }
};

export const handleGetShowtime = async (id: string) => {
    try {
        const data = await apiGetShowtime(id);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: error instanceof Error ? error.message : "Failed to load showtime" };
    }
};

export const handleUpdateShowtime = async (id: string, data: Partial<Showtime>) => {
    try {
        const result = await apiUpdateShowtime(id, data);
        toast.success("Showtime updated");
        return { success: true, data: result };
    } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Failed to update showtime");
        return { success: false, message: error instanceof Error ? error.message : "Failed to update showtime" };
    }
};

export const handleDeleteShowtime = async (id: string) => {
    try {
        await apiDeleteShowtime(id);
        toast.success("Showtime deleted");
        return { success: true };
    } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Failed to delete showtime");
        return { success: false, message: error instanceof Error ? error.message : "Failed to delete showtime" };
    }
};