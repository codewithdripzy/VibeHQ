import { Schema } from "mongoose";

const expenseSchema = new Schema(
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
        category: {
            type: String,
            enum: [
                "software",
                "cloud_infrastructure",
                "api_costs",
                "marketing",
                "contractors",
                "hardware",
                "office",
                "travel",
                "legal",
                "insurance",
                "salaries",
                "bonuses",
                "other",
            ],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "reimbursed"],
            default: "pending",
        },

        amount: { type: Number, required: true },
        currency: { type: String, default: "USD" },
        exchangeRate: { type: Number },
        amountInDefaultCurrency: { type: Number, required: true },

        vendor: { type: String },
        invoiceNumber: { type: String },
        invoiceUrl: { type: String },
        receiptUrl: { type: String },

        submittedBy: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
            required: true,
        },
        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
        },
        approvedAt: { type: Date },

        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },
        team: {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },
        budget: {
            type: String,
            enum: ["company", "project", "team"],
            default: "company",
        },

        isRecurring: { type: Boolean, default: false },
        recurrenceFrequency: {
            type: String,
            enum: ["monthly", "quarterly", "annually"],
        },

        expenseDate: { type: Date, required: true },

        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

expenseSchema.index({ company: 1 });
expenseSchema.index({ company: 1, status: 1 });
expenseSchema.index({ company: 1, category: 1 });
expenseSchema.index({ project: 1 });
expenseSchema.index({ team: 1 });

export default expenseSchema;
