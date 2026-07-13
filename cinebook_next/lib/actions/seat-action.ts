import { updateSeatType, updateSeatStatus, bulkUpdateSeats, type Seat } from "@/lib/api/seat";

export const handleUpdateSeatType = async (
    seatId: string,
    seatType: Seat["seatType"]
): Promise<{ success: boolean; data?: Seat; message?: string }> => {
    try {
        const data = await updateSeatType(seatId, seatType);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleUpdateSeatStatus = async (
    seatId: string,
    status: Seat["status"]
): Promise<{ success: boolean; data?: Seat; message?: string }> => {
    try {
        const data = await updateSeatStatus(seatId, status);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleBulkUpdateSeats = async (
    hallId: string,
    updates: Array<{ seatId: string; seatType?: string; status?: string }>
): Promise<{ success: boolean; data?: { updatedCount: number }; message?: string }> => {
    try {
        const data = await bulkUpdateSeats(hallId, updates);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};
