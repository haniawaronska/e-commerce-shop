import { IUserRepository } from "../../Domain/Repositories/IUserRepository";
import { User, UserRole } from "../../Domain/Model/User";
import { UserModel, IUserDocument } from "./UserSchema";

export class MongoUserRepository implements IUserRepository {
    private toDomain(doc: IUserDocument): User {
        return new User(
            doc._id.toString(),
            doc.username,
            doc.email,
            {
                passwordHash: doc.authentication.passwordHash,
                salt: doc.authentication.salt
            },
            doc.role as UserRole
        );
    }

    public async save(user: User): Promise<void> {
        await UserModel.findByIdAndUpdate(
            user.ID,
            {
                username: user.username,
                email: user.email,
                authentication: {
                    passwordHash: user.authentication.passwordHash,
                    salt: user.authentication.salt
                },
                role: user.role
            },
            { upsert: true, new: true }
        );
    }

    public async getById(id: string): Promise<User | null> {
        const doc = await UserModel.findById(id);
        if (doc) {
            return this.toDomain(doc);
        }
        return null;
    }

    public async getAll(): Promise<User[]> {
        const docs = await UserModel.find();
        return docs.map(doc => this.toDomain(doc));
    }

    public async delete(id: string): Promise<void> {
        const doc = await UserModel.findByIdAndDelete(id);
        if (!doc) {
            throw new Error(`User with ID ${id} not found`);
        }
    }

    public async findByUsername(username: string): Promise<User | null> {
        const doc = await UserModel.findOne({ username: username });
        return doc ? this.toDomain(doc) : null;
    }

    public async findByEmail(email: string): Promise<User | null> {
        const doc = await UserModel.findOne({ email: email });
        return doc ? this.toDomain(doc) : null;
    }

    public async getAllUsers(): Promise<User[]> {
        return await this.getAll();
    }
}