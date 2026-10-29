import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

async function bootstrap() {
  try {
    await connectDB();
    const server = app.listen(ENV.PORT, () => {
      console.log(`=================================================`);
      console.log(`🕵️  AI Mystery Room API running on port ${ENV.PORT}`);
      console.log(`   Health check: http://localhost:${ENV.PORT}/api/v1/health`);
      console.log(`   AI Provider:  ${ENV.USE_MOCK_AI ? "Deterministic Mock Provider" : "Google Gemini (" + ENV.GEMINI_MODEL + ")"}`);
      console.log(`=================================================`);
    });

    const shutdown = async () => {
      console.log("\n[Server] Graceful shutdown initiated...");
      server.close(() => {
        console.log("[Server] HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (err) {
    console.error("[Server] Fatal error during startup:", err);
    process.exit(1);
  }
}

bootstrap();
