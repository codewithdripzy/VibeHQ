import { Schema } from "mongoose";

const companySchema = new Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
        },
        logo: {
            type: String,
        },
        industry: {
            type: String,
        },
        website: {
            type: String,
        },
        mission: {
            type: String,
        },
        vision: {
            type: String,
        },
        values: {
            type: [String],
            default: [],
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["draft", "active", "paused", "archived"],
            default: "draft",
        },
        teams: [
            {
                type: Schema.Types.ObjectId,
                ref: "Team",
            },
        ],
        resources: [
            {
                type: Schema.Types.ObjectId,
                ref: "CompanyResource",
            },
        ],
        projects: [
            {
                type: Schema.Types.ObjectId,
                ref: "Project",
            },
        ],
        channels: [
            {
                type: Schema.Types.ObjectId,
                ref: "Channel",
            },
        ],
        customers: [
            {
                type: Schema.Types.ObjectId,
                ref: "Customer",
            },
        ],
        ideas: [
            {
                type: Schema.Types.ObjectId,
                ref: "Idea",
            },
        ],
        socialFeed: [
            {
                type: Schema.Types.ObjectId,
                ref: "SocialPost",
            },
        ],
        revenues: [
            {
                type: Schema.Types.ObjectId,
                ref: "Revenue",
            },
        ],
        invoices: [
            {
                type: Schema.Types.ObjectId,
                ref: "Invoice",
            },
        ],
        forecasts: [
            {
                type: Schema.Types.ObjectId,
                ref: "FinancialForecast",
            },
        ],
        cronJobs: [
            {
                type: Schema.Types.ObjectId,
                ref: "CronJob",
            },
        ],
        workflows: [
            {
                type: Schema.Types.ObjectId,
                ref: "Workflow",
            },
        ],
        escalationChains: [
            {
                type: Schema.Types.ObjectId,
                ref: "EscalationChain",
            },
        ],
        approvalWorkflows: [
            {
                type: Schema.Types.ObjectId,
                ref: "ApprovalWorkflow",
            },
        ],
        meetingBookings: [
            {
                type: Schema.Types.ObjectId,
                ref: "MeetingBooking",
            },
        ],
        externalCalendars: [
            {
                type: Schema.Types.ObjectId,
                ref: "ExternalCalendar",
            },
        ],
        calendarEvents: [
            {
                type: Schema.Types.ObjectId,
                ref: "CompanyCalendarEvent",
            },
        ],
        knowledgeEntries: [
            {
                type: Schema.Types.ObjectId,
                ref: "KnowledgeEntry",
            },
        ],
        decisionLogs: [
            {
                type: Schema.Types.ObjectId,
                ref: "DecisionLog",
            },
        ],
        anomalyAlerts: [
            {
                type: Schema.Types.ObjectId,
                ref: "AnomalyAlert",
            },
        ],
        slaTrackings: [
            {
                type: Schema.Types.ObjectId,
                ref: "SLATracking",
            },
        ],
        rbacRoles: [
            {
                type: Schema.Types.ObjectId,
                ref: "RBACRole",
            },
        ],
        secretStores: [
            {
                type: Schema.Types.ObjectId,
                ref: "SecretStore",
            },
        ],
        complianceRecords: [
            {
                type: Schema.Types.ObjectId,
                ref: "ComplianceRecord",
            },
        ],
        supportTickets: [
            {
                type: Schema.Types.ObjectId,
                ref: "SupportTicket",
            },
        ],
        customerOnboardings: [
            {
                type: Schema.Types.ObjectId,
                ref: "CustomerOnboarding",
            },
        ],
        feedbackLoops: [
            {
                type: Schema.Types.ObjectId,
                ref: "FeedbackLoop",
            },
        ],
        contentCalendar: [
            {
                type: Schema.Types.ObjectId,
                ref: "ContentCalendar",
            },
        ],
        seoMonitors: [
            {
                type: Schema.Types.ObjectId,
                ref: "SEOMonitor",
            },
        ],
        abExperiments: [
            {
                type: Schema.Types.ObjectId,
                ref: "ABExperiment",
            },
        ],
        toolConfigs: [
            {
                type: Schema.Types.ObjectId,
                ref: "AgentToolConfig",
            },
        ],
        mcpServers: [
            {
                type: Schema.Types.ObjectId,
                ref: "MCPServer",
            },
        ],
        llmConfigs: [
            {
                type: Schema.Types.ObjectId,
                ref: "LLMConfig",
            },
        ],
        billing: {
            plan: {
                type: String,
                enum: ["free", "starter", "professional", "enterprise"],
                default: "free",
            },
            stripeCustomerId: {
                type: String,
            },
            monthlyBudget: {
                type: Number,
                default: 0,
            },
            spentThisMonth: {
                type: Number,
                default: 0,
            },
            billingCycleStart: {
                type: Date,
                default: Date.now,
            },
        },
        settings: {
            maxAgents: {
                type: Number,
                default: 5,
            },
            maxTeams: {
                type: Number,
                default: 3,
            },
            autoHire: {
                type: Boolean,
                default: false,
            },
            approvalRequired: {
                type: Boolean,
                default: true,
            },
            allowedToolCategories: {
                type: [String],
                default: [],
            },
            timezone: {
                type: String,
                default: "UTC",
            },
            defaultCurrency: {
                type: String,
                default: "USD",
            },
        },
        metadata: {
            foundedDate: {
                type: Date,
            },
            employeeCount: {
                type: Number,
                default: 0,
            },
            activeProjectCount: {
                type: Number,
                default: 0,
            },
            totalRevenue: {
                type: Number,
                default: 0,
            },
            totalExpenses: {
                type: Number,
                default: 0,
            },
            totalCustomers: {
                type: Number,
                default: 0,
            },
        },
        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

companySchema.index({ owner: 1 });
companySchema.index({ slug: 1 });
companySchema.index({ status: 1 });

export default companySchema;
