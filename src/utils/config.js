import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Logger from "./logger.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Config {
  constructor() {
    // Try multiple locations for config.json
    const possibleConfigPaths = [
      // 1. In project root
      path.join(__dirname, "../../config.json"),
      // 2. In user's home directory
      path.join(process.env.HOME || process.env.USERPROFILE, ".mongo-cli-config.json"),
      // 3. In same directory as executable
      path.join(__dirname, "../config.json"),
    ];

    // Find existing config or use first path as default
    this.configPath = possibleConfigPaths.find((p) => fs.existsSync(p)) || possibleConfigPaths[1];

    this.defaultConfig = {
      lastUsedCollection: "users",
      operations: {
        add: 0,
        update: 0,
        delete: 0,
      },
      lastConnection: null,
    };
    this.loadConfig();
  }

  /**
   * Load configuration from file or create default
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, "utf8");
        this.config = { ...this.defaultConfig, ...JSON.parse(data) };
      } else {
        this.config = { ...this.defaultConfig };
        this.saveConfig();
      }
    } catch (error) {
      Logger.warning("Could not load config file, using defaults");
      this.config = { ...this.defaultConfig };
    }
  }

  /**
   * Save configuration to file
   */
  saveConfig() {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      Logger.error("Failed to save configuration: " + error.message);
    }
  }

  /**
   * Get configuration value
   * @param {string} key - Configuration key
   * @returns {any} Configuration value
   */
  get(key) {
    return this.config[key];
  }

  /**
   * Set configuration value
   * @param {string} key - Configuration key
   * @param {any} value - Configuration value
   */
  set(key, value) {
    this.config[key] = value;
    this.saveConfig();
  }

  /**
   * Increment operation counter
   * @param {string} operation - Operation type (add, update, delete)
   */
  incrementOperation(operation) {
    if (this.config.operations[operation] !== undefined) {
      this.config.operations[operation]++;
      this.saveConfig();
    }
  }

  /**
   * Get operation statistics
   * @returns {Object} Operation statistics
   */
  getStats() {
    return {
      operations: this.config.operations,
      lastConnection: this.config.lastConnection,
      lastUsedCollection: this.config.lastUsedCollection,
    };
  }
}

export default new Config();
