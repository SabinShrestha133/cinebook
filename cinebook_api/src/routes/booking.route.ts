import { Router } from "express";
import { bookingController } from "../controllers/booking.controller";
import { authenticate } from "../middlewares/authorized.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createBookingSchema } from "../validators/booking.validator";

const router = Router();

router.post("/", authenticate, validateBody(createBookingSchema), bookingController.create.bind(bookingController));
router.get("/me", authenticate, bookingController.getMine.bind(bookingController));
router.get("/:id", authenticate, bookingController.get.bind(bookingController));

export default router;
