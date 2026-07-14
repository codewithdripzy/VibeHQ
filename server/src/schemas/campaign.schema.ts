import { Schema } from "mongoose";

const contentAssetSchema = new Schema(
    {
        name: { type: String, required: true },
        type: { type: String },
        url: { type: String },
        status: {
            type: String,
            enum: ["draft", "review", "published"],
            default: "draft",
        },
    },
    { _id: false }
);

const experimentSchema = new Schema(
    {
        name: { type: String, required: true },
        variantA: { type: String, required: true },
        variantB: { type: String, required: true },
        winner: {
            type: String,
            enum: ["a", "b"],
        },
        confidence: { type: Number },
    },
    { _id: false }
);

const campaignMetricsSchema = new Schema(
    {
        impressions: { type: Number, default: 0 },
        clicks: { type: Number, default: 0 },
        conversions: { type: Number, default: 0 },
        revenue: { type: Number, default: 0 },
        roi: { type: Number, default: 0 },
        costPerLead: { type: Number, default: 0 },
        costPerAcquisition: { type: Number, default: 0 },
    },
    { _id: false }
);

const campaignSchema = new Schema(
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
            enum: [
                "product_launch",
                "content_marketing",
                "email",
                "social_media",
                "paid_advertising",
                "seo",
                "partnership",
                "referral",
                "event",
                "retargeting",
            ],
            required: true,
        },
        status: {
            type: String,
            enum: ["planning", "active", "paused", "completed", "cancelled"],
            default: "planning",
        },

        startDate: { type: Date },
        endDate: { type: Date },

        budget: { type: Number, default: 0 },
        budgetSpent: { type: Number, default: 0 },

        targetAudience: { type: String },
        channels: { type: [String], default: [] },
        tags: { type: [String], default: [] },

        lead: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
        },
        team: [
            {
                type: Schema.Types.ObjectId,
                ref: "Agent",
            },
        ],

        metrics: {
            type: campaignMetricsSchema,
            default: () => ({}),
        },

        contentAssets: {
            type: [contentAssetSchema],
            default: [],
        },

        experiments: {
            type: [experimentSchema],
            default: [],
        },

        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },

        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

campaignSchema.index({ company: 1 });
campaignSchema.index({ company: 1, status: 1 });
campaignSchema.index({ company: 1, type: 1 });
campaignSchema.index({ project: 1 });

export default campaignSchema;
