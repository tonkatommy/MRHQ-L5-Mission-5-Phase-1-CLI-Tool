import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { warning, error as _error } from "./logger";

// Configuration management class
// Handles loading, saving, and updating config settings
class Config {
  constructor() {
    this.configPath = join(__dirname, "../../config.json");
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
      if (existsSync(this.configPath)) {
        const data = readFileSync(this.configPath, "utf8");
        this.config = { ...this.defaultConfig, ...JSON.parse(data) };
      } else {
        this.config = { ...this.defaultConfig };
        this.saveConfig();
      }
    } catch (error) {
      warning("Could not load config file, using defaults");
      this.config = { ...this.defaultConfig };
    }
  }

  /**
   * Save configuration to file
   */
  saveConfig() {
    try {
      writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      _error("Failed to save configuration: " + error.message);
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
