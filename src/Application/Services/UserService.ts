import crypto from "crypto";
import mongoose from "mongoose";
import { IUserRepository } from "../../Domain/Repositories/IUserRepository";
import { User, UserRole } from "../../Domain/Model/User";

const SECRET = "HANAKATANA2024";

export class UserService {
    constructor(private userRepository: IUserRepository) {}

    private hashPassword(salt: string, password: string): string {
        return crypto.createHmac("sha256", [salt, password].join("/"))
            .update(SECRET)
            .digest("hex");
    }

    public async register(username: string, email: string, password: string): Promise<User> {
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser) {
            throw new Error("Username already taken");
        }

        const existingEmail = await this.userRepository.findByEmail(email);
        if (existingEmail) {
            throw new Error("Email already taken");
        }

        const salt = crypto.randomBytes(16).toString("hex");
        const passwordHash = this.hashPassword(salt, password);
        const id = new mongoose.Types.ObjectId().toString();

        const newUser = new User(id, username, email, { passwordHash, salt });
        await this.userRepository.save(newUser);
        return newUser;
    }

    public async login(username: string, password: string): Promise<User> {
        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            throw new Error("Invalid username or password");
        }

        const passwordHash = this.hashPassword(user.authentication.salt, password);
        if (passwordHash !== user.authentication.passwordHash) {
            throw new Error("Invalid username or password");
        }

        return user;
    }

    public async getAllUsers(): Promise<User[]> {
        return this.userRepository.getAllUsers();
    }

    public async getUserById(id: string): Promise<User | null> {
        return this.userRepository.getById(id);
    }

    public async deleteUser(id: string): Promise<void> {
        return this.userRepository.delete(id);
    }

    public async changeUserRole(id: string, newRole: UserRole): Promise<void> {
        const user = await this.userRepository.getById(id);
        if (!user) {
            throw new Error("User not found");
        }
        user.changeRole(newRole);
        await this.userRepository.save(user);
    }

    public async changeUserPassword(id: string, newPassword: string): Promise<void> {
        const user = await this.userRepository.getById(id);
        if (!user) {
            throw new Error("User not found");
        }
        const salt = crypto.randomBytes(16).toString("hex");
        const passwordHash = this.hashPassword(salt, newPassword);
        user.authentication = { passwordHash, salt };
        await this.userRepository.save(user);
    }
}