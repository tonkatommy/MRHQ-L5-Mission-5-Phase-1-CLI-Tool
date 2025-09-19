import chalk from "chalk";
import logger from "../utils/logger.js";
import database from "../utils/database.js";

/**
 * Find command handler
 * @param {string} collection - Collection name
 * @param {Object} options - Command options
 */
async function findCommand(collection, options) {
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
}

export default findCommand;
