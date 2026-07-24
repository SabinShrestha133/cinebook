import { Request, Response } from "express";
import { aiRecommendationService } from "../services/ai-recommendation.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

export class AiRecommendationController {
    async getMovieRecommendations(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const result = await aiRecommendationService.getMovieRecommendationsForUser(userId.toString());
            return ApiResponseHelper.success(res, result, result.message || "AI recommendations fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching AI recommendations", 500);
        }
    }
}

export const aiRecommendationController = new AiRecommendationController();
