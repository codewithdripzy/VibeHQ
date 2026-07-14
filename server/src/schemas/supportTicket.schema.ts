import { Schema, model } from "mongoose";
const supportTicketSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
        ticketNumber: { type: String, required: true, unique: true },
        subject: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, enum: ["bug", "feature_request", "account", "billing", "onboarding", "technical", "general", "complaint", "security", "performance"], required: true },
        priority: { type: String, enum: ["critical", "high", "medium", "low"], default: "medium", index: true },
        status: { type: String, enum: ["open", "in_progress", "waiting_on_customer", "waiting_on_internal", "resolved", "closed", "escalated", "reopened"], default: "open", index: true },
        assignedAgent: { type: Schema.Types.ObjectId, ref: "Agent" },
        assignedTeam: { type: Schema.Types.ObjectId, ref: "Team" },
        channel: { type: String, default: "web" },
        messages: [{
            sender: { type: Schema.Types.ObjectId, ref: "Agent" },
            senderType: { type: String, enum: ["agent", "customer", "system"] },
            content: String, timestamp: Date, attachments: [String], isInternal: { type: Boolean, default: false },
        }],
        tags: { type: [String], default: [] },
        relatedTickets: [{ type: Schema.Types.ObjectId, ref: "SupportTicket" }],
        slaBreached: { type: Boolean, default: false },
        firstResponseAt: { type: Date },
        firstResponseTime: { type: Number },
        resolutionTime: { type: Number },
        resolvedAt: { type: Date },
        resolvedBy: { type: Schema.Types.ObjectId, ref: "Agent" },
        satisfactionScore: { type: Number, min: 1, max: 5 },
        satisfactionFeedback: { type: String },
        reopenCount: { type: Number, default: 0 },
        escalationHistory: [{
            escalatedTo: { type: Schema.Types.ObjectId, ref: "Agent" }, escalatedAt: Date, reason: String,
        }],
        metadata: { type: Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);
supportTicketSchema.index({ company: 1, status: 1, priority: 1 });
supportTicketSchema.index({ company: 1, customer: 1 });
const SupportTicket = model("SupportTicket", supportTicketSchema);
export default SupportTicket;
