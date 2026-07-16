import { configDotenv } from "dotenv";
configDotenv();

import express from "express";
import cors from "cors";
import { createServer } from "http";
import mongoose from "mongoose";
import routes from "./routes";
import { errorHandler } from "./core/middleware/error.middleware";
import { wsServer } from "./websocket/server";
import { scheduler } from "./cron/scheduler";
import { registerBuiltInTools } from "./tools/builtIn";
import { getLLMRouter } from "./llm/router";
import Database from "./config/database";
import brainstormService from "./services/brainstorm.service";

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:3000",
    credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), version: "1.0.0" });
});

// API routes
app.use("/api", routes);

// Error handling
app.use(errorHandler);

// Initialize services
async function init() {
    const db = new Database();
    await db.getConnection();
    console.log("[DB] Connected to MongoDB");

    wsServer.init(httpServer);
    console.log("[WS] WebSocket server initialized");

    await scheduler.loadJobs();
    scheduler.startPolling(60000);
    console.log("[Scheduler] Cron scheduler started");

    registerBuiltInTools();
    console.log("[Tools] Built-in tools registered");

    await brainstormService.resumeRunningSessions();
    console.log("[Brainstorm] Running sessions resumed");

    console.log("[LLM] Multi-model LLM router ready");
}

const PORT = parseInt(process.env.PORT || "3003");

export { app, httpServer, init, PORT };
