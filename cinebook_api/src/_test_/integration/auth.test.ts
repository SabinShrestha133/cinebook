import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

// top-level -> suite
describe(
    "Integration: Auth Routes", // name of suite,
    () => {
        beforeAll(
            async () => {
                await UserModel.deleteMany({}); // clear users collection before tests
            }
        );
        // same can be afterAll

        // group/nested
        describe(
            "POST /api/v1/auth/register", // name of group
            () => {
                test(
                    "should validate user", //individual test
                    async () => {
                        const response = await request(app)
                            .post("/api/v1/auth/register")
                            .send({
                                "firstName": "John",
                                "lastName": "Doe",
                                "email": "john.doe@example.com",
                                "password": "password123"
                            });
                            //expect -> to be
                        expect(response.status).toBe(400);
                        // can have multiple expects
                        expect(response.body.success).toBe(false);
                    }
                );
            }
        )
    }
)