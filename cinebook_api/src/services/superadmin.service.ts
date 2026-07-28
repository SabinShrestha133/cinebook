import { UserMongoRepository } from "../repositories/user.repository";
import { IUser } from "../models/user.model";

const userRepo = new UserMongoRepository();

export class SuperAdminService {
    async listAdmins() {
        const users = await userRepo.getAll();
        return users.filter((u) => u.role === "admin" || u.role === "super_admin");
    }

    async createAdmin(payload: Partial<IUser>) {
        payload.role = "admin" as any;
        const created = await userRepo.createUser(payload as Partial<IUser>);
        return created;
    }

    async setActive(id: string, isActive: boolean) {
        return userRepo.update(id, { isActive } as Partial<IUser>);
    }

    async updateAdmin(id: string, payload: Partial<IUser>) {
        return userRepo.update(id, payload);
    async updateAdmin(id: string, payload: { isActive?: boolean; permissions?: string[] }) {
        return userRepo.update(id, payload as Partial<IUser>);
    }
}

export const superAdminService = new SuperAdminService();
