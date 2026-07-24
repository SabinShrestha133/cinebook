import { UserMongoRepository } from "../repositories/user.repository";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { IUser } from "../models/user.model";
import { HttpException } from "../exceptions/http-exception";
import bycryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { CLIENT_URL, SECRET_KEY } from "../configs/constant";
import { sendEmail } from "../configs/email";

const userRepository = new UserMongoRepository();

export class UserService {
    async createUser(userData: CreateUserDTO): Promise<IUser> {
        // validation
        const existingEmail = await userRepository.getUserByEmail(userData.email);
        if (existingEmail) {
            throw new HttpException(400, "Email already exists");
        }
        const existingUsername = await userRepository.getUserByUsername(userData.username);
        if (existingUsername) {
            throw new HttpException(400, "Username already exists");
        }
        // hash password
        const hashedPassword = await bycryptjs.hash(userData.password, 10);
        userData.password = hashedPassword;
        const user = await userRepository.createUser(userData);
        return user;
    }

    async loginUser(loginData: LoginUserDTO) {
        console.log("[SVC] loginUser started");
        console.log("[SVC] email:", loginData.email);
        console.log("[SVC] SECRET_KEY exists:", !!SECRET_KEY);

        const user = await userRepository.getUserByEmail(loginData.email);
        console.log("[SVC] user found:", !!user);

        if (!user) {
            throw new HttpException(400, "Invalid email");
        }

        console.log("[SVC] comparing password...");
        const isPasswordValid = await bycryptjs.compare(
            loginData.password,
            user.password
        );
        console.log("[SVC] password valid:", isPasswordValid);

        if (!isPasswordValid) {
            throw new HttpException(400, "Invalid password");
        }

        console.log("[SVC] signing jwt...");
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "30d" }
        );
        console.log("[SVC] jwt created");

        return { user, token };
    }

    async updateUser(id: string, updateData: UpdateUserDTO){
        const user = await userRepository.getUserById(id);
        if (!user) {
            throw new HttpException(404, "User not found");
        }
        if(updateData.email && updateData.email !== user.email) {
            const existingEmail = await userRepository.getUserByEmail(updateData.email);
            if (existingEmail) {
                throw new HttpException(400, "Email already exists");
            }
        }
        if(updateData.username && updateData.username !== user.username) {
            const existingUsername = await userRepository.getUserByUsername(updateData.username);
            if (existingUsername) {
                throw new HttpException(400, "Username already exists");
            }
        }
        if(updateData.password) {
            if (!updateData.currentPassword) {
                throw new HttpException(400, "Current password is required");
            }

            const isCurrentPasswordValid = await bycryptjs.compare(
                updateData.currentPassword,
                user.password
            );

            if (!isCurrentPasswordValid) {
                throw new HttpException(400, "Current password is incorrect");
            }

            const hashedPassword = await bycryptjs.hash(updateData.password, 10);
            updateData.password = hashedPassword;

            delete (updateData as any).currentPassword;
        }
        const updatedUser = await userRepository.update(id, updateData);
        return updatedUser;
    }


    async sendResetPasswordEmail(email?: string) {
        if (!email) {
            throw new HttpException(400, "Email is required");
        }
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            throw new HttpException(404, "User not found");
        }
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' }); // 1 hour expiry
        const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;
        const html = `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`;
        await sendEmail(user.email, "Password Reset", html);
        return { user, token };

    }

    async resetPassword(token?: string, newPassword?: string) {
        try {
            if (!token || !newPassword) {
                throw new HttpException(400, "Token and new password are required");
            }
            const decoded: any = jwt.verify(token, SECRET_KEY);
            const userId = decoded.id;
            const user = await userRepository.getUserById(userId);
            if (!user) {
                throw new HttpException(404, "User not found");
            }
            const hashedPassword = await bycryptjs.hash(newPassword, 10);
            await userRepository.update(userId, { password: hashedPassword });
            return user;
        } catch (error) {
            throw new HttpException(400, "Invalid or expired token");
        }
    }
}