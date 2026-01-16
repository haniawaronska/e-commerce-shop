import { Cart } from "../../Domain/Model/Cart";
import { ICartRepository } from "../../Domain/Repositories/ICartRepository";
import { InMemoryRepository } from "./InMemoryRepository";

export class InMemoryCartRepository extends InMemoryRepository<Cart> implements ICartRepository {
    public getByItemCount(minCount: number): Cart[] {
        return this.getAll().filter(cart => cart.items.length >= minCount);
    }

    public findByTotalValue(minValue: number, maxValue: number): Cart[] {
        return this.getAll().filter(cart => cart.totalValue >= minValue && cart.totalValue <= maxValue);
    }
}