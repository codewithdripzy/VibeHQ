import { Router } from "express";
import { createCrudRoutes } from "./crudRoutes";
import { services } from "../services";
import authRouter from "./auth.routes";
import brainstormRouter from "./brainstorm.routes";
import { authenticate, AuthRequest } from "../core/middleware/auth.middleware";
import { rateLimit } from "../core/middleware/rateLimit.middleware";
import { Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import brainstormService from "../services/brainstorm.service";

const router = Router();

// Auth
router.use("/auth", authRouter);

// Brainstorm
router.use("/brainstorm", brainstormRouter);

// Core entities
router.use("/users", createCrudRoutes({ service: services.user }));

// Company with auto-set owner/slug and starting team creation
const companyRouter = Router();
companyRouter.get("/", authenticate, rateLimit(), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await services.company.findAll(
            {},
            {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 20,
                sort: (req.query.sort as string) || "createdAt",
                order: (req.query.order as "asc" | "desc") || "desc",
                search: req.query.search as string,
                searchFields: (req.query.searchFields as string)?.split(",") || [],
            }
        );
        res.json(result);
    } catch (error) { next(error); }
});
companyRouter.get("/:id", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const doc = await services.company.findById(req.params.id);
        res.json({ data: doc });
    } catch (error) { next(error); }
});
companyRouter.post("/", authenticate, rateLimit(), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name, slug, startingTeams, ...rest } = req.body;
        if (!req.user?._id) {
            res.status(401).json({ error: "Authentication required" });
            return;
        }
        const companyData = {
            ...rest,
            uid: uuidv4(),
            name,
            slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
            owner: req.user._id,
        };
        const company = await services.company.create(companyData);

        const teams = Array.isArray(startingTeams) && startingTeams.length > 0
            ? await Promise.all(startingTeams.map((t: any) =>
                services.team.create({
                    uid: uuidv4(),
                    name: t.name,
                    slug: t.slug || t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                    company: (company as any)._id,
                    department: t.department || "executive",
                } as any)
            ))
            : [await services.team.create({
                uid: uuidv4(),
                name: `${name} Team`,
                slug: companyData.slug,
                company: (company as any)._id,
                department: "executive",
            } as any)];

        await services.company.update((company as any)._id, { teams: teams.map((t: any) => t._id) });

        // Auto-create a board meeting + brainstorm session
        try {
            const meetingUid = uuidv4();
            const meeting = await services.meeting.create({
                uid: meetingUid,
                title: `Board Meeting — ${name} Launch`,
                description: `Initial board meeting to brainstorm strategy for ${name}.`,
                company: (company as any)._id,
                type: "executive_board",
                status: "in_progress",
                scheduledAt: new Date(),
                durationMinutes: 10,
                organizer: teams[0]?._id,
                attendees: teams.map((t: any) => t._id),
            } as any);

            // Start brainstorm session linked to the meeting
            const session = await brainstormService.startSession({
                companyId: (company as any)._id.toString(),
                userId: req.user._id.toString(),
                trigger: "manual",
                maxDepth: 5,
                maxTurns: 30,
                timeLimitMinutes: 10,
            });

            // Link meeting to brainstorm session
            await services.meeting.update((meeting as any)._id, { notes: `Brainstorm Session: ${session.uid}` } as any);
        } catch (err) {
            console.error("Failed to auto-create board meeting:", err);
            // Non-fatal — company was created successfully
        }

        res.status(201).json({ message: "Company created", data: company });
    } catch (error) {
        next(error);
    }
});
companyRouter.put("/:id", authenticate, rateLimit(), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const doc = await services.company.update(req.params.id, req.body);
        res.json(doc);
    } catch (error) { next(error); }
});
companyRouter.patch("/:id", authenticate, rateLimit(), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const doc = await services.company.update(req.params.id, req.body);
        res.json(doc);
    } catch (error) { next(error); }
});
companyRouter.delete("/:id", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        await services.company.softDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (error) { next(error); }
});
router.use("/companies", companyRouter);
router.use("/teams", createCrudRoutes({ service: services.team }));
router.use("/agents", createCrudRoutes({ service: services.agent }));
router.use("/agent-memories", createCrudRoutes({ service: services.agentMemory }));
router.use("/resources", createCrudRoutes({ service: services.resource }));

