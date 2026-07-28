import { z } from "zod";

export const registerSchema = z.object({
    email: z.email("Invalid email address"),
    name: z.string("Full name must be string")
        .min(2, "Full name must be at least 2 characters long"),
    username: z.string("Username must be string")
        .min(3, "Username must be at least 3 characters long"),
    phoneNumber: z.string("Phone number must be string")
        .min(10, "Phone number must be at least 10 digits"),
    password: z.string("Password must be string")
        .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string("Confirm Password must be string")
        .min(6, "Confirm Password must be at least 6 characters long")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string("Password must be string")
        .min(6, "Password must be at least 6 characters long")
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long").optional().or(z.literal("")),
    email: z.email("Invalid email address"),
    phone: z.string().optional().or(z.literal("")),
    profileImage: z.any().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const passwordSchema = z.object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters long"),
    newPassword: z.string().min(6, "New password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type PasswordFormData = z.infer<typeof passwordSchema>;

export const forgotPasswordSchema = z.object({
    email: z.email("Invalid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, "New password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
