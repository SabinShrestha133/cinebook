import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import { ApiResponseHelper } from "../utils/apihelper.util";
import mongoose from "mongoose";

function getValidatedId(req: Request): string {
    const id = String(req.params.id || "");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
    }
    return id;
}

export class AdminController {
    async dashboard(req: Request, res: Response) {
        try {
            const cinemaId = req.query.cinemaId as string | undefined;
            const summary = await adminService.dashboardSummary(cinemaId);
            return ApiResponseHelper.success(res, summary, "Admin dashboard summary");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching dashboard", 500);
        }
    }

    async listUsers(req: Request, res: Response) {
        try {
            const users = await adminService.listUsers();
            return ApiResponseHelper.success(res, users, "Users fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching users", 500);
        }
    }

    async getUserDetails(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const details = await adminService.getUserDetails(id);
            return ApiResponseHelper.success(res, details, "User details fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching user details", 500);
        }
    }

    async listBookings(req: Request, res: Response) {
        try {
            const cinemaId = req.query.cinemaId as string | undefined;
            const movieId = req.query.movieId as string | undefined;
            const userId = req.query.userId as string | undefined;
            const bookings = await adminService.listBookings({ cinemaId, movieId, userId });
            return ApiResponseHelper.success(res, bookings, "Bookings fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching bookings", 500);
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const payload = req.body;
            const updated = await adminService.updateUser(id, payload);
            return ApiResponseHelper.success(res, updated, "User updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error updating user", 500);
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            await adminService.deleteUser(id);
            return ApiResponseHelper.success(res, null, "User deleted", 200);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error deleting user", 500);
        }
    }

    async listAllBookings(req: Request, res: Response) {
        try {
            const cinemaId = req.query.cinemaId as string | undefined;
            const movieId = req.query.movieId as string | undefined;
            const userId = req.query.userId as string | undefined;
            const bookings = await adminService.listAllBookings({ cinemaId, movieId, userId });
            return ApiResponseHelper.success(res, bookings, "Bookings fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching bookings", 500);
        }
    }

    async listShowtimes(req: Request, res: Response) {
        try {
            const cinemaId = req.query.cinemaId as string | undefined;
            const movieId = req.query.movieId as string | undefined;
            const hallId = req.query.hallId as string | undefined;
            const showtimes = await adminService.listShowtimes({ cinemaId, movieId, hallId });
            return ApiResponseHelper.success(res, showtimes, "Showtimes fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching showtimes", 500);
        }
    }

    async getShowtime(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const showtime = await adminService.getShowtime(id);
            return ApiResponseHelper.success(res, showtime, "Showtime fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching showtime", 500);
        }
    }

    async updateShowtime(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const payload = req.body;
            const showtime = await adminService.updateShowtime(id, payload);
            return ApiResponseHelper.success(res, showtime, "Showtime updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error updating showtime", 500);
        }
    }

    async deleteShowtime(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            await adminService.deleteShowtime(id);
            return ApiResponseHelper.success(res, null, "Showtime deleted", 200);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error deleting showtime", 500);
        }
    }

    async listHalls(req: Request, res: Response) {
        try {
            const cinemaId = req.query.cinemaId as string | undefined;
            const name = req.query.name as string | undefined;
            const halls = await adminService.listHalls({ cinemaId, name });
            return ApiResponseHelper.success(res, halls, "Halls fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching halls", 500);
        }
    }

    async getHall(req: Request, res: Response) {
        try {
            const id = getValidatedId(req);
            const hall = await adminService.getHall(id);
            return ApiResponseHelper.success(res, hall, "Hall fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error fetching hall", 400);
        }
    }

    async updateHall(req: Request, res: Response) {
        try {
            const id = getValidatedId(req);
            const payload = req.body;
            const hall = await adminService.updateHall(id, payload);
            return ApiResponseHelper.success(res, hall, "Hall updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error updating hall", 400);
        }
    }

    async deleteHall(req: Request, res: Response) {
        try {
            const id = getValidatedId(req);
            await adminService.deleteHall(id);
            return ApiResponseHelper.success(res, null, "Hall deleted", 200);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Error deleting hall", 400);
        }
    }
}

export const adminController = new AdminController();
