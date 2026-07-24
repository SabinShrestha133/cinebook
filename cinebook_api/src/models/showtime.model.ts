import mongoose, { Schema, Document } from "mongoose";

export interface IShowtime extends Document {
    movieId: mongoose.Types.ObjectId;
    cinemaId: mongoose.Types.ObjectId;
    hallId: mongoose.Types.ObjectId;
    showDate: Date;
    startTime: string;
    endTime: string;
    ticketPrice: number;
    bookedSeats: string[]; // array of seatIds
    status: "active" | "cancelled" | "completed";
    createdAt: Date;
    updatedAt: Date;
}

const ShowtimeSchema: Schema = new Schema<IShowtime>(
    {
        movieId: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
        cinemaId: { type: Schema.Types.ObjectId, ref: "Cinema", required: true },
        hallId: { type: Schema.Types.ObjectId, ref: "Hall", required: true },
        showDate: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String },
        ticketPrice: { type: Number, required: true },
        bookedSeats: { type: [String], default: [] },
        status: { type: String, enum: ["active", "cancelled", "completed"], default: "active" },
    },
    { timestamps: true }
);

export const ShowtimeModel = mongoose.model<IShowtime>("Showtime", ShowtimeSchema);
