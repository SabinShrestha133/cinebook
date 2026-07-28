import { Request, Response } from "express";
import { cinemaService } from "../services/cinema.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

export class CinemaController {
    async list(req: Request, res: Response) {
        try {
            const data = await cinemaService.listCinemas();
            return ApiResponseHelper.success(res, data, "Cinemas fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching cinemas", 500);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const cinema = await cinemaService.createCinema(req.body);
            return ApiResponseHelper.success(res, cinema, "Cinema created", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error creating cinema", 500);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const cinema = await cinemaService.updateCinema(id, req.body);
            if (!cinema) return ApiResponseHelper.error(res, "Not found", 404);
            return ApiResponseHelper.success(res, cinema, "Cinema updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error updating cinema", 500);
        }
    }
}

export const cinemaController = new CinemaController();
