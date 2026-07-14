import { Schema } from "mongoose";

const pinnedMessageSchema = new Schema(
    {
        content: { type: String, required: true },
        agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        pinnedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const lastMessageSchema = new Schema(
    {
        content: { type: String },
        agent: { type: Schema.Types.ObjectId, ref: "Agent" },
        createdAt: { type: Date },
    },
    { _id: false }
);

const channelSchema = new Schema(
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
        type: {
            type: String,
            enum: ["team", "project", "direct", "announcement", "watercooler"],
            required: true,
        },

        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "Agent",
            },
        ],
        admins: [
            {
                type: Schema.Types.ObjectId,
                ref: "Agent",
            },
        ],

        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },
        team: {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },

        lastMessage: {
            type: lastMessageSchema,
        },
        messageCount: { type: Number, default: 0 },

        isArchived: { type: Boolean, default: false },
        pinnedMessages: {
            type: [pinnedMessageSchema],
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

channelSchema.index({ company: 1 });
channelSchema.index({ company: 1, type: 1 });
channelSchema.index({ project: 1 });
channelSchema.index({ team: 1 });

export default channelSchema;
