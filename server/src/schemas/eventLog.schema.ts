import { Schema, model } from "mongoose";
const eventLogSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        eventType: { type: String, required: true, index: true },
        source: { type: String, required: true },
        payload: { type: Schema.Types.Mixed, default: {} },
        triggeredBy: { type: Schema.Types.ObjectId, ref: "Agent" },
        workflowTriggered: { type: Schema.Types.ObjectId, ref: "Workflow" },
        handlersNotified: { type: [String], default: [] },
        result: { success: Boolean, output: Schema.Types.Mixed, error: String },
        duration: { type: Number },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);
eventLogSchema.index({ company: 1, createdAt: -1 });
eventLogSchema.index({ company: 1, eventType: 1, createdAt: -1 });
const EventLog = model("EventLog", eventLogSchema);
export default EventLog;
