import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "../configs/constant";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { UserMongoRepository } from "../repositories/user.repository";
import { HttpException } from "../exceptions/http-exception";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { Role } from "../constants";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

const userRepository = new UserMongoRepository();

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new HttpException(401, "Unauthorized: invalid JWT");
        }
        const token = authHeader.split(" ")[1];
        if (!token) throw new HttpException(401, "Unauthorized: JWT missing");

        const decodedToken = jwt.verify(token, SECRET_KEY) as { id: string };
        if (!decodedToken?.id) {
            throw new HttpException(401, "Unauthorized: JWT unverified");
        }

        const user = await userRepository.getUserById(decodedToken.id);
        if (!user) throw new HttpException(401, "Unauthorized: user not found");
        if (!user.isActive) throw new HttpException(403, "Account is deactivated");

        req.user = user;
        return next();
    } catch (err: unknown) {
        const error = err as { message?: string; status?: number };
        return ApiResponseHelper.error(
            res,
            error.message || "Internal Server Error",
            error.status || 500
        );
    }
};

/** @deprecated Use authenticate */
export const authorizedMiddleware = authenticate;

export const authorizeRoles =
    (...roles: Role[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new HttpException(401, "Unauthorized: no user info");
            }
            if (!roles.includes(req.user.role as Role)) {
                throw new HttpException(403, "Forbidden: insufficient permissions");
            }
            return next();
        } catch (err: unknown) {
            const error = err as { message?: string; status?: number };
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    };

/** Admin or super_admin */
export const adminMiddleware = authorizeRoles("admin", "super_admin");

/** Super admin only */
export const superAdminMiddleware = authorizeRoles("super_admin");
