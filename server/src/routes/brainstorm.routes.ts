import { Router, Response, NextFunction } from "express";
import { authenticate, AuthRequest } from "../core/middleware/auth.middleware";
import { rateLimit } from "../core/middleware/rateLimit.middleware";
import brainstormService from "../services/brainstorm.service";

const router = Router();

// Start a new brainstorm session
router.post("/", authenticate, rateLimit(), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { companyId, maxDepth, maxTurns, timeLimitMinutes } = req.body;

        if (!companyId) {
            res.status(400).json({ error: "companyId is required" });
            return;
        }

        if (!req.user?._id) {
            res.status(401).json({ error: "Authentication required" });
            return;
        }

        const session = await brainstormService.startSession({
            companyId,
            userId: req.user._id.toString(),
            trigger: "manual",
            maxDepth,
            maxTurns,
            timeLimitMinutes,
        });

        res.status(201).json({ data: session });
    } catch (error) {
        next(error);
    }
});

// Get all brainstorm sessions for a company
router.get("/", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { companyId, limit } = req.query;
        if (!companyId) {
            res.status(400).json({ error: "companyId query param is required" });
            return;
        }
        const sessions = await brainstormService.getCompanySessions(
            companyId as string,
            parseInt(limit as string) || 20
        );
        res.json({ data: sessions });
    } catch (error) {
        next(error);
    }
});

// Get a specific brainstorm session
router.get("/:uid", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const session = await brainstormService.getSession(req.params.uid);
        if (!session) {
            res.status(404).json({ error: "Session not found" });
            return;
        }
        res.json({ data: session });
    } catch (error) {
        next(error);
    }
});

// Pause a brainstorm session
router.patch("/:uid/pause", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const session = await brainstormService.pauseSession(req.params.uid);
        if (!session) {
            res.status(404).json({ error: "Session not found" });
            return;
        }
        res.json({ data: session });
    } catch (error) {
        next(error);
    }
});

// Resume a brainstorm session
router.patch("/:uid/resume", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const session = await brainstormService.resumeSession(req.params.uid);
        if (!session) {
            res.status(404).json({ error: "Session not found" });
            return;
        }
        res.json({ data: session });
    } catch (error) {
        next(error);
    }
});

// Cancel a brainstorm session
router.patch("/:uid/cancel", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const session = await brainstormService.cancelSession(req.params.uid);
        if (!session) {
            res.status(404).json({ error: "Session not found" });
            return;
        }
        res.json({ data: session });
    } catch (error) {
        next(error);
    }
});

// Inject a user message into an active brainstorm session
router.post("/:uid/message", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { message } = req.body;
        if (!message?.trim()) {
            res.status(400).json({ error: "message is required" });
            return;
        }
        if (!req.user?._id) {
            res.status(401).json({ error: "Authentication required" });
            return;
        }

        const companyId = (req.user as any).companyId || req.body.companyId;
        if (!companyId) {
            res.status(400).json({ error: "companyId is required" });
            return;
        }

        const result = await brainstormService.injectUserMessage(
            req.params.uid,
            companyId,
            req.user._id.toString(),
            message.trim()
        );
        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

export default router;
