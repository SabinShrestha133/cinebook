import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

export class AdminController {
    async dashboard(req: Request, res: Response) {
        try {
            const cinemaId = req.query.cinemaId as string | undefined;
            const summary = await adminService.dashboardSummary(cinemaId);
            return ApiResponseHelper.success(res, summary, "Admin dashboard summary");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching dashboard", 500);
        }
    }

    async listUsers(req: Request, res: Response) {
        try {
            const users = await adminService.listUsers();
            return ApiResponseHelper.success(res, users, "Users fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching users", 500);
        }
    }

    async getUserDetails(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const details = await adminService.getUserDetails(id);
            return ApiResponseHelper.success(res, details, "User details fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching user details", 500);
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const payload = req.body;
            const updated = await adminService.updateUser(id, payload);
            return ApiResponseHelper.success(res, updated, "User updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error updating user", 500);
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            await adminService.deleteUser(id);
            return ApiResponseHelper.success(res, null, "User deleted", 200);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error deleting user", 500);
        }
    }
}

export const adminController = new AdminController();
