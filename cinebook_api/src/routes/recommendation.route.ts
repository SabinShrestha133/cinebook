import { Router } from "express";
import { recommendationController } from "../controllers/recommendation.controller";
import { authenticate } from "../middlewares/authorized.middleware";

const router = Router();

router.get("/me", authenticate, recommendationController.me.bind(recommendationController));

export default router;
