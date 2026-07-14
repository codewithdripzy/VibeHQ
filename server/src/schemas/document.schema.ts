import { Schema } from "mongoose";

const reviewCommentSchema = new Schema(
    {
        agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        content: { type: String, required: true },
        resolved: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const companyDocumentSchema = new Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        type: {
            type: String,
            enum: [
                "prd",
                "rfc",
                "design_doc",
                "playbook",
                "policy",
                "sop",
                "meeting_notes",
                "post_mortem",
                "retrospective",
                "onboarding",
                "wiki",
                "spec",
                "report",
                "contract",
                "proposal",
                "other",
            ],
            required: true,
        },
        status: {
            type: String,
            enum: ["draft", "in_review", "approved", "published", "archived"],
            default: "draft",
        },

        // Content
        content: { type: String, default: "" },
        format: {
            type: String,
            enum: ["markdown", "html", "plain"],
            default: "markdown",
        },

        // Structure
        folder: { type: Schema.Types.ObjectId, ref: "CompanyDocument" },
        tags: { type: [String], default: [] },
        version: { type: Number, default: 1 },

        // Ownership
        author: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
            required: true,
        },
        lastEditedBy: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
        },

        // Collaboration
        reviewers: [
            {
                type: Schema.Types.ObjectId,
                ref: "Agent",
            },
        ],
        reviewComments: {
            type: [reviewCommentSchema],
            default: [],
        },

        // Relationships
        parentDocument: {
            type: Schema.Types.ObjectId,
            ref: "CompanyDocument",
        },
        relatedDocuments: [
            {
                type: Schema.Types.ObjectId,
                ref: "CompanyDocument",
            },
        ],
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },

        // Access
        visibility: {
            type: String,
            enum: ["private", "team", "company", "public"],
            default: "company",
        },
        allowedAgents: [
            {
                type: Schema.Types.ObjectId,
                ref: "Agent",
            },
        ],

        // Publishing
        publishedAt: { type: Date },
        expiresAt: { type: Date },

        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

companyDocumentSchema.index({ company: 1 });
companyDocumentSchema.index({ company: 1, type: 1 });
companyDocumentSchema.index({ company: 1, status: 1 });
companyDocumentSchema.index({ project: 1 });
companyDocumentSchema.index({ slug: 1 });

export default companyDocumentSchema;
