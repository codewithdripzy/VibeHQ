import { Schema } from "mongoose";

const referenceAssetSchema = new Schema(
    {
        name: { type: String, required: true },
        type: {
            type: String,
            enum: ["file", "image", "document", "link", "code", "data", "mockup", "video"],
            required: true,
        },
        url: { type: String },
        filePath: { type: String },
        mimeType: { type: String },
        size: { type: Number },
        description: { type: String },
        uploadedBy: { type: Schema.Types.ObjectId, ref: "Agent" },
        uploadedAt: { type: Date, default: Date.now },
        usableInPrompt: { type: Boolean, default: false },
    },
    { _id: false }
);

const aiAnalysisSchema = new Schema(
    {
        recommendation: {
            type: String,
            enum: ["strong_yes", "yes", "conditional", "no", "strong_no"],
        },
        confidence: { type: Number, min: 0, max: 1 },
        reasoning: { type: String },
        pros: { type: [String], default: [] },
        cons: { type: [String], default: [] },
        marketFit: { type: Number, min: 0, max: 100 },
        feasibility: { type: Number, min: 0, max: 100 },
        riskLevel: { type: Number, min: 0, max: 100 },
        estimatedEffort: { type: String },
        estimatedImpact: { type: String },
        similarProjects: [
            {
                name: { type: String },
                description: { type: String },
                outcome: { type: String },
            },
        ],
        trendData: {
            trendScore: { type: Number },
            searchQueries: { type: [String] },
            sourcesFound: { type: Number },
            lastResearchedAt: { type: Date },
        },
        agentId: { type: Schema.Types.ObjectId, ref: "Agent" },
        analyzedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const ownerReviewSchema = new Schema(
    {
        decision: {
            type: String,
            enum: ["pending", "approved", "rejected", "needs_info"],
        },
        comment: { type: String },
        reviewedAt: { type: Date },
    },
    { _id: false }
);

const ideaSchema = new Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },

        // Who suggested it
        suggestedBy: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        suggestedByType: {
            type: String,
            enum: ["user", "agent"],
            required: true,
        },

        // Status & classification
        status: {
            type: String,
            enum: [
                "proposed",
                "ai_reviewed",
                "owner_review",
                "approved",
                "rejected",
                "in_development",
                "implemented",
                "archived",
            ],
            default: "proposed",
        },
        category: {
            type: String,
            enum: [
                "product",
                "feature",
                "marketing",
                "growth",
                "revenue",
                "process",
                "technology",
                "partnership",
                "content",
                "experiment",
                "other",
            ],
            required: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },
        tags: {
            type: [String],
            default: [],
        },

        // Reference assets (files, images, docs that can be referenced by name in prompts)
        assets: {
            type: [referenceAssetSchema],
            default: [],
        },

        // AI analysis
        aiAnalysis: {
            type: aiAnalysisSchema,
        },

        // Owner review
        ownerReview: {
            type: ownerReviewSchema,
            default: () => ({}),
        },

        // Agent feedback — agents can give their opinion
        agentFeedback: [
            {
                agent: { type: Schema.Types.ObjectId, ref: "Agent" },
                opinion: {
                    type: String,
                    enum: ["support", "concern", "neutral"],
                },
                reasoning: { type: String },
                confidence: { type: Number, min: 0, max: 1 },
                submittedAt: { type: Date, default: Date.now },
            },
        ],

        // Votes from agents
        votes: {
            up: [{ type: Schema.Types.ObjectId, ref: "Agent" }],
            down: [{ type: Schema.Types.ObjectId, ref: "Agent" }],
        },

        // Research data
        research: {
            searchQueries: { type: [String], default: [] },
            sources: [
                {
                    title: { type: String },
                    url: { type: String },
                    relevance: { type: Number, min: 0, max: 1 },
                    summary: { type: String },
                },
            ],
            trendScore: { type: Number, min: 0, max: 100 },
            marketSize: { type: String },
            competitors: [
                {
                    name: { type: String },
                    description: { type: String },
                    url: { type: String },
                },
            ],
            lastResearchedAt: { type: Date },
        },

        // Implementation tracking
        implementation: {
            project: { type: Schema.Types.ObjectId, ref: "Project" },
            assignedTeam: { type: Schema.Types.ObjectId, ref: "Team" },
            assignedAgents: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Agent",
                },
            ],
            startedAt: { type: Date },
            completedAt: { type: Date },
            progress: { type: Number, default: 0, min: 0, max: 100 },
        },

        // Metrics after implementation
        outcome: {
            implemented: { type: Boolean, default: false },
            result: { type: String },
            metrics: { type: Schema.Types.Mixed },
            realizedAt: { type: Date },
        },

        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

ideaSchema.index({ company: 1 });
ideaSchema.index({ company: 1, status: 1 });
ideaSchema.index({ company: 1, category: 1 });
ideaSchema.index({ company: 1, priority: 1 });
ideaSchema.index({ suggestedBy: 1 });
ideaSchema.index({ status: 1 });

export default ideaSchema;
