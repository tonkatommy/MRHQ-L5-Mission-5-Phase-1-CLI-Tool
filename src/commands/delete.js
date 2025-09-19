import inquirer from "inquirer";
import Logger from "../utils/logger.js";
import database from "../utils/database.js";
import config from "../utils/config.js";

/**
 * Delete command handler
 * @param {string} collection - Collection name
 * @param {Object} options - Command options
 */
async function deleteCommand(collection, options) {
  Logger.header(`Deleting document(s) from '${collection}' collection`);

  try {
    // Connect to database
    const connected = await database.connect();
    if (!connected) {
      return;
    }

    const Model = database.getModel(collection);

    let query;

    // Parse query from options or prompt for interactive input
    if (options.query) {
      try {
        query = JSON.parse(options.query);
      } catch (error) {
        Logger.error("Invalid JSON query: " + error.message);
        return;
      }
    } else {
      // Interactive mode
      query = await promptForDeleteQuery();
    }

    Logger.info("Searching for documents to delete...");

    // Find documents matching the query first
    const documentsToDelete = await Model.find(query);

    if (documentsToDelete.length === 0) {
      Logger.warning("No documents found matching the query");
      Logger.data(query);
      return;
    }

    Logger.warning(`Found ${documentsToDelete.length} document(s) matching the query:`);
    documentsToDelete.forEach((doc, index) => {
      console.log(`${index + 1}. ID: ${doc._id}`);
      Logger.data(doc.toObject());
    });

    // Double confirmation for safety
    const { confirmDelete } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmDelete",
        message: `⚠️  Are you absolutely sure you want to DELETE ${documentsToDelete.length} document(s)? This action cannot be undone!`,
        default: false,
      },
    ]);

    if (!confirmDelete) {
      Logger.info("Delete operation cancelled");
      return;
    }

    // Additional confirmation for multiple documents
    if (documentsToDelete.length > 1) {
      const { finalConfirm } = await inquirer.prompt([
        {
          type: "input",
          name: "finalConfirm",
          message: `Type "DELETE" to confirm deletion of ${documentsToDelete.length} documents:`,
          validate: (input) => input === "DELETE" || 'You must type "DELETE" to confirm',
        },
      ]);

      if (finalConfirm !== "DELETE") {
        Logger.info("Delete operation cancelled");
        return;
      }
    }

    // Perform the deletion
    const result = await Model.deleteMany(query);

    Logger.success(`Delete operation completed!`);
    Logger.info(`Documents deleted: ${result.deletedCount}`);

    // Update statistics
    config.incrementOperation("delete");
    config.set("lastUsedCollection", collection);

    Logger.separator();
    Logger.info("Delete operation summary:");
    Logger.info(`Collection: ${collection}`);
    Logger.info(`Query used: ${JSON.stringify(query)}`);
    Logger.info(`Documents deleted: ${result.deletedCount}`);
  } catch (error) {
    Logger.error("Failed to delete document(s): " + error.message);
  } finally {
    await database.disconnect();
  }
}

/**
 * Prompt user for delete query
 * @returns {Promise<Object>} Query object
 */
async function promptForDeleteQuery() {
  Logger.warning("⚠️  You are about to delete documents. Please be careful!");

  const { queryMethod } = await inquirer.prompt([
    {
      type: "list",
      name: "queryMethod",
      message: "How would you like to specify which documents to delete?",
      choices: [
        "By ID (delete single document)",
        "By field value",
        "Custom JSON query",
        "Delete ALL documents (DANGEROUS!)",
      ],
    },
  ]);

  let query = {};

  switch (queryMethod) {
    case "By ID (delete single document)":
      const { documentId } = await inquirer.prompt([
        {
          type: "input",
          name: "documentId",
          message: "Enter document ID:",
          validate: (input) => input.trim().length > 0 || "Document ID is required",
        },
      ]);
      query = { _id: documentId };
      break;

    case "By field value":
      const { fieldName, fieldValue, matchType } = await inquirer.prompt([
        {
          type: "input",
          name: "fieldName",
          message: "Field name to query:",
          validate: (input) => input.trim().length > 0 || "Field name is required",
        },
        {
          type: "list",
          name: "matchType",
          message: "Match type:",
          choices: ["Exact match", "Contains (case insensitive)", "Starts with", "Ends with"],
        },
        {
          type: "input",
          name: "fieldValue",
          message: "Field value to match:",
          validate: (input) => input.trim().length > 0 || "Field value is required",
        },
      ]);

      switch (matchType) {
        case "Exact match":
          query[fieldName] = fieldValue;
          break;
        case "Contains (case insensitive)":
          query[fieldName] = { $regex: fieldValue, $options: "i" };
          break;
        case "Starts with":
          query[fieldName] = { $regex: "^" + fieldValue, $options: "i" };
          break;
        case "Ends with":
          query[fieldName] = { $regex: fieldValue + "$", $options: "i" };
          break;
      }
      break;

    case "Custom JSON query":
      const { customQuery } = await inquirer.prompt([
        {
          type: "input",
          name: "customQuery",
          message: 'Enter JSON query (e.g., {"status": "inactive", "age": {"$lt": 18}}):',
          validate: (input) => {
            try {
              JSON.parse(input);
              return true;
            } catch {
              return "Please enter valid JSON";
            }
          },
        },
      ]);
      query = JSON.parse(customQuery);
      break;

    case "Delete ALL documents (DANGEROUS!)":
      const { confirmDeleteAll } = await inquirer.prompt([
        {
          type: "input",
          name: "confirmDeleteAll",
          message:
            '⚠️  Type "DELETE ALL" to confirm you want to delete ALL documents in this collection:',
          validate: (input) => input === "DELETE ALL" || 'You must type "DELETE ALL" to confirm',
        },
      ]);

      if (confirmDeleteAll !== "DELETE ALL") {
        Logger.info("Delete all operation cancelled");
        process.exit(0);
      }
      query = {}; // Empty query matches all documents
      break;
  }

  return query;
}

export default deleteCommand;
