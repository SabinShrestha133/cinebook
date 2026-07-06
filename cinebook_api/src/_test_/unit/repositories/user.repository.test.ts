// src/__tests__/unit/repositories/user.repository.test.ts
import { UserMongoRepository } from "../../../repositories/user.repository";

describe('UserMongoRepository', () => {
    const userRepository = new UserMongoRepository();
    const userData: any = {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        password: 'password123'
    };
    test('should create a new user', async () => {
        const user = await userRepository.createUser(userData);

        expect(user).toBeDefined();
        expect(user.username).toBe(userData.username);
        expect(user.email).toBe(userData.email);
    });
});