import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "vibehq-secret-key";

export interface AuthRequest extends Request {
    user?: {
        uid: string;
        email: string;
        role: string[];
        companyId?: string;
    };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ error: "No token provided" });
            return;
        }
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const user = await User.findOne({ uid: decoded.uid, deletedAt: null }).select("-password");
        if (!user) {
            res.status(401).json({ error: "User not found" });
            return;
        }
        req.user = {
            uid: user.uid,
            email: user.email,
            role: user.role || [],
            companyId: decoded.companyId,
        };
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        if (roles.length > 0 && !roles.some(r => req.user!.role.includes(r))) {
            res.status(403).json({ error: "Insufficient permissions" });
            return;
        }
        next();
    };
};
