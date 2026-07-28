import mongoose from "mongoose";
import { HallRowModel, IHallRow } from "../models/hall-row.model";

export class HallRowRepository {
    async create(data: Partial<IHallRow>) {
        return HallRowModel.create(data);
    }

    async findByHallId(hallId: string) {
        return HallRowModel.find({ hallId: new mongoose.Types.ObjectId(hallId), isDeleted: { $ne: true } }).sort({ order: 1 }).lean();
    }

    async deleteByHallId(hallId: string) {
        return HallRowModel.deleteMany({ hallId: new mongoose.Types.ObjectId(hallId) });
    }

    async softDeleteByHallId(hallId: string, deletedBy: string) {
        return HallRowModel.updateMany(
            { hallId: new mongoose.Types.ObjectId(hallId), isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date(), deletedBy: new mongoose.Types.ObjectId(deletedBy) }
        );
    }
}
