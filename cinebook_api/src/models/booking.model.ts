import mongoose, { Schema, Document } from "mongoose";
import { BookingStatus, PaymentStatus } from "../enums/booking.enums";

export interface IBookedSeat {
    seatId: string;
    label?: string;
    price: number;
}

export interface IBooking extends Document {
    userId: mongoose.Types.ObjectId;
    movieId: mongoose.Types.ObjectId;
    cinemaId: mongoose.Types.ObjectId;
    hallId: mongoose.Types.ObjectId;
    showtimeId: mongoose.Types.ObjectId;
    seats: IBookedSeat[];
    seatCount: number;
    totalAmount: number;
    bookingStatus: BookingStatus;
    paymentStatus: PaymentStatus;
    bookingCode: string;
    ticketJwt?: string;
    khaltiPidx?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookedSeatSchema: Schema = new Schema<IBookedSeat>({
    seatId: { type: String, required: true },
    label: String,
    price: { type: Number, required: true },
});

const BookingSchema: Schema = new Schema<IBooking>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        movieId: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
        cinemaId: { type: Schema.Types.ObjectId, ref: "Cinema", required: true },
        hallId: { type: Schema.Types.ObjectId, ref: "Hall", required: true },
        showtimeId: { type: Schema.Types.ObjectId, ref: "Showtime", required: true },
        seats: { type: [BookedSeatSchema], required: true },
        seatCount: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        bookingStatus: {
            type: String,
            enum: Object.values(BookingStatus),
            default: BookingStatus.PendingPayment,
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.Pending,
        },
        bookingCode: { type: String, required: true, unique: true },
        ticketJwt: { type: String, required: false },
        khaltiPidx: { type: String, required: false, index: true },
    },
    { timestamps: true }
);

export const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
