import { CinemaModel, ICinema } from "../models/cinema.model";

export class CinemaRepository {
    async find(query = {}, options = {}) {
        return CinemaModel.find(query, null, options).lean();
    }

    async findById(id: string) {
        return CinemaModel.findById(id).lean();
    }
}
