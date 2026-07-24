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

    // Atomically reserve seats: only succeed if none of seatIds are already booked
    async reserveSeats(showtimeId: string, seatIds: string[]) {
        const result = await ShowtimeModel.updateOne(
            { _id: new mongoose.Types.ObjectId(showtimeId), bookedSeats: { $nin: seatIds } },
            { $push: { bookedSeats: { $each: seatIds } } }
        );
        return result.matchedCount > 0;
    }

    async unreserveSeats(showtimeId: string, seatIds: string[]) {
        return ShowtimeModel.updateOne(
            { _id: new mongoose.Types.ObjectId(showtimeId) },
            { $pull: { bookedSeats: { $in: seatIds } } }
        );
    }
}
