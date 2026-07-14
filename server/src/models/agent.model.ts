import { model } from "mongoose";
import { AgentDocument } from "../core/interfaces/schema";
import agentSchema from "../schemas/agent.schema";

export const Agent = model<AgentDocument>("Agent", agentSchema, "agents");
