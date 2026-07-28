import mongoose, { Schema, Document } from "mongoose";

export interface IDayDiscount extends Document {
    dayOfWeek: number;
    discountType: "percentage" | "fixed";
    discountValue: number;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const DayDiscountSchema: Schema = new Schema<IDayDiscount>(
    {
        dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
        discountType: { type: String, enum: ["percentage", "fixed"], required: true },
        discountValue: { type: Number, required: true, min: 0 },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
        deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

DayDiscountSchema.index({ dayOfWeek: 1, isDeleted: 1 });

export const DayDiscountModel = mongoose.model<IDayDiscount>("DayDiscount", DayDiscountSchema);
