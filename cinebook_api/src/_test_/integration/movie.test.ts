import request from "supertest";
import app from "../../app";

describe("Movies API", () => {
    let token: string;

    beforeAll(async () => {
        const unique = Date.now();
        const email = `movietest+${unique}@example.com`;
        const username = `movietester${unique}`;
        await request(app).post("/api/v1/auth/register").send({ name: "Movie Tester", email, username, password: "password123", phoneNumber: "0001112223" });
        const res = await request(app).post("/api/v1/auth/login").send({ email, password: "password123" });
        if (res.status !== 200 || !res.body?.data?.token) {
            throw new Error(`Login failed in test setup: ${JSON.stringify(res.body)}`);
        }
        token = res.body.data.token;
    });

    it("should create movie (admin only) - expect 403 for normal user", async () => {
        const res = await request(app)
            .post("/api/v1/movies")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Protected Movie" });

        expect(res.status).toBe(403);
    });
});
