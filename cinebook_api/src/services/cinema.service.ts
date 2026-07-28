import { CinemaRepository } from "../repositories/cinema.repository";

const cinemaRepo = new CinemaRepository();

export class CinemaService {
    async listCinemas() {
        return cinemaRepo.find({}, { sort: { createdAt: -1 } });
    }

    async createCinema(payload: any) {
        return cinemaRepo.create(payload);
    }

    async updateCinema(id: string, payload: any) {
        return cinemaRepo.update(id, payload);
    }

    async deleteCinema(id: string, deletedBy: string) {
        return cinemaRepo.softDelete(id, deletedBy);
    }
}

export const cinemaService = new CinemaService();
