import inquirer from "inquirer";
import Logger from "../utils/logger.js";
import database from "../utils/database.js";
import config from "../utils/config.js";

/**
 * Update command handler
 * @param {string} collection - Collection name
 * @param {Object} options - Command options
 */
async function updateCommand(collection, options) {
  Logger.header(`Updating document in '${collection}' collection`);

  try {
    // Connect to database
    const connected = await database.connect();
    if (!connected) {
      return;
    }

    const Model = database.getModel(collection);

    let query, updateData;

    // Parse query and update data from options
    if (options.query && options.data) {
      try {
        query = JSON.parse(options.query);
        updateData = JSON.parse(options.data);
      } catch (error) {
        Logger.error("Invalid JSON in query or data: " + error.message);
        return;
      }
    } else {
      // Interactive mode
      const interactiveData = await promptForUpdateData();
      query = interactiveData.query;
      updateData = interactiveData.updateData;
    }

    Logger.info("Searching for documents to update...");

    // Find documents matching the query first
    const documentsToUpdate = await Model.find(query);

    if (documentsToUpdate.length === 0) {
      Logger.warning("No documents found matching the query");
      Logger.data(query);
      return;
    }

    Logger.info(`Found ${documentsToUpdate.length} document(s) matching the query:`);
    documentsToUpdate.forEach((doc, index) => {
      console.log(`${index + 1}. ID: ${doc._id}`);
      Logger.data(doc.toObject());
    });

    // Confirm update
    const { confirmUpdate } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmUpdate",
        message: `Do you want to update ${documentsToUpdate.length} document(s)?`,
        default: false,
      },
    ]);

    if (!confirmUpdate) {
      Logger.info("Update cancelled");
      return;
    }

    // Perform the update
    const result = await Model.updateMany(query, updateData);

    Logger.success(`Update completed!`);
    Logger.info(`Documents matched: ${result.matchedCount}`);
    Logger.info(`Documents modified: ${result.modifiedCount}`);

    // Show updated documents
    if (result.modifiedCount > 0) {
      Logger.info("Updated documents:");
      const updatedDocs = await Model.find(query);
      updatedDocs.forEach((doc, index) => {
        console.log(`Updated document ${index + 1}:`);
        Logger.data(doc.toObject());
      });
    }

    // Update statistics
    config.incrementOperation("update");
    config.set("lastUsedCollection", collection);
  } catch (error) {
    Logger.error("Failed to update document: " + error.message);
  } finally {
    await database.disconnect();
  }
}

/**
 * Prompt user for update query and data
 * @returns {Promise<Object>} Query and update data
 */
async function promptForUpdateData() {
  Logger.info("Define the query to find documents to update");

  const { queryMethod } = await inquirer.prompt([
    {
      type: "list",
      name: "queryMethod",
      message: "How would you like to specify the query?",
      choices: ["By ID", "By field value", "Custom JSON query"],
    },
  ]);

  let query = {};

  switch (queryMethod) {
    case "By ID":
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
      const { fieldName, fieldValue } = await inquirer.prompt([
        {
          type: "input",
          name: "fieldName",
          message: "Field name to query:",
          validate: (input) => input.trim().length > 0 || "Field name is required",
        },
        {
          type: "input",
          name: "fieldValue",
          message: "Field value to match:",
          validate: (input) => input.trim().length > 0 || "Field value is required",
        },
      ]);
      query[fieldName] = fieldValue;
      break;

    case "Custom JSON query":
      const { customQuery } = await inquirer.prompt([
        {
          type: "input",
          name: "customQuery",
          message: 'Enter JSON query (e.g., {"name": "John", "age": {"$gt": 25}}):',
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
  }

  Logger.info("Define the update data");

  const { updateMethod } = await inquirer.prompt([
    {
      type: "list",
      name: "updateMethod",
      message: "How would you like to specify the update?",
      choices: ["Update single field", "Custom JSON update"],
    },
  ]);

  let updateData = {};

  switch (updateMethod) {
    case "Update single field":
      const { updateFieldName, updateFieldValue, updateFieldType } = await inquirer.prompt([
        {
          type: "input",
          name: "updateFieldName",
          message: "Field name to update:",
          validate: (input) => input.trim().length > 0 || "Field name is required",
        },
        {
          type: "list",
          name: "updateFieldType",
          message: "Field type:",
          choices: ["String", "Number", "Boolean", "JSON Object"],
        },
        {
          type: "input",
          name: "updateFieldValue",
          message: "New value:",
          validate: (input) => input.trim().length > 0 || "Value is required",
        },
      ]);

      // Convert value based on type
      switch (updateFieldType) {
        case "Number":
          updateData[updateFieldName] = parseFloat(updateFieldValue);
          break;
        case "Boolean":
          updateData[updateFieldName] = updateFieldValue.toLowerCase() === "true";
          break;
        case "JSON Object":
          try {
            updateData[updateFieldName] = JSON.parse(updateFieldValue);
          } catch {
            Logger.warning("Invalid JSON, storing as string");
            updateData[updateFieldName] = updateFieldValue;
          }
          break;
        default:
          updateData[updateFieldName] = updateFieldValue;
      }
      break;

    case "Custom JSON update":
      const { customUpdate } = await inquirer.prompt([
        {
          type: "input",
          name: "customUpdate",
          message: 'Enter JSON update (e.g., {"$set": {"name": "NewName"}, "$inc": {"age": 1}}):',
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
      updateData = JSON.parse(customUpdate);
      break;
  }

  return { query, updateData };
}

export default updateCommand;
