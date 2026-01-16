import express, { Request, Response } from 'express';
import { ProductService } from "../Application/Services/ProductService";
import { CartService } from "../Application/Services/CartService";
import { MongoProductRepository } from "../Infrastructure/Mongo/MongoProductRepository";
import { MongoCartRepository } from "../Infrastructure/Mongo/MongoCartRepository";
import { MongoUserRepository } from "../Infrastructure/Mongo/MongoUserRepository";
import { MongoOrderRepository } from '../Infrastructure/Mongo/MongoOrderRepository';
import path from 'path';
import mongoose from 'mongoose';
import session from 'express-session';
import { requireAdmin, requireAuth, attachUser } from './middleware/auth';
import { UserService } from '../Application/Services/UserService';
import { Order } from '../Domain/Model/Order';
import { OrderService } from '../Application/Services/OrderService';


const productRepo = new MongoProductRepository();
const cartRepo = new MongoCartRepository();
const userRepo = new MongoUserRepository();
const orderRepo = new MongoOrderRepository();

const MONGO_URL = "mongodb+srv://waronskahania:LtC0E3WTh64uzLEW@cluster.lesfs7d.mongodb.net/";
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (err) => { console.log(err) });

const productService = new ProductService(productRepo);
const cartService = new CartService(cartRepo, productRepo);
const userService = new UserService(userRepo);
const orderService = new OrderService(orderRepo, cartRepo);


(async () => {
    try {
        const existingProducts = await productService.getAllProducts();
        if (existingProducts.length === 0) {
            await productService.createProduct(new mongoose.Types.ObjectId().toString(), "Laptop", 5000);
            await productService.createProduct(new mongoose.Types.ObjectId().toString(), "Wireless Mouse", 100);
            await productService.createProduct(new mongoose.Types.ObjectId().toString(), "Mechanical Keyboard", 300);
            console.log("Przykładowe produkty dodane");
        }
    } catch (error) {
        console.log("Błąd inicjalizacji produktów:", error);
    }
})();

// const expressLayouts = require('express-ejs-layouts');
const app = express();
const PORT = 3003;
// app.use(expressLayouts);
// app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'TAJNY-KLUCZ-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(attachUser);


app.get('/', (req: Request, res: Response) => {
    res.render('index', { title: 'Strona Główna' });
});

app.get('/register', (req: Request, res: Response) => {
    if (req.session.userId) {
        return res.redirect('/catalog');
    }
    res.render('register', { title: 'Rejestracja' });
});

app.post('/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.render('register', {
            title: 'Rejestracja',
            error: 'Wszystkie pola są wymagane'
        });
    }
    if (password.length < 6) {
        return res.render('register', {
            title: 'Rejestracja',
            error: 'Hasło musi mieć co najmniej 6 znaków'
        });
    }
    try {
        const newUser = await userService.register(username, email, password);

        req.session.userId = newUser.ID;
        req.session.username = newUser.username;
        req.session.role = newUser.role;

        res.redirect('/catalog');
    }
    catch (error) {
        res.render('register', {
            title: 'Rejestracja',
            error: error instanceof Error ? error.message : 'Błąd rejestracji'
        });
    }
});

app.get('/login', (req: Request, res: Response) => {
    res.render('login', { title: 'Logowanie' });
});

app.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await userService.login(username, password);

        req.session.userId = user.ID;
        req.session.username = user.username;
        req.session.role = user.role;
        if (req.session.role === 'admin') {
            res.redirect('/manager');
        } else {
            res.redirect('/catalog');
        }
    } catch (error) {
        res.render('login', {
            title: 'Logowanie',
            error: error instanceof Error ? error.message : 'Błąd logowania'
        });
    }
});

app.post('/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

app.get('/catalog', async (req: Request, res: Response) => {
    const products = await productService.getAllProducts();
    res.render('catalog', { title: 'Katalog Produktów', products: products });
});

app.get('/catalog/search', async (req: Request, res: Response) => {
    const query = req.query.q as string;
    const products = await productService.searchProducts(query);
    res.render('catalog', { title: 'Wyniki wyszukiwania', products: products });
});

app.get('/product/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const product = await productService.getProductDetails(id);
        res.render('product', { title: 'Szczegóły Produktu', product: product });
    } catch (error) {
        res.status(404).send('Produkt nie znaleziony');
    }
});

app.get('/cart', requireAuth, async (req: Request, res: Response) => {
    const userId = req.session.userId!;
    const cart = await cartService.getCart(userId);
    res.render('cart', { title: 'Twój Koszyk', cart: cart });
});

app.post('/cart/add/:productId', requireAuth, async (req: Request, res: Response) => {
    const userId = req.session.userId!;
    const productId = req.params.productId;
    try {
        await cartService.addToCart(userId, productId, 1);
        res.redirect('/cart');
    }
    catch (error) {
        res.send("Błąd dodawania do koszyka: " + error);
    }
});

