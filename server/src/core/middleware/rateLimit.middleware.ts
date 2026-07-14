import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
    [key: string]: { count: number; resetAt: number };
}

const store: RateLimitStore = {};

export const rateLimit = (windowMs: number = 60000, max: number = 100) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const key = `${req.ip}-${req.path}`;
        const now = Date.now();
        if (!store[key] || store[key].resetAt < now) {
            store[key] = { count: 1, resetAt: now + windowMs };
            next();
            return;
        }
        store[key].count++;
        if (store[key].count > max) {
            res.status(429).json({ error: "Too many requests", retryAfter: Math.ceil((store[key].resetAt - now) / 1000) });
            return;
        }
        next();
    };
};
