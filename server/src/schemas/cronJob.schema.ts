import { Schema, model } from "mongoose";
const cronJobSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        name: { type: String, required: true },
        description: { type: String },
        type: { type: String, enum: ["report", "standup", "check", "sync", "cleanup", "notify", "review", "backup", "monitor", "generate", "analyse", "post", "follow_up", "renewal", "maintenance"], required: true },
        status: { type: String, enum: ["active", "paused", "completed", "failed", "cancelled"], default: "active", index: true },
        cronExpression: { type: String, required: true },
        timezone: { type: String, default: "UTC" },
        payload: {
            workflowId: { type: Schema.Types.ObjectId, ref: "Workflow" },
            action: { type: String, required: true },
            params: { type: Schema.Types.Mixed, default: {} },
        },
        lastRunAt: { type: Date },
        nextRunAt: { type: Date, index: true },
        runCount: { type: Number, default: 0 },
        lastResult: { success: Boolean, output: Schema.Types.Mixed, error: String },
        timeout: { type: Number, default: 30000 },
        retryCount: { type: Number, default: 0 },
        maxRetries: { type: Number, default: 3 },
        enabledBy: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);
cronJobSchema.index({ company: 1, status: 1 });
cronJobSchema.index({ company: 1, nextRunAt: 1 });
const CronJob = model("CronJob", cronJobSchema);
export default CronJob;
