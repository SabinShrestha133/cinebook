import { Router } from "express";
import { cinemaController } from "../controllers/cinema.controller";
import { authenticate, adminMiddleware, requirePermission } from "../middlewares/authorized.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createCinemaSchema, updateCinemaSchema } from "../validators/cinema.validator";
import { PERMISSIONS } from "../constants";

const router = Router();

router.get("/", cinemaController.list.bind(cinemaController));
router.post("/", authenticate, adminMiddleware, requirePermission(PERMISSIONS.CINEMA_MANAGE), validateBody(createCinemaSchema), cinemaController.create.bind(cinemaController));
router.put("/:id", authenticate, adminMiddleware, requirePermission(PERMISSIONS.CINEMA_MANAGE), validateBody(updateCinemaSchema), cinemaController.update.bind(cinemaController));

export default router;
