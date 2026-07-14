import { Schema } from "mongoose";

const companyResourceSchema = new Schema(
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
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: [
                "company_card",
                "api_key",
                "cloud_credits",
                "software_license",
                "subscription",
                "budget_allocation",
            ],
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "depleted", "suspended"],
            default: "active",
        },
        description: {
            type: String,
        },
        value: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: "USD",
        },
        balance: {
            type: Number,
            default: 0,
        },
        metadata: {
            cardNumber: { type: String },
            cardProvider: { type: String },
            apiKey: { type: String },
            apiProvider: { type: String },
            expiryDate: { type: Date },
            lastUsedAt: { type: Date },
            usageCount: { type: Number, default: 0 },
        },
        accessAgents: [
            {
                type: Schema.Types.ObjectId,
                ref: "Agent",
            },
        ],
        monthlyLimit: {
            type: Number,
        },
        monthlyUsed: {
            type: Number,
            default: 0,
        },
        renewalDate: {
            type: Date,
        },
        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

companyResourceSchema.index({ company: 1 });
companyResourceSchema.index({ company: 1, type: 1 });
companyResourceSchema.index({ status: 1 });

export default companyResourceSchema;
