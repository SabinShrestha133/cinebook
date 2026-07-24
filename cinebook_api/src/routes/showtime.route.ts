import { Router } from "express";
import { showtimeController } from "../controllers/showtime.controller";
import { authenticate, adminMiddleware, requirePermission } from "../middlewares/authorized.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createShowtimeSchema } from "../validators/showtime.validator";
import { PERMISSIONS } from "../constants";

const router = Router();

router.get("/", showtimeController.list.bind(showtimeController));
router.get("/:id", showtimeController.get.bind(showtimeController));
router.post("/", authenticate, adminMiddleware, requirePermission(PERMISSIONS.SHOWTIME_CREATE), validateBody(createShowtimeSchema), showtimeController.create.bind(showtimeController));

export default router;
