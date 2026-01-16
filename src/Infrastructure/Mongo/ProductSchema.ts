import mongoose, {Schema, Document} from "mongoose";    


export interface IProductDocument extends Document {
    name: string;
    price: number;
    status: string;
    tags: string[];
    description?: string;
};

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' },
    tags: { type: [String], default: [] },
    description: { type: String, required: false },
});

export const ProductModel = mongoose.model<IProductDocument>('Product', ProductSchema);

// export const changeStatus = (id: string, newStatus: string) => {
//     return ProductModel.findByIdAndUpdate(id, { status: newStatus }, { new: true });
// }

// export const updatePrice = (id: string, newPrice: number) => {
//     if (newPrice < 0) {
//         throw new Error('Price cannot be negative');
//     }
//     return ProductModel.findByIdAndUpdate(id, { price: newPrice }, { new: true });
// }   

// export const findByName = (name: string) => {
//     return ProductModel.findOne({ name: name });
// }