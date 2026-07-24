import { listAdmins, createAdmin, setAdminActive, updateAdmin } from "../api/super-admin";
import { type AdminUser } from "../api/super-admin";

export const handleListAdmins = async (): Promise<{ success: boolean; data?: AdminUser[]; message?: string }> => {
    try {
        const data = await listAdmins();
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleCreateAdmin = async (
    data: Record<string, unknown>
): Promise<{ success: boolean; data?: unknown; message?: string }> => {
    try {
        const dataOut = await createAdmin(data);
        return { success: true, data: dataOut };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleSetAdminActive = async (
    id: string,
    isActive: boolean
): Promise<{ success: boolean; data?: unknown; message?: string }> => {
    try {
        const data = await setAdminActive(id, isActive);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};

export const handleUpdateAdmin = async (
    id: string,
    data: { isActive?: boolean; permissions?: string[] }
): Promise<{ success: boolean; data?: unknown; message?: string }> => {
    try {
        const dataOut = await updateAdmin(id, data);
        return { success: true, data: dataOut };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
};
