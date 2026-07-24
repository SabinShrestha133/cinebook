import { UserMongoRepository } from "../repositories/user.repository";
import { CreateUserDTO, LoginUserDTO, UpdateProfileDTO } from "../dtos/user.dto";
import { IUser } from "../models/user.model";
import { HttpException } from "../exceptions/http-exception";
import bycryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY, HOST, PORT } from "../configs/constant";

const userRepository = new UserMongoRepository();

function transformUserResponse(user: IUser) {
    const userObj = user.toObject ? user.toObject() : user;
    const profilePicture = userObj.profilePicture;
    const host = HOST === "0.0.0.0" ? "localhost" : HOST;
    return {
        id: userObj._id?.toString() || userObj.id,
        fullName: userObj.name,
        email: userObj.email,
        phoneNumber: userObj.phoneNumber,
        profilePicture: profilePicture
            ? profilePicture.startsWith("http")
                ? profilePicture
                : `http://${host}:${PORT}${profilePicture}`
            : undefined
    };
}

export class UserService {
    async createUser(userData: CreateUserDTO): Promise<{ user: any; token: string }> {
        const existingEmail = await userRepository.getUserByEmail(userData.email);
        if (existingEmail) {
            throw new HttpException(409, "Email already exists");
        }
        const existingUsername = await userRepository.getUserByUsername(userData.username);
        if (existingUsername) {
            throw new HttpException(409, "Username already exists");
        }
        const hashedPassword = await bycryptjs.hash(userData.password, 10);
        const user = await userRepository.createUser({
            ...userData,
            password: hashedPassword
        });
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "30d" }
        );
        return { user: transformUserResponse(user), token };
    }

    async loginUser(loginData: LoginUserDTO): Promise<{ user: any; token: string }> {
        const user = await userRepository.getUserByEmail(loginData.email);
        if (!user) {
            throw new HttpException(401, "Invalid email or password");
        }
        const isPasswordValid = await bycryptjs.compare(
            loginData.password,
            user.password
        );
        if (!isPasswordValid) {
            throw new HttpException(401, "Invalid email or password");
        }
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "30d" }
        );
        return { user: transformUserResponse(user), token };
    }

    async updateProfile(userId: string, profileData: UpdateProfileDTO, profilePicture?: string): Promise<any> {
        const updateData: Partial<IUser> = {};

        if (profileData.fullName) {
            updateData.name = profileData.fullName;
        }
        if (profileData.phoneNumber) {
            updateData.phoneNumber = profileData.phoneNumber;
        }
        if (profileData.email) {
            const existingEmail = await userRepository.getUserByEmail(profileData.email);
            if (existingEmail && existingEmail._id?.toString() !== userId) {
                throw new HttpException(409, "Email already exists");
            }
            updateData.email = profileData.email;
        }
        if (profileData.password) {
            updateData.password = await bycryptjs.hash(profileData.password, 10);
        }
        if (profilePicture) {
            updateData.profilePicture = profilePicture;
        }

        const updatedUser = await userRepository.update(userId, updateData);
        if (!updatedUser) {
            throw new HttpException(404, "User not found");
        }
        return transformUserResponse(updatedUser);
    }
}