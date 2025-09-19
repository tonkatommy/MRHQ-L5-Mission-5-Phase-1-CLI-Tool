import chalk from "chalk";
import logger from "../utils/logger.js";
import database from "../utils/database.js";

/**
 * Collections command handler
 * Lists all collections in the database
 */
async function collectionsCommand() {
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
}

export default collectionsCommand;
