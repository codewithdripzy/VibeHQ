import { Schema, model } from "mongoose";
const contentCalendarSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, enum: ["blog", "social_post", "email", "ad", "landing_page", "video", "podcast", "newsletter", "webinar", "case_study", "whitepaper", "infographic", "press_release", "documentation", "tutorial"], required: true, index: true },
        status: { type: String, enum: ["ideation", "drafting", "review", "approved", "scheduled", "published", "archived", "failed"], default: "ideation", index: true },
        scheduledDate: { type: Date, index: true },
        publishedDate: { type: Date },
        author: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        assignedTo: { type: Schema.Types.ObjectId, ref: "Agent" },
        project: { type: Schema.Types.ObjectId, ref: "Project" },
        campaign: { type: Schema.Types.ObjectId, ref: "Campaign" },
        content: { type: String },
        media: [{ url: String, type: String, altText: String }],
        channels: { type: [String], default: [] },
        tags: { type: [String], default: [] },
        seoTitle: { type: String },
        seoDescription: { type: String },
        seoKeywords: { type: [String] },
        performance: { views: Number, likes: Number, shares: Number, comments: Number, clicks: Number, conversions: Number, engagementRate: Number },
        approvalRequired: { type: Boolean, default: false },
        approvedBy: { type: Schema.Types.ObjectId, ref: "Agent" },
        approvedAt: { type: Date },
        notes: { type: String },
    },
    { timestamps: true }
);
contentCalendarSchema.index({ company: 1, scheduledDate: 1, status: 1 });
const ContentCalendar = model("ContentCalendar", contentCalendarSchema);
export default ContentCalendar;
