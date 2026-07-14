import { Schema, model } from "mongoose";
const directMessageSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        conversationId: { type: String, required: true, index: true },
        sender: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        senderType: { type: String, enum: ["agent", "user"], default: "agent" },
        recipient: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        recipientType: { type: String, enum: ["agent", "user"], default: "agent" },
        content: { type: String, required: true },
        messageType: { type: String, enum: ["text", "image", "file", "system", "reaction"], default: "text" },
        replyTo: { type: Schema.Types.ObjectId, ref: "DirectMessage" },
        read: { type: Boolean, default: false },
        readAt: { type: Date },
        reactions: [{ emoji: String, agents: [{ type: Schema.Types.ObjectId, ref: "Agent" }] }],
        isDeleted: { type: Boolean, default: false },
        editedAt: { type: Date },
        metadata: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);
directMessageSchema.index({ company: 1, conversationId: 1, createdAt: -1 });
directMessageSchema.index({ company: 1, recipient: 1, read: 1 });
const DirectMessage = model("DirectMessage", directMessageSchema);
export default DirectMessage;
