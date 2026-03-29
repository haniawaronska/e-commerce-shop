import { Cart } from "../../Domain/Model/Cart";
import { ICartRepository } from "../../Domain/Repositories/ICartRepository";
import { InMemoryRepository } from "./InMemoryRepository";

export class InMemoryCartRepository extends InMemoryRepository<Cart> implements ICartRepository {
    public async findByUserId(userId: string): Promise<Cart | null> {
        const carts = await this.getAll();
        return carts.find(cart => cart.userID === userId) || null;
    }

    public async deleteByUserId(userId: string): Promise<void> {
        const cart = await this.findByUserId(userId);
        if (cart) {
            await this.delete(cart.ID);
        }
    }

    public async getByItemCount(minCount: number): Promise<Cart[]> {
        const carts = await this.getAll();
        return carts.filter(cart => cart.items.length >= minCount);
    }

    public async findByTotalValue(minValue: number, maxValue: number): Promise<Cart[]> {
        const carts = await this.getAll();
        return carts.filter(cart => cart.totalValue >= minValue && cart.totalValue <= maxValue);
    }
}