// Project management
router.use("/projects", createCrudRoutes({ service: services.project }));
router.use("/tasks", createCrudRoutes({ service: services.task }));
router.use("/sprints", createCrudRoutes({ service: services.sprint }));
router.use("/milestones", createCrudRoutes({ service: services.milestone }));
router.use("/meetings", createCrudRoutes({ service: services.meeting }));
router.use("/documents", createCrudRoutes({ service: services.document }));

// Communication
router.use("/channels", createCrudRoutes({ service: services.channel }));
router.use("/direct-messages", createCrudRoutes({ service: services.directMessage }));
router.use("/social-posts", createCrudRoutes({ service: services.socialPost }));
router.use("/notifications", createCrudRoutes({ service: services.notification }));

// Business
router.use("/customers", createCrudRoutes({ service: services.customer }));
router.use("/campaigns", createCrudRoutes({ service: services.campaign }));
router.use("/okrs", createCrudRoutes({ service: services.okr }));
router.use("/ideas", createCrudRoutes({ service: services.idea }));

// Financial
router.use("/revenue", createCrudRoutes({ service: services.revenue }));
router.use("/invoices", createCrudRoutes({ service: services.invoice }));
router.use("/forecasts", createCrudRoutes({ service: services.forecast }));
router.use("/expenses", createCrudRoutes({ service: services.expense }));

// Automation
router.use("/cron-jobs", createCrudRoutes({ service: services.cronJob }));
router.use("/workflows", createCrudRoutes({ service: services.workflow }));
router.use("/escalation-chains", createCrudRoutes({ service: services.escalationChain }));
router.use("/approval-workflows", createCrudRoutes({ service: services.approvalWorkflow }));

// Error handling
router.use("/error-logs", createCrudRoutes({ service: services.errorLog }));
router.use("/checkpoints", createCrudRoutes({ service: services.checkpoint }));

// Calendar
router.use("/meeting-bookings", createCrudRoutes({ service: services.meetingBooking }));
router.use("/external-calendars", createCrudRoutes({ service: services.externalCalendar }));
router.use("/calendar-events", createCrudRoutes({ service: services.companyCalendarEvent }));

// Knowledge
router.use("/knowledge-entries", createCrudRoutes({ service: services.knowledgeEntry }));
router.use("/decision-logs", createCrudRoutes({ service: services.decisionLog }));

// Monitoring
router.use("/anomaly-alerts", createCrudRoutes({ service: services.anomalyAlert }));
router.use("/sla-tracking", createCrudRoutes({ service: services.slaTracking }));

// Security
router.use("/rbac-roles", createCrudRoutes({ service: services.rbacRole }));
router.use("/secrets", createCrudRoutes({ service: services.secretStore }));
router.use("/compliance-records", createCrudRoutes({ service: services.complianceRecord }));
router.use("/tool-configs", createCrudRoutes({ service: services.agentToolConfig }));

// Support
router.use("/support-tickets", createCrudRoutes({ service: services.supportTicket }));
router.use("/customer-onboardings", createCrudRoutes({ service: services.customerOnboarding }));
router.use("/feedback", createCrudRoutes({ service: services.feedbackLoop }));

// Marketing
router.use("/content-calendar", createCrudRoutes({ service: services.contentCalendar }));
router.use("/seo-monitors", createCrudRoutes({ service: services.seoMonitor }));
router.use("/experiments", createCrudRoutes({ service: services.abExperiment }));

// Infrastructure
router.use("/event-logs", createCrudRoutes({ service: services.eventLog }));
router.use("/mcp-servers", createCrudRoutes({ service: services.mcpServer }));
router.use("/llm-configs", createCrudRoutes({ service: services.llmConfig }));

// Audit
router.use("/audit-logs", createCrudRoutes({ service: services.auditLog }));

// Brainstorm sessions (CRUD)
router.use("/brainstorm-sessions", createCrudRoutes({
    service: services.brainstormSession,
    companyIdExtractor: (req) => (req.query.companyId as string) || req.user?.companyId || "",
}));

export default router;
