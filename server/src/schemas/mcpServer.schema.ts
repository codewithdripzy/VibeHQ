import { Schema, model } from "mongoose";
const mcpServerSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        name: { type: String, required: true },
        description: { type: String },
        type: { type: String, enum: ["filesystem", "database", "api", "browser", "git", "memory", "search", "compute", "communication", "custom"], required: true },
        status: { type: String, enum: ["connected", "disconnected", "error", "starting", "stopping"], default: "disconnected", index: true },
        transport: { type: String, enum: ["stdio", "sse", "http", "websocket"], default: "stdio" },
        config: {
            command: { type: String },
            args: { type: [String], default: [] },
            env: { type: Schema.Types.Mixed, default: {} },
            url: { type: String },
            port: { type: Number },
            host: { type: String },
            workingDir: { type: String },
        },
        capabilities: {
            tools: { type: Boolean, default: true },
            resources: { type: Boolean, default: false },
            prompts: { type: Boolean, default: false },
        },
        tools: [{
            name: { type: String, required: true },
            description: { type: String },
            inputSchema: { type: Schema.Types.Mixed },
            tags: { type: [String], default: [] },
        }],
        resources: [{
            uri: { type: String },
            name: { type: String },
            description: { type: String },
            mimeType: { type: String },
        }],
        prompts: [{
            name: { type: String },
            description: { type: String },
            arguments: [{ name: String, description: String, required: Boolean }],
        }],
        allowedAgents: [{ type: Schema.Types.ObjectId, ref: "Agent" }],
        allowedRoles: { type: [String], default: [] },
        usageStats: {
            totalCalls: { type: Number, default: 0 },
            successfulCalls: { type: Number, default: 0 },
            failedCalls: { type: Number, default: 0 },
            lastUsedAt: { type: Date },
        },
        healthCheck: {
            lastChecked: { type: Date },
            status: { type: String, enum: ["healthy", "degraded", "down"], default: "healthy" },
            latency: { type: Number },
        },
        autoRestart: { type: Boolean, default: true },
        maxRestarts: { type: Number, default: 3 },
        restartCount: { type: Number, default: 0 },
        tags: { type: [String], default: [] },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);
mcpServerSchema.index({ company: 1, type: 1 });
mcpServerSchema.index({ company: 1, status: 1 });
const MCPServer = model("MCPServer", mcpServerSchema);
export default MCPServer;
