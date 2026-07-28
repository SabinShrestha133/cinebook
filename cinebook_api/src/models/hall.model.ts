import mongoose, { Schema, Document } from "mongoose";

export interface IHall extends Document {
    cinemaId: mongoose.Types.ObjectId;
    name: string;
    totalRows: number;
    seatsPerRow: number;
    aisles: number[];
    isDeleted: boolean;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const HallSchema: Schema = new Schema<IHall>(
    {
        cinemaId: { type: Schema.Types.ObjectId, ref: "Cinema", required: true },
        name: { type: String, required: true },
        totalRows: { type: Number, required: true },
        seatsPerRow: { type: Number, required: true },
        aisles: [{ type: Number }],
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
        deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export const HallModel = mongoose.model<IHall>("Hall", HallSchema);
