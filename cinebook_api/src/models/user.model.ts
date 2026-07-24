import mongoose, { Schema, Document } from "mongoose";
import { UserType } from "../types/user.type";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
const BCRYPT_HASH_REGEX = /^\$2[aby]\$/;

export interface IUser extends UserType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const UserMongoSchema: Schema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        role: {
            type: String,
            enum: ["user", "admin", "super_admin"],
            default: "user",
        },
        profilePicture: { type: String },
        isActive: { type: Boolean, default: true },
        isVerified: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
)

UserMongoSchema.pre<IUser>("save", async function () {
    if (!this.isModified("password")) return;
    const password = this.password as string;
    if (BCRYPT_HASH_REGEX.test(password)) return;
    this.password = await bcrypt.hash(password, SALT_ROUNDS);
});

export const UserModel = mongoose.model<IUser>(
    "User",
    UserMongoSchema
);
