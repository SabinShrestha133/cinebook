import { Router } from "express";
import { seatRecommendationController } from "../controllers/seat-recommendation.controller";

const router = Router();

router.get("/", seatRecommendationController.recommend.bind(seatRecommendationController));

export default router;
