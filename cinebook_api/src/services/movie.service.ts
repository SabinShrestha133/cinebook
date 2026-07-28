import { MovieRepository } from "../repositories/movie.repository";

const movieRepo = new MovieRepository();

export class MovieService {
    async createMovie(payload: any) {
        if (!payload.slug && payload.title) {
            payload.slug = payload.title.toLowerCase().replace(/\s+/g, "-");
        }
        return movieRepo.create(payload);
    }

    async getMovie(id: string) {
        return movieRepo.findById(id);
    }

    async list(query = {}, options = {}) {
        return movieRepo.find(query, options);
    }

    async update(id: string, payload: any) {
        return movieRepo.update(id, payload);
    }

    async delete(id: string, deletedBy: string) {
        return movieRepo.softDelete(id, deletedBy);
    }
}

export const movieService = new MovieService();
