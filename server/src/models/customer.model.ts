import { model } from "mongoose";
import { CustomerDocument } from "../core/interfaces/schema";
import customerSchema from "../schemas/customer.schema";

export const Customer = model<CustomerDocument>("Customer", customerSchema, "customers");
