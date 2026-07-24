import {
    createHall,
    getHall,
    listHalls,
    updateHall,
    deleteHall,
    generateHallLayout,
    getSeatsByHall,
    type Hall,
    type Seat,
} from "@/lib/api/hall";

export type { Hall, Seat } from "@/lib/api/hall";

export const handleCreateHall = async (
    payload: Partial<Hall>
): Promise<{ success: boolean; data?: Hall; message?: string }> => {
    try {
        const data = await createHall(payload);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleGetHall = async (
    id: string
): Promise<{ success: boolean; data?: Hall; message?: string }> => {
    try {
        const data = await getHall(id);
        return { success: true, data: data as Hall };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleListHalls = async (params?: { page?: number; limit?: number; search?: string }): Promise<{ success: boolean; data?: Hall[]; total?: number; page?: number; limit?: number; message?: string }> => {
    try {
        const out = await listHalls(params);
        return { success: true, data: out.data, total: out.total, page: out.page, limit: out.limit };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleUpdateHall = async (
    id: string,
    payload: Partial<Hall>
): Promise<{ success: boolean; data?: Hall; message?: string }> => {
    try {
        const data = await updateHall(id, payload);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleDeleteHall = async (
    id: string
): Promise<{ success: boolean; message?: string }> => {
    try {
        await deleteHall(id);
        return { success: true };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleGenerateHallLayout = async (
    hallId: string
): Promise<{ success: boolean; data?: Hall; message?: string }> => {
    try {
        const data = await generateHallLayout(hallId);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleGetSeatsByHall = async (
    hallId: string
): Promise<{ success: boolean; data?: Seat[]; message?: string }> => {
    try {
        const data = await getSeatsByHall(hallId);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};
