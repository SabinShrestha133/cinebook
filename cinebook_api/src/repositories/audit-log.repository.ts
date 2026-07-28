import { AuditLogModel, IAuditLog } from "../models/audit-log.model";

export class AuditLogRepository {
    async create(data: Partial<IAuditLog>) {
        return AuditLogModel.create(data);
    }

    async findByUser(userId: string, limit = 50) {
        return AuditLogModel.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    }
}
