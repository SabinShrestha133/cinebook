import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { MovieModel } from "../../models/movie.model";
import { CinemaModel } from "../../models/cinema.model";
import { HallModel } from "../../models/hall.model";
import { ShowtimeModel } from "../../models/showtime.model";

describe("Integration: Showtime Routes", () => {
    let userToken: string;
    let adminToken: string;
    let movie: any;
    let cinema: any;
    let hall: any;
    let showtime: any;

    beforeAll(async () => {
        await UserModel.deleteMany({});
        await ShowtimeModel.deleteMany({});
        await HallModel.deleteMany({});
        await CinemaModel.deleteMany({});
        await MovieModel.deleteMany({});

        await UserModel.create({ name: "Showtime User", email: "stuser@example.com", username: "stuser", password: "password123", phoneNumber: "1234567890" });
        const userLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: "stuser@example.com", password: "password123" });
        userToken = userLogin.body.data.token;

        await UserModel.create({ name: "Showtime Admin", email: "stadmin@example.com", username: "stadmin", password: "password123", phoneNumber: "0987654321", role: "admin" });
        const adminLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: "stadmin@example.com", password: "password123" });
        adminToken = adminLogin.body.data.token;

        movie = await MovieModel.create({ title: "Showtime Movie", slug: "showtime-movie", genres: ["action"], status: "now_showing" });
        cinema = await CinemaModel.create({ name: "Showtime Cinema", city: "Showtime City" });
        hall = await HallModel.create({ cinemaId: cinema._id, name: "Showtime Hall", totalRows: 5, seatsPerRow: 8, aisles: [3] });
        showtime = await ShowtimeModel.create({ movieId: movie._id, cinemaId: cinema._id, hallId: hall._id, showDate: new Date(), startTime: "18:00", ticketPrice: 100 });
    });

    afterAll(async () => {
        await ShowtimeModel.deleteMany({});
        await HallModel.deleteMany({});
        await CinemaModel.deleteMany({});
        await MovieModel.deleteMany({});
        await UserModel.deleteMany({});
    });

    describe("GET /api/v1/showtimes", () => {
        test("should return list of showtimes", async () => {
            const res = await request(app).get("/api/v1/showtimes");
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe("GET /api/v1/showtimes/:id", () => {
        test("should return showtime by valid ID", async () => {
            const res = await request(app).get(`/api/v1/showtimes/${showtime._id}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test("should return 400 for invalid ID format", async () => {
            const res = await request(app).get("/api/v1/showtimes/invalid-id");
            expect(res.status).toBe(400);
        });

        test("should return 404 for non-existent ID", async () => {
            const res = await request(app).get("/api/v1/showtimes/000000000000000000000001");
            expect(res.status).toBe(404);
        });
    });

    describe("POST /api/v1/showtimes", () => {
        test("should create showtime as admin", async () => {
            const res = await request(app)
                .post("/api/v1/showtimes")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ movieId: movie._id.toString(), cinemaId: cinema._id.toString(), hallId: hall._id.toString(), showDate: new Date(), startTime: "20:00", ticketPrice: 120 });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });

        test("should return 400 when required fields are missing", async () => {
            const res = await request(app)
                .post("/api/v1/showtimes")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ movieId: movie._id.toString(), ticketPrice: 100 });
            expect(res.status).toBe(400);
        });

        test("should return 403 for non-admin user", async () => {
            const res = await request(app)
                .post("/api/v1/showtimes")
                .set("Authorization", `Bearer ${userToken}`)
                .send({ movieId: movie._id.toString(), cinemaId: cinema._id.toString(), hallId: hall._id.toString(), showDate: new Date(), startTime: "20:00", ticketPrice: 100 });
            expect(res.status).toBe(403);
        });
    });

    describe("PUT /api/v1/showtimes/:id", () => {
        test("should update showtime as admin", async () => {
            const res = await request(app)
                .put(`/api/v1/showtimes/${showtime._id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ startTime: "19:30" });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});