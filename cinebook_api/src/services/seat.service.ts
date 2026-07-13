import { SeatRepository } from "../repositories/seat.repository";
import { SeatType, SeatStatus } from "../constants";
import { HttpException } from "../exceptions/http-exception";

const seatRepo = new SeatRepository();

export class SeatService {
    async getSeatsByHall(hallId: string) {
        return seatRepo.findByHallId(hallId);
    }

    async getSeatById(id: string) {
        const seat = await seatRepo.findById(id);
        if (!seat) throw new HttpException(404, "Seat not found");
        return seat;
    }

    async updateSeatType(seatId: string, seatType: SeatType) {
        const seat = await seatRepo.update(seatId, { seatType });
        if (!seat) throw new HttpException(404, "Seat not found");
        return seat;
    }

    async updateSeatStatus(seatId: string, status: SeatStatus) {
        const seat = await seatRepo.update(seatId, { status });
        if (!seat) throw new HttpException(404, "Seat not found");
        return seat;
    }

    async bulkUpdateSeats(hallId: string, updates: Array<{ seatId: string; seatType?: SeatType; status?: SeatStatus }>) {
        const validSeatIds = updates.map((u) => u.seatId);
        const existingSeats = await seatRepo.findByHallId(hallId);
        const existingIds = new Set(existingSeats.map((s) => String(s._id)));

        const filteredUpdates = updates.filter((u) => existingIds.has(u.seatId));
        if (filteredUpdates.length === 0) {
            throw new HttpException(400, "No valid seats to update");
        }

        const ops = filteredUpdates.map((u) => ({
            seatId: u.seatId,
            data: {
                ...(u.seatType !== undefined && { seatType: u.seatType }),
                ...(u.status !== undefined && { status: u.status }),
            },
        }));

        await seatRepo.bulkUpdate(hallId, ops);
        return { updatedCount: ops.length };
    }
}

export const seatService = new SeatService();
