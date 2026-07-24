import { Router } from "express";
import { seatController } from "../controllers/seat.controller";
import { authenticate, adminMiddleware } from "../middlewares/authorized.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { updateSeatTypeSchema, updateSeatStatusSchema, bulkUpdateSeatsSchema } from "../validators/seat.validator";

const router = Router();

router.get("/hall/:hallId", seatController.getByHall.bind(seatController));
router.patch("/:id/type", authenticate, adminMiddleware, validateBody(updateSeatTypeSchema), seatController.updateType.bind(seatController));
router.patch("/:id/status", authenticate, adminMiddleware, validateBody(updateSeatStatusSchema), seatController.updateStatus.bind(seatController));
router.post("/bulk-update", authenticate, adminMiddleware, validateBody(bulkUpdateSeatsSchema), seatController.bulkUpdate.bind(seatController));
router.get("/hall/:hallId", seatController.getByHall.bind(seatController));

export default router;
