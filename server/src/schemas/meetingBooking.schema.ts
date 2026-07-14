import { Schema, model } from "mongoose";
const meetingBookingSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        title: { type: String, required: true },
        description: { type: String },
        platform: { type: String, enum: ["google_meet", "zoom", "microsoft_teams", "discord", "slack_huddle", "in_person", "phone", "webex", "hangouts", "custom"], required: true },
        scheduledBy: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        scheduledAt: { type: Date, required: true, index: true },
        duration: { type: Number, required: true },
        timezone: { type: String, default: "UTC" },
        attendees: [{
            agent: { type: Schema.Types.ObjectId, ref: "Agent" },
            user: { type: Schema.Types.ObjectId, ref: "User" },
            email: String,
            external: Boolean,
            status: { type: String, enum: ["accepted", "declined", "tentative", "pending"], default: "pending" },
        }],
        meetingUrl: { type: String },
        meetingId: { type: String },
        passcode: { type: String },
        calendarEventId: { type: String },
        reminderMinutes: { type: [Number], default: [15] },
        isRecurring: { type: Boolean, default: false },
        recurrenceRule: { type: String },
        agenda: [{
            topic: String, presenter: { type: Schema.Types.ObjectId, ref: "Agent" }, durationMinutes: Number, notes: String,
        }],
        notes: { type: String },
        recording: { url: String, duration: Number, summary: String },
        followUp: { tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }], notes: String, sentAt: Date },
        status: { type: String, enum: ["scheduled", "in_progress", "completed", "cancelled", "no_show"], default: "scheduled", index: true },
    },
    { timestamps: true }
);
meetingBookingSchema.index({ company: 1, scheduledAt: 1 });
const MeetingBooking = model("MeetingBooking", meetingBookingSchema);
export default MeetingBooking;
