import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
    action: string;
    userId: mongoose.Types.ObjectId;
    targetId?: string;
    entity: string;
    metadata?: Record<string, any>;
    ip?: string;
    userAgent?: string;
    createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        action: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        targetId: { type: String },
        entity: { type: String, required: true },
        metadata: { type: Schema.Types.Mixed },
        ip: { type: String },
        userAgent: { type: String },
    },
    { timestamps: true }
);

AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ entity: 1, targetId: 1 });

export const AuditLogModel = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
