import { MovieRepository } from "../repositories/movie.repository";

const movieRepo = new MovieRepository();

export class MovieService {
    async createMovie(payload: any) {
        // slug generation could be improved
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

    async delete(id: string) {
        return movieRepo.delete(id);
    }
}

export const movieService = new MovieService();
