import { z } from "zod";

export const createShowtimeSchema = z.object({
    movieId: z.string().min(1),
    cinemaId: z.string().min(1),
    hallId: z.string().min(1),
    showDate: z.string().min(1),
    startTime: z.string().min(1),
    endTime: z.string().optional(),
    ticketPrice: z.number(),
});
