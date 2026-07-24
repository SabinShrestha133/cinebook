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
}

export const cinemaController = new CinemaController();
