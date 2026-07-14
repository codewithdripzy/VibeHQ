import { model } from "mongoose";
import { AuditLogDocument } from "../core/interfaces/schema";
import auditLogSchema from "../schemas/auditLog.schema";

export const AuditLog = model<AuditLogDocument>("AuditLog", auditLogSchema, "audit_logs");
