import { DayDiscountRepository } from "../repositories/day-discount.repository";
import { calculateEffectivePrice, type Discount } from "../utils/pricing.util";

const dayDiscountRepo = new DayDiscountRepository();

export class DayDiscountService {
    async createDayDiscount(payload: any) {
        return dayDiscountRepo.create(payload);
    }

    async getDayDiscount(id: string) {
        return dayDiscountRepo.findById(id);
    }

    async listDayDiscounts(query = {}, options = {}) {
        return dayDiscountRepo.find(query, options);
    }

    async updateDayDiscount(id: string, payload: any) {
        return dayDiscountRepo.update(id, payload);
    }

    async deleteDayDiscount(id: string, deletedBy: string) {
        return dayDiscountRepo.softDelete(id, deletedBy);
    }

    async getActiveForDay(dayOfWeek: number) {
        return dayDiscountRepo.findActiveForDay(dayOfWeek);
    }

    async getAllActive() {
        return dayDiscountRepo.findAllActive();
    }

    async getEffectiveDiscountsForShowtime(showDate: Date, showtimeDiscount?: { discountType: string; discountValue: number }) {
        const dayOfWeek = new Date(showDate).getDay();
        const globalDiscount = await dayDiscountRepo.findActiveForDay(dayOfWeek);
        
        const discounts: Discount[] = [];
        if (globalDiscount) {
            discounts.push({
                discountType: globalDiscount.discountType,
                discountValue: globalDiscount.discountValue,
            });
        }
        if (showtimeDiscount && showtimeDiscount.discountType && showtimeDiscount.discountType !== "none") {
            discounts.push({
                discountType: showtimeDiscount.discountType as Discount["discountType"],
                discountValue: showtimeDiscount.discountValue,
            });
        }
        return discounts;
    }
}

export const dayDiscountService = new DayDiscountService();
