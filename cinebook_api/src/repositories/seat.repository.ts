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
        return SeatModel.find({ hallId: new mongoose.Types.ObjectId(hallId), isDeleted: { $ne: true } }).sort({ positionIndex: 1 }).lean();
    }

    async findById(id: string) {
        return SeatModel.findOne({ _id: id, isDeleted: { $ne: true } }).lean();
    }

    async update(id: string, data: Partial<ISeat>) {
        return SeatModel.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, data, { new: true }).lean();
    }

    async bulkUpdate(hallId: string, updates: { seatId: string; data: Partial<ISeat> }[]) {
        const bulkOps = updates.map((u) => ({
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(u.seatId), hallId: new mongoose.Types.ObjectId(hallId), isDeleted: { $ne: true } },
                update: { $set: u.data },
            },
        }));
        return SeatModel.bulkWrite(bulkOps);
    }

    async deleteByHallId(hallId: string) {
        return SeatModel.deleteMany({ hallId: new mongoose.Types.ObjectId(hallId) });
    }

    async softDeleteByHallId(hallId: string, deletedBy: string) {
        return SeatModel.updateMany(
            { hallId: new mongoose.Types.ObjectId(hallId), isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date(), deletedBy: new mongoose.Types.ObjectId(deletedBy) }
        );
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
            isDeleted: { $ne: true },
            _id: { $nin: bookedObjectIds },
        }).lean();
    }
}
