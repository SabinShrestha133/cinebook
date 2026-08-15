import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { MovieModel } from "../../models/movie.model";

describe("Integration: Movie Routes", () => {
    let userToken: string;
    let adminToken: string;
    let movie: any;

    beforeAll(async () => {
        await UserModel.deleteMany({});
        await MovieModel.deleteMany({});

        await UserModel.create({ name: "Normal User", email: "movieuser@example.com", username: "movieuser", password: "password123", phoneNumber: "1234567890" });
        const userLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: "movieuser@example.com", password: "password123" });
        userToken = userLogin.body.data.token;

        await UserModel.create({ name: "Admin User", email: "movieadmin@example.com", username: "movieadmin", password: "password123", phoneNumber: "0987654321", role: "admin" });
        const adminLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: "movieadmin@example.com", password: "password123" });
        adminToken = adminLogin.body.data.token;
    });

    afterAll(async () => {
        await MovieModel.deleteMany({});
        await UserModel.deleteMany({});
    });

    describe("GET /api/v1/movies", () => {
        test("should return list of movies", async () => {
            await MovieModel.create({ title: "Public Movie", slug: "public-movie", genres: ["action"], status: "now_showing" });
            const res = await request(app).get("/api/v1/movies");
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe("GET /api/v1/movies/:id", () => {
        test("should return movie by valid ID", async () => {
            movie = await MovieModel.create({ title: "Single Movie", slug: "single-movie", genres: ["comedy"], status: "upcoming" });
            const res = await request(app).get(`/api/v1/movies/${movie._id}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe("Single Movie");
        });

        test("should return 400 for invalid ID format", async () => {
            const res = await request(app).get("/api/v1/movies/invalid-id");
            expect(res.status).toBe(400);
        });

        test("should return 404 for non-existent ID", async () => {
            const res = await request(app).get("/api/v1/movies/000000000000000000000001");
            expect(res.status).toBe(404);
        });
    });

    describe("POST /api/v1/movies", () => {
        test("should create movie as admin with valid data", async () => {
            const res = await request(app)
                .post("/api/v1/movies")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ title: "Admin Movie", slug: "admin-movie", genres: ["drama"], status: "upcoming" });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe("Admin Movie");
        });

        test("should return 403 for non-admin user", async () => {
            const res = await request(app)
                .post("/api/v1/movies")
                .set("Authorization", `Bearer ${userToken}`)
                .send({ title: "User Movie", slug: "user-movie", genres: ["comedy"] });
            expect(res.status).toBe(403);
        });

        test("should return 401 when not authenticated", async () => {
            const res = await request(app)
                .post("/api/v1/movies")
                .send({ title: "No Auth Movie", slug: "noauth-movie", genres: ["action"] });
            expect(res.status).toBe(401);
        });

        test("should return 400 when title is missing", async () => {
            const res = await request(app)
                .post("/api/v1/movies")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ slug: "notitle-movie", genres: ["thriller"] });
            expect(res.status).toBe(400);
        });
    });

    describe("PUT /api/v1/movies/:id", () => {
        test("should update movie as admin", async () => {
            const m = await MovieModel.create({ title: "Update Target", slug: "update-target", genres: ["drama"], status: "upcoming" });
            const res = await request(app)
                .put(`/api/v1/movies/${m._id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ title: "Updated Movie Title" });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test("should return 403 for non-admin user", async () => {
            const m = await MovieModel.create({ title: "Protected Update", slug: "protected-update", genres: ["comedy"], status: "upcoming" });
            const res = await request(app)
                .put(`/api/v1/movies/${m._id}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({ title: "Hacked Title" });
            expect(res.status).toBe(403);
        });
    });
});