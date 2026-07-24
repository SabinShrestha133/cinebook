import { Router } from "express";
import { bookingController } from "../controllers/booking.controller";
import { authenticate } from "../middlewares/authorized.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createBookingSchema, initiatePaymentSchema, verifyPaymentSchema, verifyTicketSchema } from "../validators/booking.validator";

const router = Router();

router.post("/", authenticate, validateBody(createBookingSchema), bookingController.create.bind(bookingController));
router.get("/me", authenticate, bookingController.getMine.bind(bookingController));
router.get("/:id/qr", bookingController.getQr.bind(bookingController));
router.get("/:id", authenticate, bookingController.get.bind(bookingController));

router.post("/:id/initiate-payment", authenticate, validateBody(initiatePaymentSchema), bookingController.initiatePayment.bind(bookingController));
router.post("/verify-payment", authenticate, validateBody(verifyPaymentSchema), bookingController.verifyPayment.bind(bookingController));
router.patch("/:id/cancel", authenticate, bookingController.cancelBooking.bind(bookingController));

router.post("/verify-ticket", authenticate, validateBody(verifyTicketSchema), bookingController.verifyTicket.bind(bookingController));

export default router;
