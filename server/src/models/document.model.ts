import { model } from "mongoose";
import { CompanyDocumentDoc } from "../core/interfaces/schema";
import companyDocumentSchema from "../schemas/document.schema";

export const CompanyDocument = model<CompanyDocumentDoc>(
    "CompanyDocument",
    companyDocumentSchema,
    "company_documents"
);
