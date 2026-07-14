import { Schema, model } from "mongoose";
const feedbackLoopSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
        type: { type: String, enum: ["nps", "csat", "ces", "survey", "in_app", "support", "social_media", "review", "interview", "usage"], required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        rating: { type: Number, min: 1, max: 10 },
        sentiment: { type: String, enum: ["positive", "neutral", "negative"], required: true },
        category: { type: String },
        source: { type: String },
        relatedEntity: { entityType: String, entityId: Schema.Types.ObjectId },
        response: { content: String, respondedBy: { type: Schema.Types.ObjectId, ref: "Agent" }, respondedAt: Date },
        status: { type: String, enum: ["new", "reviewed", "actioned", "closed"], default: "new", index: true },
        actionItems: [{
            description: String, assignedTo: { type: Schema.Types.ObjectId, ref: "Agent" }, completed: { type: Boolean, default: false }, completedAt: Date,
        }],
        tags: { type: [String], default: [] },
        upvotes: { type: Number, default: 0 },
        downvotes: { type: Number, default: 0 },
    },
    { timestamps: true }
);
feedbackLoopSchema.index({ company: 1, sentiment: 1, status: 1 });
const FeedbackLoop = model("FeedbackLoop", feedbackLoopSchema);
export default FeedbackLoop;
