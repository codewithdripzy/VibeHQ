import { Schema, model } from "mongoose";
const escalationChainSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        name: { type: String, required: true },
        description: { type: String },
        triggerCondition: { type: String, required: true },
        levels: [{
            level: { type: String, enum: ["agent", "manager", "director", "ceo", "human"], required: true },
            assignee: { type: Schema.Types.ObjectId, ref: "Agent" },
            team: { type: Schema.Types.ObjectId, ref: "Team" },
            timeoutMinutes: { type: Number, required: true },
            notifyChannels: { type: [String], default: [] },
        }],
        currentLevel: { type: Number, default: 0 },
        status: { type: String, enum: ["pending", "escalated", "acknowledged", "in_progress", "resolved", "timed_out", "cancelled"], default: "pending", index: true },
        initiatedBy: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        initiatedAt: { type: Date, default: Date.now },
        resolvedBy: { type: Schema.Types.ObjectId, ref: "Agent" },
        resolvedAt: { type: Date },
        resolution: { type: String },
        relatedEntity: { entityType: String, entityId: Schema.Types.ObjectId },
        escalationHistory: [{
            level: String, assignee: { type: Schema.Types.ObjectId, ref: "Agent" }, escalatedAt: Date, acknowledgedAt: Date, resolvedAt: Date, notes: String,
        }],
    },
    { timestamps: true }
);
escalationChainSchema.index({ company: 1, status: 1 });
const EscalationChain = model("EscalationChain", escalationChainSchema);
export default EscalationChain;
