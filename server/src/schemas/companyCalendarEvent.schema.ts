import { Schema, model } from "mongoose";
const companyCalendarEventSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        title: { type: String, required: true },
        description: { type: String },
        type: { type: String, enum: ["meeting", "deadline", "milestone", "sprint_start", "sprint_end", "standup", "retrospective", "all_hands", "one_on_one", "interview", "launch", "review", "workshop", "conference", "personal", "reminder", "recurring"], required: true, index: true },
        startDate: { type: Date, required: true, index: true },
        endDate: { type: Date, required: true },
        allDay: { type: Boolean, default: false },
        timezone: { type: String, default: "UTC" },
        location: { type: String },
        meetingBooking: { type: Schema.Types.ObjectId, ref: "MeetingBooking" },
        project: { type: Schema.Types.ObjectId, ref: "Project" },
        sprint: { type: Schema.Types.ObjectId, ref: "Sprint" },
        milestone: { type: Schema.Types.ObjectId, ref: "Milestone" },
        attendees: [{
            agent: { type: Schema.Types.ObjectId, ref: "Agent" },
            user: { type: Schema.Types.ObjectId, ref: "User" },
            status: { type: String, enum: ["accepted", "declined", "tentative", "pending"], default: "pending" },
        }],
        organizer: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        isRecurring: { type: Boolean, default: false },
        recurrenceRule: { type: String },
        reminders: [{ minutesBefore: Number, sent: { type: Boolean, default: false } }],
        tags: { type: [String], default: [] },
        color: { type: String },
        isCancelled: { type: Boolean, default: false },
        cancelledAt: { type: Date },
        cancelledBy: { type: Schema.Types.ObjectId, ref: "Agent" },
        cancellationReason: { type: String },
        externalCalendarIds: [{
            provider: { type: String, enum: ["google", "outlook", "apple", "caldav", "exchange"] },
            eventId: String,
            calendarId: String,
        }],
    },
    { timestamps: true }
);
companyCalendarEventSchema.index({ company: 1, startDate: 1, endDate: 1 });
companyCalendarEventSchema.index({ company: 1, type: 1 });
const CompanyCalendarEvent = model("CompanyCalendarEvent", companyCalendarEventSchema);
export default CompanyCalendarEvent;
