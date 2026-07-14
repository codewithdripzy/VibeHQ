import { Schema, model } from "mongoose";
const agentToolConfigSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        name: { type: String, required: true },
        type: { type: String, enum: ["google_meet", "google_calendar", "github", "gitlab", "jira", "linear", "notion", "slack", "discord", "twitter", "linkedin", "stripe", "sendgrid", "twilio", "aws", "gcp", "azure", "openai", "anthropic", "firebase", "supabase", "redis", "postgres", "mongodb", "elasticsearch", "custom"], required: true },
        status: { type: String, enum: ["connected", "disconnected", "error", "expired", "rate_limited", "pending"], default: "pending", index: true },
        config: { type: Schema.Types.Mixed, default: {} },
        credentials: { type: Schema.Types.ObjectId, ref: "SecretStore" },
        allowedAgents: [{ type: Schema.Types.ObjectId, ref: "Agent" }],
        allowedRoles: { type: [String], default: [] },
        rateLimit: {
            requestsPerMinute: { type: Number, default: 60 },
            requestsPerDay: { type: Number, default: 1000 },
            currentUsage: { type: Number, default: 0 },
            resetAt: { type: Date },
        },
        usageStats: {
            totalCalls: { type: Number, default: 0 },
            successfulCalls: { type: Number, default: 0 },
            failedCalls: { type: Number, default: 0 },
            averageResponseTime: { type: Number, default: 0 },
            lastUsedAt: { type: Date },
        },
        webhooks: [{
            url: String, secret: String, events: [String], active: { type: Boolean, default: true },
        }],
        scopes: { type: [String], default: [] },
        expiresAt: { type: Date },
        lastHealthCheck: { type: Date },
        healthStatus: { type: String, enum: ["healthy", "degraded", "down"], default: "healthy" },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);
agentToolConfigSchema.index({ company: 1, type: 1 });
agentToolConfigSchema.index({ company: 1, status: 1 });
const AgentToolConfig = model("AgentToolConfig", agentToolConfigSchema);
export default AgentToolConfig;
