import { init, httpServer, PORT } from "./app";

async function start() {
    try {
        await init();
        httpServer.listen(PORT, () => {
            console.log(`\n🚀 VibeHQ Server running on port ${PORT}`);
            console.log(`   Health: http://localhost:${PORT}/health`);
            console.log(`   API:    http://localhost:${PORT}/api\n`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

start();
