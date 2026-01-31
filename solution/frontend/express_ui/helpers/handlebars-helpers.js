/**
 * Handlebars Custom Helpers
 *
 * This module contains all custom Handlebars helpers used throughout the application.
 */

const hbs = require('hbs');

/**
 * Register all Handlebars helpers
 */
function registerHelpers() {
  /**
   * Equality comparison helper for Handlebars templates
   * @param {*} a - First value to compare
   * @param {*} b - Second value to compare
   * @returns {boolean} True if values are equal
   * @example {{#if (eq searchType 'genre')}}...{{/if}}
   */
  hbs.registerHelper('eq', function(a, b) { return a === b; });

  /**
   * Greater than comparison helper
   * @param {number} a - First value
   * @param {number} b - Second value
   * @returns {boolean} True if a > b
   */
  hbs.registerHelper('gt', function(a, b) { return a > b; });

  /**
   * Less than comparison helper
   * @param {number} a - First value
   * @param {number} b - Second value
   * @returns {boolean} True if a < b
   */
  hbs.registerHelper('lt', function(a, b) { return a < b; });

  /**
   * Addition helper
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Sum of a and b
   */
  hbs.registerHelper('plus', function(a, b) { return a + b; });

  /**
   * Subtraction helper
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Difference of a and b
   */
  hbs.registerHelper('minus', function(a, b) { return a - b; });

  /**
   * Multiplication helper
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Product of a and b
   */
  hbs.registerHelper('multiply', function(a, b) { return a * b; });

  /**
   * Generate page numbers for pagination
   * @param {number} currentPage - Current page number
   * @param {number} totalPages - Total number of pages
   * @returns {Array} Array of page numbers with ellipsis
   */
  hbs.registerHelper('generatePageNumbers', function(currentPage, totalPages) {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++)
        pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end   = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  });

  /**
   * Format array-like strings by removing brackets and quotes
   * Converts strings like "['Action', 'Comedy', 'Drama']" to "Action, Comedy, Drama"
   * @param {string} str - Array-like string with brackets and quotes
   * @returns {string} Clean comma-separated list
   * @example {{formatList anime.genres}} => "Action, Comedy, Drama"
   */
  hbs.registerHelper('formatList', function(str) {
    if (!str) return '';

    return str
      .replace(/[\[\]'\"]/g, '')
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .join(', ');
  });

  /**
   * Check if array includes a value
   * @param {Array} array - Array to search in
   * @param {*} value - Value to search for
   * @returns {boolean} True if array includes value
   * @example {{#if (includes selectedGenres this)}}selected{{/if}}
   */
  hbs.registerHelper('includes', function(array, value) {
    if (!Array.isArray(array)) return false;
    return array.includes(value);
  });

  /**
   * Concatenate multiple strings
   * @param {...string} args - Strings to concatenate
   * @returns {string} Concatenated string
   * @example {{concat "/favorites/" username}} => "/favorites/john"
   */
  hbs.registerHelper('concat', function(...args) {
    // Remove the last argument which is the options object from Handlebars
    args.pop();
    return args.join('');
  });
}

module.exports = { registerHelpers };
