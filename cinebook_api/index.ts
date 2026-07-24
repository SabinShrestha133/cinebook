import app, { PORT, HOST } from "./src/app";
import { connectToMongoDB } from "./src/database/mongodb";

async function startServer() {
    try {
        console.log("[BOOT] Connecting to MongoDB...");
        await connectToMongoDB();
        console.log("[BOOT] MongoDB connected successfully");

        app.listen(PORT, HOST, () => {
            console.log(`🎬 CineBook API Server running at http://${HOST}:${PORT}`);
        });
    } catch (error) {
        console.error("[BOOT] Failed to start server:", error);
        process.exit(1);
    }
}

startServer();

process.on("unhandledRejection", (reason) => {
    console.error("[FATAL] Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
    console.error("[FATAL] Uncaught Exception:", error);
});