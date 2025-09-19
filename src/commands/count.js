import logger from "../utils/logger.js";
import database from "../utils/database.js";

/**
 * Count command handler
 * @param {string} collection - Collection name
 * @param {Object} options - Command options
 */
async function countCommand(collection, options) {
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
}

export default countCommand;
