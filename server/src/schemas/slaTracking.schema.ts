import { Schema, model } from "mongoose";
const slaTrackingSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        priority: { type: String, enum: ["critical", "high", "medium", "low"], required: true },
        metric: { type: String, enum: ["revenue", "users", "tasks", "quality", "satisfaction", "growth", "churn", "retention", "response_time", "uptime", "cost", "efficiency", "throughput", "latency"], required: true },
        target: { type: Number, required: true },
        current: { type: Number, required: true },
        unit: { type: String, required: true },
        threshold: { warning: Number, breach: Number },
        status: { type: String, enum: ["on_track", "at_risk", "breached", "resolved", "waived"], default: "on_track", index: true },
        period: { type: String, enum: ["hourly", "daily", "weekly", "monthly", "quarterly", "yearly"], required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        history: [{ date: Date, value: Number, status: { type: String, enum: ["on_track", "at_risk", "breached", "resolved", "waived"] } }],
        breaches: [{ date: Date, duration: Number, severity: { type: String, enum: ["low", "medium", "high", "critical", "fatal"] }, resolvedAt: Date, resolution: String }],
        relatedEntities: [{ entityType: String, entityId: Schema.Types.ObjectId }],
        assignee: { type: Schema.Types.ObjectId, ref: "Agent" },
        notificationChannels: { type: [String], default: [] },
        autoEscalate: { type: Boolean, default: false },
        escalationChain: { type: Schema.Types.ObjectId, ref: "EscalationChain" },
    },
    { timestamps: true }
);
slaTrackingSchema.index({ company: 1, status: 1 });
const SLATracking = model("SLATracking", slaTrackingSchema);
export default SLATracking;
