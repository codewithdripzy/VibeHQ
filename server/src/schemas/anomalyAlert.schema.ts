import { Schema, model } from "mongoose";
const anomalyAlertSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        type: { type: String, enum: ["spending_spike", "quality_drop", "deadline_miss", "behavior_change", "resource_depletion", "performance_degradation", "unusual_activity", "cost_overrun", "output_drop", "response_delay", "error_spike", "collaboration_breakdown"], required: true, index: true },
        severity: { type: String, enum: ["low", "medium", "high", "critical", "fatal"], required: true, index: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        detectedBy: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        metric: { type: String, enum: ["revenue", "users", "tasks", "quality", "satisfaction", "growth", "churn", "retention", "response_time", "uptime", "cost", "efficiency", "throughput", "latency"] },
        currentValue: { type: Number, required: true },
        expectedValue: { type: Number, required: true },
        threshold: { type: Number, required: true },
        deviation: { type: Number, required: true },
        affectedEntities: [{ entityType: String, entityId: Schema.Types.ObjectId }],
        acknowledged: { type: Boolean, default: false },
        acknowledgedBy: { type: Schema.Types.ObjectId, ref: "Agent" },
        acknowledgedAt: { type: Date },
        resolved: { type: Boolean, default: false, index: true },
        resolvedBy: { type: Schema.Types.ObjectId, ref: "Agent" },
        resolvedAt: { type: Date },
        resolution: { type: String },
        autoResolved: { type: Boolean, default: false },
        notificationSent: { type: Boolean, default: false },
        escalationChain: { type: Schema.Types.ObjectId, ref: "EscalationChain" },
        recommendations: { type: [String], default: [] },
    },
    { timestamps: true }
);
anomalyAlertSchema.index({ company: 1, resolved: 1, severity: 1 });
const AnomalyAlert = model("AnomalyAlert", anomalyAlertSchema);
export default AnomalyAlert;
