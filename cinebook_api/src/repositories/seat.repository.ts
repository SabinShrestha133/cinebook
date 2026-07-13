import mongoose from "mongoose";
import { SeatModel, ISeat } from "../models/seat.model";
import { ShowtimeModel } from "../models/showtime.model";

export class SeatRepository {
    async create(data: Partial<ISeat>) {
        return SeatModel.create(data);
    }

    async bulkCreate(seats: Partial<ISeat>[]) {
        return SeatModel.insertMany(seats);
    }

    async findByHallId(hallId: string) {
        return SeatModel.find({ hallId }).sort({ positionIndex: 1 }).lean();
    }

    async findById(id: string) {
        return SeatModel.findById(id).lean();
    }

    async update(id: string, data: Partial<ISeat>) {
        return SeatModel.findByIdAndUpdate(id, data, { new: true }).lean();
    }

    async bulkUpdate(hallId: string, updates: { seatId: string; data: Partial<ISeat> }[]) {
        const bulkOps = updates.map((u) => ({
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(u.seatId), hallId: new mongoose.Types.ObjectId(hallId) },
                update: { $set: u.data },
            },
        }));
        return SeatModel.bulkWrite(bulkOps);
    }

    async deleteByHallId(hallId: string) {
        return SeatModel.deleteMany({ hallId: new mongoose.Types.ObjectId(hallId) });
    }

    async findAvailableByShowtime(showtimeId: string) {
        const showtime = await ShowtimeModel.findById(showtimeId).lean();
        if (!showtime) return [];

        const bookedObjectIds = (showtime.bookedSeats as string[])
            .map((id) => new mongoose.Types.ObjectId(id))
            .filter((id) => mongoose.Types.ObjectId.isValid(id));

        return SeatModel.find({
            hallId: showtime.hallId,
            status: "active",
            _id: { $nin: bookedObjectIds },
        }).lean();
    }
}
