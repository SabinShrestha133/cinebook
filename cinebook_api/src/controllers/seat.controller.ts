import { Request, Response } from "express";
import { seatService } from "../services/seat.service";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { updateSeatTypeSchema, updateSeatStatusSchema, bulkUpdateSeatsSchema } from "../validators/seat.validator";
import { validateBody } from "../middlewares/validate.middleware";

function getId(req: Request) {
    return String(req.params.id);
}

function getHallId(req: Request) {
    return String(req.params.hallId);
}

export class SeatController {
    async updateType(req: Request, res: Response) {
        try {
            const { seatType } = req.body;
            const seat = await seatService.updateSeatType(getId(req), seatType);
            return ApiResponseHelper.success(res, seat, "Seat type updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error updating seat type", 500);
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { status } = req.body;
            const seat = await seatService.updateSeatStatus(getId(req), status);
            return ApiResponseHelper.success(res, seat, "Seat status updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error updating seat status", 500);
        }
    }

    async bulkUpdate(req: Request, res: Response) {
        try {
            const { hallId, updates } = req.body;
            const result = await seatService.bulkUpdateSeats(hallId, updates);
            return ApiResponseHelper.success(res, result, "Seats updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error updating seats", 500);
        }
    }

    async getByHall(req: Request, res: Response) {
        try {
            const seats = await seatService.getSeatsByHall(getHallId(req));
            return ApiResponseHelper.success(res, seats, "Seats fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching seats", 500);
        }
    }
}

export const seatController = new SeatController();
