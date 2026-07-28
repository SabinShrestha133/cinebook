import { z } from "zod";

export const createCinemaSchema = z.object({
    name: z.string().min(1, "Cinema name is required"),
    address: z.string().optional(),
    city: z.string().optional(),
    description: z.string().optional(),
    contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    contactPhone: z.string().optional(),
    isActive: z.boolean().optional(),
});

export const updateCinemaSchema = z.object({
    name: z.string().min(1).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    description: z.string().optional(),
    contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    contactPhone: z.string().optional(),
    isActive: z.boolean().optional(),
});
