import { z } from "zod";

export const createMovieSchema = z.object({
    title: z.string().min(1),
    slug: z.string().optional(),
    description: z.string().optional(),
    genres: z.array(z.string()).optional(),
    language: z.string().optional(),
    duration: z.preprocess(
        (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
        z.number().optional()
    ),
    releaseDate: z.string().optional(),
    posterUrl: z.string().optional(),
    featured: z.preprocess(
        (v) =>
            v === "true" || v === true
                ? true
                : v === "false" || v === false
                ? false
                : undefined,
        z.boolean().optional()
    ),
});