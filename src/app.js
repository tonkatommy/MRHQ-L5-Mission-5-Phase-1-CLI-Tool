#!/usr/bin/env node

import dotenv from "dotenv";
import { Command } from "commander";
import chalk from "chalk";
import logger from "./utils/logger.js";
import database from "./utils/database.js";
import config from "./utils/config.js";

// Import command handlers
import addCommand from "./commands/add.js";
import updateCommand from "./commands/update.js";
import deleteCommand from "./commands/delete.js";

// Load environment variables from .env file
dotenv.config();

// Initialize CLI program
const program = new Command();

// CLI Header
console.log(
  chalk.bold.redBright(`
╔══════════════════════════════════════╗
║          MongoDB CLI Tool            ║
║     Professional Database Manager    ║
╚══════════════════════════════════════╝
`)
);

// Program configuration
program
  .name("mongo-cli")
  .description("Professional CLI tool for MongoDB operations")
  .version("1.0.0")
  .option("-v, --verbose", "Enable verbose logging")
  .option("--no-color", "Disable colored output");

// Add command
program
  .command("add <collection>")
  .description(
    "Add a new document to the specified collection\n" +
      "  Example: mongo-cli add users\n" +
      '  Example: mongo-cli add users -d \'{"name":"John","age":30}\'\n' +
      "  Example: mongo-cli add users --file ./data/users.json"
  )
  .option("-d, --data <json>", "JSON data for the document (non-interactive mode)")
  .option("-f, --file <path>", "Path to JSON file containing document(s) to add")
  .option("--dry-run", "Show what would be added without actually adding")
  .action(async (collection, options) => {
    try {
      if (options.dryRun) {
        logger.info("DRY RUN MODE - No changes will be made");
      }
      await addCommand(collection, options);
    } catch (error) {
      logger.error("Add command failed: " + error.message);
      process.exit(1);
    }
  });

// Update command
program
  .command("update <collection>")
  .description(
    "Update documents in the specified collection\n" +
      "  Example: mongo-cli update users\n" +
      '  Example: mongo-cli update users -q \'{"name":"John"}\' -d \'{"age":31}\''
  )
  .option("-q, --query <json>", "JSON query to find documents to update")
  .option("-d, --data <json>", "JSON data for the update")
  .option("--dry-run", "Show what would be updated without actually updating")
  .action(async (collection, options) => {
    try {
      if (options.dryRun) {
        logger.info("DRY RUN MODE - No changes will be made");
      }
      await updateCommand(collection, options);
    } catch (error) {
      logger.error("Update command failed: " + error.message);
      process.exit(1);
    }
  });

// Delete command
program
  .command("delete <collection>")
  .alias("del")
  .description(
    "Delete documents from the specified collection\n" +
      "  Example: mongo-cli delete users\n" +
      '  Example: mongo-cli delete users -q \'{"status":"inactive"}\''
  )
  .option("-q, --query <json>", "JSON query to find documents to delete")
  .option("--force", "Skip confirmation prompts (DANGEROUS!)")
  .option("--dry-run", "Show what would be deleted without actually deleting")
  .action(async (collection, options) => {
    try {
      if (options.dryRun) {
        logger.info("DRY RUN MODE - No changes will be made");
      }
      if (options.force) {
        logger.warning("FORCE MODE - Skipping confirmations!");
      }
      await deleteCommand(collection, options);
    } catch (error) {
      logger.error("Delete command failed: " + error.message);
      process.exit(1);
    }
  });

// List collections command
program
  .command("collections")
  .alias("ls")
  .description("List all collections in the database")
  .action(async () => {
    try {
      logger.header("Database Collections");

      const connected = await database.connect();
      if (!connected) {
        return;
      }

      const collections = await database.mongoose.connection.db.listCollections().toArray();

      if (collections.length === 0) {
        logger.info("No collections found in the database");
      } else {
        logger.success(`Found ${collections.length} collection(s):`);
        collections.forEach((collection, index) => {
          console.log(chalk.cyan(`${index + 1}. ${collection.name}`));
        });
      }

      await database.disconnect();
    } catch (error) {
      logger.error("Failed to list collections: " + error.message);
    }
  });

