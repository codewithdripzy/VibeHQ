import { Schema } from "mongoose";

const attachmentSchema = new Schema(
    {
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String },
        uploadedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const commentSchema = new Schema(
    {
        agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const taskSchema = new Schema(
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
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },
        sprint: {
            type: Schema.Types.ObjectId,
            ref: "Sprint",
        },
        milestone: {
            type: Schema.Types.ObjectId,
            ref: "Milestone",
        },

        // Assignment
        assignee: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
        },
        assigner: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
        },
        reviewer: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
        },
        team: {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },

        // Status & priority
        status: {
            type: String,
            enum: ["queued", "in_progress", "in_review", "completed", "failed", "blocked", "cancelled"],
            default: "queued",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium",
        },

        // Hierarchy
        parentTask: {
            type: Schema.Types.ObjectId,
            ref: "Task",
        },
        subtasks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Task",
            },
        ],
        dependencies: [
            {
                type: Schema.Types.ObjectId,
                ref: "Task",
            },
        ],

        // Time tracking
        estimatedHours: { type: Number },
        actualHours: { type: Number, default: 0 },
        startedAt: { type: Date },
        completedAt: { type: Date },

        // Quality
        qualityScore: { type: Number, min: 0, max: 100 },

        // Content
        tags: {
            type: [String],
            default: [],
        },
        attachments: {
            type: [attachmentSchema],
            default: [],
        },
        comments: {
            type: [commentSchema],
            default: [],
        },

        // Recurrence
        isRecurring: {
            type: Boolean,
            default: false,
        },
        recurrencePattern: {
            type: String,
        },

        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

taskSchema.index({ company: 1 });
taskSchema.index({ project: 1 });
taskSchema.index({ sprint: 1 });
taskSchema.index({ assignee: 1 });
taskSchema.index({ company: 1, status: 1 });
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignee: 1, status: 1 });

export default taskSchema;
