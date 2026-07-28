import { Request, Response } from "express";
import { hallService } from "../services/hall.service";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { createHallSchema, updateHallSchema, generateHallSchema } from "../validators/hall.validator";
import { validateBody } from "../middlewares/validate.middleware";
import mongoose from "mongoose";

function getId(req: Request) {
    const id = String(req.params.id || "");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
    }
    return id;
}

export class HallController {
    async create(req: Request, res: Response) {
        try {
            const hall = await hallService.createHall(req.body);
            return ApiResponseHelper.success(res, hall, "Hall created successfully", 201);
        } catch (err: any) {
            console.error("[HALL CREATE] Error:", err);
            if (err?.name === "CastError") {
                console.error("[HALL CREATE] CastError details:", {
                    path: err.path,
                    value: err.value,
                    kind: err.kind,
                });
            }
            return ApiResponseHelper.error(res, err.message || "Error creating hall", 500);
        }
    }

    async list(req: Request, res: Response) {
        try {
            const page = parseInt((req.query.page as string) || "1", 10);
            const limit = parseInt((req.query.limit as string) || "10", 10);
            const search = req.query.search as string | undefined;

            const { data, total } = await hallService.listHalls(
                search ? { name: search } : {},
                { page, limit }
            );

            return ApiResponseHelper.success(res, data, "Halls fetched", 200, {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            });
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching halls", 500);
        }
    }

    async get(req: Request, res: Response) {
        try {
            const hall = await hallService.getHall(getId(req));
            return ApiResponseHelper.success(res, hall, "Hall fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching hall", 500);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const hall = await hallService.updateHall(getId(req), req.body);
            return ApiResponseHelper.success(res, hall, "Hall updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error updating hall", 500);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = getId(req);
            const deletedBy = req.user?._id;
            if (!deletedBy) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            await hallService.deleteHall(id, deletedBy.toString());
            return ApiResponseHelper.success(res, null, "Hall deleted");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error deleting hall", 500);
        }
    }

    async generate(req: Request, res: Response) {
        try {
            const hall = await hallService.generateHallLayout(getId(req));
            return ApiResponseHelper.success(res, hall, "Hall layout generated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error generating hall layout", 500);
        }
    }
}

export const hallController = new HallController();
