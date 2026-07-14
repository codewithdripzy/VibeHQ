import { model } from "mongoose";
import { CompanyResourceDocument } from "../core/interfaces/schema";
import companyResourceSchema from "../schemas/companyResource.schema";

export const CompanyResource = model<CompanyResourceDocument>(
    "CompanyResource",
    companyResourceSchema,
    "company_resources"
);
