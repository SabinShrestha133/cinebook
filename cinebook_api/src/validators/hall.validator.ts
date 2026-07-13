import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createHallSchema = z.object({
    name: z.string().min(1, "Hall name is required"),
    cinemaId: objectIdSchema,
    totalRows: z.number().int().positive("Total rows must be a positive integer").max(50, "Maximum 50 rows allowed"),
    seatsPerRow: z.number().int().positive("Seats per row must be a positive integer").max(30, "Maximum 30 seats per row allowed"),
    aisles: z.array(z.number().int().positive()).optional(),
});

export const updateHallSchema = z.object({
    name: z.string().min(1).optional(),
    cinemaId: objectIdSchema.optional(),
    totalRows: z.number().int().positive().max(50).optional(),
    seatsPerRow: z.number().int().positive().max(30).optional(),
    aisles: z.array(z.number().int().positive()).optional(),
});

export const generateHallSchema = z.object({
    hallId: objectIdSchema,
});

export type CreateHallInput = z.infer<typeof createHallSchema>;
export type UpdateHallInput = z.infer<typeof updateHallSchema>;
export type GenerateHallInput = z.infer<typeof generateHallSchema>;
