import { model } from "mongoose";
import { CompanyDocument } from "../core/interfaces/schema";
import companySchema from "../schemas/company.schema";

export const Company = model<CompanyDocument>("Company", companySchema, "companies");
