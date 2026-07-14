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

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
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
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vibehq";
    await mongoose.connect(MONGO_URI);
    console.log("[DB] Connected to MongoDB");

    wsServer.init(httpServer);
    console.log("[WS] WebSocket server initialized");

    await scheduler.loadJobs();
    scheduler.startPolling(60000);
    console.log("[Scheduler] Cron scheduler started");

    registerBuiltInTools();
    console.log("[Tools] Built-in tools registered");

    console.log("[LLM] Multi-model LLM router ready");
}

const PORT = parseInt(process.env.PORT || "3000");

export { app, httpServer, init, PORT };
