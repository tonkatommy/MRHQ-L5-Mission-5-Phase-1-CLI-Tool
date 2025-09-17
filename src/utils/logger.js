// import { green, red, yellow, blue, cyan, gray, bold } from "chalk";
import chalk from "chalk";

// Logger utility for styled console output
// Provides methods for different log levels and formats
// Uses chalk for coloring and styling
class Logger {
  /**
   * Log success message in green
   * @param {string} message - Message to log
   */
  static success(message) {
    console.log(chalk.green("✓ " + message));
  }

  /**
   * Log error message in red
   * @param {string} message - Error message to log
   */
  static error(message) {
    console.log(chalk.red("✗ " + message));
  }

  /**
   * Log warning message in yellow
   * @param {string} message - Warning message to log
   */
  static warning(message) {
    console.log(chalk.yellow("⚠ " + message));
  }

  /**
   * Log info message in blue
   * @param {string} message - Info message to log
   */
  static info(message) {
    console.log(chalk.blue("ℹ " + message));
  }

  /**
   * Log data in a formatted table-like structure
   * @param {Object} data - Data object to display
   */
  static data(data) {
    console.log(chalk.cyan("📄 Data:"));
    console.log(chalk.gray(JSON.stringify(data, null, 2)));
  }

  /**
   * Log a separator line
   */
  static separator() {
    console.log(chalk.gray("─".repeat(50)));
  }

  /**
   * Log header with styling
   * @param {string} title - Header title
   */
  static header(title) {
    console.log("\n" + chalk.bold.magenta(`🔧 ${title}`));
    this.separator();
  }
}

export default Logger;
