import { Router } from "express";
import { showtimeController } from "../controllers/showtime.controller";
import { authenticate, adminMiddleware } from "../middlewares/authorized.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createShowtimeSchema } from "../validators/showtime.validator";

const router = Router();

router.get("/", showtimeController.list.bind(showtimeController));
router.get("/:id", showtimeController.get.bind(showtimeController));
router.post("/", authenticate, adminMiddleware, validateBody(createShowtimeSchema), showtimeController.create.bind(showtimeController));

export default router;
