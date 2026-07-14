import { model } from "mongoose";
import { SprintDocument } from "../core/interfaces/schema";
import sprintSchema from "../schemas/sprint.schema";

export const Sprint = model<SprintDocument>("Sprint", sprintSchema, "sprints");
