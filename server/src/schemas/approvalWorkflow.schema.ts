import { Schema, model } from "mongoose";
const approvalWorkflowSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        type: { type: String, enum: ["budget", "hire", "fire", "publish", "deploy", "legal", "partnership", "acquisition", "restructure", "api_key", "data_access", "vendor"], required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        status: { type: String, enum: ["pending", "approved", "rejected", "expired", "cancelled", "resubmitted"], default: "pending", index: true },
        requestedBy: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        requestedAt: { type: Date, default: Date.now },
        amount: { type: Number },
        currency: { type: String },
        approvers: [{
            agent: { type: Schema.Types.ObjectId, ref: "Agent" },
            level: { type: String, enum: ["agent", "manager", "director", "ceo", "human"] },
            status: { type: String, enum: ["pending", "approved", "rejected", "expired", "cancelled", "resubmitted"], default: "pending" },
            decidedAt: Date,
            notes: String,
        }],
        requiredApprovals: { type: Number, default: 1 },
        currentApprovals: { type: Number, default: 0 },
        expiresAt: { type: Date, required: true },
        decidedAt: { type: Date },
        decisionNotes: { type: String },
        relatedEntity: { entityType: String, entityId: Schema.Types.ObjectId },
        attachments: { type: [String], default: [] },
        auditTrail: [{
            action: String, performedBy: { type: Schema.Types.ObjectId, ref: "Agent" }, performedAt: Date, details: String,
        }],
    },
    { timestamps: true }
);
approvalWorkflowSchema.index({ company: 1, status: 1 });
approvalWorkflowSchema.index({ company: 1, requestedBy: 1 });
const ApprovalWorkflow = model("ApprovalWorkflow", approvalWorkflowSchema);
export default ApprovalWorkflow;
