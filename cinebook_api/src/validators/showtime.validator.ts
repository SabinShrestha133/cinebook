import { z } from "zod";

export const createShowtimeSchema = z.object({
    movieId: z.string().min(1),
    cinemaId: z.string().min(1),
    hallId: z.string().min(1),
    showDate: z.string().min(1),
    startTime: z.string().min(1),
    endTime: z.string().optional(),
    ticketPrice: z.number(),
    discountType: z.enum(["none", "percentage", "fixed"]).optional(),
    discountValue: z.number().optional(),
});

export const updateShowtimeSchema = z.object({
    movieId: z.string().min(1).optional(),
    cinemaId: z.string().min(1).optional(),
    hallId: z.string().min(1).optional(),
    showDate: z.string().min(1).optional(),
    startTime: z.string().min(1).optional(),
    endTime: z.string().optional(),
    ticketPrice: z.number().optional(),
    discountType: z.enum(["none", "percentage", "fixed"]).optional(),
    discountValue: z.number().optional(),
    status: z.enum(["active", "cancelled", "completed"]).optional(),
});
