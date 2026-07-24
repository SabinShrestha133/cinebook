// API response example
const res = {
    "status": 200,
    "success": true,
    "message": "Products fetched successfully",
    "data": [],
    "meta": {
        // pagination
        "page": 1,
        "limit": 10,
        "total": 100
    }
}
import { Response } from "express";
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
}

export interface ApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T;
    meta?: PaginationMeta;
    pagination?: PaginationMeta;
    errors?: string[];
}

export class ApiResponseHelper {
    static success<T>(
        res: Response,
        data: T,
        message: string = "Success",
        status: number = 200,
        pagination?: PaginationMeta
    ): Response {
        const response: ApiResponse<T> = {
            status,
            success: true,
            message,
            data,
            ...(pagination && { pagination, meta: pagination }),
        };
        return res.status(status).json(response);
    }

    static error(
        res: Response,
        message: string = "Error",
        status: number = 500,
        errors?: string[]
    ): Response {
        const response: ApiResponse<null> = {
            status,
            success: false,
            message,
            data: null,
            ...(errors && { errors }),
        };
        return res.status(status).json(response);
    }
}
