import { Schema } from "mongoose";

const deliverableSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        status: {
            type: String,
            enum: ["pending", "in_progress", "delivered"],
            default: "pending",
        },
        dueDate: { type: Date },
    },
    { _id: false }
);

const retrospectiveSchema = new Schema(
    {
        whatWentWell: { type: [String], default: [] },
        whatImproved: { type: [String], default: [] },
        actionItems: { type: [String], default: [] },
        completedAt: { type: Date },
    },
    { _id: false }
);

const projectSchema = new Schema(
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
            lowercase: true,
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
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lead: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
        },
        teams: [
            {
                type: Schema.Types.ObjectId,
                ref: "Team",
            },
        ],
        status: {
            type: String,
            enum: ["planning", "active", "on_hold", "completed", "cancelled"],
            default: "planning",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium",
        },
        tags: {
            type: [String],
            default: [],
        },

        // Timeline
        startDate: { type: Date },
        endDate: { type: Date },
        deadline: { type: Date },

        // Structure
        milestones: [
            {
                type: Schema.Types.ObjectId,
                ref: "Milestone",
            },
        ],
        sprints: [
            {
                type: Schema.Types.ObjectId,
                ref: "Sprint",
            },
        ],
        tasks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Task",
            },
        ],

        // Scope
        budget: { type: Number, default: 0 },
        budgetUsed: { type: Number, default: 0 },
        estimatedHours: { type: Number, default: 0 },
        actualHours: { type: Number, default: 0 },

        // Metrics
        progress: { type: Number, default: 0, min: 0, max: 100 },
        tasksTotal: { type: Number, default: 0 },
        tasksCompleted: { type: Number, default: 0 },
        tasksInProgress: { type: Number, default: 0 },
        tasksBlocked: { type: Number, default: 0 },

        // Relationships
        dependencies: [
            {
                type: Schema.Types.ObjectId,
                ref: "Project",
            },
        ],
        parentProject: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },

        // Output
        deliverables: {
            type: [deliverableSchema],
            default: [],
        },

        // Retrospective
        retrospective: {
            type: retrospectiveSchema,
        },

        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

projectSchema.index({ company: 1 });
projectSchema.index({ company: 1, status: 1 });
projectSchema.index({ company: 1, priority: 1 });
projectSchema.index({ slug: 1 });

export default projectSchema;
