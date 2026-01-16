import {User} from "../Model/User";
import { IRepository } from "./IRepository";

export interface IUserRepository extends IRepository<User> {
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
}