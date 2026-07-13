import { Request, Response } from "express";
import { recommendationService } from "../services/recommendation.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

export class RecommendationController {
    async me(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
            const recs = await recommendationService.getForUser(userId.toString(), 10);
            return ApiResponseHelper.success(res, recs, "Recommendations fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching recommendations", 500);
        }
    }
}

export const recommendationController = new RecommendationController();
