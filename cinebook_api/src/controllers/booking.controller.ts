import { Request, Response } from "express";
import { bookingService } from "../services/booking.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

export class BookingController {
    async create(req: Request, res: Response) {
        try {
            const payload = { ...req.body, userId: req.user?._id };
            const booking = await bookingService.createBooking(payload);
            return ApiResponseHelper.success(res, booking, "Booking confirmed", 201);
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
}

export const bookingController = new BookingController();
