import { BookingModel } from "../models/booking.model";
import { MovieModel } from "../models/movie.model";
import mongoose from "mongoose";

export class RecommendationService {
    // simple hybrid: user's top genres + popular movies
    async getForUser(userId: string, limit = 10) {
        // 1. get user's bookings
        const userBookings = await BookingModel.find({ userId }).lean();
        const movieIds = userBookings.map((b) => b.movieId.toString());

        // 2. fetch movies user booked and collect genres
        const userMovies = await MovieModel.find({ _id: { $in: movieIds } }).lean();
        const genreCounts: Record<string, number> = {};
        userMovies.forEach((m: any) => {
            (m.genres || []).forEach((g: string) => (genreCounts[g] = (genreCounts[g] || 0) + 1));
        });

        const topGenres = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map((x) => x[0]);

        // 3. get popular movies (by bookings count)
        const popularAgg = await BookingModel.aggregate([
            { $group: { _id: "$movieId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 },
        ]);
        const popularMovieIds = popularAgg.map((r) => new mongoose.Types.ObjectId(r._id));

        // 4. query candidates: movies in top genres first, then popular
        const candidates = await MovieModel.find({
            $or: [
                { genres: { $in: topGenres } },
                { _id: { $in: popularMovieIds } },
                { featured: true },
            ],
        })
            .limit(limit)
            .lean();

        return candidates;
    }
}

export const recommendationService = new RecommendationService();
