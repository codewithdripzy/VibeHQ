import { model } from "mongoose";
import { MilestoneDocument } from "../core/interfaces/schema";
import milestoneSchema from "../schemas/milestone.schema";

export const Milestone = model<MilestoneDocument>("Milestone", milestoneSchema, "milestones");
