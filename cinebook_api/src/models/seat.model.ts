import mongoose, { Schema, Document } from "mongoose";

export interface ISeat extends Document {
    hallId: mongoose.Types.ObjectId;
    rowId: mongoose.Types.ObjectId;
    rowLabel: string;
    seatNumber: number;
    seatLabel: string;
    seatType: "regular" | "premium" | "vip";
    status: "active" | "disabled" | "hidden" | "missing";
    positionIndex: number;
    isDeleted: boolean;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const SeatSchema: Schema = new Schema<ISeat>(
    {
        hallId: { type: Schema.Types.ObjectId, ref: "Hall", required: true },
        rowId: { type: Schema.Types.ObjectId, ref: "HallRow", required: true },
        rowLabel: { type: String, required: true },
        seatNumber: { type: Number, required: true },
        seatLabel: { type: String, required: true },
        seatType: { type: String, enum: ["regular", "premium", "vip"], default: "regular" },
        status: { type: String, enum: ["active", "disabled", "hidden", "missing"], default: "active" },
        positionIndex: { type: Number, required: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
        deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

SeatSchema.index({ hallId: 1, rowLabel: 1, seatNumber: 1 }, { unique: true });
SeatSchema.index({ hallId: 1, seatLabel: 1 }, { unique: true });
SeatSchema.index({ hallId: 1, positionIndex: 1 }, { unique: true });

export const SeatModel = mongoose.model<ISeat>("Seat", SeatSchema);
