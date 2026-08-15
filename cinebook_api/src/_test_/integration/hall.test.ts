import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { CinemaModel } from "../../models/cinema.model";
import { HallModel } from "../../models/hall.model";

describe("Integration: Hall Routes", () => {
    let adminToken: string;
    let cinema: any;
    let hall: any;

    beforeAll(async () => {
        await UserModel.deleteMany({});
        await HallModel.deleteMany({});
        await CinemaModel.deleteMany({});

        await UserModel.create({ name: "Hall Admin", email: "halladmin@example.com", username: "halladmin", password: "password123", phoneNumber: "0987654321", role: "admin" });
        const adminLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: "halladmin@example.com", password: "password123" });
        adminToken = adminLogin.body.data.token;

        cinema = await CinemaModel.create({ name: "Hall Cinema", city: "Hall City" });
    });

    afterAll(async () => {
        await HallModel.deleteMany({});
        await CinemaModel.deleteMany({});
        await UserModel.deleteMany({});
    });

    describe("GET /api/v1/halls", () => {
        test("should return list of halls", async () => {
            await HallModel.create({ cinemaId: cinema._id, name: "Lobby Hall", totalRows: 3, seatsPerRow: 6, aisles: [2] });
            const res = await request(app)
                .get("/api/v1/halls")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe("GET /api/v1/halls/:id", () => {
        test("should return hall by valid ID", async () => {
            hall = await HallModel.create({ cinemaId: cinema._id, name: "Get Hall", totalRows: 4, seatsPerRow: 8, aisles: [3] });
            const res = await request(app)
                .get(`/api/v1/halls/${hall._id}`)
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe("Get Hall");
        });

        test("should return 400 for invalid ID format", async () => {
            const res = await request(app)
                .get("/api/v1/halls/invalid-id")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(400);
        });
    });

    describe("POST /api/v1/halls", () => {
        test("should create hall as admin", async () => {
            const res = await request(app)
                .post("/api/v1/halls")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "New Hall", cinemaId: cinema._id.toString(), totalRows: 5, seatsPerRow: 10, aisles: [3] });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });

        test("should return 400 when required fields are missing", async () => {
            const res = await request(app)
                .post("/api/v1/halls")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Incomplete Hall" });
            expect(res.status).toBe(400);
        });
    });

    describe("PUT /api/v1/halls/:id", () => {
        test("should update hall as admin", async () => {
            const h = await HallModel.create({ cinemaId: cinema._id, name: "Update Hall", totalRows: 4, seatsPerRow: 8, aisles: [3] });
            const res = await request(app)
                .put(`/api/v1/halls/${h._id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Updated Hall Name" });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe("DELETE /api/v1/halls/:id", () => {
        test("should delete hall as admin", async () => {
            const h = await HallModel.create({ cinemaId: cinema._id, name: "Delete Hall", totalRows: 3, seatsPerRow: 6, aisles: [2] });
            const res = await request(app)
                .delete(`/api/v1/halls/${h._id}`)
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});