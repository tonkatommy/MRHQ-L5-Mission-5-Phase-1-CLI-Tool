import chalk from "chalk";
import logger from "../utils/logger.js";
import database from "../utils/database.js";
import config from "../utils/config.js";

/**
 * Stats command handler
 * Shows CLI usage statistics and database info
 */
async function statsCommand() {
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
}

export default statsCommand;
