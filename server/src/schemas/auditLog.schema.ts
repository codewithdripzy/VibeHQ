import { Schema } from "mongoose";

const auditLogSchema = new Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        actor: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        actorType: {
            type: String,
            enum: ["user", "agent", "system"],
            required: true,
        },

        entityType: {
            type: String,
            enum: [
                "user",
                "company",
                "team",
                "agent",
                "project",
                "task",
                "meeting",
                "document",
                "campaign",
                "customer",
                "okr",
                "expense",
                "resource",
                "channel",
            ],
            required: true,
        },
        entityId: {
            type: Schema.Types.ObjectId,
            required: true,
        },

        changes: [
            {
                field: { type: String },
                oldValue: { type: Schema.Types.Mixed },
                newValue: { type: Schema.Types.Mixed },
            },
        ],

        metadata: { type: Schema.Types.Mixed },
        ipAddress: { type: String },
        userAgent: { type: String },

        timestamp: { type: Date, default: Date.now },

        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

auditLogSchema.index({ company: 1 });
auditLogSchema.index({ company: 1, action: 1 });
auditLogSchema.index({ company: 1, entityType: 1 });
auditLogSchema.index({ company: 1, actor: 1 });
auditLogSchema.index({ company: 1, timestamp: -1 });
auditLogSchema.index({ entityId: 1 });

export default auditLogSchema;
