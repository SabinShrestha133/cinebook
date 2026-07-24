import mongoose, { Schema, Document } from "mongoose";

export interface IHallRow extends Document {
    hallId: mongoose.Types.ObjectId;
    rowLabel: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const HallRowSchema: Schema = new Schema<IHallRow>(
    {
        hallId: { type: Schema.Types.ObjectId, ref: "Hall", required: true },
        rowLabel: { type: String, required: true },
        order: { type: Number, required: true },
    },
    { timestamps: true }
);

HallRowSchema.index({ hallId: 1, rowLabel: 1 }, { unique: true });
HallRowSchema.index({ hallId: 1, order: 1 }, { unique: true });

export const HallRowModel = mongoose.model<IHallRow>("HallRow", HallRowSchema);
