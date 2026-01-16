import mongoose from "mongoose";

export interface IOrderItemDocument {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
}

const OrderItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
}, { _id: false });


const OrderSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['open', 'completed', 'canceled'], default: 'open' },
    createdAt: { type: Date, default: Date.now }
});

export interface IOrderDocument extends mongoose.Document {
    userID: mongoose.Types.ObjectId;
    items: IOrderItemDocument[];
    totalAmount: number;
    status: string;
    createdAt: Date;
}

export const OrderModel = mongoose.model<IOrderDocument>("Order", OrderSchema);