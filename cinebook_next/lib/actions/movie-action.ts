import { browseMovies, type Movie } from "@/lib/api/movie";

export const fetchMovies = async (): Promise<Movie[]> => {
    try {
        return await browseMovies();
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unable to load movies");
    }
};
