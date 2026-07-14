import { Schema, model } from "mongoose";
const customerOnboardingSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
        name: { type: String, required: true },
        status: { type: String, enum: ["open", "in_progress", "waiting_on_customer", "waiting_on_internal", "resolved", "closed", "escalated", "reopened"], default: "in_progress", index: true },
        currentStage: { type: Number, default: 0 },
        stages: [{
            name: String, description: String,
            status: { type: String, enum: ["pending", "in_progress", "completed", "skipped"], default: "pending" },
            startedAt: Date, completedAt: Date,
            assignedAgent: { type: Schema.Types.ObjectId, ref: "Agent" },
            tasks: [{ name: String, completed: { type: Boolean, default: false }, completedAt: Date }],
        }],
        startDate: { type: Date, default: Date.now },
        targetCompletionDate: { type: Date },
        actualCompletionDate: { type: Date },
        assignedAgent: { type: Schema.Types.ObjectId, ref: "Agent" },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        notes: { type: String, default: "" },
        blockers: { type: [String], default: [] },
        milestones: [{ name: String, targetDate: Date, completedAt: Date }],
    },
    { timestamps: true }
);
customerOnboardingSchema.index({ company: 1, status: 1 });
const CustomerOnboarding = model("CustomerOnboarding", customerOnboardingSchema);
export default CustomerOnboarding;
