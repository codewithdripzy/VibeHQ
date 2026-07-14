import { Router } from "express";
import { AuthRequest, authenticate } from "../core/middleware/auth.middleware";
import { validate } from "../core/middleware/validation.middleware";
import { rateLimit } from "../core/middleware/rateLimit.middleware";
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export interface CrudRouteOptions {
    service: any;
    createSchema?: Joi.ObjectSchema;
    updateSchema?: Joi.ObjectSchema;
    paramName?: string;
    companyIdExtractor?: (req: AuthRequest) => string;
    middleware?: any[];
}

export function createCrudRoutes(options: CrudRouteOptions): Router {
    const router = Router();
    const { service, createSchema, updateSchema, paramName = "id", companyIdExtractor = (req) => req.user?.companyId || "", middleware = [] } = options;

    router.get("/", authenticate, ...middleware, rateLimit(), async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const companyId = companyIdExtractor(req);
            const filter = companyId ? { company: companyId } : {};
            const result = await service.findAll(filter, {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 20,
                sort: (req.query.sort as string) || "createdAt",
                order: (req.query.order as "asc" | "desc") || "desc",
                search: req.query.search as string,
                searchFields: (req.query.searchFields as string)?.split(",") || [],
            });
            res.json(result);
        } catch (error) { next(error); }
    });

    router.get(`/:${paramName}`, authenticate, ...middleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const doc = await service.findById(req.params[paramName]);
            res.json(doc);
        } catch (error) { next(error); }
    });

    const createHandlers = [authenticate, ...middleware, rateLimit()];
    if (createSchema) createHandlers.push(validate(createSchema));
    router.post("/", ...createHandlers, async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const companyId = companyIdExtractor(req);
            if (companyId && !req.body.company) req.body.company = companyId;
            if (!req.body.uid) req.body.uid = `uid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const doc = await service.create(req.body);
            res.status(201).json(doc);
        } catch (error) { next(error); }
    });

    const updateHandlers = [authenticate, ...middleware, rateLimit()];
    if (updateSchema) updateHandlers.push(validate(updateSchema));
    router.put(`/:${paramName}`, ...updateHandlers, async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const doc = await service.update(req.params[paramName], req.body);
            res.json(doc);
        } catch (error) { next(error); }
    });

    router.patch(`/:${paramName}`, ...updateHandlers, async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const doc = await service.update(req.params[paramName], req.body);
            res.json(doc);
        } catch (error) { next(error); }
    });

    router.delete(`/:${paramName}`, authenticate, ...middleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            await service.softDelete(req.params[paramName]);
            res.json({ message: "Deleted" });
        } catch (error) { next(error); }
    });

    return router;
}
