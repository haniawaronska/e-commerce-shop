import mongoose from "mongoose";
import { Order, OrderItem, OrderStatus } from "../../Domain/Model/Order";
import { IOrderRepository } from "../../Domain/Repositories/IOrderRepository";
import { ICartRepository } from "../../Domain/Repositories/ICartRepository";
import { Cart } from "../../Domain/Model/Cart";

export class OrderService {
    private orderRepository: IOrderRepository;
    private cartRepository: ICartRepository;

    constructor(orderRepository: IOrderRepository, cartRepository: ICartRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
    }

    public async createOrderFromCart(userId: string): Promise<Order> {
        const cart: Cart | null = await this.cartRepository.findByUserId(userId);
        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty or does not exist");
        }

        const orderItems = cart.items.map(item => 
            new OrderItem(item.productId, item.productName, item.quantity, item.unitPrice)
        );

        const order = new Order(
            new mongoose.Types.ObjectId().toString(),
            userId,
            orderItems,
            OrderStatus.OPEN,
            new Date()
        );

        await this.orderRepository.save(order);
        await this.cartRepository.delete(cart.ID);

        return order;
    }

    public async getOrdersByUserId(userId: string): Promise<Order[]> {
        return this.orderRepository.findByUserId(userId);
    }

    public async getOrderById(orderId: string): Promise<Order | null> {
        return this.orderRepository.getById(orderId);
    }

    public async getAllOrders(): Promise<Order[]> {
        return this.orderRepository.getAllOrders();
    }

    public async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
        return this.orderRepository.findByStatus(status as string);
    }

    public async finalizeOrder(orderId: string): Promise<void> {
        const order = await this.orderRepository.getById(orderId);
        if (!order) {
            throw new Error("Order not found");
        }
        order.finalize();
        await this.orderRepository.save(order);
    }

    public async cancelOrder(orderId: string): Promise<void> {
        const order = await this.orderRepository.getById(orderId);
        if (!order) {
            throw new Error("Order not found");
        }
        order.cancel();
        await this.orderRepository.save(order);
    }
}