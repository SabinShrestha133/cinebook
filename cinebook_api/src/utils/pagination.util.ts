import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from "../constants";

export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

export interface PaginationResult {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export function parsePagination(query: {
    page?: string;
    limit?: string;
}): PaginationParams {
    const page = Math.max(1, parseInt(query.page || String(DEFAULT_PAGE), 10) || DEFAULT_PAGE);
    let limit = parseInt(query.limit || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
    limit = Math.min(Math.max(1, limit), MAX_LIMIT);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}

export function buildPagination(
    page: number,
    limit: number,
    total: number
): PaginationResult {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
    };
}
