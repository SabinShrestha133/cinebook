import { DayDiscountModel, IDayDiscount } from "../models/day-discount.model";
import mongoose from "mongoose";

export class DayDiscountRepository {
    async create(data: Partial<IDayDiscount>) {
        return DayDiscountModel.create(data);
    }

    async findById(id: string) {
        return DayDiscountModel.findOne({ _id: id, isDeleted: { $ne: true } }).lean();
    }

    async find(query = {}, options = {}) {
        return DayDiscountModel.find({ ...query, isDeleted: { $ne: true } }, null, options).lean();
    }

    async findActiveForDay(dayOfWeek: number) {
        return DayDiscountModel.findOne({ dayOfWeek, isActive: true, isDeleted: { $ne: true } }).lean();
    }

    async findAllActive() {
        return DayDiscountModel.find({ isActive: true, isDeleted: { $ne: true } }).lean();
    }

    async update(id: string, data: Partial<IDayDiscount>) {
        return DayDiscountModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            data,
            { new: true }
        ).lean();
    }

    async softDelete(id: string, deletedBy: string) {
        return DayDiscountModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date(), deletedBy: new mongoose.Types.ObjectId(deletedBy) },
            { new: true }
        ).lean();
    }
}
