import { Product } from "../Model/Product";

import { IRepository } from "./IRepository";

export interface IProductRepository extends IRepository<Product> {
    getByStatus(status: string): Promise<Product[]>;
    findByName(name: string): Promise<Product | null>;
    findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>;
}