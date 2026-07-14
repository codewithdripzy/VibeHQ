import { model } from "mongoose";
import { AgentMemoryDocument } from "../core/interfaces/schema";
import agentMemorySchema from "../schemas/agentMemory.schema";

export const AgentMemory = model<AgentMemoryDocument>(
    "AgentMemory",
    agentMemorySchema,
    "agent_memories"
);
