import { model } from "mongoose";
import { NotificationDocument } from "../core/interfaces/schema";
import notificationSchema from "../schemas/notification.schema";

export const Notification = model<NotificationDocument>(
    "Notification",
    notificationSchema,
    "notifications"
);
