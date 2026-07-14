import { Schema, model } from "mongoose";
const abExperimentSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, enum: ["ab", "multivariate", "split_url", "multi_page", "bandit"], required: true },
        status: { type: String, enum: ["draft", "running", "paused", "completed", "analysed", "cancelled"], default: "draft", index: true },
        hypothesis: { type: String, required: true },
        variants: [{
            name: String, description: String, isControl: { type: Boolean, default: false },
            traffic: { type: Number, default: 0 }, conversions: { type: Number, default: 0 },
            conversionRate: { type: Number, default: 0 }, revenue: { type: Number, default: 0 },
            revenuePerUser: { type: Number, default: 0 },
        }],
        targetMetric: { type: String, enum: ["revenue", "users", "tasks", "quality", "satisfaction", "growth", "churn", "retention", "response_time", "uptime", "cost", "efficiency", "throughput", "latency"], required: true },
        minimumSampleSize: { type: Number, default: 1000 },
        currentSampleSize: { type: Number, default: 0 },
        confidenceLevel: { type: Number, default: 95 },
        statisticallySignificant: { type: Boolean, default: false },
        winner: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        duration: { type: Number, default: 14 },
        createdBy: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        project: { type: Schema.Types.ObjectId, ref: "Project" },
        tags: { type: [String], default: [] },
        results: { summary: String, recommendation: String, impact: Number, confidence: Number },
    },
    { timestamps: true }
);
abExperimentSchema.index({ company: 1, status: 1 });
const ABExperiment = model("ABExperiment", abExperimentSchema);
export default ABExperiment;
