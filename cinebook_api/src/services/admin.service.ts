import mongoose from "mongoose";
import { UserMongoRepository } from "../repositories/user.repository";
import { BookingModel } from "../models/booking.model";
import { MovieModel } from "../models/movie.model";
import { CinemaModel } from "../models/cinema.model";
import { ShowtimeModel } from "../models/showtime.model";
import { HallModel } from "../models/hall.model";
import { IUser } from "../models/user.model";

const userRepo = new UserMongoRepository();

export class AdminService {
    async dashboardSummary(cinemaId?: string) {
        const match: any = { isDeleted: { $ne: true } };
        if (cinemaId) {
            match.cinemaId = new mongoose.Types.ObjectId(cinemaId);
        }

        const totalBookings = await BookingModel.countDocuments(match);
        const totalMovies = await MovieModel.countDocuments({ isDeleted: { $ne: true } });
        const totalCinemas = await CinemaModel.countDocuments({ isDeleted: { $ne: true } });
        const totalShowtimes = await ShowtimeModel.countDocuments({ isDeleted: { $ne: true } });

        const revenueAgg = await BookingModel.aggregate([
            { $match: { paymentStatus: "paid", isDeleted: { $ne: true } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        const revenue = (revenueAgg[0] && revenueAgg[0].total) || 0;

        return { totalBookings, totalMovies, totalCinemas, totalShowtimes, revenue };
    }

    async listUsers() {
        const users = await userRepo.getAll();
        return users.filter((u) => u.role === "user");
    }

    async listAllBookings(params?: { cinemaId?: string; movieId?: string; userId?: string }) {
        const query: any = { isDeleted: { $ne: true } };
        if (params?.cinemaId) query.cinemaId = new mongoose.Types.ObjectId(params.cinemaId);
        if (params?.movieId) query.movieId = new mongoose.Types.ObjectId(params.movieId);
        if (params?.userId) query.userId = new mongoose.Types.ObjectId(params.userId);

        return BookingModel.find(query)
            .populate("userId", "name email username")
            .populate("movieId", "title slug")
            .populate("cinemaId", "name")
            .populate("showtimeId", "showDate startTime endTime")
            .sort({ createdAt: -1 })
            .lean();
    }

    async getUserDetails(userId: string) {
        const user = await userRepo.getUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const bookings = await BookingModel.find({ userId, isDeleted: { $ne: true } })
            .populate("movieId", "title slug language duration genres")
            .populate("cinemaId", "name")
            .populate("showtimeId", "startTime endTime hallId")
            .sort({ createdAt: -1 });

        const paidBookings = bookings.filter((b) => b.paymentStatus === "paid");

        const movieStats = paidBookings.reduce<
            Array<{
                movieId: string;
                title: string;
                slug: string;
                genres: string[];
                timesWatched: number;
                totalSpent: number;
                lastWatched: Date;
            }>
        >((acc, booking) => {
            const existing = acc.find((m) => m.movieId === String(booking.movieId));
            const amount = booking.totalAmount;
            if (existing) {
                existing.timesWatched += 1;
                existing.totalSpent += amount;
                if (new Date(booking.createdAt) > new Date(existing.lastWatched)) {
                    existing.lastWatched = booking.createdAt;
                }
            } else {
                acc.push({
                    movieId: String(booking.movieId),
                    title: (booking.movieId as any).title || "Unknown",
                    slug: (booking.movieId as any).slug || "",
                    genres: (booking.movieId as any).genres || [],
                    timesWatched: 1,
                    totalSpent: amount,
                    lastWatched: booking.createdAt,
                });
            }
            return acc;
        }, []);

        const totalMoviesWatched = movieStats.length;
        const totalTickets = paidBookings.length;
        const totalSpent = paidBookings.reduce((sum, b) => sum + b.totalAmount, 0);

        return {
            user: {
                _id: String(user._id),
                name: user.name,
                email: user.email,
                username: user.username,
                phoneNumber: user.phoneNumber,
                role: user.role,
                isActive: user.isActive,
                isVerified: user.isVerified,
                profilePicture: user.profilePicture,
                createdAt: user.createdAt,
            },
            stats: {
                totalMoviesWatched,
                totalTickets,
                totalSpent,
            },
            movieStats,
            bookings: bookings
                .filter((b) => b.paymentStatus === "paid")
                .map((b) => ({
                    _id: String(b._id),
                    movieTitle: (b.movieId as any).title || "Unknown",
                    movieSlug: (b.movieId as any).slug || "",
                    cinemaName: (b.cinemaId as any).name || "Unknown",
                    totalAmount: b.totalAmount,
                    seatCount: b.seatCount,
                    seats: b.seats,
                    bookingStatus: b.bookingStatus,
                    paymentStatus: b.paymentStatus,
                    bookingCode: b.bookingCode,
                    createdAt: b.createdAt,
                    showtimeStartTime: (b.showtimeId as any)?.startTime,
                })),
        };
    }

    async listBookings(filters: { cinemaId?: string; movieId?: string; userId?: string } = {}) {
        const query: Record<string, unknown> = {};
        if (filters.cinemaId) query.cinemaId = filters.cinemaId;
        if (filters.movieId) query.movieId = filters.movieId;
        if (filters.userId) query.userId = filters.userId;

        const bookings = await BookingModel.find(query)
            .populate("userId", "name email username")
            .populate("movieId", "title slug")
            .populate("cinemaId", "name")
            .populate("showtimeId", "showDate startTime endTime hallId")
            .sort({ createdAt: -1 })
            .lean();

        return bookings.map((b: any) => ({
            _id: String(b._id),
            user: {
                _id: String(b.userId?._id),
                name: b.userId?.name || b.userId?.username || "Unknown",
                email: b.userId?.email || "",
            },
            movieTitle: b.movieId?.title || "Unknown",
            movieSlug: b.movieId?.slug || "",
            cinemaName: b.cinemaId?.name || "Unknown",
            showtime: {
                showDate: b.showtimeId?.showDate,
                startTime: b.showtimeId?.startTime || "",
                endTime: b.showtimeId?.endTime || "",
            },
            seats: b.seats || [],
            seatCount: b.seatCount,
            totalAmount: b.totalAmount,
            bookingStatus: b.bookingStatus,
            paymentStatus: b.paymentStatus,
            bookingCode: b.bookingCode,
            createdAt: b.createdAt,
        }));
    }

    async updateUser(userId: string, payload: Partial<IUser>) {
        const updated = await userRepo.update(userId, payload);
        if (!updated) {
            throw new Error("User not found");
        }
        return {
            _id: String(updated._id),
            name: updated.name,
            email: updated.email,
            username: updated.username,
            phoneNumber: updated.phoneNumber,
            role: updated.role,
            isActive: updated.isActive,
            isVerified: updated.isVerified,
            profilePicture: updated.profilePicture,
        };
    }

    async deleteUser(userId: string) {
        await userRepo.update(userId, { isActive: false, updatedAt: new Date() });
    }

    async listShowtimes(params?: { cinemaId?: string; movieId?: string; hallId?: string }) {
        const query: any = { isDeleted: { $ne: true } };
        if (params?.cinemaId) query.cinemaId = new mongoose.Types.ObjectId(params.cinemaId);
        if (params?.movieId) query.movieId = new mongoose.Types.ObjectId(params.movieId);
        if (params?.hallId) query.hallId = new mongoose.Types.ObjectId(params.hallId);

        return ShowtimeModel.find(query)
            .populate("movieId", "title slug")
            .populate("cinemaId", "name")
            .populate("hallId", "name")
            .sort({ showDate: 1, startTime: 1 })
            .lean();
    }

    async getShowtime(id: string) {
        const showtime = await ShowtimeModel.findOne({ _id: id, isDeleted: { $ne: true } }).lean();
        if (!showtime) throw new Error("Showtime not found");
        return showtime;
    }

    async updateShowtime(id: string, payload: any) {
        const showtime = await ShowtimeModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            payload,
            { new: true }
        ).lean();
        if (!showtime) throw new Error("Showtime not found");
        return showtime;
    }

    async deleteShowtime(id: string) {
        const showtime = await ShowtimeModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        ).lean();
        if (!showtime) throw new Error("Showtime not found");
        return showtime;
    }

    async listHalls(params?: { cinemaId?: string; name?: string }) {
        const query: any = { isDeleted: { $ne: true } };
        if (params?.cinemaId) query.cinemaId = new mongoose.Types.ObjectId(params.cinemaId);
        if (params?.name) query.name = { $regex: params.name, $options: "i" };

        return HallModel.find(query).sort({ createdAt: -1 }).lean();
    }

    async getHall(id: string) {
        const hall = await HallModel.findOne({ _id: id, isDeleted: { $ne: true } }).lean();
        if (!hall) throw new Error("Hall not found");
        return hall;
    }

    async updateHall(id: string, payload: any) {
        const hall = await HallModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            payload,
            { new: true }
        ).lean();
        if (!hall) throw new Error("Hall not found");
        return hall;
    }

    async deleteHall(id: string) {
        const hall = await HallModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        ).lean();
        if (!hall) throw new Error("Hall not found");
        return hall;
    }
}

export const adminService = new AdminService();