// Count documents command
program
  .command("count <collection>")
  .description(
    "Count documents in the specified collection\n" +
      "  Example: mongo-cli count users\n" +
      '  Example: mongo-cli count users -q \'{"status":"active"}\''
  )
  .option("-q, --query <json>", "JSON query to count specific documents")
  .action(async (collection, options) => {
    try {
      logger.header(`Counting documents in '${collection}' collection`);

      const connected = await database.connect();
      if (!connected) {
        return;
      }

      const Model = database.getModel(collection);
      let query = {};

      if (options.query) {
        try {
          query = JSON.parse(options.query);
        } catch (error) {
          logger.error("Invalid JSON query: " + error.message);
          return;
        }
      }

      const count = await Model.countDocuments(query);

      logger.success(`Document count: ${count}`);
      if (Object.keys(query).length > 0) {
        logger.info("Query used:");
        logger.data(query);
      }

      await database.disconnect();
    } catch (error) {
      logger.error("Failed to count documents: " + error.message);
    }
  });

// Find/Search command
program
  .command("find <collection>")
  .description(
    "Find and display documents from the specified collection\n" +
      "  Example: mongo-cli find users\n" +
      '  Example: mongo-cli find users -q \'{"age":{"$gte":18}}\' -l 5'
  )
  .option("-q, --query <json>", "JSON query to find specific documents")
  .option("-l, --limit <number>", "Limit number of results (default: 10)", "10")
  .option("--skip <number>", "Skip number of documents (default: 0)", "0")
  .option("-s, --sort <json>", "Sort results (e.g., '{\"createdAt\": -1}')")
  .action(async (collection, options) => {
    try {
      logger.header(`Finding documents in '${collection}' collection`);

      const connected = await database.connect();
      if (!connected) {
        return;
      }

      const Model = database.getModel(collection);
      let query = {};
      let sort = {};

      if (options.query) {
        try {
          query = JSON.parse(options.query);
        } catch (error) {
          logger.error("Invalid JSON query: " + error.message);
          return;
        }
      }

      if (options.sort) {
        try {
          sort = JSON.parse(options.sort);
        } catch (error) {
          logger.error("Invalid JSON sort: " + error.message);
          return;
        }
      }

      const documents = await Model.find(query)
        .sort(sort)
        .limit(parseInt(options.limit))
        .skip(parseInt(options.skip));

      if (documents.length === 0) {
        logger.warning("No documents found matching the criteria");
        if (Object.keys(query).length > 0) {
          logger.info("Query used:");
          logger.data(query);
        }
      } else {
        logger.success(`Found ${documents.length} document(s):`);
        documents.forEach((doc, index) => {
          console.log(chalk.cyan(`\nDocument ${index + 1}:`));
          logger.data(doc.toObject());
        });
      }

      await database.disconnect();
    } catch (error) {
      logger.error("Failed to find documents: " + error.message);
    }
  });

// Statistics command
program
  .command("stats")
  .description("Show CLI usage statistics and database info")
  .action(async () => {
    try {
      logger.header("CLI Statistics & Database Info");

      // Show CLI statistics
      const stats = config.getStats();
      console.log(chalk.bold("📊 CLI Usage Statistics:"));
      console.log(`  Add operations: ${chalk.green(stats.operations.add)}`);
      console.log(`  Update operations: ${chalk.yellow(stats.operations.update)}`);
      console.log(`  Delete operations: ${chalk.red(stats.operations.delete)}`);
      console.log(`  Last used collection: ${chalk.cyan(stats.lastUsedCollection)}`);
      console.log(
        `  Last connection: ${
          stats.lastConnection ? new Date(stats.lastConnection).toLocaleString() : "Never"
        }`
      );

      logger.separator();

      // Test database connection
      const connectionTest = await database.testConnection();
      if (connectionTest.success) {
        logger.success("Database connection: OK");
        console.log(`  Database URI: ${chalk.gray(process.env.MONGODB_URI)}`);
      } else {
        logger.error("Database connection: FAILED");
        logger.error(connectionTest.message);
      }

      await database.disconnect();
    } catch (error) {
      logger.error("Failed to get statistics: " + error.message);
    }
  });

// Test connection command
program
  .command("test")
  .description("Test database connection")
  .action(async () => {
    try {
      logger.header("Testing Database Connection");

      const result = await database.testConnection();

      if (result.success) {
        logger.success(result.message);
        logger.info("Connection details:");
        logger.data(result.details);
      } else {
        logger.error(result.message);
        logger.error("Error: " + result.error);
      }

      await database.disconnect();
    } catch (error) {
      logger.error("Connection test failed: " + error.message);
    }
  });

// Configure global error handling
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error.message);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("\nShutting down gracefully...");
  await database.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("\nShutting down gracefully...");
  await database.disconnect();
  process.exit(0);
});

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
