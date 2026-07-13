import { Request, Response } from "express";
import { superAdminService } from "../services/superadmin.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

export class SuperAdminController {
    async listAdmins(req: Request, res: Response) {
        try {
            const admins = await superAdminService.listAdmins();
            return ApiResponseHelper.success(res, admins, "Admins fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching admins", 500);
        }
    }

    async createAdmin(req: Request, res: Response) {
        try {
            const payload = req.body;
            const created = await superAdminService.createAdmin(payload);
            return ApiResponseHelper.success(res, created, "Admin created", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error creating admin", 500);
        }
    }

    async setActive(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const { isActive } = req.body;
            const updated = await superAdminService.setActive(id, Boolean(isActive));
            return ApiResponseHelper.success(res, updated, "Admin updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error updating admin", 500);
        }
    }
}

export const superAdminController = new SuperAdminController();
