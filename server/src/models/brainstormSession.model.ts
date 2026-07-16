import { model } from "mongoose";
import brainstormSessionSchema from "../schemas/brainstormSession.schema";

export const BrainstormSession = model("BrainstormSession", brainstormSessionSchema, "brainstormSessions");
export default BrainstormSession;
