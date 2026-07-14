import { Schema, model } from "mongoose";
const llmConfigSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        name: { type: String, required: true },
        provider: { type: String, enum: ["ollama", "huggingface", "together", "groq", "openai", "anthropic", "google", "mistral", "deepseek", "local", "custom"], required: true },
        model: { type: String, required: true },
        modelSize: { type: String, enum: ["tiny", "small", "medium", "large", "extra_large"], default: "medium" },
        isDefault: { type: Boolean, default: false },
        isFree: { type: Boolean, default: true },
        config: {
            baseUrl: { type: String },
            apiKey: { type: String },
            temperature: { type: Number, default: 0.7 },
            maxTokens: { type: Number, default: 4096 },
            topP: { type: Number, default: 0.9 },
            frequencyPenalty: { type: Number, default: 0 },
            presencePenalty: { type: Number, default: 0 },
            stopSequences: { type: [String], default: [] },
            timeout: { type: Number, default: 30000 },
            retries: { type: Number, default: 3 },
        },
        rateLimit: {
            requestsPerMinute: { type: Number, default: 60 },
            tokensPerMinute: { type: Number, default: 100000 },
            currentUsage: { type: Number, default: 0 },
            resetAt: { type: Date },
        },
        usageStats: {
            totalRequests: { type: Number, default: 0 },
            totalTokens: { type: Number, default: 0 },
            totalCost: { type: Number, default: 0 },
            averageLatency: { type: Number, default: 0 },
            lastUsedAt: { type: Date },
        },
        allowedAgents: [{ type: Schema.Types.ObjectId, ref: "Agent" }],
        allowedRoles: { type: [String], default: [] },
        fallbackOrder: { type: Number, default: 0 },
        tags: { type: [String], default: [] },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);
llmConfigSchema.index({ company: 1, provider: 1 });
llmConfigSchema.index({ company: 1, isDefault: 1 });
const LLMConfig = model("LLMConfig", llmConfigSchema);
export default LLMConfig;
