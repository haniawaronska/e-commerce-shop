import { Request, Response, NextFunction } from 'express';


export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.session.userId) {
        // Użytkownik niezalogowany
        return res.redirect('/login');  // przekieruj na stronę logowania
    }
    // Użytkownik zalogowany, idź dalej
    next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    if (req.session.role !== 'admin') {
        // Zalogowany, ale nie admin
        return res.status(403).send('Access denied. Admin only.');
    }
    next();
}

export function attachUser(req: Request, res: Response, next: NextFunction) {
    res.locals.user = null;
    res.locals.isAuthenticated = false;
    
    if (req.session.userId) {
        res.locals.user = {
            id: req.session.userId,
            username: req.session.username,
            role: req.session.role
        };
        res.locals.isAuthenticated = true;
    }
    next();
}