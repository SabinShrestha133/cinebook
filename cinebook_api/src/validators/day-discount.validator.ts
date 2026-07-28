import { z } from "zod";

export const createDayDiscountSchema = z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.number().min(0),
    isActive: z.boolean().optional(),
});

export const updateDayDiscountSchema = z.object({
    dayOfWeek: z.number().int().min(0).max(6).optional(),
    discountType: z.enum(["percentage", "fixed"]).optional(),
    discountValue: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
});
