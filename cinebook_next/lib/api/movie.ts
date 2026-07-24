import axios from "axios";
import publicAxios from "./public-axios";
import { API } from "./endpoints";

export interface Movie {
    _id: string;
    title: string;
    slug?: string;
    description?: string;
    genres?: string[];
    language?: string;
    duration?: number;
    releaseDate?: string;
    rating?: number;
    posterUrl?: string;
    bannerUrl?: string;
    status?: "now_showing" | "upcoming" | "archived";
    featured?: boolean;
}

export const browseMovies = async (): Promise<Movie[]> => {
    try {
        const response = await publicAxios.get(API.MOVIE.BROWSE);
        return response.data?.data ?? [];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to load movies");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to load movies");
        }
        throw new Error("Failed to load movies");
    }
};

export const fetchMovieById = async (id: string): Promise<Movie | null> => {
    try {
        const response = await publicAxios.get(API.MOVIE.DETAIL(id));
        return response.data?.data ?? null;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to load movie details");
        }
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to load movie details");
        }
        throw new Error("Failed to load movie details");
    }
};
