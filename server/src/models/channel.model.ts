import { model } from "mongoose";
import { ChannelDocument } from "../core/interfaces/schema";
import channelSchema from "../schemas/channel.schema";

export const Channel = model<ChannelDocument>("Channel", channelSchema, "channels");
