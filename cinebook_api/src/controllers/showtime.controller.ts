import { Request, Response } from "express";
import { showtimeService } from "../services/showtime.service";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { createShowtimeSchema, updateShowtimeSchema } from "../validators/showtime.validator";
import { validateBody } from "../middlewares/validate.middleware";

export class ShowtimeController {
    async create(req: Request, res: Response) {
        try {
            const st = await showtimeService.createShowtime(req.body);
            return ApiResponseHelper.success(res, st, "Showtime created", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error creating showtime", 500);
        }
    }

    async get(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const st = await showtimeService.getShowtime(id);
            if (!st) return ApiResponseHelper.error(res, "Not found", 404);
            return ApiResponseHelper.success(res, st, "Showtime fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching showtime", 500);
        }
    }

    async list(req: Request, res: Response) {
        try {
            const list = await showtimeService.list(req.query || {});
            return ApiResponseHelper.success(res, list, "Showtimes fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error listing showtimes", 500);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const st = await showtimeService.updateShowtime(id, req.body);
            if (!st) return ApiResponseHelper.error(res, "Not found", 404);
            return ApiResponseHelper.success(res, st, "Showtime updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error updating showtime", 500);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const deletedBy = req.user?._id;
            if (!deletedBy) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            await showtimeService.softDelete(id, deletedBy.toString());
            return ApiResponseHelper.success(res, null, "Showtime deleted");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error deleting showtime", 500);
        }
    }
}

export const showtimeController = new ShowtimeController();
