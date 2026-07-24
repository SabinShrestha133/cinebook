import { MovieModel, IMovie } from "../models/movie.model";

export class MovieRepository {
    async create(data: Partial<IMovie>) {
        return MovieModel.create(data);
    }

    async findById(id: string) {
        return MovieModel.findById(id).lean();
    }

    async find(query = {}, options = {}) {
        return MovieModel.find(query, null, options).lean();
    }

    async update(id: string, data: Partial<IMovie>) {
        return MovieModel.findByIdAndUpdate(id, data, { new: true }).lean();
    }

    async delete(id: string) {
        return MovieModel.findByIdAndDelete(id).lean();
    }
}
