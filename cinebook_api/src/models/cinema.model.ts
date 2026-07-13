import mongoose, { Schema, Document } from "mongoose";

export interface ICinema extends Document {
    name: string;
    location?: { lat?: number; lng?: number };
    address?: string;
    city?: string;
    description?: string;
    contactEmail?: string;
    contactPhone?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CinemaSchema: Schema = new Schema<ICinema>(
    {
        name: { type: String, required: true },
        location: { lat: Number, lng: Number },
        address: { type: String },
        city: { type: String },
        description: { type: String },
        contactEmail: { type: String },
        contactPhone: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const CinemaModel = mongoose.model<ICinema>("Cinema", CinemaSchema);
