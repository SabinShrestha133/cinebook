import { CinemaRepository } from "../repositories/cinema.repository";

const cinemaRepo = new CinemaRepository();

export class CinemaService {
    async listCinemas() {
        return cinemaRepo.find({}, { sort: { createdAt: -1 } });
    }
}

export const cinemaService = new CinemaService();
