import { Request, Response } from "express";
import { SeatRecommendationService } from "../services/seat-recommendation.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

export class SeatRecommendationController {
    async recommend(req: Request, res: Response) {
        try {
            const { showtimeId, count } = req.query;
            const seatCount = Math.max(1, Math.min(8, Number(count) || 1));

            if (!showtimeId || typeof showtimeId !== "string") {
                return ApiResponseHelper.error(res, "showtimeId is required", 400);
            }

            const service = new SeatRecommendationService();
            const recommendations = await service.recommend(showtimeId, seatCount);
            return ApiResponseHelper.success(res, recommendations, "Seat recommendations fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching seat recommendations", 500);
        }
    }
}

export const seatRecommendationController = new SeatRecommendationController();
