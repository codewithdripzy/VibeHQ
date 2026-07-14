import Joi from "joi";
import { HTTP_RESPONSE_CODE } from "../core/constants/values";
import { NextFunction, Request, Response } from "express";

export const validateSchema = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({
            message: error.details[0].message,
            details: error.details
        });
    }

    req.body = value;
    next();
}