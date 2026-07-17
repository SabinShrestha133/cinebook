import { z } from "zod";

const Genre = z.enum(["action", "adventure", "comedy", "drama", "fantasy", "horror", "musicals", "mystery", "romance", "science fiction", "sports", "thriller", "Western"]);

export const createMovieSchema = z.object({
    title: z.string().min(1),
    slug: z.string().optional(),
    description: z.string().optional(),
    genres: z.array(Genre).optional(),
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

export const updateMovieSchema = z.object({
    title: z.string().min(1).optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    genres: z.array(Genre).optional(),
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
    status: z.enum(["now_showing", "upcoming", "archived"]).optional(),
});
