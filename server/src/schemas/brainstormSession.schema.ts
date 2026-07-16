import { Schema } from "mongoose";

const brainstormQuestionSchema = new Schema(
    {
        id: { type: String, required: true },
        parentId: { type: String },
        phase: { type: Number, required: true },
        depth: { type: Number, required: true, default: 0 },
        question: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "researching", "resolved", "delegated", "skipped"],
            default: "pending",
        },
        answer: { type: String },
        confidence: { type: Number, min: 0, max: 100, default: 0 },
        searchQueries: { type: [String], default: [] },
        sources: [
            {
                title: { type: String },
                url: { type: String },
                snippet: { type: String },
            },
        ],
        delegation: {
            to: { type: String },
            from: { type: String },
            context: { type: String },
            researchDone: { type: String },
            specificQuestion: { type: String },
            deadline: { type: Date },
            status: {
                type: String,
                enum: ["pending", "in_progress", "completed", "timeout"],
            },
            response: { type: String },
        },
        createdAt: { type: Date, default: Date.now },
        resolvedAt: { type: Date },
    },
    { _id: false }
);

const brainstormSessionSchema = new Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        status: {
            type: String,
            enum: ["running", "paused", "completed", "failed", "cancelled"],
            default: "running",
        },
        phase: {
            type: Number,
            min: 1,
            max: 6,
            default: 1,
        },
        trigger: {
            type: String,
            enum: ["manual", "auto", "scheduled"],
            default: "manual",
        },
        initiatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        // Graph state
        questions: {
            type: [brainstormQuestionSchema],
            default: [],
        },
        currentQuestionId: { type: String },

        // Limits
        maxDepth: { type: Number, default: 5 },
        maxTurns: { type: Number, default: 30 },
        timeLimitMinutes: { type: Number, default: 10 },
        turnsUsed: { type: Number, default: 0 },

        // Results
        summary: {
            problemStatement: { type: String },
            proposedSolution: { type: String },
            targetMarket: { type: String },
            businessModel: { type: String },
            competitiveAdvantage: { type: String },
            mvpScope: { type: String },
            resourceRequirements: { type: String },
            riskAssessment: { type: String },
            recommendation: {
                type: String,
                enum: ["proceed", "iterate", "pivot", "abandon"],
            },
            nextSteps: { type: [String], default: [] },
        },

        // Delegations
        delegations: [
            {
                to: { type: String, required: true },
                question: { type: String, required: true },
                context: { type: String },
                status: {
                    type: String,
                    enum: ["pending", "in_progress", "completed", "timeout"],
                    default: "pending",
                },
                response: { type: String },
                resources: [
                    {
                        type: { type: String, enum: ["document", "file", "image", "link", "code", "data"], required: true },
                        name: { type: String, required: true },
                        url: { type: String },
                        content: { type: String },
                        mimeType: { type: String },
                        size: { type: Number },
                        metadata: { type: Schema.Types.Mixed },
                    },
                ],
                createdAt: { type: Date, default: Date.now },
                completedAt: { type: Date },
            },
        ],

        // Output ideas generated
        ideasGenerated: [
            {
                type: Schema.Types.ObjectId,
                ref: "Idea",
            },
        ],

        // Chat log - messages per team tab
        chatLog: [
            {
                team: { type: String, required: true },  // "board", "engineering", "marketing", etc.
                sender: { type: String, required: true },  // agent name/role
                content: { type: String, required: true },
                type: { type: String, enum: ["message", "delegation", "response", "system"], default: "message" },
                linkedDelegationTo: { type: String },  // if delegation, which team tab to link to
                resources: [
                    {
                        type: { type: String, enum: ["document", "file", "image", "link", "code", "data"], required: true },
                        name: { type: String, required: true },
                        url: { type: String },
                        content: { type: String },
                        mimeType: { type: String },
                        size: { type: Number },
                        metadata: { type: Schema.Types.Mixed },
                    },
                ],
                timestamp: { type: Date, default: Date.now },
            },
        ],

        // Linked meeting
        meeting: { type: Schema.Types.ObjectId, ref: "Meeting" },

        // Timing
        startedAt: { type: Date, default: Date.now },
        completedAt: { type: Date },
        expiresAt: { type: Date },

        deletedAt: { type: Date },
    },
    {
        timestamps: true,
    }
);

brainstormSessionSchema.index({ company: 1 });
brainstormSessionSchema.index({ company: 1, status: 1 });
brainstormSessionSchema.index({ company: 1, createdAt: -1 });
brainstormSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default brainstormSessionSchema;
