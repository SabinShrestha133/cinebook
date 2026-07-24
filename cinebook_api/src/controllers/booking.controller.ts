import { Request, Response } from "express";
import { bookingService } from "../services/booking.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

export class BookingController {
    async create(req: Request, res: Response) {
        try {
            const payload = { ...req.body, userId: req.user?._id };
            const booking = await bookingService.createBooking(payload);
            return ApiResponseHelper.success(res, booking, "Booking created. Proceed to payment.", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error creating booking", 400);
        }
    }

    async getMine(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            const list = await bookingService.list({ userId });
            return ApiResponseHelper.success(res, list, "User bookings fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching bookings", 500);
        }
    }

    async get(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const booking = await bookingService.getBooking(id);
            if (!booking) return ApiResponseHelper.error(res, "Not found", 404);
            return ApiResponseHelper.success(res, booking, "Booking fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching booking", 500);
        }
    }

    async initiatePayment(req: Request, res: Response) {
        try {
            const bookingId = String(req.params.id);
            const customerInfo = req.body.customerInfo || {
                name: req.user?.name || "Customer",
                email: req.user?.email || "customer@example.com",
                phone: req.user?.phoneNumber || "9800000000",
            };
            const result = await bookingService.initiatePayment(bookingId, customerInfo);
            return ApiResponseHelper.success(res, result, "Payment initiated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error initiating payment", 400);
        }
    }

    async verifyPayment(req: Request, res: Response) {
        try {
            const { pidx } = req.body;
            const bookingId = String(req.body.bookingId);
            const result = await bookingService.verifyPayment(bookingId, pidx);
            return ApiResponseHelper.success(res, result, "Payment verified");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error verifying payment", 400);
        }
    }

    async cancelBooking(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const booking = await bookingService.cancelBooking(id);
            return ApiResponseHelper.success(res, booking, "Booking cancelled");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error cancelling booking", 400);
        }
    }
}

export const bookingController = new BookingController();
