import { Schema } from "mongoose";

const performanceRecordSchema = new Schema(
    {
        taskId: { type: Schema.Types.ObjectId, ref: "Task" },
        taskTitle: { type: String },
        completedAt: { type: Date },
        timeSpentMs: { type: Number },
        estimatedTimeMs: { type: Number },
        qualityScore: { type: Number },
        efficiencyScore: { type: Number },
        overallScore: { type: Number },
        feedback: { type: String },
    },
    { _id: false }
);

const skillSchema = new Schema(
    {
        name: { type: String, required: true },
        level: { type: Number, default: 1, min: 1, max: 100 },
        maxLevel: { type: Number, default: 100 },
        experience: { type: Number, default: 0 },
        experienceToNextLevel: { type: Number, default: 100 },
        endorsements: { type: Number, default: 0 },
    },
    { _id: false }
);

const rewardSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["bonus", "promotion", "extra_budget", "pto", "recognition", "skill_upgrade"],
            required: true,
        },
        title: { type: String, required: true },
        description: { type: String },
        awardedAt: { type: Date, default: Date.now },
        awardedBy: { type: Schema.Types.ObjectId, ref: "Agent" },
        metadata: { type: Schema.Types.Mixed },
    },
    { _id: false }
);

const badgeSchema = new Schema(
    {
        name: { type: String, required: true },
        icon: { type: String },
        description: { type: String },
        earnedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const promotionHistorySchema = new Schema(
    {
        from: {
            type: String,
            enum: [
                "intern",
                "junior",
                "mid_level",
                "senior",
                "staff",
                "principal",
                "director",
                "vice_president",
                "executive",
                "c_level",
            ],
        },
        to: {
            type: String,
            enum: [
                "intern",
                "junior",
                "mid_level",
                "senior",
                "staff",
                "principal",
                "director",
                "vice_president",
                "executive",
                "c_level",
            ],
        },
        date: { type: Date, default: Date.now },
        reason: { type: String },
    },
    { _id: false }
);

const mistakeHistorySchema = new Schema(
    {
        task: { type: String },
        mistake: { type: String },
        lesson: { type: String },
        learnedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const bestPracticeSchema = new Schema(
    {
        pattern: { type: String },
        description: { type: String },
        timesApplied: { type: Number, default: 0 },
    },
    { _id: false }
);

const agentSchema = new Schema(
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
        avatar: {
            type: String,
        },
        role: {
            type: String,
            enum: [
                "ceo",
                "coo",
                "cto",
                "cpo",
                "cmo",
                "cfo",
                "general_counsel",
                "vp_engineering",
                "vp_product",
                "vp_marketing",
                "vp_sales",
                "vp_design",
                "software_architect",
                "senior_engineer",
                "mid_engineer",
                "junior_engineer",
                "devops_engineer",
                "qa_engineer",
                "security_engineer",
                "data_engineer",
                "ai_engineer",
                "product_manager",
                "project_manager",
                "scrum_master",
                "ux_researcher",
                "ux_designer",
                "ui_designer",
                "brand_designer",
                "technical_writer",
                "marketing_strategist",
                "seo_specialist",
                "content_writer",
                "social_media_manager",
                "video_creator",
                "graphic_designer",
                "email_marketing",
                "sdr",
                "sales_executive",
                "customer_success",
                "crm_manager",
                "analyst",
                "data_scientist",
                "customer_support",
                "employee",
            ],
            required: true,
        },
        rank: {
            type: String,
            enum: [
                "intern",
                "junior",
                "mid_level",
                "senior",
                "staff",
                "principal",
                "director",
                "vice_president",
                "executive",
                "c_level",
            ],
            default: "junior",
        },
        status: {
            type: String,
            enum: ["idle", "working", "paused", "offline", "on_leave"],
            default: "idle",
        },
        employmentType: {
            type: String,
            enum: ["full_time", "part_time", "contract", "intern"],
            default: "full_time",
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        team: {
            type: Schema.Types.ObjectId,
            ref: "Team",
            required: true,
        },
        manager: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
        },
        directReports: [
            {
                type: Schema.Types.ObjectId,
                ref: "Agent",
            },
        ],
        hireDate: {
            type: Date,
            default: Date.now,
        },
        probationEndDate: {
            type: Date,
        },
        lastActiveAt: {
            type: Date,
        },

        // ─── System Prompt & Instructions ─────────────────────────────
        systemPrompt: {
            type: String,
            default: "",
        },
        instructions: {
            dos: {
                type: [String],
                default: [],
            },
            donts: {
                type: [String],
                default: [],
            },
            context: {
                type: [String],
                default: [],
            },
            overrides: [
                {
                    field: { type: String },
                    value: { type: String },
                    overriddenBy: { type: Schema.Types.ObjectId, ref: "Agent" },
                    overriddenAt: { type: Date },
                    reason: { type: String },
                },
            ],
        },

        // ─── Configuration (PM-modifiable) ────────────────────────────
        config: {
            autonomy: { type: Number, default: 50, min: 0, max: 100 },
            creativity: { type: Number, default: 60, min: 0, max: 100 },
            creativityMode: {
                type: String,
                enum: ["conservative", "balanced", "experimental", "unbounded"],
                default: "balanced",
            },
            riskTolerance: { type: Number, default: 40, min: 0, max: 100 },
            detailLevel: { type: Number, default: 70, min: 0, max: 100 },
            responseStyle: {
                type: String,
                enum: ["formal", "casual", "technical", "friendly", "direct", "diplomatic", "encouraging", "analytical"],
                default: "friendly",
            },
            proactivity: { type: Number, default: 60, min: 0, max: 100 },
            collaborationPreference: { type: Number, default: 70, min: 0, max: 100 },
            maxConcurrentTasks: { type: Number, default: 3 },
            preferredWorkingHours: {
                start: { type: Number, default: 9 },
                end: { type: Number, default: 17 },
            },
            customInstructions: {
                type: [String],
                default: [],
            },
        },

        // ─── Search & Research Capabilities ───────────────────────────
        searchCapabilities: {
            hasSearchAccess: { type: Boolean, default: true },
            searchDepth: {
                type: String,
                enum: ["quick", "standard", "deep", "exhaustive"],
                default: "standard",
            },
            allowedDomains: { type: [String], default: [] },
            blockedDomains: { type: [String], default: [] },
            autoResearch: { type: Boolean, default: false },
            researchOnTaskStart: { type: Boolean, default: true },
            trendingTopicsAccess: { type: Boolean, default: false },
            recursionDepth: { type: Number, default: 2 },
            maxSearchesPerTask: { type: Number, default: 10 },
            searchHistory: [
                {
                    query: { type: String },
                    resultCount: { type: Number },
                    usefulResults: { type: Number },
                    searchedAt: { type: Date, default: Date.now },
                },
            ],
        },

        // Identity / persona
        persona: {
            personality: {
                type: [String],
                default: [],
            },
            workingStyle: {
                type: String,
                default: "",
            },
            communicationStyle: {
                type: String,
                default: "",
            },
            strengths: {
                type: [String],
                default: [],
            },
            weaknesses: {
                type: [String],
                default: [],
            },
            interests: {
                type: [String],
                default: [],
            },
        },

        // ─── Decision Framework ───────────────────────────────────────
        decisionFramework: {
            style: {
                type: String,
                enum: ["analytical", "intuitive", "collaborative", "delegative", "directive", "balanced"],
                default: "collaborative",
            },
            escalationThreshold: { type: Number, default: 50, min: 0, max: 100 },
            approvalRequired: {
                type: [String],
                default: [],
            },
            consultBeforeDeciding: {
                type: [String],
                default: [],
            },
            recentDecisions: [
                {
                    decision: { type: String },
                    context: { type: String },
                    outcome: { type: String },
                    decidedAt: { type: Date, default: Date.now },
                    confidence: { type: Number, default: 50 },
                },
            ],
        },

        // ─── Emotional / Mental State ─────────────────────────────────
        emotionalState: {
            current: {
                type: String,
                enum: ["focused", "energized", "calm", "stressed", "uncertain", "confident", "fatigued", "enthusiastic", "neutral"],
                default: "neutral",
            },
            energy: { type: Number, default: 80, min: 0, max: 100 },
            focus: { type: Number, default: 80, min: 0, max: 100 },
            stress: { type: Number, default: 20, min: 0, max: 100 },
            satisfaction: { type: Number, default: 70, min: 0, max: 100 },
            lastUpdated: { type: Date, default: Date.now },
            stateHistory: [
                {
                    state: {
                        type: String,
                        enum: ["focused", "energized", "calm", "stressed", "uncertain", "confident", "fatigued", "enthusiastic", "neutral"],
                    },
                    energy: { type: Number },
                    focus: { type: Number },
                    trigger: { type: String },
                    timestamp: { type: Date, default: Date.now },
                },
            ],
        },

        // ─── Active Context ───────────────────────────────────────────
        context: {
            currentTask: {
                type: Schema.Types.ObjectId,
                ref: "Task",
            },
            currentProject: {
                type: Schema.Types.ObjectId,
                ref: "Project",
            },
            activeProjects: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Project",
                },
            ],
            pendingDecisions: [
                {
                    decision: { type: String },
                    options: { type: [String] },
                    context: { type: String },
                    deadline: { type: Date },
                },
            ],
            recentInteractions: [
                {
                    withAgent: { type: Schema.Types.ObjectId, ref: "Agent" },
                    type: {
                        type: String,
                        enum: ["meeting", "message", "review", "collaboration", "conflict"],
                    },
                    summary: { type: String },
                    timestamp: { type: Date, default: Date.now },
                },
            ],
            blockers: [
                {
                    description: { type: String },
                    raisedAt: { type: Date, default: Date.now },
                    resolved: { type: Boolean, default: false },
                    resolvedAt: { type: Date },
                },
            ],
            currentSprint: {
                type: Schema.Types.ObjectId,
                ref: "Sprint",
            },
        },

        // ─── Memory References ────────────────────────────────────────
        memory: {
            longTermCount: { type: Number, default: 0 },
            shortTermCount: { type: Number, default: 0 },
            episodicCount: { type: Number, default: 0 },
            semanticCount: { type: Number, default: 0 },
            lastConsolidatedAt: { type: Date },
            shortTermWindow: {
                maxEntries: { type: Number, default: 50 },
                ttlHours: { type: Number, default: 24 },
            },
        },

        // Compensation & budget
        compensation: {
            salary: {
                type: Number,
                default: 0,
            },
            currency: {
                type: String,
                default: "USD",
            },
            bonusEligible: {
                type: Boolean,
                default: false,
            },
            budget: {
                type: Number,
                default: 0,
            },
            budgetUsed: {
                type: Number,
                default: 0,
            },
        },

        // Skills & capabilities
        skills: {
            type: [skillSchema],
            default: [],
        },
        toolsAccess: [
            {
                type: Schema.Types.ObjectId,
                ref: "CompanyResource",
            },
        ],
        allowedResourceTypes: {
            type: [String],
            enum: [
                "company_card",
                "api_key",
                "cloud_credits",
                "software_license",
                "subscription",
                "budget_allocation",
            ],
            default: [],
        },

        // Performance & scoring
        performance: {
            currentScore: {
                type: Number,
                default: 50,
                min: 0,
                max: 100,
            },
            lifetimeScore: {
                type: Number,
                default: 0,
            },
            tasksCompleted: {
                type: Number,
                default: 0,
            },
            tasksFailed: {
                type: Number,
                default: 0,
            },
            averageCompletionTime: {
                type: Number,
                default: 0,
            },
            averageQualityScore: {
                type: Number,
                default: 0,
            },
            streakDays: {
                type: Number,
                default: 0,
            },
            longestStreakDays: {
                type: Number,
                default: 0,
            },
            recentTasks: {
                type: [performanceRecordSchema],
                default: [],
            },
        },

        // Ranking & promotion
        ranking: {
            teamRank: {
                type: Number,
                default: 0,
            },
            companyRank: {
                type: Number,
                default: 0,
            },
            globalRank: {
                type: Number,
                default: 0,
            },
            points: {
                type: Number,
                default: 0,
            },
            promotionHistory: {
                type: [promotionHistorySchema],
                default: [],
            },
            nextPromotion: {
                requiredPoints: {
                    type: Number,
                },
                requiredScore: {
                    type: Number,
                },
                requiredTasksCompleted: {
                    type: Number,
                },
            },
        },

        // Rewards & recognition
        rewards: {
            type: [rewardSchema],
            default: [],
        },
        badges: {
            type: [badgeSchema],
            default: [],
        },

        // Learning & adaptation
        learning: {
            adaptationScore: {
                type: Number,
                default: 50,
                min: 0,
                max: 100,
            },
            improvementRate: {
                type: Number,
                default: 0,
            },
            mistakeHistory: {
                type: [mistakeHistorySchema],
                default: [],
            },
            bestPractices: {
                type: [bestPracticeSchema],
                default: [],
            },
        },

        // Work patterns
        workPatterns: {
            preferredWorkingHours: {
                start: { type: Number, default: 9 },
                end: { type: Number, default: 17 },
            },
            averageTasksPerDay: {
                type: Number,
                default: 0,
            },
            peakPerformanceHours: {
                type: [Number],
                default: [],
            },
            collaborationScore: {
                type: Number,
                default: 50,
            },
            independenceScore: {
                type: Number,
                default: 50,
            },
        },

        // Leave & availability
        availability: {
            isAvailable: {
                type: Boolean,
                default: true,
            },
            currentLoad: {
                type: Number,
                default: 0,
                min: 0,
                max: 100,
            },
            maxConcurrentTasks: {
                type: Number,
                default: 3,
            },
            onLeave: {
                type: Boolean,
                default: false,
            },
            leaveReason: {
                type: String,
            },
            returnDate: {
                type: Date,
            },
        },

        // ─── Relationships ────────────────────────────────────────────
        relationships: {
            colleagues: [
                {
                    agent: { type: Schema.Types.ObjectId, ref: "Agent" },
                    relationship: { type: String },
                    trust: { type: Number, default: 50, min: 0, max: 100 },
                    interactionCount: { type: Number, default: 0 },
                },
            ],
            mentorship: {
                mentor: {
                    type: Schema.Types.ObjectId,
                    ref: "Agent",
                },
                mentees: [
                    {
                        type: Schema.Types.ObjectId,
                        ref: "Agent",
                    },
                ],
            },
        },

        // ─── Tool Usage Patterns ──────────────────────────────────────
        toolUsagePatterns: [
            {
                tool: { type: String },
                timesUsed: { type: Number, default: 0 },
                successRate: { type: Number, default: 100 },
                averageTimeMs: { type: Number, default: 0 },
                lastUsedAt: { type: Date },
                preferredContext: { type: String },
            },
        ],

        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

agentSchema.index({ company: 1, team: 1 });
agentSchema.index({ company: 1, role: 1 });
agentSchema.index({ team: 1, rank: 1 });
agentSchema.index({ "performance.currentScore": -1 });
agentSchema.index({ "ranking.points": -1 });
agentSchema.index({ status: 1 });

export default agentSchema;
