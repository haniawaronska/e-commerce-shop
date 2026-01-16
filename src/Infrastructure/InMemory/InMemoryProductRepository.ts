import { Product } from "../../Domain/Model/Product";
import { IProductRepository } from "../../Domain/Repositories/IProductRepository";
import { InMemoryRepository } from "./InMemoryRepository";

export class InMemoryProductRepository extends InMemoryRepository<Product> implements IProductRepository {
    public override save(entity: Product): void {
        const productClone = entity.clone();
        super.save(productClone); // super odwoluje sie do klasy rodzica
    }
    // tutaj dodajemy to zeby operowac na klonach a nie na oryginalnych obiektach
    public override getById(id: string): Product | null {
        const product = super.getById(id);
        return product ? product.clone() : null;
    }

    public override getAll(): Product[] {
        return super.getAll().map(product => product.clone());
    }

    public getByStatus(status: string): Product[] {
        return this.getAll().filter(product => product.status === status);
    }

    public findByName(name: string): Product | null {
        return this.getAll().find(product => product.name === name) || null;
    }   

    public findByPriceRange(minPrice: number, maxPrice: number): Product[] {
        return this.getAll().filter(product => product.price >= minPrice && product.price <= maxPrice);
    }
}