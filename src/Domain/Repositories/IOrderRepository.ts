import { Order } from "../Model/Order";
import { IRepository } from "./IRepository";

export interface IOrderRepository extends IRepository<Order> {
    findByUserId(userId: string): Promise<Order[]>;
    findByStatus(status: string): Promise<Order[]>;
    getAllOrders(): Promise<Order[]>;
}