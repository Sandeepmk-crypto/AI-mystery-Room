import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ENV } from "./env.js";

let mongodInstance: MongoMemoryServer | null = null;

export async function connectDB(): Promise<void> {
  // If already connected, skip
  if (mongoose.connection.readyState >= 1) return;

  try {
    // Attempt connecting to the configured URI with a short timeout
    await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] Connected to external MongoDB at ${ENV.MONGODB_URI}`);
  } catch (err) {
    console.warn(`[Database] Could not connect to MongoDB at ${ENV.MONGODB_URI}.`);
    console.log("[Database] Initializing isolated In-Memory MongoDB Server...");

    try {
      mongodInstance = await MongoMemoryServer.create();
      const inMemoryUri = mongodInstance.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] Connected successfully to In-Memory MongoDB at ${inMemoryUri}`);
    } catch (memErr) {
      console.error("[Database] Failed to start In-Memory MongoDB:", memErr);
      throw memErr;
    }
  }
}

export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongodInstance) {
    await mongodInstance.stop();
    mongodInstance = null;
  }
}
