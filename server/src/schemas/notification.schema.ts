import { Schema } from "mongoose";

const notificationSchema = new Schema(
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
        recipient: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        recipientType: {
            type: String,
            enum: ["user", "agent"],
            required: true,
        },

        type: {
            type: String,
            enum: [
                "task_assigned",
                "task_completed",
                "task_blocked",
                "meeting_scheduled",
                "meeting_reminder",
                "review_requested",
                "approval_needed",
                "budget_alert",
                "deadline_warning",
                "achievement",
                "promotion",
                "mention",
                "announcement",
                "system",
            ],
            required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },

        entityType: { type: String },
        entityId: { type: Schema.Types.ObjectId },

        isRead: { type: Boolean, default: false },
        readAt: { type: Date },

        actionUrl: { type: String },
        actionLabel: { type: String },

        sender: {
            type: Schema.Types.ObjectId,
        },
        senderType: {
            type: String,
            enum: ["user", "agent", "system"],
        },

        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({ company: 1 });
notificationSchema.index({ recipient: 1, recipientType: 1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ company: 1, type: 1 });

export default notificationSchema;
