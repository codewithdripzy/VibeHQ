import { model } from "mongoose";
import { TeamDocument } from "../core/interfaces/schema";
import teamSchema from "../schemas/team.schema";

export const Team = model<TeamDocument>("Team", teamSchema, "teams");
