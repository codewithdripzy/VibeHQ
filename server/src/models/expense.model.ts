import { model } from "mongoose";
import { ExpenseDocument } from "../core/interfaces/schema";
import expenseSchema from "../schemas/expense.schema";

export const Expense = model<ExpenseDocument>("Expense", expenseSchema, "expenses");
