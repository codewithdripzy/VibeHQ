import { Schema, model } from "mongoose";
const externalCalendarSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        provider: { type: String, enum: ["google", "outlook", "apple", "caldav", "exchange"], required: true },
        calendarId: { type: String, required: true },
        calendarName: { type: String, required: true },
        accessToken: { type: String, required: true },
        refreshToken: { type: String },
        tokenExpiresAt: { type: Date },
        syncStatus: { type: String, enum: ["synced", "pending", "failed", "conflict", "partial"], default: "pending" },
        lastSyncedAt: { type: Date },
        syncError: { type: String },
        syncFrequency: { type: String, enum: ["hourly", "daily", "weekly", "monthly", "quarterly", "yearly"], default: "hourly" },
        settings: {
            showAvailability: { type: Boolean, default: true },
            autoBlockSlots: { type: Boolean, default: false },
            bufferMinutes: { type: Number, default: 15 },
            workingHoursOnly: { type: Boolean, default: true },
            workingHours: { start: { type: Number, default: 9 }, end: { type: Number, default: 17 } },
            workingDays: { type: [Number], default: [1, 2, 3, 4, 5] },
        },
        color: { type: String, default: "#4285f4" },
        isVisible: { type: Boolean, default: true },
        isPrimary: { type: Boolean, default: false },
    },
    { timestamps: true }
);
externalCalendarSchema.index({ company: 1, user: 1 });
const ExternalCalendar = model("ExternalCalendar", externalCalendarSchema);
export default ExternalCalendar;
