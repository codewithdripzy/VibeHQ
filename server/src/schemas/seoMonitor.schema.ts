import { Schema, model } from "mongoose";
const seoMonitorSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        url: { type: String, required: true },
        checkType: { type: String, enum: ["keyword", "backlink", "page_speed", "mobile_friendly", "meta_tags", "content_quality", "structured_data", "internal_links", "image_optimisation", "core_web_vitals"], required: true, index: true },
        score: { type: Number, required: true },
        maxScore: { type: Number, default: 100 },
        status: { type: String, enum: ["pass", "warning", "fail"], required: true },
        findings: [{
            name: String, status: { type: String, enum: ["pass", "warning", "fail"] }, score: Number, maxScore: Number, details: String, recommendation: String, priority: { type: String, enum: ["critical", "high", "medium", "low"] },
        }],
        keywords: [{
            keyword: String, position: Number, previousPosition: Number, searchVolume: Number, difficulty: Number, trend: { type: String, enum: ["rising", "stable", "declining"] },
        }],
        competitors: [{
            url: String, score: Number, strengths: [String], weaknesses: [String],
        }],
        history: [{ date: Date, score: Number }],
        lastCheckedAt: { type: Date, default: Date.now },
        nextCheckAt: { type: Date },
        frequency: { type: String, enum: ["hourly", "daily", "weekly", "monthly", "quarterly", "yearly"], default: "daily" },
        assignedAgent: { type: Schema.Types.ObjectId, ref: "Agent" },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);
seoMonitorSchema.index({ company: 1, url: 1, checkType: 1 });
const SEOMonitor = model("SEOMonitor", seoMonitorSchema);
export default SEOMonitor;
