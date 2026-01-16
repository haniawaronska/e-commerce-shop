import { ICartRepository } from "../../Domain/Repositories/ICartRepository";
import { Cart, CartItem } from "../../Domain/Model/Cart";
import { CartModel, ICartDocument } from "./CartSchema";
import mongoose from "mongoose";

export class MongoCartRepository implements ICartRepository {
    private toDomain(doc: ICartDocument): Cart {
        const cart = new Cart(doc._id.toString(), doc.userID.toString());
        cart.items = doc.items.map(item => 
            new CartItem(item.productId, item.productName, item.quantity, item.unitPrice)
        );
        return cart;
    }
    
    public async save(cart: Cart): Promise<void> {
        await CartModel.findByIdAndUpdate(
            cart.ID,
            {
                userID: new mongoose.Types.ObjectId(cart.userID),
                items: cart.items.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                })),
                updatedAt: new Date()
            },
            { upsert: true, new: true }
        );
    }

    public async getById(id: string): Promise<Cart | null> {
        const doc = await CartModel.findById(id);
        if (doc) {
            return this.toDomain(doc);
        }
        return null;
    }

    public async findByUserId(userId: string): Promise<Cart | null> {
        const doc = await CartModel.findOne({ userID: new mongoose.Types.ObjectId(userId) });
        if (doc) {
            return this.toDomain(doc);
        }
        return null;
    }

    public async getAll(): Promise<Cart[]> {
        const docs = await CartModel.find();
        return docs.map(doc => this.toDomain(doc));
    }

    public async delete(id: string): Promise<void> {
        const doc = await CartModel.findByIdAndDelete(id);
        if (!doc) {
            throw new Error(`Cart with ID ${id} not found`);
        }
    }

    public async deleteByUserId(userId: string): Promise<void> {
        const doc = await CartModel.findOneAndDelete({ userID: new mongoose.Types.ObjectId(userId) });   
        if (!doc) {
            throw new Error(`Cart for User ID ${userId} not found`);
        }
    }
}