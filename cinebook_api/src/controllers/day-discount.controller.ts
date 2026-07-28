import { Request, Response } from "express";
import { dayDiscountService } from "../services/day-discount.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

export class DayDiscountController {
    async create(req: Request, res: Response) {
        try {
            const discount = await dayDiscountService.createDayDiscount(req.body);
            return ApiResponseHelper.success(res, discount, "Day discount created", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error creating day discount", 500);
        }
    }

    async list(req: Request, res: Response) {
        try {
            const list = await dayDiscountService.listDayDiscounts(req.query || {});
            return ApiResponseHelper.success(res, list, "Day discounts fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error listing day discounts", 500);
        }
    }

    async get(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const discount = await dayDiscountService.getDayDiscount(id);
            if (!discount) return ApiResponseHelper.error(res, "Not found", 404);
            return ApiResponseHelper.success(res, discount, "Day discount fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching day discount", 500);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const discount = await dayDiscountService.updateDayDiscount(id, req.body);
            if (!discount) return ApiResponseHelper.error(res, "Not found", 404);
            return ApiResponseHelper.success(res, discount, "Day discount updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error updating day discount", 500);
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const discount = await dayDiscountService.deleteDayDiscount(id, req.user?._id?.toString() as string);
            if (!discount) return ApiResponseHelper.error(res, "Not found", 404);
            return ApiResponseHelper.success(res, null, "Day discount deleted");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error deleting day discount", 500);
        }
    }
}

export const dayDiscountController = new DayDiscountController();
