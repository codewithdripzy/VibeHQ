import { Schema, model } from "mongoose";
const complianceRecordSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        checkType: { type: String, enum: ["data_privacy", "financial", "security", "legal", "operational", "hr", "environmental", "access_control"], required: true, index: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        status: { type: String, enum: ["compliant", "non_compliant", "under_review", "exempt", "pending"], default: "pending", index: true },
        score: { type: Number, default: 0 },
        maxScore: { type: Number, default: 100 },
        lastCheckedAt: { type: Date, default: Date.now },
        nextCheckAt: { type: Date },
        frequency: { type: String, enum: ["hourly", "daily", "weekly", "monthly", "quarterly", "yearly"], default: "monthly" },
        checks: [{
            name: String, passed: Boolean, score: Number, maxScore: Number, details: String, evidence: String,
        }],
        findings: [{
            severity: { type: String, enum: ["low", "medium", "high", "critical", "fatal"] },
            description: String, recommendation: String,
            status: { type: String, enum: ["open", "acknowledged", "remediated", "accepted"], default: "open" },
            remediatedAt: Date, remediatedBy: { type: Schema.Types.ObjectId, ref: "Agent" },
        }],
        assessor: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        report: { type: String },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);
complianceRecordSchema.index({ company: 1, checkType: 1, status: 1 });
const ComplianceRecord = model("ComplianceRecord", complianceRecordSchema);
export default ComplianceRecord;
