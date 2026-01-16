import mongoose from "mongoose"

export interface ICartItemDocument {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
}

const CartItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
}, { _id: false });

const CartSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [CartItemSchema], required: true },
    updatedAt: { type: Date, default: Date.now }
});

export interface ICartDocument extends mongoose.Document {
    userID: mongoose.Types.ObjectId;
    items: ICartItemDocument[];
    updatedAt: Date;
}

export const CartModel = mongoose.model<ICartDocument>("Cart", CartSchema);