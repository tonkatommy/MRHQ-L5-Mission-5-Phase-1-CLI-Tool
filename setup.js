#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup global configuration
function setupGlobalConfig() {
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  const globalDir = path.join(homeDir, "MongoDB-CLI-Tool");
  const globalEnvPath = path.join(globalDir, ".mongo-cli.env");
  const globalConfigPath = path.join(globalDir, ".mongo-cli-config.json");

  // Create global directory if it doesn't exist
  if (!fs.existsSync(globalDir)) {
    fs.mkdirSync(globalDir, { recursive: true });
    console.log(`✅ Created global directory at: ${globalDir}`);
  }

  // Create global .env file if it doesn't exist
  if (!fs.existsSync(globalEnvPath)) {
    const defaultEnv = `# MongoDB CLI Global Configuration
# Copy and modify these values for your setup
MONGODB_URI=mongodb://127.0.0.1:27017/your_database_name
DB_NAME=your_database_name
DEFAULT_COLLECTION=users
LOG_LEVEL=info`;

    fs.writeFileSync(globalEnvPath, defaultEnv);
    console.log(`✅ Created global .env file at: ${globalEnvPath}`);
    console.log("📝 Please edit this file with your MongoDB connection details");
  } else {
    console.log(`✅ Global .env file already exists at: ${globalEnvPath}`);
  }

  // Create global config file if it doesn't exist
  if (!fs.existsSync(globalConfigPath)) {
    const defaultConfig = {
      lastUsedCollection: "users",
      operations: { add: 0, update: 0, delete: 0 },
      lastConnection: null,
    };

    fs.writeFileSync(globalConfigPath, JSON.stringify(defaultConfig, null, 2));
    console.log(`✅ Created global config file at: ${globalConfigPath}`);
  } else {
    console.log(`✅ Global config file already exists at: ${globalConfigPath}`);
  }

  console.log(`
🎉 Setup complete! Your MongoDB CLI tool is ready to use.

📋 Next steps:
1. Edit your global .env file: ${globalEnvPath}
2. Update MONGODB_URI with your database connection string
3. Test the connection: mongo-cli test
4. Start using the tool: mongo-cli --help

🌍 The tool will now work from any directory!
  `);
}

setupGlobalConfig();
