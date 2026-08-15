import { Request, Response } from "express";
import { movieService } from "../services/movie.service";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { uploadToCloudinary } from "../utils/cloudinary.util";
import { updateMovieSchema } from "../validators/movie.validator";

export class MovieController {
    async create(req: Request, res: Response) {
        try {
            if (req.file && req.file.path) {
                const url = await uploadToCloudinary(req.file.path, 'movies');
                req.body.posterUrl = url;
            }
            const movie = await movieService.createMovie(req.body);
            return ApiResponseHelper.success(res, movie, "Movie created", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error creating movie", 500);
        }
    }

    async get(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const movie = await movieService.getMovie(id);
            if (!movie) return ApiResponseHelper.error(res, "Not found", 404);
            return ApiResponseHelper.success(res, movie, "Movie fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching movie", 500);
        }
    }

    async list(req: Request, res: Response) {
        try {
            const movies = await movieService.list();
            return ApiResponseHelper.success(res, movies, "Movies fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error listing movies", 500);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const movie = await movieService.update(id, req.body);
            const parsed = updateMovieSchema.parse(req.body);
            const movie = await movieService.update(id, parsed);
            if (!movie) return ApiResponseHelper.error(res, "Not found", 404);
            return ApiResponseHelper.success(res, movie, "Movie updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error updating movie", 500);
        }
    }
}

export const movieController = new MovieController();
