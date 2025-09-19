import mongoose from "mongoose";
import Logger from "./logger.js";
import config from "./config.js";
class Database {
  constructor() {
    this.isConnected = false;
    this.mongoose = mongoose; // Export mongoose for use in commands

    // Set default MongoDB URI if not provided
    if (!process.env.MONGODB_URI) {
      process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/mission-5";
      Logger.warning(
        "No MONGODB_URI found in .env, using default: mongodb://127.0.0.1:27017/mission-5"
      );
    }
  }

  /**
   * Connect to MongoDB database
   * @returns {Promise<boolean>} Connection success status
   */
  async connect() {
    try {
      if (this.isConnected) {
        return true;
      }

      Logger.info("Connecting to MongoDB...");

      await mongoose.connect(process.env.MONGODB_URI);

      this.isConnected = true;
      Logger.success("Connected to MongoDB successfully");

      // Update last connection time
      config.set("lastConnection", new Date().toISOString());

      return true;
    } catch (error) {
      Logger.error("Failed to connect to MongoDB: " + error.message);
      return false;
    }
  }

  /**
   * Disconnect from MongoDB database
   */
  async disconnect() {
    try {
      if (this.isConnected) {
        await mongoose.disconnect();
        this.isConnected = false;
        Logger.info("Disconnected from MongoDB");
      }
    } catch (error) {
      Logger.error("Error disconnecting from MongoDB: " + error.message);
    }
  }

  /**
   * Get database connection status
   * @returns {boolean} Connection status
   */
  getConnectionStatus() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  /**
   * Create a dynamic model for any collection
   * @param {string} collectionName - Name of the collection
   * @returns {mongoose.Model} Mongoose model
   */
  getModel(collectionName) {
    // Create a flexible schema that accepts any fields
    const dynamicSchema = new mongoose.Schema(
      {},
      {
        strict: false, // Allow any fields
        timestamps: true, // Add createdAt and updatedAt automatically
      }
    );

    // Check if model already exists to avoid re-compilation error
    if (mongoose.models[collectionName]) {
      return mongoose.models[collectionName];
    }

    return mongoose.model(collectionName, dynamicSchema, collectionName);
  }

  /**
   * Test database connection
   * @returns {Promise<Object>} Connection test result
   */
  async testConnection() {
    try {
      await this.connect();
      const adminDb = mongoose.connection.db.admin();
      const result = await adminDb.ping();

      return {
        success: true,
        message: "Database connection test successful",
        details: result,
      };
    } catch (error) {
      return {
        success: false,
        message: "Database connection test failed",
        error: error.message,
      };
    }
  }
}

export default new Database();
