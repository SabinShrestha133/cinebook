import { CinemaModel, ICinema } from "../models/cinema.model";

export class CinemaRepository {
    async find(query = {}, options = {}) {
        return CinemaModel.find(query, null, options).lean();
    }

    async findById(id: string) {
        return CinemaModel.findById(id).lean();
    }

    async create(data: Partial<ICinema>) {
        return CinemaModel.create(data);
    }

    async update(id: string, data: Partial<ICinema>) {
        return CinemaModel.findByIdAndUpdate(id, data, { new: true }).lean();
    }
}
