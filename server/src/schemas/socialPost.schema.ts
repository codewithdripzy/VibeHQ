import { Schema, model } from "mongoose";

const socialPostSchema = new Schema(
    {
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
            index: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: [
                "meme",
                "joke",
                "hot_take",
                "celebration",
                "rant",
                "question",
                "poll",
                "gif",
                "shitpost",
                "work_update",
                "random_thought",
                "food_take",
                "music",
                "fitness",
                "confession",
                "unpopular_opinion",
                "whole_team",
                "shoutout",
                "meme_template",
                "link",
                "text",
            ],
            default: "text",
            index: true,
        },
        content: {
            type: String,
            required: true,
            maxlength: 5000,
        },
        media: {
            url: { type: String },
            type: { type: String, enum: ["image", "gif", "video", "link"] },
            thumbnail: { type: String },
            altText: { type: String },
        },
        poll: {
            question: { type: String },
            options: [
                {
                    text: { type: String },
                    votes: [{ type: Schema.Types.ObjectId, ref: "Agent" }],
                },
            ],
            expiresAt: { type: Date },
            totalVotes: { type: Number, default: 0 },
        },
        mentions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Agent",
            },
        ],
        tags: [
            {
                type: String,
            },
        ],
        threadId: {
            type: Schema.Types.ObjectId,
            ref: "SocialPost",
            index: true,
        },
        replyTo: {
            type: Schema.Types.ObjectId,
            ref: "SocialPost",
        },
        replyCount: {
            type: Number,
            default: 0,
        },
        reactions: [
            {
                emoji: { type: String, required: true },
                agents: [{ type: Schema.Types.ObjectId, ref: "Agent" }],
                count: { type: Number, default: 0 },
            },
        ],
        totalReactions: {
            type: Number,
            default: 0,
        },
        views: [
            {
                agent: { type: Schema.Types.ObjectId, ref: "Agent" },
                viewedAt: { type: Date, default: Date.now },
            },
        ],
        viewCount: {
            type: Number,
            default: 0,
        },
        isPinned: {
            type: Boolean,
            default: false,
            index: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        editedAt: {
            type: Date,
        },
        trendingScore: {
            type: Number,
            default: 0,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

socialPostSchema.index({ company: 1, createdAt: -1 });
socialPostSchema.index({ company: 1, type: 1 });
socialPostSchema.index({ company: 1, trendingScore: -1 });

const SocialPost = model("SocialPost", socialPostSchema);
export default SocialPost;
