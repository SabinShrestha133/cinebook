import { BookingRepository } from "../repositories/booking.repository";
import { showtimeService } from "./showtime.service";
import { paymentService } from "./payment.service";
import { v4 as uuidv4 } from "uuid";
import { BookingStatus, PaymentStatus } from "../enums/booking.enums";

const bookingRepo = new BookingRepository();

export class BookingService {
    async createBooking(payload: any) {
        const { showtimeId, seats, userId, movieId, cinemaId, hallId } = payload;
        const seatIds = seats.map((s: any) => s.seatId);

        const totalAmount = seats.reduce((acc: number, s: any) => acc + (s.price || 0), 0);
        const expiresAt = new Date(Date.now() + paymentService.getExpiryMinutes() * 60 * 1000);

        const booking = await bookingRepo.create({
            userId,
            movieId,
            cinemaId,
            hallId,
            showtimeId,
            seats,
            seatCount: seats.length,
            totalAmount,
            bookingStatus: BookingStatus.PendingPayment,
            paymentStatus: PaymentStatus.Pending,
            bookingCode: uuidv4().split("-")[0].toUpperCase(),
        });

        const reserved = await showtimeService.reserveSeats(showtimeId, seatIds, booking._id.toString(), expiresAt);
        if (!reserved) {
            await bookingRepo.delete(booking._id.toString());
            throw new Error("One or more seats are already booked or reserved by another user");
        }

        return booking;
    }

    async getBooking(id: string) {
        return bookingRepo.findById(id);
    }

    async list(query = {}, options = {}) {
        return bookingRepo.find(query, options);
    }

    async initiatePayment(bookingId: string, customerInfo: { name: string; email: string; phone: string }) {
        const booking = await bookingRepo.findById(bookingId);
        if (!booking) {
            throw new Error("Booking not found");
        }
        if (booking.bookingStatus !== BookingStatus.PendingPayment) {
            throw new Error("Booking is not pending payment");
        }

        const payment = await paymentService.initiatePayment(bookingId, booking.totalAmount, customerInfo);
        return { ...payment, bookingId };
    }

    async verifyPayment(bookingId: string, pidx: string) {
        const verification = await paymentService.verifyPayment(pidx);
        const booking = await bookingRepo.findById(bookingId);

        if (!booking) {
            throw new Error("Booking not found");
        }

        if (verification.status === "Completed") {
            await this.confirmBooking(bookingId);
        } else {
            await this.cancelBooking(bookingId);
        }

        return { verification, booking: await bookingRepo.findById(bookingId) };
    }

    async confirmBooking(bookingId: string) {
        const booking = await bookingRepo.findById(bookingId);
        if (!booking) throw new Error("Booking not found");

        await showtimeService.confirmSeats(booking.showtimeId.toString(), bookingId);

        await bookingRepo.update(bookingId, {
            bookingStatus: BookingStatus.Confirmed,
            paymentStatus: PaymentStatus.Paid,
        });

        return bookingRepo.findById(bookingId);
    }

    async cancelBooking(bookingId: string) {
        const booking = await bookingRepo.findById(bookingId);
        if (!booking) throw new Error("Booking not found");

        await showtimeService.unreserveSeats(booking.showtimeId.toString(), bookingId);

        await bookingRepo.update(bookingId, {
            bookingStatus: BookingStatus.Cancelled,
            paymentStatus: PaymentStatus.Failed,
        });

        return bookingRepo.findById(bookingId);
    }

    async releaseExpiredBookings() {
        const now = new Date();
        const expiryMinutes = paymentService.getExpiryMinutes();

        const expiredBookings = await bookingRepo.find({
            bookingStatus: BookingStatus.PendingPayment,
            paymentStatus: PaymentStatus.Pending,
            createdAt: { $lt: new Date(now.getTime() - expiryMinutes * 60 * 1000) },
        });

        for (const booking of expiredBookings) {
            try {
                await this.cancelBooking(booking._id.toString());
            } catch (err) {
                console.error(`Failed to cancel expired booking ${booking._id}:`, err);
            }
        }

        await showtimeService.releaseExpiredReservations();
    }
}

export const bookingService = new BookingService();
