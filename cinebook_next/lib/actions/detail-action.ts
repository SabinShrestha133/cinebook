import { fetchShowtimeById, fetchShowtimesByMovie, Showtime } from "@/lib/api/showtime";
import { fetchMovieById, Movie } from "@/lib/api/movie";

export const loadMovieDetail = async (id: string): Promise<Movie | null> => {
    return await fetchMovieById(id);
};

export const loadShowtimeDetail = async (id: string): Promise<Showtime | null> => {
    return await fetchShowtimeById(id);
};

export const loadShowtimesForMovie = async (movieId: string): Promise<Showtime[]> => {
    return await fetchShowtimesByMovie(movieId);
};
