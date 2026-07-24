import { Request, Response } from "express";
import { showtimeService } from "../services/showtime.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

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
}

export const showtimeController = new ShowtimeController();
