import { Schema, model } from "mongoose";
const workflowSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        name: { type: String, required: true },
        description: { type: String },
        status: { type: String, enum: ["draft", "active", "paused", "completed", "failed", "cancelled"], default: "draft", index: true },
        trigger: {
            type: { type: String, enum: ["event", "schedule", "manual", "webhook", "threshold", "condition", "external"], required: true },
            config: { type: Schema.Types.Mixed, default: {} },
        },
        steps: [{
            stepId: { type: String, required: true },
            name: { type: String, required: true },
            type: { type: String, enum: ["create_task", "assign_agent", "send_message", "update_status", "notify", "delay", "condition", "api_call", "create_project", "update_project", "send_email", "create_invoice", "allocate_budget", "escalate", "approve", "log", "transform", "branch", "parallel"], required: true },
            config: { type: Schema.Types.Mixed, default: {} },
            nextStepId: { type: String },
            condition: { type: String },
            onError: { type: String, enum: ["retry", "skip", "assign_fallback", "escalate", "halt", "rollback", "restart_agent", "restore_checkpoint", "notify_human", "degrade"], default: "halt" },
            timeout: { type: Number, default: 60000 },
            retryCount: { type: Number, default: 0 },
        }],
        variables: { type: Schema.Types.Mixed, default: {} },
        executionCount: { type: Number, default: 0 },
        lastExecutedAt: { type: Date },
        lastExecutionResult: { success: Boolean, stepsCompleted: Number, totalSteps: Number, error: String },
        createdBy: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);
workflowSchema.index({ company: 1, status: 1 });
const Workflow = model("Workflow", workflowSchema);
export default Workflow;
