import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

describe("Integration: Auth Routes", () => {
    beforeAll(async () => {
        await UserModel.deleteMany({});
    });

    afterAll(async () => {
        await UserModel.deleteMany({});
    });

    describe("POST /api/v1/auth/register", () => {
        test("should return 400 when name is missing", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({ email: "reg1@example.com", username: "reguser1", password: "password123", phoneNumber: "1234567890" });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should return 400 when email is missing", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({ name: "Missing Email", username: "reguser2", password: "password123", phoneNumber: "1234567890" });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should return 400 when username is missing", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({ name: "Missing Username", email: "nouser@example.com", password: "password123", phoneNumber: "1234567890" });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should return 400 when password is missing", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({ name: "Missing Pass", email: "nopass@example.com", username: "nopassuser", phoneNumber: "1234567890" });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should return 400 when phoneNumber is missing", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({ name: "Missing Phone", email: "nophone@example.com", username: "nophoneuser", password: "password123" });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should return 400 when username is too short", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({ name: "Short User", email: "short@example.com", username: "ab", password: "password123", phoneNumber: "1234567890" });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should return 400 when password is too short", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({ name: "Short Pass", email: "shortpass@example.com", username: "shortpassuser", password: "123", phoneNumber: "1234567890" });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should return 400 when email is invalid", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({ name: "Bad Email", email: "notanemail", username: "bademailuser", password: "password123", phoneNumber: "1234567890" });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should register a new user successfully", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({ name: "New User", email: "newuser@example.com", username: "newuser1", password: "password123", phoneNumber: "1234567890" });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
        });

        test("should return 409 when email is already registered", async () => {
            await UserModel.create({ name: "Duplicate User", email: "dup@example.com", username: "dupuser1", password: "password123", phoneNumber: "1234567890" });
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({ name: "Another User", email: "dup@example.com", username: "dupuser2", password: "password123", phoneNumber: "0987654321" });
            expect(res.status).toBe(409);
            expect(res.body.success).toBe(false);
        });
    });

    describe("POST /api/v1/auth/login", () => {
        test("should login with valid credentials and return token", async () => {
            await UserModel.create({ name: "Login User", email: "login@example.com", username: "loginuser1", password: "password123", phoneNumber: "1234567890" });
            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ email: "login@example.com", password: "password123" });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();
        });

        test("should return 404 with non-existent email", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ email: "nonexistent@example.com", password: "password123" });
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });

        test("should return 401 with wrong password", async () => {
            await UserModel.create({ name: "Wrong Pass User", email: "wrongpass@example.com", username: "wrongpassuser1", password: "password123", phoneNumber: "1234567890" });
            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ email: "wrongpass@example.com", password: "wrongpassword" });
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should return 400 when email is missing", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ password: "password123" });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should return 400 when password is missing", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ email: "login@example.com" });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/auth/whoami", () => {
        test("should return user profile with valid token", async () => {
            await UserModel.create({ name: "Whoami User", email: "whoami@example.com", username: "whoamiuser1", password: "password123", phoneNumber: "1234567890" });
            const loginRes = await request(app)
                .post("/api/v1/auth/login")
                .send({ email: "whoami@example.com", password: "password123" });
            const token = loginRes.body.data.token;
            const res = await request(app)
                .get("/api/v1/auth/whoami")
                .set("Authorization", `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test("should return 401 without token", async () => {
            const res = await request(app)
                .get("/api/v1/auth/whoami");
            expect(res.status).toBe(401);
        });
    });
});