import { z } from "zod";
import { SeatType, SeatStatus } from "../constants";

export const updateSeatTypeSchema = z.object({
    seatId: z.string().min(1, "Seat ID is required"),
    seatType: z.enum(["regular", "premium", "vip"], "Invalid seat type"),
});

export const updateSeatStatusSchema = z.object({
    seatId: z.string().min(1, "Seat ID is required"),
    status: z.enum(["active", "disabled", "hidden", "missing"], "Invalid seat status"),
});

export const bulkUpdateSeatsSchema = z.object({
    hallId: z.string().min(1),
    updates: z.array(
        z.object({
            seatId: z.string().min(1),
            seatType: z.enum(["regular", "premium", "vip"]).optional(),
            status: z.enum(["active", "disabled", "hidden", "missing"]).optional(),
        })
    ).min(1, "At least one update is required"),
});
