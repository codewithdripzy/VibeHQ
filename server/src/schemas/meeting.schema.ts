import { Schema } from "mongoose";

const agendaItemSchema = new Schema(
    {
        topic: { type: String, required: true },
        presenter: { type: Schema.Types.ObjectId, ref: "Agent" },
        durationMinutes: { type: Number },
        notes: { type: String },
    },
    { _id: false }
);

const decisionSchema = new Schema(
    {
        decision: { type: String, required: true },
        decidedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "Agent",
            },
        ],
        decidedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const actionItemSchema = new Schema(
    {
        task: { type: String, required: true },
        assignee: { type: Schema.Types.ObjectId, ref: "Agent" },
        dueDate: { type: Date },
        completed: { type: Boolean, default: false },
    },
    { _id: false }
);

const recurrenceSchema = new Schema(
    {
        frequency: {
            type: String,
            enum: ["daily", "weekly", "biweekly", "monthly"],
        },
        endDate: { type: Date },
    },
    { _id: false }
);

const meetingSchema = new Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        type: {
            type: String,
            enum: [
                "daily_standup",
                "sprint_planning",
                "sprint_review",
                "retrospective",
                "product_review",
                "architecture_review",
                "marketing_review",
                "sales_review",
                "executive_board",
                "all_hands",
                "one_on_one",
                "custom",
            ],
            required: true,
        },
        status: {
            type: String,
            enum: ["scheduled", "in_progress", "completed", "cancelled"],
            default: "scheduled",
        },

        // Schedule
        scheduledAt: { type: Date, required: true },
        durationMinutes: { type: Number, required: true },
        timezone: { type: String, default: "UTC" },
        recurrence: {
            type: recurrenceSchema,
        },

        // Participants
        organizer: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
            required: true,
        },
        attendees: [
            {
                type: Schema.Types.ObjectId,
                ref: "Agent",
            },
        ],
        requiredAttendees: [
            {
                type: Schema.Types.ObjectId,
                ref: "Agent",
            },
        ],
        optionalAttendees: [
            {
                type: Schema.Types.ObjectId,
                ref: "Agent",
            },
        ],

        // Content
        agenda: {
            type: [agendaItemSchema],
            default: [],
        },

        // Outcome
        notes: { type: String },
        decisions: {
            type: [decisionSchema],
            default: [],
        },
        actionItems: {
            type: [actionItemSchema],
            default: [],
        },

        // Related
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },
        relatedDocuments: [
            {
                type: Schema.Types.ObjectId,
                ref: "CompanyDocument",
            },
        ],

        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

meetingSchema.index({ company: 1 });
meetingSchema.index({ company: 1, scheduledAt: 1 });
meetingSchema.index({ project: 1 });
meetingSchema.index({ organizer: 1 });

export default meetingSchema;
