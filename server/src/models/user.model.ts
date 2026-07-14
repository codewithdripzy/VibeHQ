import { model } from "mongoose";
import { UserDocument } from "../core/interfaces/schema";
import userSchema from "../schemas/user.schema";

export const User = model<UserDocument>("User", userSchema, "users");
