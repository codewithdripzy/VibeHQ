import { Schema, model } from "mongoose";
const knowledgeEntrySchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        type: { type: String, enum: ["sop", "decision", "lesson", "process", "policy", "template", "faq", "runbook", "architecture", "postmortem", "onboarding", "how_to", "reference"], required: true, index: true },
        accessLevel: { type: String, enum: ["public", "internal", "team", "confidential", "restricted", "classified"], default: "internal" },
        author: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        lastEditedBy: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        tags: { type: [String], default: [] },
        category: { type: String },
        relatedEntries: [{ type: Schema.Types.ObjectId, ref: "KnowledgeEntry" }],
        attachments: [{ name: String, url: String, type: String }],
        version: { type: Number, default: 1 },
        versionHistory: [{
            version: Number, content: String, editedBy: { type: Schema.Types.ObjectId, ref: "Agent" }, editedAt: Date, changeNote: String,
        }],
        viewCount: { type: Number, default: 0 },
        lastViewedAt: { type: Date },
        helpful: { type: Number, default: 0 },
        notHelpful: { type: Number, default: 0 },
        isPublished: { type: Boolean, default: false, index: true },
        isPinned: { type: Boolean, default: false },
        searchKeywords: { type: [String], default: [] },
    },
    { timestamps: true }
);
knowledgeEntrySchema.index({ company: 1, isPublished: 1, type: 1 });
knowledgeEntrySchema.index({ company: 1, searchKeywords: "text" });
const KnowledgeEntry = model("KnowledgeEntry", knowledgeEntrySchema);
export default KnowledgeEntry;
