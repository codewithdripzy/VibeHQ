import { Schema } from "mongoose";

const keyResultSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        status: {
            type: String,
            enum: ["not_started", "on_track", "at_risk", "behind", "completed"],
            default: "not_started",
        },
        currentValue: { type: Number, default: 0 },
        targetValue: { type: Number, required: true },
        unit: { type: String, default: "" },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        lastUpdated: { type: Date, default: Date.now },
    },
    { _id: false }
);

const okrSchema = new Schema(
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
        team: {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
            required: true,
        },
        cadence: {
            type: String,
            enum: ["quarterly", "annual", "monthly"],
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "achieved", "abandoned"],
            default: "active",
        },

        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },

        objective: { type: String, required: true },

        keyResults: {
            type: [keyResultSchema],
            default: [],
        },

        progress: { type: Number, default: 0, min: 0, max: 100 },

        parentOKR: {
            type: Schema.Types.ObjectId,
            ref: "OKR",
        },
        alignedProjects: [
            {
                type: Schema.Types.ObjectId,
                ref: "Project",
            },
        ],

        finalScore: { type: Number },
        scoredAt: { type: Date },

        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

okrSchema.index({ company: 1 });
okrSchema.index({ company: 1, cadence: 1 });
okrSchema.index({ company: 1, status: 1 });
okrSchema.index({ team: 1 });

export default okrSchema;
