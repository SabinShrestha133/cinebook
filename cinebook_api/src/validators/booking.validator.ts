import { z } from "zod";

export const createBookingSchema = z.object({
    showtimeId: z.string().min(1),
    movieId: z.string().min(1),
    cinemaId: z.string().min(1),
    hallId: z.string().min(1),
    seats: z.array(z.object({ seatId: z.string().min(1), label: z.string().optional(), price: z.number() })).min(1),
});

export const initiatePaymentSchema = z.object({
    customerInfo: z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
    }),
});

export const verifyPaymentSchema = z.object({
    pidx: z.string().min(1),
});
