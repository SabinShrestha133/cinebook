import { Router } from "express";
import { cinemaController } from "../controllers/cinema.controller";
import { authenticate, adminMiddleware } from "../middlewares/authorized.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { permission } from "../middlewares/permission.middleware";
import { audit } from "../middlewares/audit.middleware";
import { createCinemaSchema, updateCinemaSchema } from "../validators/cinema.validator";
import { authenticate, adminMiddleware, requirePermission } from "../middlewares/authorized.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createCinemaSchema, updateCinemaSchema } from "../validators/cinema.validator";
import { PERMISSIONS } from "../constants";

const router = Router();

router.get("/", cinemaController.list.bind(cinemaController));
router.post("/", authenticate, adminMiddleware, requirePermission(PERMISSIONS.CINEMA_MANAGE), validateBody(createCinemaSchema), cinemaController.create.bind(cinemaController));
router.put("/:id", authenticate, adminMiddleware, requirePermission(PERMISSIONS.CINEMA_MANAGE), validateBody(updateCinemaSchema), cinemaController.update.bind(cinemaController));

router.post(
    "/",
    authenticate,
    adminMiddleware,
    permission("cinema:manage"),
    audit("Cinema", "CREATE_CINEMA"),
    validateBody(createCinemaSchema),
    cinemaController.create.bind(cinemaController)
);

router.put(
    "/:id",
    authenticate,
    adminMiddleware,
    permission("cinema:manage"),
    audit("Cinema", "UPDATE_CINEMA"),
    validateBody(updateCinemaSchema),
    cinemaController.update.bind(cinemaController)
);

export default router;
