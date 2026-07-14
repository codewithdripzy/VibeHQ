import { model } from "mongoose";
import { IdeaDocument } from "../core/interfaces/schema";
import ideaSchema from "../schemas/idea.schema";

export const Idea = model<IdeaDocument>("Idea", ideaSchema, "ideas");
