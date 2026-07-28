import { BookingModel, IBooking } from "../models/booking.model";
import mongoose from "mongoose";

export class BookingRepository {
    async create(data: Partial<IBooking>) {
        return BookingModel.create(data);
    }

    async findById(id: string) {
        return BookingModel.findOne({ _id: id, isDeleted: { $ne: true } }).lean();
    }

    async findOne(query: Record<string, unknown>) {
        return BookingModel.findOne({ ...query, isDeleted: { $ne: true } }).lean();
    }

    async find(query = {}, options = {}) {
        return BookingModel.find({ ...query, isDeleted: { $ne: true } }, null, options).lean();
    }

    async update(id: string, data: Partial<IBooking>) {
        return BookingModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            data,
            { new: true }
        ).lean();
    }

    async softDelete(id: string, deletedBy: string) {
        return BookingModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date(), deletedBy: new mongoose.Types.ObjectId(deletedBy) },
            { new: true }
        ).lean();
    }
}
