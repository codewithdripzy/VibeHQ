import { Schema, model } from "mongoose";
const decisionLogSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        context: { type: String, required: true },
        options: [{
            label: String, description: String, pros: [String], cons: [String], estimatedImpact: Number, estimatedEffort: Number,
        }],
        chosenOption: { type: String },
        decisionMaker: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        decisionMakerType: { type: String, enum: ["agent", "user", "team"], default: "agent" },
        rationale: { type: String },
        outcome: { type: String },
        outcomeRating: { type: Number, min: 0, max: 10 },
        relatedDecisions: [{ type: Schema.Types.ObjectId, ref: "DecisionLog" }],
        stakeholders: [{ type: Schema.Types.ObjectId, ref: "Agent" }],
        tags: { type: [String], default: [] },
        reversible: { type: Boolean, default: true },
        deadline: { type: Date },
        decidedAt: { type: Date },
        reviewedAt: { type: Date },
        reviewNotes: { type: String },
    },
    { timestamps: true }
);
decisionLogSchema.index({ company: 1, decidedAt: -1 });
decisionLogSchema.index({ company: 1, decisionMaker: 1 });
const DecisionLog = model("DecisionLog", decisionLogSchema);
export default DecisionLog;
