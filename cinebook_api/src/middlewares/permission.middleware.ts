import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { ROLES, Permission } from "../constants";

export const permission = (...required: Permission[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user as IUser | undefined;
            if (!user) {
                return ApiResponseHelper.error(res, "Unauthorized: no user info", 401);
            }
            if (user.role === ROLES.SUPER_ADMIN) {
                return next();
            }
            const has = required.every((p) => (user.permissions as string[] | undefined)?.includes(p));
            if (!has) {
                return ApiResponseHelper.error(res, "Forbidden: insufficient permissions", 403);
            }
            return next();
        } catch (err: unknown) {
            const error = err as { message?: string };
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                500
            );
        }
    };
};
