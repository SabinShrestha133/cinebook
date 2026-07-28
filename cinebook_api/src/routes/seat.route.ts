import { Router } from "express";
import { seatController } from "../controllers/seat.controller";
import { authenticate, adminMiddleware } from "../middlewares/authorized.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { permission } from "../middlewares/permission.middleware";
import { audit } from "../middlewares/audit.middleware";
import { updateSeatTypeSchema, updateSeatStatusSchema, bulkUpdateSeatsSchema } from "../validators/seat.validator";

const router = Router();

router.get("/hall/:hallId", seatController.getByHall.bind(seatController));

router.patch("/:id/type", authenticate, adminMiddleware, permission("hall:manage"), audit("Seat", "UPDATE_SEAT_TYPE"), validateBody(updateSeatTypeSchema), seatController.updateType.bind(seatController));
router.patch("/:id/status", authenticate, adminMiddleware, permission("hall:manage"), audit("Seat", "UPDATE_SEAT_STATUS"), validateBody(updateSeatStatusSchema), seatController.updateStatus.bind(seatController));
router.post("/bulk-update", authenticate, adminMiddleware, permission("hall:manage"), audit("Seat", "BULK_UPDATE_SEATS"), validateBody(bulkUpdateSeatsSchema), seatController.bulkUpdate.bind(seatController));

export default router;
