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

    async reserveSeats(showtimeId: string, seatIds: string[], bookingId: string, expiresAt: Date) {
        return showtimeRepo.reserveSeats(showtimeId, seatIds, bookingId, expiresAt);
    }

    async unreserveSeats(showtimeId: string, bookingId: string) {
        return showtimeRepo.unreserveSeats(showtimeId, bookingId);
    }

    async confirmSeats(showtimeId: string, bookingId: string) {
        return showtimeRepo.confirmSeats(showtimeId, bookingId);
    }

    async releaseExpiredReservations() {
        return showtimeRepo.releaseExpiredReservations();
    }
}

export const showtimeService = new ShowtimeService();
