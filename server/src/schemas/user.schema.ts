import { Schema } from "mongoose";

const userSchema = new Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        loginProvider: {
            type: String,
            enum: ["local", "google", "github"],
            default: "local",
        },
        role: {
            type: [String],
            enum: ["user", "admin"],
        },
        avatar: {
            type: String,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
        },
        companies: [
            {
                type: Schema.Types.ObjectId,
                ref: "Company",
            },
        ],
        activeCompany: {
            type: Schema.Types.ObjectId,
            ref: "Company",
        },
        isFirstTime: {
            type: Boolean,
            default: true,
        },
        onboardingStatus: [
            {
                task: String,
                completed: {
                    type: Boolean,
                    default: false,
                },
                completedAt: Date,
            },
        ],
        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);



export default userSchema;
