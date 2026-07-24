import { IUser } from "../models/user.model";

export function sanitizeUser(user: IUser | null) {
    if (!user) return null;
    const obj = user.toObject ? user.toObject() : { ...user };
    delete (obj as Record<string, unknown>).password;
    return obj;
}

export function sanitizeUsers(users: IUser[]) {
    return users.map((u) => sanitizeUser(u));
}
