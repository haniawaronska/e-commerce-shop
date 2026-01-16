import { IProductRepository } from "../../Domain/Repositories/IProductRepository";
import { Product, ProductStatus } from "../../Domain/Model/Product";
import { ProductModel, IProductDocument } from "./ProductSchema";

export class MongoProductRepository implements IProductRepository {
    private toDomain(doc: IProductDocument): Product {
        return new Product(doc._id.toString(), doc.name, doc.price, doc.status as ProductStatus, doc.tags, doc.description);
    }

    public async save(product: Product): Promise<void> {
        await ProductModel.findByIdAndUpdate(
            product.ID,
            {
                name: product.name,
                price: product.price,
                status: product.status,
                tags: product.tags,
                description: product.description
            },
            { upsert: true, new: true }
        );
    }

    public async getAll(): Promise<Product[]> {
        const docs = await ProductModel.find();
        return docs.map(doc => this.toDomain(doc));
    }

    public async getById(id: string) : Promise<Product | null> {
        const doc = await ProductModel.findById(id);
        if (doc) {
            return this.toDomain(doc);
        }
        return null;
    }

    public async getByStatus (status: string): Promise<Product[]> {
        const docs = await ProductModel.find({ status: status });
        return docs.map(doc => this.toDomain(doc));
    }

    public async delete (id: string): Promise<void> {
        const doc = await ProductModel.findByIdAndDelete(id);
        if (!doc) {
            throw new Error(`Product with ID ${id} not found`);
        }   
    }

    public async findByName(name: string): Promise<Product | null> {
        const doc = await ProductModel.findOne({name: name});
        if (doc) {
            return this.toDomain(doc);
        }
        return null;
    }

    public async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
        const docs = await ProductModel.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });
        return docs.map(doc => this.toDomain(doc));
    }
}
