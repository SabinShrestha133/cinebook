import { connectToMongoDB } from "../src/database/mongodb";
import { MovieModel } from "../src/models/movie.model";
import { CinemaModel } from "../src/models/cinema.model";
import { HallModel } from "../src/models/hall.model";
import { ShowtimeModel } from "../src/models/showtime.model";
import { UserModel } from "../src/models/user.model";
import bcrypt from "bcryptjs";

async function seed() {
    await connectToMongoDB();

    // create super admin if not exists
    const existing = await UserModel.findOne({ email: "admin@cinebook.local" });
    if (!existing) {
        const hashed = await bcrypt.hash("adminpass", 10);
        await UserModel.create({ name: "Super Admin", email: "admin@cinebook.local", username: "superadmin", password: hashed, phoneNumber: "9800000000", role: "super_admin", isActive: true });
        console.log("Created super admin: admin@cinebook.local / adminpass");
    }

    const movie = await MovieModel.create({ title: "Seed Movie", slug: "seed-movie", genres: ["action"], status: "now_showing" });
    const cinema = await CinemaModel.create({ name: "Seed Cinema", city: "Seed City" });
    const hall = await HallModel.create({ cinemaId: cinema._id, name: "Main Hall", totalRows: 5, seatsPerRow: 8, aisles: [3] });
    await ShowtimeModel.create({ movieId: movie._id, cinemaId: cinema._id, hallId: hall._id, showDate: new Date(), startTime: "19:00", ticketPrice: 120 });

    console.log("Seeding complete");
    process.exit(0);
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
