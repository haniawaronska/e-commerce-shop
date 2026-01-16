export enum ProductStatus {
    Active = 'active',
    Inactive = 'inactive',
    Deleted = 'deleted'
}

export class Product {
    public ID: string;
    public name: string;
    public price: number;
    public status: ProductStatus;
    public tags: string[];
    public description?: string;

    constructor(id: string, name: string, price: number, status: ProductStatus = ProductStatus.Active, tags: string[] = [], description?: string) {
        this.ID = id;
        this.name = name;
        this.price = price;
        this.status = status;
        this.tags = tags;
        this.description = description;
    }

    public changeStatus(newStatus: ProductStatus): void {
        this.status = newStatus;
    }

    public updatePrice(newPrice: number): void {
        if (newPrice < 0) {
            throw new Error('Price cannot be negative');
        }
        this.price = newPrice;
    }

    public clone(): Product {
        return new Product(
            this.ID, this.name, this.price, this.status, [...this.tags], this.description
        );
    }
}