import { HallModel, IHall } from "../models/hall.model";
import mongoose from "mongoose";

export class HallRepository {
    async create(data: Partial<IHall>) {
        return HallModel.create(data);
    }

    async findById(id: string) {
        return HallModel.findOne({ _id: id, isDeleted: { $ne: true } }).lean();
    }

    async find(query = {}, options = {}) {
        return HallModel.find({ ...query, isDeleted: { $ne: true } }, null, options).lean();
    }

    async update(id: string, data: Partial<IHall>) {
        return HallModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            data,
            { new: true }
        ).lean();
    }

    async softDelete(id: string, deletedBy: string) {
        return HallModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date(), deletedBy: new mongoose.Types.ObjectId(deletedBy) },
            { new: true }
        ).lean();
    }

    async delete(id: string) {
        return HallModel.findByIdAndDelete(id).lean();
    }
}
