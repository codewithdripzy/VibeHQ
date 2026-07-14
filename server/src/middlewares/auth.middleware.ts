import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { HTTP_RESPONSE_CODE } from "../core/constants/values";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({ message: "No session found, please login" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "vibehq-secret") as any;

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({ message: "User not found" });
        }

        const userData = {
            _id: user._id.toString(),
            uid: user.uid,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            isFirstTime: user.isFirstTime,
        };

        (req as any).user = userData;

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({ message: "Invalid or expired session" });
    }
};

export default authMiddleware;
