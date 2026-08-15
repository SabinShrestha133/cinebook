import { Request, Response } from "express";
import { bookingService } from "../services/booking.service";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { BookingModel } from "../models/booking.model";

export class BookingController {
    async create(req: Request, res: Response) {
        try {
            const payload = { ...req.body, userId: req.user?._id };
            const booking = await bookingService.createBooking(payload);
            return ApiResponseHelper.success(res, booking, "Booking confirmed.", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error creating booking", 400);
        }
    }

    async getMine(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            const list = await BookingModel.find({ userId })
                .populate("movieId", "title")
                .populate("cinemaId", "name")
                .populate("hallId", "name")
                .populate("showtimeId", "showDate startTime endTime")
                .sort({ createdAt: -1 })
                .lean();
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
            const result = await bookingService.verifyPayment(pidx);
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

    async verifyTicket(req: Request, res: Response) {
        try {
            const { bookingCode, bookingId } = req.body;
            const identifier = bookingCode || bookingId;
            if (!identifier) {
                return ApiResponseHelper.error(res, "bookingCode or bookingId is required", 400);
            }
            const result = await bookingService.verifyTicket(identifier);
            return ApiResponseHelper.success(res, result, "Ticket verified and checked in");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error verifying ticket", 400);
        }
    }

    async getQr(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const qrBuffer = await bookingService.getBookingQr(id);
            res.setHeader("Content-Type", "image/png");
            res.setHeader("Cache-Control", "no-store");
            res.send(qrBuffer);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error generating QR", 400);
        }
    }
}

export const bookingController = new BookingController();
