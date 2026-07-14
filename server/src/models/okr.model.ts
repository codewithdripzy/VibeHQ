import { model } from "mongoose";
import { OKRDocument } from "../core/interfaces/schema";
import okrSchema from "../schemas/okr.schema";

export const OKR = model<OKRDocument>("OKR", okrSchema, "okrs");
