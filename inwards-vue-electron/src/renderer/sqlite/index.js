/**
 * SQLite Database Module (Legacy Compatibility Layer)
 *
 * This module provides backward compatibility for existing code that uses
 * the old sqlite3 API. It wraps the new sql.js based database service.
 *
 * For new code, import directly from '@/services/database' instead.
 */

import {
  initDatabase,
  isDbExist,
  isDatabaseReady,
  getDatabasePath,
  rawQuery,
  rawQueryCallback,
  insert,
  dbUrl
} from '../services/database';

// Export legacy API
export { dbUrl };
export { getDatabasePath }; // Async version for when path is needed
export let dbFilePath = null;
export let dbReady = false;

// Initialize path asynchronously
(async () => {
  try {
    dbFilePath = await getDatabasePath();
  } catch (e) {
    console.warn('Could not get database path:', e);
  }
})();

/**
 * Legacy connection function
 * With sql.js, there's no persistent connection - operations are synchronous
 * This is kept for API compatibility
 */
export function conn() {
  console.warn('conn() is deprecated with sql.js. Database operations are now direct.');
  return null;
}

/**
 * Check if database exists
 * @returns {Promise<boolean>}
 */
export { isDbExist };

/**
 * Execute a raw SQL query
 * @param {string} query - SQL query
 * @param {Function} callback - Callback function (rows, error)
 */
export const rawQueryLegacy = (query, callback) => {
  rawQueryCallback(query, callback);
};

// Re-export rawQuery for both callback and promise-based usage
export { rawQuery, rawQueryCallback };

/**
 * Insert a row
 * @param {string} table - Table name
 * @param {Object} valuesDict - Column values
 */
export { insert };

/**
 * Initialize the database
 * Call this before using any database functions
 */
export { initDatabase };

/**
 * Check if database is ready
 */
export { isDatabaseReady };

// Default export for backward compatibility
export default {
  conn,
  isDbExist,
  rawQuery: rawQueryCallback, // Use callback version for legacy code
  insert,
  initDatabase,
  isDatabaseReady,
  dbUrl,
  get dbFilePath() { return dbFilePath; },
  get dbReady() { return isDatabaseReady(); }
};
