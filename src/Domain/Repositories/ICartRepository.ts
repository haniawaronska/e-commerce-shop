import { Cart } from "../Model/Cart";
import { IRepository } from "./IRepository";

export interface ICartRepository extends IRepository<Cart> {
    findByUserId(userId: string): Promise<Cart | null>;
    deleteByUserId(userId: string): Promise<void>;
}