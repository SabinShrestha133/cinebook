import { UserService } from "../services/user.service";
import { z } from "zod";
import { CreateUserDTO, LoginUserDTO, UpdateProfileDTO } from "../dtos/user.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { Request, Response } from "express";
import { HttpException } from "../exceptions/http-exception";

const userService = new UserService();

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const userData = CreateUserDTO.safeParse(req.body);
            if (!userData.success) {
                return res.status(400).json({
                    success: false,
                    message: z.prettifyError(userData.error)
                });
            }
            const result = await userService.createUser(userData.data);
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                token: result.token,
                user: result.user
            });
        } catch (error: Error | any | unknown) {
            const status = error instanceof HttpException ? error.status : 500;
            return res.status(status).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            const parsedData = LoginUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: z.prettifyError(parsedData.error)
                });
            }
            const result = await userService.loginUser(parsedData.data);
            return res.status(200).json({
                success: true,
                message: "Login successful",
                token: result.token,
                user: result.user
            });
        } catch (error: Error | any | unknown) {
            const status = error instanceof HttpException ? error.status : 500;
            return res.status(status).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async whoami(req: Request, res: Response) {
        try {
            const user = req.user;
            if (!user) {
                throw new HttpException(401, "Unauthorized");
            }
            const userObj = user.toObject ? (user as any).toObject() : user;
            return res.status(200).json({
                success: true,
                message: "User fetched successfully",
                user: {
                    id: userObj._id?.toString() || userObj.id,
                    name: userObj.name,
                    email: userObj.email,
                    phone: userObj.phoneNumber,
                    profilePicture: userObj.profilePicture
                }
            });
        } catch (error: Error | any | unknown) {
            const status = error instanceof HttpException ? error.status : 500;
            return res.status(status).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const userId = req.user?._id?.toString();
            if (!userId) {
                throw new HttpException(401, "Unauthorized");
            }

            const parsedData = UpdateProfileDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: z.prettifyError(parsedData.error)
                });
            }

            // Handle file upload if present
            let profilePicture: string | undefined;
            if (req.file) {
                profilePicture = `/uploads/profiles/${req.file.filename}`;
            }

            const result = await userService.updateProfile(userId, parsedData.data, profilePicture);
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                user: result
            });
        } catch (error: Error | any | unknown) {
            const status = error instanceof HttpException ? error.status : 500;
            return res.status(status).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }
}