import { Schema, model } from "mongoose";
const errorLogSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        agent: { type: Schema.Types.ObjectId, ref: "Agent", index: true },
        project: { type: Schema.Types.ObjectId, ref: "Project" },
        task: { type: Schema.Types.ObjectId, ref: "Task" },
        severity: { type: String, enum: ["low", "medium", "high", "critical", "fatal"], required: true, index: true },
        category: { type: String, enum: ["task_failure", "api_error", "timeout", "rate_limit", "auth_failure", "data_corruption", "dependency_failure", "resource_exhausted", "logic_error", "external_service", "network", "validation", "permission", "unknown"], required: true },
        message: { type: String, required: true },
        stack: { type: String },
        context: { type: Schema.Types.Mixed, default: {} },
        recoveryAction: { type: String, enum: ["retry", "skip", "assign_fallback", "escalate", "halt", "rollback", "restart_agent", "restore_checkpoint", "notify_human", "degrade"], required: true },
        recoveryResult: { success: Boolean, message: String, fallbackAgent: { type: Schema.Types.ObjectId, ref: "Agent" } },
        retryCount: { type: Number, default: 0 },
        maxRetries: { type: Number, default: 3 },
        resolved: { type: Boolean, default: false, index: true },
        resolvedBy: { type: Schema.Types.ObjectId, ref: "Agent" },
        resolvedAt: { type: Date },
        resolution: { type: String },
        impact: { tasksAffected: Number, agentsAffected: Number, downtimeMinutes: Number },
        firstOccurredAt: { type: Date, default: Date.now },
        lastOccurredAt: { type: Date, default: Date.now },
        occurrenceCount: { type: Number, default: 1 },
    },
    { timestamps: true }
);
errorLogSchema.index({ company: 1, firstOccurredAt: -1 });
errorLogSchema.index({ company: 1, agent: 1, severity: 1 });
const ErrorLog = model("ErrorLog", errorLogSchema);
export default ErrorLog;
