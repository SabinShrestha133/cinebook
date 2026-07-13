import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiResponseHelper } from "../utils/apihelper.util";

export const validateBody = (schema: ZodSchema<any>) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
        return ApiResponseHelper.error(res, "Validation failed", 400, errors);
    }
    req.body = result.data;
    return next();
};
