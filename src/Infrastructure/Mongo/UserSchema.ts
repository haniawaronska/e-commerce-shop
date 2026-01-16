import mongoose from "mongoose";
import { User } from "../../Domain/Model/User";


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    authentication: {
        passwordHash: { type: String, required: true },
        salt: { type: String, required: true}
    },
    role: { type: String, enum: ['admin', 'user', 'anonymous'], default: 'user' },
})


export interface IUserDocument extends mongoose.Document {
    username: string;
    email: string;
    authentication: {
        passwordHash: string;
        salt: string;
    };
    role: string;
}   


export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);

