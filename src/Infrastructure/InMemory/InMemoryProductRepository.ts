import { Product } from "../../Domain/Model/Product";
import { IProductRepository } from "../../Domain/Repositories/IProductRepository";
import { InMemoryRepository } from "./InMemoryRepository";

export class InMemoryProductRepository extends InMemoryRepository<Product> implements IProductRepository {
    public override async save(entity: Product): Promise<void> {
        const productClone = entity.clone();
        await super.save(productClone); // super odwoluje sie do klasy rodzica
    }
    // tutaj dodajemy to zeby operowac na klonach a nie na oryginalnych obiektach
    public override async getById(id: string): Promise<Product | null> {
        const product = await super.getById(id);
        return product ? product.clone() : null;
    }

    public override async getAll(): Promise<Product[]> {
        const products = await super.getAll();
        return products.map(product => product.clone());
    }

    public async getByStatus(status: string): Promise<Product[]> {
        const products = await this.getAll();
        return products.filter(product => product.status === status);
    }

    public async findByName(name: string): Promise<Product | null> {
        const products = await this.getAll();
        return products.find(product => product.name === name) || null;
    }   

    public async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
        const products = await this.getAll();
        return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
    }
}