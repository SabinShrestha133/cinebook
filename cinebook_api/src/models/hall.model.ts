import mongoose, { Schema, Document } from "mongoose";

export interface IHall extends Document {
    cinemaId: mongoose.Types.ObjectId;
    name: string;
    totalRows: number;
    seatsPerRow: number;
    aisles: number[];
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
    },
    { timestamps: true }
);

export const HallModel = mongoose.model<IHall>("Hall", HallSchema);
