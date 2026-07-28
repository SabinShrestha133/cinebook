import { Router } from "express";
import { showtimeController } from "../controllers/showtime.controller";
import { authenticate, adminMiddleware } from "../middlewares/authorized.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { permission } from "../middlewares/permission.middleware";
import { audit } from "../middlewares/audit.middleware";
import { createShowtimeSchema, updateShowtimeSchema } from "../validators/showtime.validator";

const router = Router();

router.get("/", showtimeController.list.bind(showtimeController));
router.get("/:id", showtimeController.get.bind(showtimeController));

router.post(
    "/",
    authenticate,
    adminMiddleware,
    permission("showtime:create"),
    audit("Showtime", "CREATE_SHOWTIME"),
    validateBody(createShowtimeSchema),
    showtimeController.create.bind(showtimeController)
);

router.put(
    "/:id",
    authenticate,
    adminMiddleware,
    permission("showtime:update"),
    audit("Showtime", "UPDATE_SHOWTIME"),
    validateBody(updateShowtimeSchema),
    showtimeController.update.bind(showtimeController)
);

router.delete(
    "/:id",
    authenticate,
    adminMiddleware,
    permission("showtime:delete"),
    audit("Showtime", "DELETE_SHOWTIME"),
    showtimeController.delete.bind(showtimeController)
);

export default router;
