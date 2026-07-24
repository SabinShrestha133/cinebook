import request from "supertest";
import app from "../../app";
import { MovieModel } from "../../models/movie.model";
import { CinemaModel } from "../../models/cinema.model";
import { HallModel } from "../../models/hall.model";
import { ShowtimeModel } from "../../models/showtime.model";

describe("Booking flow", () => {
    let token: string;
    let movie: any;
    let cinema: any;
    let hall: any;
    let showtime: any;

    beforeAll(async () => {
        const regRes = await request(app)
            .post("/api/v1/auth/register")
            .send({ name: "Test User", email: "test@example.com", username: "testuser", password: "password123", phoneNumber: "1234567890" });

        const loginRes = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: "test@example.com", password: "password123" });

        token = loginRes.body.data.token;

        movie = await MovieModel.create({ title: "Test Movie", slug: "test-movie", genres: ["drama"], status: "now_showing" });
        cinema = await CinemaModel.create({ name: "Test Cinema", city: "Test City" });
        hall = await HallModel.create({ cinemaId: cinema._id, name: "Hall 1", totalRows: 5, seatsPerRow: 8, aisles: [3] });
        showtime = await ShowtimeModel.create({ movieId: movie._id, cinemaId: cinema._id, hallId: hall._id, showDate: new Date(), startTime: "18:00", ticketPrice: 100 });
    });

    it("should create a booking successfully", async () => {
        const res = await request(app)
            .post("/api/v1/bookings")
            .set("Authorization", `Bearer ${token}`)
            .send({ showtimeId: showtime._id.toString(), movieId: movie._id.toString(), cinemaId: cinema._id.toString(), hallId: hall._id.toString(), seats: [ { seatId: "A1", label: "A1", price: 100 } ] });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("bookingCode");
        expect(res.body.data.bookingStatus).toBe("pending_payment");
        expect(res.body.data.paymentStatus).toBe("pending");
    });
});
