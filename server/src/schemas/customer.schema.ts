import { Schema } from "mongoose";

const customerNoteSchema = new Schema(
    {
        content: { type: String, required: true },
        agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const customerSchema = new Schema(
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
        email: {
            type: String,
        },
        company: {
            type: String,
        },
        companyRef: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        status: {
            type: String,
            enum: ["lead", "prospect", "active", "churned", "returning"],
            default: "lead",
        },
        tier: {
            type: String,
            enum: ["free", "starter", "professional", "enterprise"],
            default: "free",
        },

        source: {
            type: String,
            enum: ["organic", "referral", "marketing", "sales", "partner", "other"],
            required: true,
        },
        referredBy: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
        },

        firstContactDate: { type: Date, default: Date.now },
        lastContactDate: { type: Date },
        lastActivityDate: { type: Date },

        lifetimeValue: { type: Number, default: 0 },
        monthlyRevenue: { type: Number, default: 0 },
        totalPurchases: { type: Number, default: 0 },

        notes: {
            type: [customerNoteSchema],
            default: [],
        },
        tickets: [
            {
                type: Schema.Types.ObjectId,
                ref: "Task",
            },
        ],

        communicationPreference: {
            type: String,
            enum: ["email", "chat", "phone"],
            default: "email",
        },
        timezone: { type: String },

        tags: { type: [String], default: [] },
        segments: { type: [String], default: [] },

        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

customerSchema.index({ companyRef: 1 });
customerSchema.index({ companyRef: 1, status: 1 });
customerSchema.index({ companyRef: 1, tier: 1 });
customerSchema.index({ email: 1 });

export default customerSchema;
