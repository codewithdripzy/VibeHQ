import { Request, Response, NextFunction } from "express";
import { HTTP_RESPONSE_CODE } from "../core/constants/values";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
        return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({ message: "Unauthorized. No user found." });
    }

    if (!user.role || !user.role.includes("admin")) {
        return res.status(HTTP_RESPONSE_CODE.FORBIDDEN).json({ message: "Forbidden. Admin access required." });
    }

    next();
};
