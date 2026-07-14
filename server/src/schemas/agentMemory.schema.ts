import { Schema } from "mongoose";

const episodicContentSchema = new Schema(
    {
        event: { type: String },
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "Agent",
            },
        ],
        location: { type: String },
        emotionalContext: {
            type: String,
            enum: ["focused", "energized", "calm", "stressed", "uncertain", "confident", "fatigued", "enthusiastic", "neutral"],
        },
        outcome: { type: String },
    },
    { _id: false }
);

const semanticContentSchema = new Schema(
    {
        subject: { type: String },
        predicate: { type: String },
        object: { type: String },
        confidence: { type: Number, default: 0.8 },
        source_count: { type: Number, default: 1 },
    },
    { _id: false }
);

const proceduralContentSchema = new Schema(
    {
        steps: { type: [String], default: [] },
        successRate: { type: Number, default: 100 },
        timesApplied: { type: Number, default: 0 },
        lastAppliedAt: { type: Date },
    },
    { _id: false }
);

const agentMemorySchema = new Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        agent: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
            required: true,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },

        type: {
            type: String,
            enum: ["long_term", "short_term", "episodic", "semantic", "procedural"],
            required: true,
        },
        category: {
            type: String,
            enum: ["fact", "experience", "relationship", "preference", "lesson", "procedure", "context", "feedback", "decision", "insight"],
            required: true,
        },

        content: {
            type: String,
            required: true,
        },
        summary: {
            type: String,
        },
        embedding: {
            type: [Number],
            index: "vector",
        },

        source: {
            entityType: { type: String },
            entityId: { type: Schema.Types.ObjectId },
            taskTitle: { type: String },
            meetingTitle: { type: String },
            channelName: { type: String },
        },

        importance: {
            type: Number,
            default: 0.5,
            min: 0,
            max: 1,
        },
        accessCount: {
            type: Number,
            default: 0,
        },
        lastAccessedAt: {
            type: Date,
            default: Date.now,
        },
        decayRate: {
            type: Number,
            default: 0.01,
        },
        consolidatedAt: {
            type: Date,
        },

        relatedMemories: [
            {
                type: Schema.Types.ObjectId,
                ref: "AgentMemory",
            },
        ],
        tags: {
            type: [String],
            default: [],
        },

        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },
        team: {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },
        sprint: {
            type: Schema.Types.ObjectId,
            ref: "Sprint",
        },

        episodic: {
            type: episodicContentSchema,
        },
        semantic: {
            type: semanticContentSchema,
        },
        procedural: {
            type: proceduralContentSchema,
        },

        expiresAt: {
            type: Date,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },

        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

agentMemorySchema.index({ agent: 1 });
agentMemorySchema.index({ agent: 1, type: 1 });
agentMemorySchema.index({ agent: 1, category: 1 });
agentMemorySchema.index({ agent: 1, importance: -1 });
agentMemorySchema.index({ agent: 1, type: 1, importance: -1 });
agentMemorySchema.index({ company: 1 });
agentMemorySchema.index({ tags: 1 });
agentMemorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default agentMemorySchema;
