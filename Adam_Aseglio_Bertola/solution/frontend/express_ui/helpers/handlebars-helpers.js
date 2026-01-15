/**
 * Handlebars Custom Helpers
 *
 * This module contains custom Handlebars helpers used throughout the application.
 */

const hbs = require('hbs');

/**
 * Register all Handlebars helpers
 */
function registerHelpers() {
  /**
   * JSON stringify helper for displaying raw JSON in templates
   * @param {*} obj - Object to stringify
   * @returns {string} JSON string
   */
  hbs.registerHelper('json', function(obj) {
    return JSON.stringify(obj, null, 2);
  });

  /**
   * Addition helper
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Sum of a and b
   */
  hbs.registerHelper('add', function(a, b) {
    return a + b;
  });

  /**
   * Subtraction helper
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Difference of a and b
   */
  hbs.registerHelper('subtract', function(a, b) {
    return a - b;
  });
}

module.exports = { registerHelpers };
