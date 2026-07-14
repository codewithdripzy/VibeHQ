import { model } from "mongoose";
import { ProjectDocument } from "../core/interfaces/schema";
import projectSchema from "../schemas/project.schema";

export const Project = model<ProjectDocument>("Project", projectSchema, "projects");
