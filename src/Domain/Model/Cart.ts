import { Product } from "./Product";

export class CartItem{
    public productId: string;
    public productName: string;
    public quantity: number;
    public unitPrice: number;

    constructor(product: Product, quantity: number);
    constructor(productId: string, productName: string, quantity: number, unitPrice: number);
    constructor(productOrId: Product | string, quantityOrName: number | string, quantity?: number, unitPrice?: number) {
        if (typeof productOrId === 'string') {
            this.productId = productOrId;
            this.productName = quantityOrName as string;
            this.quantity = quantity!;
            this.unitPrice = unitPrice!;
        } else {
            this.productId = productOrId.ID;
            this.productName = productOrId.name;
            this.quantity = quantityOrName as number;
            this.unitPrice = productOrId.price;
        }
    }

    get totalPrice(): number {
        return this.unitPrice * this.quantity;
    }
}


export class Cart {
    public ID: string;
    public userID: string;
    public items: CartItem[];

    constructor(id: string, userID: string) {
        this.ID = id;
        this.userID = userID;
        this.items = [];
    }


    public addProduct(product: Product, quantity: number = 1): void {
        const existingItem = this.items.find(item => item.productId === product.ID);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            const newItem = new CartItem(product, quantity);
            this.items.push(newItem);
        }
    }

    public decreaseProduct(productID: string, quantity: number = 1): void {
        const existingItem = this.items.find(item => item.productId === productID);
        if (!existingItem) {
            return;
        }

        existingItem.quantity -= quantity;
        if (existingItem.quantity <= 0) {
            this.removeProduct(productID);
        }
    }

    public increaseProduct(productID: string, quantity: number = 1): void {
        const existingItem = this.items.find(item => item.productId === productID);
        if (!existingItem) {
            return;
        }
        existingItem.quantity += quantity;
    }

    public removeProduct(productID: string): void {
        this.items = this.items.filter(item => item.productId !== productID);
    }
    public clearCart(): void {
        this.items = [];
    }
    
    get totalValue(): number {
        return this.items.reduce((total, item) => total + item.totalPrice, 0);
    }
}