import { z } from "zod";

export const createBookingSchema = z.object({
    showtimeId: z.string().min(1),
    movieId: z.string().min(1),
    cinemaId: z.string().min(1),
    hallId: z.string().min(1),
    seats: z.array(z.object({ seatId: z.string().min(1), label: z.string().optional(), price: z.number() })).min(1),
});
