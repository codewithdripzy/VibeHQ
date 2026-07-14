import { Schema, model } from "mongoose";
const secretStoreSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        name: { type: String, required: true },
        service: { type: String, enum: ["google_meet", "google_calendar", "github", "gitlab", "jira", "linear", "notion", "slack", "discord", "twitter", "linkedin", "stripe", "sendgrid", "twilio", "aws", "gcp", "azure", "openai", "anthropic", "firebase", "supabase", "redis", "postgres", "mongodb", "elasticsearch", "custom"], required: true },
        key: { type: String, required: true },
        encryptedValue: { type: String, required: true },
        iv: { type: String, required: true },
        accessLevel: { type: String, enum: ["public", "internal", "team", "confidential", "restricted", "classified"], default: "confidential" },
        createdBy: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        lastRotatedAt: { type: Date, default: Date.now },
        rotationInterval: { type: Number, default: 90 },
        expiresAt: { type: Date },
        lastAccessedBy: { type: Schema.Types.ObjectId, ref: "Agent" },
        lastAccessedAt: { type: Date },
        accessCount: { type: Number, default: 0 },
        allowedAgents: [{ type: Schema.Types.ObjectId, ref: "Agent" }],
        allowedRoles: { type: [String], default: [] },
        tags: { type: [String], default: [] },
        isActive: { type: Boolean, default: true },
        backupLocation: { type: String },
    },
    { timestamps: true }
);
secretStoreSchema.index({ company: 1, service: 1, key: 1 }, { unique: true });
const SecretStore = model("SecretStore", secretStoreSchema);
export default SecretStore;
