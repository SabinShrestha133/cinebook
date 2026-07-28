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
    discountType: "none" | "percentage" | "fixed";
    discountValue: number;
    bookedSeats: string[];
    reservations: IReservation[];
    status: "active" | "cancelled" | "completed";
    isDeleted: boolean;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
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
        discountType: { type: String, enum: ["none", "percentage", "fixed"], default: "none" },
        discountValue: { type: Number, default: 0 },
        bookedSeats: { type: [String], default: [] },
        reservations: { type: [ReservationSchema], default: [] },
        status: { type: String, enum: ["active", "cancelled", "completed"], default: "active" },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
        deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export const ShowtimeModel = mongoose.model<IShowtime>("Showtime", ShowtimeSchema);
