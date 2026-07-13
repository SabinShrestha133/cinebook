import { Router } from "express";
import { cinemaController } from "../controllers/cinema.controller";
import { authenticate, adminMiddleware } from "../middlewares/authorized.middleware";

const router = Router();

router.get("/", authenticate, adminMiddleware, cinemaController.list.bind(cinemaController));

export default router;
