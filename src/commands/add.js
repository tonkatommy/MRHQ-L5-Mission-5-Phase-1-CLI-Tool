import inquirer from "inquirer";
import Logger from "../utils/logger.js";
import database from "../utils/database.js";
import config from "../utils/config.js";
import fs from "fs";

/**
 * Add command handler
 * @param {string} collection - Collection name
 * @param {Object} options - Command options
 */
async function addCommand(collection, options) {
  Logger.header(`Adding document to '${collection}' collection`);

  try {
    // Connect to database
    const connected = await database.connect();
    if (!connected) {
      return;
    }

    let documentData;

    // Support for seeding from a JSON file
    if (options.file) {
      try {
        const fileContent = fs.readFileSync(options.file, "utf-8");
        documentData = JSON.parse(fileContent);
        Logger.info(`Loaded data from file: ${options.file}`);
      } catch (error) {
        Logger.error("Failed to read or parse JSON file: " + error.message);
        return;
      }
    } else if (options.data) {
      try {
        documentData = JSON.parse(options.data);
        Logger.info("Using provided JSON data");
      } catch (error) {
        Logger.error("Invalid JSON data provided: " + error.message);
        return;
      }
    } else {
      // Interactive mode - prompt user for data
      Logger.info("Interactive mode: Enter document fields");
      documentData = await promptForDocumentData();
    }

    // Get the model for the collection
    const Model = database.getModel(collection);

    // Support for multiple documents
    if (Array.isArray(documentData)) {
      // Insert many documents
      const savedDocuments = await Model.insertMany(documentData);
      Logger.success(`Added ${savedDocuments.length} documents successfully!`);
      savedDocuments.forEach((doc, idx) => {
        Logger.data(doc.toObject());
        Logger.info(`Document ${idx + 1} ID: ${doc._id}`);
      });
    } else {
      // Single document
      const document = new Model(documentData);
      const savedDocument = await document.save();
      Logger.success(`Document added successfully!`);
      Logger.data(savedDocument.toObject());
      Logger.info(`Document ID: ${savedDocument._id}`);
    }

    // Update statistics
    config.incrementOperation("add");
    config.set("lastUsedCollection", collection);

    Logger.separator();
  } catch (error) {
    Logger.error("Failed to add document: " + error.message);
  } finally {
    await database.disconnect();
  }
}

/**
 * Prompt user to input document fields interactively
 * @returns {Promise<Object>} Document data object
 */
async function promptForDocumentData() {
  const fields = {};
  let addingFields = true;

  Logger.info("Enter field name and value pairs. Press Enter with empty field name to finish.");

  while (addingFields) {
    const { fieldName } = await inquirer.prompt([
      {
        type: "input",
        name: "fieldName",
        message: "Field name (or press Enter to finish):",
      },
    ]);

    if (!fieldName.trim()) {
      addingFields = false;
      break;
    }

    const { fieldValue, fieldType } = await inquirer.prompt([
      {
        type: "list",
        name: "fieldType",
        message: `Type for field '${fieldName}':`,
        choices: ["String", "Number", "Boolean", "JSON Object"],
      },
      {
        type: "input",
        name: "fieldValue",
        message: `Value for '${fieldName}':`,
      },
    ]);

    // Convert value based on selected type
    switch (fieldType) {
      case "Number":
        fields[fieldName] = parseFloat(fieldValue);
        break;
      case "Boolean":
        fields[fieldName] = fieldValue.toLowerCase() === "true";
        break;
      case "JSON Object":
        try {
          fields[fieldName] = JSON.parse(fieldValue);
        } catch {
          Logger.warning(`Invalid JSON for ${fieldName}, storing as string`);
          fields[fieldName] = fieldValue;
        }
        break;
      default:
        fields[fieldName] = fieldValue;
    }
  }

  return fields;
}

export default addCommand;