app.post('/cart/decrease/:productId', requireAuth, async (req: Request, res: Response) => {
    const userId = req.session.userId!;
    const productId = req.params.productId;

    try {
        await cartService.decreaseQuantity(userId, productId, 1);
        res.redirect('/cart');
    }
    catch (error) {
        res.send("Błąd zmniejszania ilości w koszyku: " + error);
    }
});

app.post('/cart/increase/:productId', requireAuth, async (req: Request, res: Response) => {
    const userId = req.session.userId!;
    const productId = req.params.productId;
    try {
        await cartService.increaseQuantity(userId, productId, 1);
        res.redirect('/cart');
    }
    catch (error) {
        res.send("Błąd zwiększania ilości w koszyku: " + error);
    }
});

app.post('/cart/remove/:productId', requireAuth, async (req: Request, res: Response) => {
    const userId = req.session.userId!;
    const productId = req.params.productId;

    try {
        await cartService.removeFromCart(userId, productId);
        res.redirect('/cart');
    }
    catch (error) {
        res.send("Błąd usuwania z koszyka: " + error);
    }
});

app.post('/cart/clear', requireAuth, async (req: Request, res: Response) => {
    const userId = req.session.userId!;
    try {
        await cartService.clearCart(userId);
        res.redirect('/cart');
    }
    catch (error) {
        res.send("Błąd czyszczenia koszyka: " + error);
    }
});

app.post('/cart/checkout', requireAuth, async (req: Request, res: Response) => {
    const userId = req.session.userId!;
    try {
        const order = await orderService.createOrderFromCart(userId);
        res.redirect('/orders');
    }
    catch (error) {
        res.send("Błąd podczas składania zamówienia: " + error);
    }
});

app.get('/orders', requireAuth, async (req: Request, res: Response) => {
    const userId = req.session.userId!;
    const orders = await orderService.getOrdersByUserId(userId);
    res.render('orders', { title: 'Your Orders', orders: orders });
});

app.get('/orders/:id', requireAuth, async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);
    if (!order) {
        return res.status(404).send('Order not found');
    }
    if (order.userID !== req.session.userId) {
        return res.status(403).send('Access denied');
    }
    res.render('order-details', { title: 'Order Details', order: order });
});


app.get('/manager', requireAdmin, async (req: Request, res: Response) => {
    const products = await productService.getAllProducts();
    res.render('manager', { title: 'Manager Panel', products: products });
});

app.get('/manager/orders', requireAdmin, async (req: Request, res: Response) => {
    const orders = await orderService.getAllOrders();
    res.render('manager-orders', { title: 'All Orders', orders: orders });
});

app.post('/manager/orders/finalize/:id', requireAdmin, async (req: Request, res: Response) => {
    const orderId = req.params.id;
    try {
        await orderService.finalizeOrder(orderId);
        res.redirect('/manager/orders');
    }
    catch (error) {
        res.send("Błąd finalizacji zamówienia: " + error);
    }
});

app.post('/manager/orders/cancel/:id', requireAdmin, async (req: Request, res: Response) => {
    const orderId = req.params.id;
    try {
        await orderService.cancelOrder(orderId);
        res.redirect('/manager/orders');
    }
    catch (error) {
        res.send("Błąd anulowania zamówienia: " + error);
    }
});

app.get('/manager/add', requireAdmin, (req: Request, res: Response) => {
    res.render('product-form', {
        title: 'Add New Product',
        action: '/manager/add',
        product: null
    });
});

app.post('/manager/add', requireAdmin, async (req: Request, res: Response) => {
    const { name, price } = req.body;

    try {
        const id = new mongoose.Types.ObjectId().toString();
        await productService.createProduct(id, name, Number(price));
        res.redirect('/manager');
    } catch (error) {
        res.send("Błąd: " + error);
    }
});

app.get('/manager/edit/:id', requireAdmin, async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const product = await productService.getProductDetails(id);
        res.render('product-form', {
            title: 'Edytuj Produkt',
            action: '/manager/edit/' + id,
            product: product
        });
    } catch (error) {
        res.status(404).send('Produkt nie znaleziony');
    }
});


app.post('/manager/edit/:id', requireAdmin, async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name, price } = req.body;

    try {
        await productService.updateProduct(id, name, Number(price));
        res.redirect('/manager');
    } catch (error) {
        res.send("Błąd edycji: " + error);
    }
});


app.post('/manager/delete/:id', requireAdmin, async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        await productService.deleteProduct(id); res.redirect('/manager');
    } catch (error) {
        res.send("Błąd usuwania: " + error);
    }
});

app.get('/manager/users', requireAdmin, async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.render('manager-users', { title: 'User Management', users: users });
});

app.post('/manager/users/role/:id', requireAdmin, async (req: Request, res: Response) => {
    const id = req.params.id;
    const { newRole } = req.body;
    try {
        await userService.changeUserRole(id, newRole);
        res.redirect('/manager/users');
    }
    catch (error) {
        res.send("Błąd zmiany roli użytkownika: " + error);
    }
});

app.post('/manager/users/delete/:id', requireAdmin, async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        await userService.deleteUser(id);
        res.redirect('/manager/users');
    }
    catch (error) {
        res.send("Błąd usuwania użytkownika: " + error);
    }
});


app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});