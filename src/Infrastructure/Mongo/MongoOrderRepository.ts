import { IOrderRepository } from "../../Domain/Repositories/IOrderRepository";
import { Order, OrderStatus, OrderItem } from "../../Domain/Model/Order";
import { OrderModel, IOrderDocument } from "./OrderSchema";
import mongoose from "mongoose";

export class MongoOrderRepository implements IOrderRepository {
    private toDomain(doc: IOrderDocument): Order {
        const order = new Order(
            doc._id.toString(),
            doc.userID.toString(),
            doc.items.map(item => new OrderItem(item.productId, item.productName, item.quantity, item.unitPrice)),
            doc.status as OrderStatus,
            doc.createdAt
        );
        return order;
    }

    public async save(order: Order): Promise<void> {
        await OrderModel.findByIdAndUpdate(
            order.ID,
            {   
                userID: new mongoose.Types.ObjectId(order.userID),
                items: order.items.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                })),
                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: order.createdAt
            },
            { upsert: true, new: true }
        );
    }

    public async getById(id: string): Promise<Order | null> {
        const doc = await OrderModel.findById(id);
        if (doc) {
            return this.toDomain(doc);
        }   
        return null;
    }

    public async getAll(): Promise<Order[]> {
        const docs = await OrderModel.find();
        return docs.map(doc => this.toDomain(doc));
    }

    public async delete(id: string): Promise<void> {
        const doc = await OrderModel.findByIdAndDelete(id);
        if (!doc) {
            throw new Error(`Order with ID ${id} not found`);
        }
    }

    public async findByUserId(userId: string): Promise<Order[]> {
        const docs = await OrderModel.find({ userID: new mongoose.Types.ObjectId(userId) })
            .sort({ createdAt: -1 });
        return docs.map(doc => this.toDomain(doc));
    }

    public async findByStatus(status: string): Promise<Order[]> {
        const docs = await OrderModel.find({ status: status })
            .sort({ createdAt: -1 });
        return docs.map(doc => this.toDomain(doc));
    }

    public async getAllOrders(): Promise<Order[]> {
        const docs = await OrderModel.find()
            .sort({ createdAt: -1 });
        return docs.map(doc => this.toDomain(doc));
    }
}