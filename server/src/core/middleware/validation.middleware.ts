import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validate = (schema: Joi.ObjectSchema, source: "body" | "query" | "params" = "body") => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
        if (error) {
            const errors = error.details.map(d => ({
                field: d.path.join("."),
                message: d.message,
            }));
            res.status(400).json({ error: "Validation failed", details: errors });
            return;
        }
        (req as any)[source] = value;
        next();
    };
};
