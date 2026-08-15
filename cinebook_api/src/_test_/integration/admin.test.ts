import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { BookingModel } from "../../models/booking.model";
import { MovieModel } from "../../models/movie.model";
import { CinemaModel } from "../../models/cinema.model";
import { HallModel } from "../../models/hall.model";
import { ShowtimeModel } from "../../models/showtime.model";

describe("Integration: Admin Routes", () => {
    let adminToken: string;
    let userToken: string;
    let adminId: string;
    let userId: string;
    let cinema: any;

    beforeAll(async () => {
        await UserModel.deleteMany({});
        await BookingModel.deleteMany({});
        await ShowtimeModel.deleteMany({});
        await HallModel.deleteMany({});
        await CinemaModel.deleteMany({});
        await MovieModel.deleteMany({});

        await UserModel.create({ name: "Super Admin", email: "superadmin@example.com", username: "superadmin", password: "password123", phoneNumber: "0987654321", role: "super_admin" });
        const superLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: "superadmin@example.com", password: "password123" });
        adminToken = superLogin.body.data.token;

        await UserModel.create({ name: "Regular User", email: "adminuser@example.com", username: "adminuser", password: "password123", phoneNumber: "1234567890" });
        const userLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: "adminuser@example.com", password: "password123" });
        userToken = userLogin.body.data.token;

        const adminUser = await UserModel.create({ name: "Target Admin", email: "targetadmin@example.com", username: "targetadmin", password: "password123", phoneNumber: "1112223333", role: "admin" });
        adminId = adminUser._id.toString();

        const targetUser = await UserModel.create({ name: "Target User", email: "targetuser@example.com", username: "targetuser", password: "password123", phoneNumber: "4445556666" });
        userId = targetUser._id.toString();

        await MovieModel.create({ title: "Test Movie", slug: "test-movie-admin", genres: ["drama"], status: "now_showing" });
        cinema = await CinemaModel.create({ name: "Test Cinema", city: "Test City" });
        await HallModel.create({ cinemaId: cinema._id, name: "Test Hall", totalRows: 5, seatsPerRow: 8, aisles: [3] });
    });

    afterAll(async () => {
        await BookingModel.deleteMany({});
        await ShowtimeModel.deleteMany({});
        await HallModel.deleteMany({});
        await CinemaModel.deleteMany({});
        await MovieModel.deleteMany({});
        await UserModel.deleteMany({});
    });

    describe("GET /api/v1/admin/dashboard", () => {
        test("should return dashboard summary for admin", async () => {
            const res = await request(app)
                .get("/api/v1/admin/dashboard")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test("should return 403 for non-admin user", async () => {
            const res = await request(app)
                .get("/api/v1/admin/dashboard")
                .set("Authorization", `Bearer ${userToken}`);
            expect(res.status).toBe(403);
        });
    });

    describe("GET /api/v1/admin/users", () => {
        test("should return list of users for admin", async () => {
            const res = await request(app)
                .get("/api/v1/admin/users")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe("GET /api/v1/admin/users/:id", () => {
        test("should return user details by ID for admin", async () => {
            const res = await request(app)
                .get(`/api/v1/admin/users/${userId}`)
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test("should return 400 for invalid ID format", async () => {
            const res = await request(app)
                .get("/api/v1/admin/users/invalid-id")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(400);
        });
    });

    describe("PUT /api/v1/admin/users/:id", () => {
        test("should update user as admin", async () => {
            const user = await UserModel.create({ name: "Update Target", email: "updatetarget@example.com", username: "updatetarget", password: "password123", phoneNumber: "1234567890" });
            const res = await request(app)
                .put(`/api/v1/admin/users/${user._id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Updated Name" });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});