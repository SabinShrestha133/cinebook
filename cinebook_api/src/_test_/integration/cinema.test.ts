import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { CinemaModel } from "../../models/cinema.model";

describe("Integration: Cinema Routes", () => {
    let adminToken: string;
    let cinemaId: string;

    beforeAll(async () => {
        await UserModel.deleteMany({});
        await CinemaModel.deleteMany({});

        await UserModel.create({ name: "Cinema Admin", email: "cinemaadmin@example.com", username: "cinemaadmin", password: "password123", phoneNumber: "0987654321", role: "admin" });
        const adminLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: "cinemaadmin@example.com", password: "password123" });
        adminToken = adminLogin.body.data.token;
    });

    afterAll(async () => {
        await CinemaModel.deleteMany({});
        await UserModel.deleteMany({});
    });

    describe("GET /api/v1/cinemas", () => {
        test("should return list of cinemas", async () => {
            await CinemaModel.create({ name: "List Cinema", city: "List City" });
            const res = await request(app).get("/api/v1/cinemas");
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe("POST /api/v1/cinemas", () => {
        test("should create cinema as admin", async () => {
            const res = await request(app)
                .post("/api/v1/cinemas")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Grand Cinema", city: "Metro City", address: "123 Main St" });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            cinemaId = res.body.data._id;
        });

        test("should return 400 when name is missing", async () => {
            const res = await request(app)
                .post("/api/v1/cinemas")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ city: "No Name City" });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should return 401 when not authenticated", async () => {
            const res = await request(app)
                .post("/api/v1/cinemas")
                .send({ name: "No Auth Cinema", city: "No Auth City" });
            expect(res.status).toBe(401);
        });
    });

    describe("PUT /api/v1/cinemas/:id", () => {
        test("should update cinema as admin", async () => {
            const c = await CinemaModel.create({ name: "Update Cinema", city: "Update City" });
            const res = await request(app)
                .put(`/api/v1/cinemas/${c._id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Updated Cinema Name" });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});