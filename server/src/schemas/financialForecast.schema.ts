import { Schema, model } from "mongoose";

const financialForecastSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        type: { type: String, enum: ["revenue", "expense", "growth", "churn", "burn_rate", "runway", "cac", "ltv", "mrr", "arr"], required: true },
        period: { type: String, enum: ["hourly", "daily", "weekly", "monthly", "quarterly", "yearly"], required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        predictedValue: { type: Number, required: true },
        confidence: { type: Number, min: 0, max: 100 },
        actualValue: { type: Number },
        variance: { type: Number },
        methodology: { type: String },
        assumptions: { type: [String], default: [] },
        dataPoints: [{ date: Date, value: Number }],
        factors: [{ name: String, impact: Number, weight: Number }],
        generatedBy: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        notes: { type: String },
    },
    { timestamps: true }
);
financialForecastSchema.index({ company: 1, type: 1, startDate: -1 });
const FinancialForecast = model("FinancialForecast", financialForecastSchema);
export default FinancialForecast;
