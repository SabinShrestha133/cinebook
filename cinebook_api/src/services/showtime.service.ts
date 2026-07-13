import { ShowtimeRepository } from "../repositories/showtime.repository";

const showtimeRepo = new ShowtimeRepository();

export class ShowtimeService {
    async createShowtime(payload: any) {
        return showtimeRepo.create(payload);
    }

    async getShowtime(id: string) {
        return showtimeRepo.findById(id);
    }

    async list(query = {}, options = {}) {
        return showtimeRepo.find(query, options);
    }

    async reserveSeats(showtimeId: string, seatIds: string[]) {
        return showtimeRepo.reserveSeats(showtimeId, seatIds);
    }

    async unreserveSeats(showtimeId: string, seatIds: string[]) {
        return showtimeRepo.unreserveSeats(showtimeId, seatIds);
    }
}

export const showtimeService = new ShowtimeService();
