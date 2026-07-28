import { Request, Response, NextFunction } from "express";
import { auditLogService } from "../services/audit-log.service";
import mongoose from "mongoose";

export const audit = (entity: string, action: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        next();
        res.on("finish", () => {
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                const targetId = typeof req.params.id === "string" ? req.params.id : undefined;
                auditLogService.log({
                    action,
                    userId: new mongoose.Types.ObjectId(req.user._id),
                    targetId,
                    entity,
                    ip: req.ip,
                    userAgent: req.get("user-agent"),
                });
            }
        });
    };
};
