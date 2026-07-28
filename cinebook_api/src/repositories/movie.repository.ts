import { MovieModel, IMovie } from "../models/movie.model";
import mongoose from "mongoose";

export class MovieRepository {
    async create(data: Partial<IMovie>) {
        return MovieModel.create(data);
    }

    async findById(id: string) {
        return MovieModel.findOne({ _id: id, isDeleted: { $ne: true } }).lean();
    }

    async find(query = {}, options = {}) {
        return MovieModel.find({ ...query, isDeleted: { $ne: true } }, null, options).lean();
    }

    async update(id: string, data: Partial<IMovie>) {
        return MovieModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            data,
            { new: true }
        ).lean();
    }

    async softDelete(id: string, deletedBy: string) {
        return MovieModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date(), deletedBy: new mongoose.Types.ObjectId(deletedBy) },
            { new: true }
        ).lean();
    }
}
