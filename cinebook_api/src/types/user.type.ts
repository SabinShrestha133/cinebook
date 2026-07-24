import { z } from "zod";

export const UserSchema = z.object({
    name: z.string().min(1, "Full name is required"),
    email: z.email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    role: z.enum(["user", "admin", "super_admin"]).default("user"),
    profilePicture: z.string().optional(),
    isActive: z.boolean().default(true),
    isVerified: z.boolean().default(false),
});

export const UpdateProfileSchema = z.object({
    fullName: z.string().min(1, "Full name is required").optional(),
    email: z.email("Invalid email address").optional(),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").optional()
});

export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>;

export type UserType = z.infer<typeof UserSchema>;
