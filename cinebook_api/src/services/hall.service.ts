import mongoose from "mongoose";
import { HallRepository } from "../repositories/hall.repository";
import { HallRowRepository } from "../repositories/hall-row.repository";
import { SeatRepository } from "../repositories/seat.repository";
import { ShowtimeModel } from "../models/showtime.model";
import { HttpException } from "../exceptions/http-exception";

const hallRepo = new HallRepository();
const hallRowRepo = new HallRowRepository();
const seatRepo = new SeatRepository();

function getRowLabel(rowIndex: number): string {
    let label = "";
    let i = rowIndex;
    while (i >= 0) {
        label = String.fromCharCode(65 + (i % 26)) + label;
        i = Math.floor(i / 26) - 1;
    }
    return label;
}

export class HallService {
    async createHall(payload: { name: string; cinemaId: string; totalRows: number; seatsPerRow: number; aisles?: number[] }) {
        if (!mongoose.Types.ObjectId.isValid(payload.cinemaId)) {
            throw new Error("Invalid Cinema ID");
        }
        const hall = await hallRepo.create({
            name: payload.name,
            cinemaId: new mongoose.Types.ObjectId(payload.cinemaId),
            totalRows: payload.totalRows,
            seatsPerRow: payload.seatsPerRow,
            aisles: payload.aisles || [],
        });
        return hall;
    }

    async getHall(id: string) {
        const hall = await hallRepo.findById(id);
        if (!hall) throw new HttpException(404, "Hall not found");
        return hall;
    }

    async listHalls(query: any = {}, options: any = {}) {
        const filter: any = {};
        if (query?.name) {
            filter.name = { $regex: query.name, $options: "i" };
        }
        const data = await hallRepo.find(filter, options);
        const total = await hallRepo.find(filter, { ...options, count: true });
        return { data, total: (total as any).length || 0 };
    }

    async updateHall(id: string, data: any) {
        const hall = await hallRepo.update(id, data);
        if (!hall) throw new HttpException(404, "Hall not found");
        return hall;
    }

    async deleteHall(id: string) {
        const hall = await hallRepo.findById(id);
        if (!hall) throw new HttpException(404, "Hall not found");

        const activeShowtimes = await ShowtimeModel.findOne({
            hallId: new mongoose.Types.ObjectId(id),
            status: "active",
        }).lean();

        if (activeShowtimes) {
            throw new HttpException(400, "Cannot delete hall with active showtimes");
        }

        await seatRepo.deleteByHallId(id);
        await hallRowRepo.deleteByHallId(id);
        await hallRepo.delete(id);
    }

    async generateHallLayout(hallId: string) {
        if (!mongoose.Types.ObjectId.isValid(hallId)) {
            throw new Error("Invalid Hall ID");
        }
        const hall = await hallRepo.findById(hallId);
        if (!hall) throw new HttpException(404, "Hall not found");

        const totalRows = hall.totalRows;
        const seatsPerRow = hall.seatsPerRow;
        const aisles = ((hall.aisles as number[]) || [])
            .filter((a) => a > 0 && a < seatsPerRow)
            .sort((a, b) => a - b);

        await hallRowRepo.deleteByHallId(hallId);
        await seatRepo.deleteByHallId(hallId);

        const rowDocs: any[] = [];
        for (let i = 0; i < totalRows; i++) {
            rowDocs.push({
                hallId: new mongoose.Types.ObjectId(hallId),
                rowLabel: getRowLabel(i),
                order: i,
            });
        }

        for (const row of rowDocs) {
            await hallRowRepo.create(row);
        }

        const createdRows = await hallRowRepo.findByHallId(hallId);
        const rowIdMap = new Map(createdRows.map((r) => [r.rowLabel, String(r._id)]));

        const seatDocs: any[] = [];
        for (let rowIdx = 0; rowIdx < totalRows; rowIdx++) {
            const rowLabel = getRowLabel(rowIdx);
            const rowId = rowIdMap.get(rowLabel);
            if (!rowId) continue;
            for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
                seatDocs.push({
                    hallId: new mongoose.Types.ObjectId(hallId),
                    rowId: new mongoose.Types.ObjectId(rowId),
                    rowLabel,
                    seatNumber: seatNum,
                    seatLabel: `${rowLabel}${seatNum}`,
                    positionIndex: rowIdx * seatsPerRow + (seatNum - 1),
                    seatType: "regular",
                    status: "active",
                });
            }
        }

        await seatRepo.bulkCreate(seatDocs);

        const populatedHall = await hallRepo.findById(hallId);
        return populatedHall;
    }
}

export const hallService = new HallService();
