import { Router } from "express";
import { createCrudRoutes } from "./crudRoutes";
import { services } from "../services";
import authRouter from "./auth.routes";
import { authenticate, AuthRequest } from "../core/middleware/auth.middleware";
import { rateLimit } from "../core/middleware/rateLimit.middleware";
import { Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Auth
router.use("/auth", authRouter);

// Core entities
router.use("/users", createCrudRoutes({ service: services.user }));

// Company with auto-set owner/slug and starting team creation
const companyRouter = createCrudRoutes({ service: services.company });
companyRouter.post("/", authenticate, rateLimit(), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name, slug, startingTeams, ...rest } = req.body;
        if (!req.user?._id) {
            res.status(401).json({ error: "Authentication required" });
            return;
        }
        const companyData = {
            ...rest,
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

        res.status(201).json({ company, teams });
    } catch (error) {
        next(error);
    }
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

export default router;
