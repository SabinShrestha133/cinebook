import { UserService } from "../services/user.service";
import { z } from "zod";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { uploadToCloudinary } from "../utils/cloudinary.util";
import { Request, Response } from "express";
import { HttpException } from "../exceptions/http-exception";
import fs from "fs";
const userService = new UserService();

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const userData = CreateUserDTO.safeParse(req.body);
            if (!userData.success) {
                return ApiResponseHelper
                    .error(res, z.prettifyError(userData.error), 400);
            }
            const user = await userService.createUser(userData.data);
            return ApiResponseHelper.success(res, user, "User created successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async loginUser(req: Request, res: Response) {
        console.log("[CTRL] loginUser hit");
        console.log("[CTRL] body:", req.body);

        try {
            const parsedData = LoginUserDTO.safeParse(req.body);

            if (!parsedData.success) {
                console.log("[CTRL] Login DTO validation failed");
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(parsedData.error),
                    400
                );
            }

            console.log("[CTRL] DTO validation passed");

            const { user, token } = await userService.loginUser(parsedData.data);

            console.log("[CTRL] loginUser success");
            return ApiResponseHelper.success(res, { user, token }, "Login successful");
        } catch (error: any) {
            console.error("[CTRL] loginUser error:", error);
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const userId = req.user?._id?.toString(); // logged in user as string
            if (!userId) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const parsedData = UpdateUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return ApiResponseHelper
                    .error(res, z.prettifyError(parsedData.error), 400);
            }
            if (req.file) {
                const secureUrl = await uploadToCloudinary(req.file.path, "profiles");
                parsedData.data.profilePicture = secureUrl;
                fs.unlink(req.file.path, () => {});
            }
            const updatedUser = await userService.updateUser(userId, parsedData.data);
            return ApiResponseHelper.success(res, updatedUser, "User updated successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async whoami(req: Request, res: Response) {
        try {
            const user = req.user; // logged in user detail
            if (!user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            return ApiResponseHelper.success(res, user, "User retrieved successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }
    async sendResetPasswordEmail(req: Request, res: Response) {
        try {
            const email = req.body.email;
            // can be replaced with DTO
            if (!email) {
                throw new HttpException(400, "Email is required");
            }
            const { token, user } = await userService.sendResetPasswordEmail(email);
            return ApiResponseHelper.success(res,
                { token, user }, "Reset password email sent successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
    async resetPassword(req: Request, res: Response) {
        try {
            const token = req.params.token as string;
            const { newPassword } = req.body;
            // can be replaced with DTO
            if (!token || !newPassword) {
                throw new HttpException(400, "Token and new password are required");
            }
            const updatedUser = await userService.resetPassword(token, newPassword);
            return ApiResponseHelper.success(res, updatedUser, "Password reset successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}