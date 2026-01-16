import { Product, ProductStatus } from "../../Domain/Model/Product";
import { IProductRepository } from "../../Domain/Repositories/IProductRepository";

export class ProductService {
    constructor(private readonly productRepo: IProductRepository) {}

    public async getAllProducts(): Promise<Product[]> {
        return this.productRepo.getAll();
    }

    public async getProductDetails(id: string): Promise<Product | null> {
        const product = await this.productRepo.getById(id);
        if (!product || product.status === ProductStatus.Deleted) {
            throw new Error('Product not found or has been deleted');
        }
        return product;
    }

    public async createProduct(id: string, name: string, price: number): Promise<void> {
        if (await this.productRepo.findByName(name)) {
            throw new Error('Product with this name already exists');
        }
        const newProduct = new Product(id, name, price, ProductStatus.Active);
        await this.productRepo.save(newProduct);
    }

    public async updateProduct(id: string, newName: string, newPrice: number): Promise<void> {
        const product = await this.productRepo.getById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        product.name = newName;
        product.updatePrice(newPrice);

        await this.productRepo.save(product);
    }

    public async deleteProduct(id: string): Promise<void> {
        await this.productRepo.delete(id);
        // const product = this.productRepo.getById(id);
        // if (!product) {
        //     throw new Error('Product not found');
        // }
        // product.changeStatus(ProductStatus.Deleted);
        // this.productRepo.save(product);
    }

    public async searchProducts(query: string): Promise<Product[]> {
        const allProducts = await this.productRepo.getAll();
        if (!query) {
            return allProducts;
        }
        return allProducts.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
            (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
        );
    }
}