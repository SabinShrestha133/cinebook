import { BookingModel, IBooking } from "../models/booking.model";

export class BookingRepository {
    async create(data: Partial<IBooking>) {
        return BookingModel.create(data);
    }

    async findById(id: string) {
        return BookingModel.findById(id).lean();
    }

    async find(query = {}, options = {}) {
        return BookingModel.find(query, null, options).lean();
    }

    async update(id: string, data: Partial<IBooking>) {
        return BookingModel.findByIdAndUpdate(id, data, { new: true }).lean();
    }
}
