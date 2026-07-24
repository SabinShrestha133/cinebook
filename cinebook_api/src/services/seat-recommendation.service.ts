import mongoose from "mongoose";
import { ShowtimeModel } from "../models/showtime.model";
import { SeatModel } from "../models/seat.model";
import { HallModel } from "../models/hall.model";

export interface RecommendedSeat {
    seatId: string;
    label: string;
    rowLabel: string;
    seatNumber: number;
    seatType: string;
}

export interface SeatRecommendation {
    seats: RecommendedSeat[];
    reason: string;
    score: number;
}

export class SeatRecommendationService {
    async recommend(showtimeId: string, count: number): Promise<SeatRecommendation[]> {
        if (count < 1) count = 1;
        if (count > 8) count = 8;

        const showtime = await ShowtimeModel.findById(showtimeId).lean();
        if (!showtime) return [];

        const hall = await HallModel.findById(showtime.hallId).lean();
        if (!hall) return [];

        const bookedSeatIds = new Set((showtime.bookedSeats as string[]) ?? []);
        for (const reservation of (showtime.reservations as any[]) ?? []) {
            if (reservation?.seatId) {
                bookedSeatIds.add(reservation.seatId);
            }
        }

        const bookedObjectIds = Array.from(bookedSeatIds)
            .filter((id) => mongoose.Types.ObjectId.isValid(id))
            .map((id) => new mongoose.Types.ObjectId(id));

        const seats = await SeatModel.find({
            hallId: showtime.hallId,
            status: "active",
            _id: { $nin: bookedObjectIds },
        }).sort({ positionIndex: 1 }).lean();

        const rows = new Map<string, typeof seats>();
        for (const seat of seats) {
            const row = seat.rowLabel;
            if (!rows.has(row)) rows.set(row, []);
            rows.get(row)!.push(seat);
        }

        const aisleSet = new Set((hall.aisles ?? []).map((a) => Number(a)));
        const totalRows = hall.totalRows || rows.size;
        const rowLabels = Array.from(rows.keys()).sort((a, b) => a.localeCompare(b));
        const centerRowIndex = rowLabels.length > 0 ? (rowLabels.length - 1) / 2 : 0;

        const candidates: SeatRecommendation[] = [];

        for (const [rowLabel, rowSeats] of rows) {
            const sorted = [...rowSeats].sort((a, b) => a.seatNumber - b.seatNumber);
            const rowIndex = rowLabels.indexOf(rowLabel);

            let blockStart = 0;
            while (blockStart < sorted.length) {
                let blockEnd = blockStart;
                while (
                    blockEnd + 1 < sorted.length &&
                    sorted[blockEnd + 1].seatNumber === sorted[blockEnd].seatNumber + 1
                ) {
                    blockEnd++;
                }

                const block = sorted.slice(blockStart, blockEnd + 1);
                if (block.length >= count) {
                    const selected = block.slice(0, count);

                    const rowDist = Math.abs(rowIndex - centerRowIndex) / Math.max(totalRows - 1, 1);
                    const rowScore = 1 - rowDist;

                    const minSeat = block[0].seatNumber;
                    const maxSeat = block[block.length - 1].seatNumber;
                    const blockCenter = (minSeat + maxSeat) / 2;
                    const rowCenter = (sorted[0].seatNumber + sorted[sorted.length - 1].seatNumber) / 2;
                    const seatSpan = sorted[sorted.length - 1].seatNumber - sorted[0].seatNumber || 1;
                    const seatDist = 1 - Math.abs(blockCenter - rowCenter) / (seatSpan / 2);

                    const hasAisle = selected.some((s) => aisleSet.has(s.seatNumber));

                    const typeScoreMap: Record<string, number> = { regular: 0, premium: 0.15, vip: 0.3 };
                    const bestTypeScore = Math.max(...selected.map((s) => typeScoreMap[s.seatType] ?? 0));

                    let score = rowScore * 0.4 + seatDist * 0.4 + bestTypeScore + (hasAisle ? 0.1 : 0);
                    score = Math.min(1, Math.max(0, score));

                    const reasons: string[] = [];
                    if (rowScore > 0.7) reasons.push("great viewing row");
                    else if (rowScore > 0.4) reasons.push("comfortable viewing row");
                    if (seatDist > 0.8) reasons.push("well-centered");
                    if (hasAisle) reasons.push("aisle access");
                    if (bestTypeScore >= 0.3) reasons.push("premium seats");
                    else if (bestTypeScore >= 0.15) reasons.push("upgraded seats");
                    const reason = reasons.length > 0 ? reasons.join(" + ") : "available block";

                    candidates.push({
                        seats: selected.map((s) => ({
                            seatId: s._id.toString(),
                            label: s.seatLabel,
                            rowLabel: s.rowLabel,
                            seatNumber: s.seatNumber,
                            seatType: s.seatType,
                        })),
                        reason,
                        score: Math.round(score * 100),
                    });
                }

                blockStart = blockEnd + 1;
            }
        }

        candidates.sort((a, b) => b.score - a.score);
        return candidates.slice(0, 5);
    }
}
