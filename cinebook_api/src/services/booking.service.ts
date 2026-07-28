import { BookingRepository } from "../repositories/booking.repository";
import { showtimeService } from "./showtime.service";
import { dayDiscountService } from "./day-discount.service";
import { calculateEffectivePrice } from "../utils/pricing.util";
import { paymentService } from "./payment.service";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import QRCode from "qrcode";
import { BookingStatus, PaymentStatus } from "../enums/booking.enums";
import { SECRET_KEY } from "../configs/constant";

const bookingRepo = new BookingRepository();

export class BookingService {
    async createBooking(payload: any) {
        const { showtimeId, seats, userId, movieId, cinemaId, hallId } = payload;
        const seatIds = seats.map((s: any) => s.seatId);

        const showtime = await showtimeService.getShowtime(showtimeId);
        if (!showtime) {
            throw new Error("Showtime not found");
        }

        const discounts = await dayDiscountService.getEffectiveDiscountsForShowtime(showtime.showDate, {
            discountType: showtime.discountType,
            discountValue: showtime.discountValue,
        });

        const effectivePrice = calculateEffectivePrice(showtime.ticketPrice, discounts);
        const totalAmount = seatIds.length * effectivePrice;
        const expiresAt = new Date(Date.now() + paymentService.getExpiryMinutes() * 60 * 1000);

        const seatsWithPrice = seatIds.map((seatId: string) => ({
            seatId,
            label: seatId,
            price: effectivePrice,
        }));

        const booking = await bookingRepo.create({
            userId,
            movieId,
            cinemaId,
            hallId,
            showtimeId,
            seats: seatsWithPrice,
            seatCount: seats.length,
            totalAmount,
            bookingStatus: BookingStatus.Reserved,
            paymentStatus: PaymentStatus.Pending,
            bookingCode: uuidv4().split("-")[0].toUpperCase(),
        });

        const reserved = await showtimeService.reserveSeats(showtimeId, seatIds, booking._id.toString(), expiresAt);
        if (!reserved) {
            await bookingRepo.update(booking._id.toString(), {
                bookingStatus: BookingStatus.Cancelled,
                paymentStatus: PaymentStatus.Failed,
            });
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
        if (booking.bookingStatus !== BookingStatus.Reserved && booking.bookingStatus !== BookingStatus.PendingPayment) {
            throw new Error("Booking is not awaiting payment");
        }

        const payment = await paymentService.initiatePayment(bookingId, booking.totalAmount, customerInfo);

        await bookingRepo.update(bookingId, {
            bookingStatus: BookingStatus.PendingPayment,
            khaltiPidx: payment.pidx,
        });

        return { ...payment, bookingId };
    }

    async verifyPayment(pidx: string) {
        const verification = await paymentService.verifyPayment(pidx);

        const booking = await bookingRepo.findOne({ khaltiPidx: pidx });

        if (!booking) {
            throw new Error("Booking not found for this payment");
        }

        const bookingId = booking._id.toString();

        if (booking.bookingStatus !== BookingStatus.PendingPayment) {
            throw new Error("Booking is not pending payment");
        }

        const expectedAmountPaisa = Math.round((booking.totalAmount || 0) * 100);
        const actualAmountPaisa = verification.total_amount ?? verification.totalAmount;

        if (actualAmountPaisa !== expectedAmountPaisa) {
            throw new Error(`Payment amount mismatch. Expected ${expectedAmountPaisa}, got ${actualAmountPaisa}`);
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

        const ticketJwt = jwt.sign(
            {
                bookingId: booking._id.toString(),
                bookingCode: booking.bookingCode,
            },
            SECRET_KEY,
            { expiresIn: "365d" }
        );

        await bookingRepo.update(bookingId, {
            bookingStatus: BookingStatus.Confirmed,
            paymentStatus: PaymentStatus.Paid,
            ticketJwt,
        });

        return bookingRepo.findById(bookingId);
    }

    async cancelBooking(bookingId: string, status = BookingStatus.Cancelled) {
        const booking = await bookingRepo.findById(bookingId);
        if (!booking) throw new Error("Booking not found");

        await showtimeService.unreserveSeats(booking.showtimeId.toString(), bookingId);

        await bookingRepo.update(bookingId, {
            bookingStatus: status,
            paymentStatus: PaymentStatus.Failed,
        });

        return bookingRepo.findById(bookingId);
    }

    async verifyTicket(identifier: string) {
        let booking = await bookingRepo.findOne({ bookingCode: identifier });

        if (!booking) {
            booking = await bookingRepo.findById(identifier);
        }

        if (!booking) {
            throw new Error("Ticket not found");
        }

        if (booking.bookingStatus === BookingStatus.CheckedIn) {
            throw new Error("Ticket has already been used");
        }

        if (booking.bookingStatus !== BookingStatus.Confirmed) {
            throw new Error("Booking is not confirmed");
        }

        await bookingRepo.update(booking._id.toString(), {
            bookingStatus: BookingStatus.CheckedIn,
        });

        return bookingRepo.findById(booking._id.toString());
    }

    async getBookingQr(bookingId: string): Promise<Buffer> {
        const booking = await bookingRepo.findById(bookingId);
        if (!booking) {
            throw new Error("Booking not found");
        }
        if (!booking.ticketJwt) {
            throw new Error("Ticket not generated yet");
        }

        return QRCode.toBuffer(booking.ticketJwt, {
            width: 400,
            margin: 2,
            color: { dark: "#000000", light: "#ffffff" },
        });
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
                await this.cancelBooking(booking._id.toString(), BookingStatus.Expired);
            } catch (err) {
                console.error(`Failed to cancel expired booking ${booking._id}:`, err);
            }
        }

        await showtimeService.releaseExpiredReservations();
    }
}

export const bookingService = new BookingService();
