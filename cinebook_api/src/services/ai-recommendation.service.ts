import axios from "axios";
import { BookingModel } from "../models/booking.model";
import { MovieModel } from "../models/movie.model";
import { GEMINI_API_KEY } from "../configs/constant";
import { BookingStatus } from "../enums/booking.enums";

export interface AiMovieRecommendation {
    movieId: string;
    title: string;
    reason: string;
    matchScore: number;
}

export interface AiRecommendationResult {
    success: boolean;
    recommendations?: AiMovieRecommendation[];
    message?: string;
}

const SYSTEM_INSTRUCTION = `You are a movie recommendation assistant for CineBook, a cinema booking platform.
Given a user's watch history and a list of available movies, recommend the best matches.
Return ONLY valid JSON in this exact format: {"recommendations": [{"movieId": "string", "title": "string", "reason": "string", "matchScore": number}]}.
- matchScore must be 0-100
- reason must be exactly 1 short sentence explaining why this movie fits their taste
- Recommend 3-5 movies from the available candidates only
- Prioritize genre matches, language preference, and similar ratings from their watch history
- Exclude any movie the user has already booked or watched`;

export class AiRecommendationService {
    async getMovieRecommendationsForUser(userId: string): Promise<AiRecommendationResult> {
        if (!GEMINI_API_KEY) {
            return { success: false, message: "AI recommendation is not configured on the server." };
        }

        const [userBookings, allMovies] = await Promise.all([
            BookingModel.find({ userId }).lean(),
            MovieModel.find({}).lean(),
        ]);

        const nowShowing = allMovies.filter((m) => m.status !== "archived");

        if (nowShowing.length === 0) {
            return { success: false, message: "No movies available right now." };
        }

        const watchedMovieIds = new Set(
            userBookings
                .filter((b) => b.bookingStatus === BookingStatus.Confirmed)
                .map((b) => b.movieId.toString())
        );

        const watchedMovies = nowShowing.filter((m) => watchedMovieIds.has(m._id.toString()));
        const availableMovies = nowShowing.filter((m) => !watchedMovieIds.has(m._id.toString()));

        if (availableMovies.length === 0) {
            return { success: false, message: "You have watched all available movies!" };
        }

        const favoriteGenres = watchedMovies.length > 0
            ? [...new Set(watchedMovies.flatMap((m) => m.genres || []))]
            : [];

        const userContext = {
            totalWatched: watchedMovies.length,
            favoriteGenres,
            watchedTitles: watchedMovies.map((m) => m.title),
            languages: [...new Set(watchedMovies.map((m) => m.language).filter(Boolean))],
            avgRating: watchedMovies.length > 0
                ? watchedMovies.reduce((sum, m) => sum + (m.rating || 0), 0) / watchedMovies.length
                : undefined,
        };

        const candidates = availableMovies.slice(0, 20).map((m) => ({
            movieId: m._id.toString(),
            title: m.title,
            genres: m.genres,
            language: m.language,
            rating: m.rating,
        }));

        const userQuery = `I have watched ${userContext.totalWatched} movies. My favorite genres are: ${favoriteGenres.join(", ") || "mixed"}. Recommend 3-5 movies from the candidates that match my taste.`;

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
                {
                    systemInstruction: {
                        parts: [{ text: SYSTEM_INSTRUCTION }],
                    },
                    contents: [
                        {
                            parts: [
                                { text: `User profile: ${JSON.stringify(userContext)}. Available candidates: ${JSON.stringify(candidates)}` },
                                { text: userQuery },
                            ],
                        },
                    ],
                    generationConfig: {
                        responseMimeType: "application/json",
                    },
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;
            if (!data.candidates || data.candidates.length === 0) {
                return { success: false, message: data.message || "No recommendations generated" };
            }

            const text = data.candidates[0]?.content?.parts?.[0]?.text;
            if (!text) {
                return { success: false, message: "Empty response from AI" };
            }

            let parsed: { recommendations?: Array<{ movieId: string; title: string; reason: string; matchScore: number }> };
            try {
                parsed = JSON.parse(text);
            } catch {
                return { success: false, message: "Failed to parse AI response" };
            }

            const recommendations = (parsed.recommendations || [])
                .filter((r) => r.movieId && r.title)
                .map((r) => ({
                    ...r,
                    matchScore: Math.min(100, Math.max(0, r.matchScore || 0)),
                }));

            if (recommendations.length === 0) {
                return { success: false, message: "No valid recommendations returned" };
            }

            return { success: true, recommendations };
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.error?.message || error.message || "AI recommendation failed",
            };
        }
    }
}

export const aiRecommendationService = new AiRecommendationService();
