import { Schema } from "mongoose";

const teamSchema = new Schema(
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
        department: {
            type: String,
            enum: [
                "executive",
                "engineering",
                "product",
                "design",
                "marketing",
                "sales",
                "analytics",
                "security",
                "legal",
                "finance",
                "support",
                "operations",
            ],
            required: true,
        },
        lead: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
        },
        agents: [
            {
                type: Schema.Types.ObjectId,
                ref: "Agent",
            },
        ],
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        budget: {
            type: Number,
            default: 0,
        },
        budgetUsed: {
            type: Number,
            default: 0,
        },
        metrics: {
            tasksCompleted: {
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
            totalRewards: {
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

teamSchema.index({ company: 1 });
teamSchema.index({ department: 1 });
teamSchema.index({ company: 1, department: 1 });

export default teamSchema;
