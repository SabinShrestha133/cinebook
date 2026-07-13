import { BookingRepository } from "../repositories/booking.repository";
import { showtimeService } from "./showtime.service";
import { v4 as uuidv4 } from "uuid";

const bookingRepo = new BookingRepository();

export class BookingService {
    async createBooking(payload: any) {
        const { showtimeId, seats, userId, movieId, cinemaId, hallId } = payload;
        const seatIds = seats.map((s: any) => s.seatId);

        // attempt to reserve seats atomically
        const reserved = await showtimeService.reserveSeats(showtimeId, seatIds);
        if (!reserved) {
            throw new Error("One or more seats are already booked");
        }

        // compute total
        const totalAmount = seats.reduce((acc: number, s: any) => acc + (s.price || 0), 0);

        const booking = await bookingRepo.create({
            userId,
            movieId,
            cinemaId,
            hallId,
            showtimeId,
            seats,
            seatCount: seats.length,
            totalAmount,
            bookingStatus: "confirmed",
            paymentStatus: "paid",
            bookingCode: uuidv4().split("-")[0].toUpperCase(),
        });

        return booking;
    }

    async getBooking(id: string) {
        return bookingRepo.findById(id);
    }

    async list(query = {}, options = {}) {
        return bookingRepo.find(query, options);
    }
}

export const bookingService = new BookingService();
