import { Schema, model } from "mongoose";

const invoiceSchema = new Schema(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
        invoiceNumber: { type: String, required: true, unique: true },
        status: { type: String, enum: ["draft", "sent", "viewed", "paid", "overdue", "cancelled", "refunded", "partially_paid", "disputed"], default: "draft", index: true },
        lineItems: [{
            description: { type: String },
            quantity: { type: Number, default: 1 },
            unitPrice: { type: Number },
            total: { type: Number },
            project: { type: Schema.Types.ObjectId, ref: "Project" },
        }],
        subtotal: { type: Number, required: true },
        tax: { type: Number, default: 0 },
        total: { type: Number, required: true },
        currency: { type: String, default: "USD" },
        paymentMethod: { type: String, enum: ["credit_card", "debit_card", "bank_transfer", "wire_transfer", "crypto", "invoice", "auto_deduct", "paypal", "stripe"] },
        dueDate: { type: Date, required: true },
        paidAt: { type: Date },
        notes: { type: String },
        billingAddress: {
            name: String, line1: String, line2: String, city: String, state: String, postalCode: String, country: String,
        },
        sentAt: { type: Date },
        reminderCount: { type: Number, default: 0 },
        lastReminderAt: { type: Date },
        stripeInvoiceId: { type: String },
    },
    { timestamps: true }
);
invoiceSchema.index({ company: 1, status: 1 });
invoiceSchema.index({ company: 1, customer: 1 });
const Invoice = model("Invoice", invoiceSchema);
export default Invoice;
