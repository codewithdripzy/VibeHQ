import { Schema, model } from "mongoose";

const revenueSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        customer: { type: Schema.Types.ObjectId, ref: "Customer" },
        project: { type: Schema.Types.ObjectId, ref: "Project" },
        type: { type: String, enum: ["subscription", "one_time", "usage_based", "commission", "licensing", "service_fee", "partnership", "advertising", "affiliate", "grant"], required: true },
        amount: { type: Number, required: true, min: 0 },
        currency: { type: String, default: "USD" },
        description: { type: String, required: true },
        invoice: { type: Schema.Types.ObjectId, ref: "Invoice" },
        recurring: { type: Boolean, default: false },
        recurringInterval: { type: String, enum: ["hourly", "daily", "weekly", "monthly", "quarterly", "yearly"] },
        nextBillingDate: { type: Date },
        category: { type: String },
        tags: { type: [String], default: [] },
        metadata: { type: Schema.Types.Mixed, default: {} },
        recordedBy: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        recordedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);
revenueSchema.index({ company: 1, recordedAt: -1 });
revenueSchema.index({ company: 1, type: 1 });
revenueSchema.index({ company: 1, customer: 1 });
const Revenue = model("Revenue", revenueSchema);
export default Revenue;
