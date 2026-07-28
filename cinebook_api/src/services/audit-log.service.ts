import { AuditLogRepository } from "../repositories/audit-log.repository";
import mongoose from "mongoose";

const auditRepo = new AuditLogRepository();

export interface AuditLogPayload {
    action: string;
    userId: string | mongoose.Types.ObjectId;
    targetId?: string;
    entity: string;
    metadata?: Record<string, any>;
    ip?: string;
    userAgent?: string;
}

export class AuditLogService {
    async log(payload: AuditLogPayload) {
        try {
            await auditRepo.create({
                ...payload,
                userId: typeof payload.userId === "string"
                    ? new mongoose.Types.ObjectId(payload.userId)
                    : payload.userId,
            });
        } catch (err) {
            console.error("Failed to write audit log:", err);
        }
    }
}

export const auditLogService = new AuditLogService();
