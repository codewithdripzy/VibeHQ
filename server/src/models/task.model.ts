import { model } from "mongoose";
import { TaskDocument } from "../core/interfaces/schema";
import taskSchema from "../schemas/task.schema";

export const Task = model<TaskDocument>("Task", taskSchema, "tasks");
