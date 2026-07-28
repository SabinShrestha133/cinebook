import { ShowtimeRepository } from "../repositories/showtime.repository";
import { dayDiscountService } from "./day-discount.service";
import { calculateEffectivePrice } from "../utils/pricing.util";
import mongoose from "mongoose";

const showtimeRepo = new ShowtimeRepository();

export class ShowtimeService {
    async createShowtime(payload: any) {
        return showtimeRepo.create(payload);
    }

    async getShowtime(id: string) {
        const st = await showtimeRepo.findById(id);
        if (!st) return null;
        const discounts = await dayDiscountService.getEffectiveDiscountsForShowtime(st.showDate, {
            discountType: st.discountType,
            discountValue: st.discountValue,
        });
        return {
            ...st,
            effectivePrice: calculateEffectivePrice(st.ticketPrice, discounts),
        };
    }

    async list(query = {}, options = {}) {
        const showtimes = await showtimeRepo.find(query, options);
        const activeDiscounts = await dayDiscountService.getAllActive();
        return showtimes.map((st) => {
            const discounts = [];
            const dayOfWeek = new Date(st.showDate).getDay();
            const global = activeDiscounts.find((d) => d.dayOfWeek === dayOfWeek);
            if (global) {
                discounts.push({ discountType: global.discountType, discountValue: global.discountValue });
            }
            if (st.discountType && st.discountType !== "none") {
                discounts.push({ discountType: st.discountType, discountValue: st.discountValue });
            }
            return {
                ...st,
                effectivePrice: calculateEffectivePrice(st.ticketPrice, discounts),
            };
        });
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

    async updateShowtime(id: string, payload: any) {
        return showtimeRepo.update(id, payload);
    }

    async softDelete(id: string, deletedBy: string) {
        return showtimeRepo.softDelete(id, deletedBy);
    }
}

export const showtimeService = new ShowtimeService();
