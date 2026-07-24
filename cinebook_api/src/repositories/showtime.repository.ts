import { ShowtimeModel, IShowtime } from "../models/showtime.model";
import mongoose from "mongoose";

export class ShowtimeRepository {
    async create(data: Partial<IShowtime>) {
        return ShowtimeModel.create(data);
    }

    async findById(id: string) {
        return ShowtimeModel.findById(id).populate("hallId").lean();
    }

    async find(query = {}, options = {}) {
        return ShowtimeModel.find(query, null, options).populate("hallId").lean();
    }

    async reserveSeats(showtimeId: string, seatIds: string[], bookingId: string, expiresAt: Date) {
        const result = await ShowtimeModel.updateOne(
            {
                _id: new mongoose.Types.ObjectId(showtimeId),
                bookedSeats: { $nin: seatIds },
                "reservations.seatId": { $nin: seatIds },
            },
            {
                $push: {
                    reservations: {
                        $each: seatIds.map((seatId) => ({
                            seatId,
                            bookingId: new mongoose.Types.ObjectId(bookingId),
                            expiresAt,
                        })),
                    },
                },
            }
        );
        return result.matchedCount > 0;
    }

    async unreserveSeats(showtimeId: string, bookingId: string) {
        return ShowtimeModel.updateOne(
            { _id: new mongoose.Types.ObjectId(showtimeId) },
            { $pull: { reservations: { bookingId: new mongoose.Types.ObjectId(bookingId) } } }
        );
    }

    async confirmSeats(showtimeId: string, bookingId: string) {
        const showtime = await ShowtimeModel.findById(showtimeId);
        if (!showtime) return false;

        const bookingReservations = showtime.reservations.filter(
            (r: any) => r.bookingId.toString() === bookingId
        );
        const seatIds = bookingReservations.map((r: any) => r.seatId);

        if (seatIds.length === 0) return false;

        await ShowtimeModel.updateOne(
            { _id: new mongoose.Types.ObjectId(showtimeId) },
            {
                $push: { bookedSeats: { $each: seatIds } },
                $pull: { reservations: { bookingId: new mongoose.Types.ObjectId(bookingId) } },
            }
        );
        return true;
    }

    async releaseExpiredReservations() {
        const now = new Date();
        const result = await ShowtimeModel.updateMany(
            { "reservations.expiresAt": { $lt: now } },
            { $pull: { reservations: { expiresAt: { $lt: now } } } }
        );
        return result.modifiedCount;
    }
}
