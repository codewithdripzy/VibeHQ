import { Schema, model } from "mongoose";
const rbacRoleSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        permissions: [{
            resource: { type: String, required: true },
            actions: { type: [String], enum: ["create", "read", "update", "delete", "execute", "approve", "assign", "escalate"], required: true },
            conditions: { type: Schema.Types.Mixed },
        }],
        isSystem: { type: Boolean, default: false },
        isDefault: { type: Boolean, default: false },
        hierarchy: { type: Number, default: 0 },
        parentRole: { type: Schema.Types.ObjectId, ref: "RBACRole" },
        childRoles: [{ type: Schema.Types.ObjectId, ref: "RBACRole" }],
        assignedAgents: [{ type: Schema.Types.ObjectId, ref: "Agent" }],
        assignedCount: { type: Number, default: 0 },
        expiresAt: { type: Date },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);
rbacRoleSchema.index({ company: 1, name: 1 }, { unique: true });
const RBACRole = model("RBACRole", rbacRoleSchema);
export default RBACRole;
