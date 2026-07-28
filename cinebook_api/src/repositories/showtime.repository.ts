import { ShowtimeModel, IShowtime } from "../models/showtime.model";
import mongoose from "mongoose";

export class ShowtimeRepository {
    async create(data: Partial<IShowtime>) {
        return ShowtimeModel.create(data);
    }

    async findById(id: string) {
        return ShowtimeModel.findOne({ _id: id, isDeleted: { $ne: true } }).populate("hallId").lean();
    }

    async find(query = {}, options = {}) {
        return ShowtimeModel.find({ ...query, isDeleted: { $ne: true } }, null, options).populate("hallId").lean();
    }

    async update(id: string, data: Partial<IShowtime>) {
        return ShowtimeModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            data,
            { new: true }
        ).lean();
    }

    async softDelete(id: string, deletedBy: string) {
        return ShowtimeModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date(), deletedBy: new mongoose.Types.ObjectId(deletedBy) },
            { new: true }
        ).lean();
    }

    async reserveSeats(showtimeId: string, seatIds: string[], bookingId: string, expiresAt: Date) {
        const result = await ShowtimeModel.updateOne(
            {
                _id: new mongoose.Types.ObjectId(showtimeId),
                isDeleted: { $ne: true },
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
            { _id: new mongoose.Types.ObjectId(showtimeId), isDeleted: { $ne: true } },
            { $pull: { reservations: { bookingId: new mongoose.Types.ObjectId(bookingId) } } }
        );
    }

    async confirmSeats(showtimeId: string, bookingId: string) {
        const showtime = await ShowtimeModel.findOne({ _id: new mongoose.Types.ObjectId(showtimeId), isDeleted: { $ne: true } });
        if (!showtime) return false;

        const bookingReservations = showtime.reservations.filter(
            (r: any) => r.bookingId.toString() === bookingId
        );
        const seatIds = bookingReservations.map((r: any) => r.seatId);

        if (seatIds.length === 0) return false;

        await ShowtimeModel.updateOne(
            { _id: new mongoose.Types.ObjectId(showtimeId), isDeleted: { $ne: true } },
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
            { "reservations.expiresAt": { $lt: now }, isDeleted: { $ne: true } },
            { $pull: { reservations: { expiresAt: { $lt: now } } } }
        );
        return result.modifiedCount;
    }
}
