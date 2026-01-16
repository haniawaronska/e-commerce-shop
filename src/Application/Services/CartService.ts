import mongoose from "mongoose";
import { Cart } from "../../Domain/Model/Cart";
import { ICartRepository } from "../../Domain/Repositories/ICartRepository";
import { IProductRepository } from "../../Domain/Repositories/IProductRepository";

export class CartService {
    constructor(
        private readonly cartRepo: ICartRepository,
        private readonly productRepo: IProductRepository
    ) {}

    public async getCart(userId: string): Promise<Cart> {
        let cart = await this.cartRepo.findByUserId(userId);
        if (!cart) {
            cart = new Cart(new mongoose.Types.ObjectId().toString(), userId);
            await this.cartRepo.save(cart);
        }
        return cart;
    }

    public async addToCart(userId: string, productId: string, quantity: number = 1): Promise<void> {
        const cart = await this.getCart(userId);
        const product = await this.productRepo.getById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        cart.addProduct(product, quantity);
        await this.cartRepo.save(cart);
    }

    public async decreaseQuantity(userId: string, productId: string, quantity: number = 1): Promise<void> {
        const cart = await this.getCart(userId);
        cart.decreaseProduct(productId, quantity);
        await this.cartRepo.save(cart);
    }

    public async increaseQuantity(userId: string, productId: string, quantity: number = 1): Promise<void> {
        const cart = await this.getCart(userId);
        cart.increaseProduct(productId, quantity);
        await this.cartRepo.save(cart);
    }

    public async removeFromCart(userId: string, productId: string): Promise<void> {
        const cart = await this.getCart(userId);
        cart.removeProduct(productId);
        await this.cartRepo.save(cart);
    }

    public async clearCart(userId: string): Promise<void> {
        await this.cartRepo.deleteByUserId(userId);
    }
}