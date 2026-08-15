import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { MovieModel } from "../../models/movie.model";
import { CinemaModel } from "../../models/cinema.model";
import { HallModel } from "../../models/hall.model";
import { ShowtimeModel } from "../../models/showtime.model";
import { BookingModel } from "../../models/booking.model";

describe("Integration: Booking Routes", () => {
    let token: string;
    let movie: any;
    let cinema: any;
    let hall: any;
    let showtime: any;
    let bookingId: string;

    beforeAll(async () => {
        await UserModel.deleteMany({});
        await BookingModel.deleteMany({});
        await ShowtimeModel.deleteMany({});
        await HallModel.deleteMany({});
        await CinemaModel.deleteMany({});
        await MovieModel.deleteMany({});
        const regRes = await request(app)
            .post("/api/v1/auth/register")
            .send({ name: "Booking User", email: "bookinguser@example.com", username: "bookinguser", password: "password123", phoneNumber: "1234567890" });

        const loginRes = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: "bookinguser@example.com", password: "password123" });

        token = loginRes.body.data.token;

        movie = await MovieModel.create({ title: "Test Movie", slug: "test-movie-booking", genres: ["drama"], status: "now_showing" });
        cinema = await CinemaModel.create({ name: "Test Cinema", city: "Test City" });
        hall = await HallModel.create({ cinemaId: cinema._id, name: "Hall 1", totalRows: 5, seatsPerRow: 8, aisles: [3] });
        showtime = await ShowtimeModel.create({ movieId: movie._id, cinemaId: cinema._id, hallId: hall._id, showDate: new Date(), startTime: "18:00", ticketPrice: 100 });
    });
    });

    describe("POST /api/v1/bookings", () => {
        test("should create a booking successfully", async () => {
            const res = await request(app)
                .post("/api/v1/bookings")
                .set("Authorization", `Bearer ${token}`)
                .send({ showtimeId: showtime._id.toString(), movieId: movie._id.toString(), cinemaId: cinema._id.toString(), hallId: hall._id.toString(), seats: [{ seatId: "A1", label: "A1", price: 100 }] });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty("bookingCode");
            bookingId = res.body.data._id;
        });

        test("should return 401 without token", async () => {
            const res = await request(app)
                .post("/api/v1/bookings")
                .send({ showtimeId: showtime._id.toString(), movieId: movie._id.toString(), cinemaId: cinema._id.toString(), hallId: hall._id.toString(), seats: [{ seatId: "B1", label: "B1", price: 100 }] });
            expect(res.status).toBe(401);
        });

        test("should return 400 when showtimeId is missing", async () => {
            const res = await request(app)
                .post("/api/v1/bookings")
                .set("Authorization", `Bearer ${token}`)
                .send({ movieId: movie._id.toString(), cinemaId: cinema._id.toString(), hallId: hall._id.toString(), seats: [{ seatId: "C1", label: "C1", price: 100 }] });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should return 400 when seats array is empty", async () => {
            const res = await request(app)
                .post("/api/v1/bookings")
                .set("Authorization", `Bearer ${token}`)
                .send({ showtimeId: showtime._id.toString(), movieId: movie._id.toString(), cinemaId: cinema._id.toString(), hallId: hall._id.toString(), seats: [] });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/bookings/me", () => {
        test("should return my bookings with valid token", async () => {
            const res = await request(app)
                .get("/api/v1/bookings/me")
                .set("Authorization", `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        test("should return 401 without token", async () => {
            const res = await request(app)
                .get("/api/v1/bookings/me");
            expect(res.status).toBe(401);
        });
    });

    describe("GET /api/v1/bookings/:id", () => {
        test("should return booking by valid ID", async () => {
            const res = await request(app)
                .get(`/api/v1/bookings/${bookingId}`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test("should return 404 for non-existent booking", async () => {
            const res = await request(app)
                .get("/api/v1/bookings/000000000000000000000001");
            expect(res.status).toBe(404);
        });
    });

    describe("GET /api/v1/bookings/:id/qr", () => {
        test("should return QR code image for valid booking", async () => {
            const res = await request(app)
                .get(`/api/v1/bookings/${bookingId}/qr`);
            expect(res.status).toBe(200);
        });
    });

    afterAll(async () => {
        await BookingModel.deleteMany({});
        await ShowtimeModel.deleteMany({});
        await HallModel.deleteMany({});
        await CinemaModel.deleteMany({});
        await MovieModel.deleteMany({});
        await UserModel.deleteMany({});
    });
});