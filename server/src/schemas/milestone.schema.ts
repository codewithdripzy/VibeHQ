import { Schema } from "mongoose";

const milestoneDeliverableSchema = new Schema(
    {
        name: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "in_progress", "delivered"],
            default: "pending",
        },
    },
    { _id: false }
);

const milestoneSchema = new Schema(
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
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "in_progress", "achieved", "missed"],
            default: "pending",
        },

        dueDate: { type: Date, required: true },
        achievedDate: { type: Date },

        tasks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Task",
            },
        ],
        progress: { type: Number, default: 0, min: 0, max: 100 },

        deliverables: {
            type: [milestoneDeliverableSchema],
            default: [],
        },

        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

milestoneSchema.index({ project: 1 });
milestoneSchema.index({ company: 1, status: 1 });
milestoneSchema.index({ project: 1, status: 1 });

export default milestoneSchema;
