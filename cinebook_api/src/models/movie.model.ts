import mongoose, { Schema, Document } from "mongoose";

export interface IMovie extends Document {
    title: string;
    slug: string;
    description?: string;
    genres: string[];
    language?: string;
    duration?: number;
    releaseDate?: Date;
    rating?: number;
    posterUrl?: string;
    bannerUrl?: string;
    trailerUrl?: string;
    cast?: string[];
    director?: string;
    status: "now_showing" | "upcoming" | "archived";
    featured?: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const MovieSchema: Schema = new Schema<IMovie>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        genres: { type: [String], default: [] },
        language: { type: String },
        duration: { type: Number },
        releaseDate: { type: Date },
        rating: { type: Number },
        posterUrl: { type: String },
        bannerUrl: { type: String },
        trailerUrl: { type: String },
        cast: { type: [String], default: [] },
        director: { type: String },
        status: {
            type: String,
            enum: ["now_showing", "upcoming", "archived"],
            default: "upcoming",
        },
        featured: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
        deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export const MovieModel = mongoose.model<IMovie>("Movie", MovieSchema);
