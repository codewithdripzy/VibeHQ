import { Schema } from "mongoose";

const retrospectiveSchema = new Schema(
    {
        completed: { type: Number, default: 0 },
        carriedOver: { type: Number, default: 0 },
        velocity: { type: Number, default: 0 },
        notes: { type: String },
    },
    { _id: false }
);

const sprintSchema = new Schema(
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
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        status: {
            type: String,
            enum: ["planned", "active", "review", "completed"],
            default: "planned",
        },

        goal: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },

        tasks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Task",
            },
        ],
        capacity: { type: Number, default: 0 },
        velocity: { type: Number, default: 0 },

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

sprintSchema.index({ project: 1 });
sprintSchema.index({ company: 1, status: 1 });
sprintSchema.index({ project: 1, status: 1 });

export default sprintSchema;
