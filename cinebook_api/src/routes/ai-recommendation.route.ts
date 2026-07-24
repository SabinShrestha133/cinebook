import { Router } from "express";
import { aiRecommendationController } from "../controllers/ai-recommendation.controller";
import { authenticate } from "../middlewares/authorized.middleware";

const router = Router();

router.get("/movies", authenticate, aiRecommendationController.getMovieRecommendations.bind(aiRecommendationController));

export default router;
