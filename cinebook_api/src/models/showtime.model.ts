import mongoose, { Schema, Document } from "mongoose";

export interface IReservation {
    seatId: string;
    bookingId: mongoose.Types.ObjectId;
    expiresAt: Date;
}

export interface IShowtime extends Document {
    movieId: mongoose.Types.ObjectId;
    cinemaId: mongoose.Types.ObjectId;
    hallId: mongoose.Types.ObjectId;
    showDate: Date;
    startTime: string;
    endTime: string;
    ticketPrice: number;
    bookedSeats: string[]; // array of confirmed seatIds
    reservations: IReservation[]; // temporary holds with expiry
    status: "active" | "cancelled" | "completed";
    createdAt: Date;
    updatedAt: Date;
}

const ReservationSchema: Schema = new Schema<IReservation>({
    seatId: { type: String, required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    expiresAt: { type: Date, required: true, index: true },
});

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
        reservations: { type: [ReservationSchema], default: [] },
        status: { type: String, enum: ["active", "cancelled", "completed"], default: "active" },
    },
    { timestamps: true }
);

export const ShowtimeModel = mongoose.model<IShowtime>("Showtime", ShowtimeSchema);
