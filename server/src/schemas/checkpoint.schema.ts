import { Schema, model } from "mongoose";
const checkpointSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true, index: true },
        task: { type: Schema.Types.ObjectId, ref: "Task" },
        project: { type: Schema.Types.ObjectId, ref: "Project" },
        state: {
            currentStep: { type: Number, default: 0 },
            totalSteps: { type: Number, default: 0 },
            completedSteps: { type: Number, default: 0 },
            data: { type: Schema.Types.Mixed, default: {} },
            memorySnapshot: { type: Schema.Types.Mixed, default: {} },
            contextSnapshot: { type: Schema.Types.Mixed, default: {} },
        },
        isCheckpoint: { type: Boolean, default: true },
        restoreCount: { type: Number, default: 0 },
        lastRestoredAt: { type: Date },
    },
    { timestamps: true }
);
checkpointSchema.index({ company: 1, agent: 1, task: 1 });
const Checkpoint = model("Checkpoint", checkpointSchema);
export default Checkpoint;
