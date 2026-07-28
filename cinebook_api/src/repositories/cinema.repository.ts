import mongoose from "mongoose";
import { CinemaModel, ICinema } from "../models/cinema.model";

export class CinemaRepository {
    async find(query = {}, options = {}) {
        return CinemaModel.find({ ...query, isDeleted: { $ne: true } }, null, options).lean();
    }

    async findById(id: string) {
        return CinemaModel.findOne({ _id: id, isDeleted: { $ne: true } }).lean();
    }

    async create(data: Partial<ICinema>) {
        return CinemaModel.create(data);
    }

    async update(id: string, data: Partial<ICinema>) {
        return CinemaModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            data,
            { new: true }
        ).lean();
    }

    async softDelete(id: string, deletedBy: string) {
        return CinemaModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date(), deletedBy: new mongoose.Types.ObjectId(deletedBy) },
            { new: true }
        ).lean();
    }
}
