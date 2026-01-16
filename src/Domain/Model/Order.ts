export enum OrderStatus {
    OPEN = "open",
    COMPLETED = "completed",
    CANCELED = "canceled",
}

export class OrderItem {
    public productId: string;
    public productName: string;
    public quantity: number;
    public unitPrice: number;

    constructor(productId: string, productName: string, quantity: number, unitPrice: number) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    get totalPrice(): number {
        return this.quantity * this.unitPrice;
    }
}

export class Order {
    public ID: string;
    public userID: string;
    public items: OrderItem[];
    public totalAmount: number;
    public status: OrderStatus;
    public createdAt: Date;
    
    constructor(id: string, userID: string, items: OrderItem[], status: OrderStatus = OrderStatus.OPEN, createdAt: Date = new Date()) {
        this.ID = id;
        this.userID = userID;
        this.items = items;
        this.status = status;
        this.createdAt = createdAt;
        this.totalAmount = this.calculateTotal();
    }

    private calculateTotal(): number {
        return this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    }

    public finalize(): void {
        if (this.status === OrderStatus.CANCELED) {
            throw new Error('Cannot finalize a canceled order');
        }
        this.status = OrderStatus.COMPLETED;
    }

    public cancel(): void {
        if (this.status === OrderStatus.COMPLETED) {
            throw new Error('Cannot cancel a completed order');
        }
        this.status = OrderStatus.CANCELED;
    }
}