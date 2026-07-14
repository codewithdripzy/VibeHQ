import { model } from "mongoose";
import { CampaignDocument } from "../core/interfaces/schema";
import campaignSchema from "../schemas/campaign.schema";

export const Campaign = model<CampaignDocument>("Campaign", campaignSchema, "campaigns");
