import { z } from "zod";
import { UserSchema } from "../types/user.type";

export const CreateUserDTO = z.object({
    fullName: z.string().min(1, "Full name is required").optional(),
    name: z.string().min(1, "Full name is required").optional(),
    email: z.email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
}).refine((data) => data.fullName || data.name, {
    message: "Full name (name or fullName) is required",
    path: ["fullName"],
}).transform((data) => {
    const name = data.fullName || data.name;
    const { fullName, ...rest } = data;
    return { ...rest, name } as { name: string; email: string; username: string; password: string; phoneNumber: string };
});

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

export const LoginUserDTO = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

export const UpdateProfileDTO = z.object({
    fullName: z.string().min(1, "Full name is required").optional(),
    email: z.email("Invalid email address").optional(),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").optional(),
    phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
    password: z.string().min(6, "Password must be at least 6 characters long").optional()
}).transform((data) => {
    const phoneNumber = data.phoneNumber || data.phone;
    const { phone, ...rest } = data;
    return { ...rest, phoneNumber } as typeof rest & { phoneNumber?: string };
});

export type UpdateProfileDTO = z.infer<typeof UpdateProfileDTO> & { phoneNumber?: string };
