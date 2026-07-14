import { model } from "mongoose";
import { MeetingDocument } from "../core/interfaces/schema";
import meetingSchema from "../schemas/meeting.schema";

export const Meeting = model<MeetingDocument>("Meeting", meetingSchema, "meetings");
