import { z } from "zod";

export const createCinemaSchema = z.object({
    name: z.string().min(1, "Cinema name is required"),
    address: z.string().optional(),
    city: z.string().optional(),
    description: z.string().optional(),
    contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    contactPhone: z.string().optional(),
    isActive: z.preprocess(
        (v) => v === "true" || v === true,
        z.boolean().optional()
    ),
});

export const updateCinemaSchema = z.object({
    name: z.string().min(1).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    description: z.string().optional(),
    contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    contactPhone: z.string().optional(),
    isActive: z.preprocess(
        (v) => v === "true" || v === true,
        z.boolean().optional()
    ),
});

export type CreateCinemaInput = z.infer<typeof createCinemaSchema>;
export type UpdateCinemaInput = z.infer<typeof updateCinemaSchema>;
