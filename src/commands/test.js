import logger from "../utils/logger.js";
import database from "../utils/database.js";

/**
 * Test command handler
 * Tests database connection
 */
async function testCommand() {
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
}

export default testCommand;
