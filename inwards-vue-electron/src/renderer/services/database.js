/**
 * Database Service using sql.js
 *
 * This replaces the native sqlite3 module with sql.js (WebAssembly-based SQLite)
 * Benefits:
 * - No native module compilation required
 * - Works identically on all platforms
 * - Compatible with all Electron versions
 * - Can load existing SQLite database files
 */

import initSqlJs from 'sql.js';

// Database state
let db = null;
let dbPath = null;
let isReady = false;
let sqlPromise = null;

// Database URL for downloading
export const dbUrl = 'http://inwards.award.org.za/db/db_download.php';

/**
 * Initialize the SQL.js library
 * This loads the WebAssembly module
 */
async function initSql() {
  if (sqlPromise) return sqlPromise;

  sqlPromise = initSqlJs({
    // Load the wasm file from CDN or local path
    locateFile: file => `https://sql.js.org/dist/${file}`
  });

  return sqlPromise;
}

/**
 * Initialize the database
 * Loads existing database file or creates a new one
 */
export async function initDatabase() {
  try {
    const SQL = await initSql();

    // Get database path from main process
    dbPath = await window.electronAPI.getDatabasePath();

    // Check if database file exists
    const exists = await window.electronAPI.fileExists(dbPath);

    if (exists) {
      // Load existing database
      const fileBuffer = await window.electronAPI.readFile(dbPath);
      db = new SQL.Database(new Uint8Array(fileBuffer));
      console.log('Database loaded from:', dbPath);
    } else {
      // Create new empty database
      db = new SQL.Database();
      console.log('New database created');
    }

    isReady = true;
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    isReady = false;
    throw error;
  }
}

/**
 * Check if database file exists
 */
export async function isDbExist() {
  if (!dbPath) {
    dbPath = await window.electronAPI.getDatabasePath();
  }
  return window.electronAPI.fileExists(dbPath);
}

/**
 * Get database ready state
 */
export function isDatabaseReady() {
  return isReady;
}

/**
 * Get the database path
 */
export async function getDatabasePath() {
  if (!dbPath) {
    dbPath = await window.electronAPI.getDatabasePath();
  }
  return dbPath;
}

/**
 * Save database to disk
 * Must be called after any write operations to persist changes
 */
export async function saveDatabase() {
  if (!db) {
    throw new Error('Database not initialized');
  }

  try {
    const data = db.export();
    const buffer = new Uint8Array(data);
    await window.electronAPI.writeFile(dbPath, buffer);
    console.log('Database saved to:', dbPath);
    return true;
  } catch (error) {
    console.error('Failed to save database:', error);
    throw error;
  }
}

/**
 * Execute a raw SQL query (SELECT)
 * Returns an array of objects representing rows
 *
 * @param {string} query - SQL query string
 * @param {Array} params - Optional array of parameters for prepared statement
 * @returns {Promise<Array>} Array of row objects
 */
export function rawQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const stmt = db.prepare(query);

      if (params.length > 0) {
        stmt.bind(params);
      }

      const results = [];
      const columns = stmt.getColumnNames();

      while (stmt.step()) {
        const row = stmt.get();
        const obj = {};
        columns.forEach((col, i) => {
          obj[col] = row[i];
        });
        results.push(obj);
      }

      stmt.free();
      resolve(results);
    } catch (error) {
      console.error('Query error:', error);
      reject(error);
    }
  });
}

/**
 * Execute a raw SQL query with callback (legacy compatibility)
 *
 * @param {string} query - SQL query string
 * @param {Function} callback - Callback function (rows, error)
 */
export function rawQueryCallback(query, callback) {
  rawQuery(query)
    .then(rows => callback(rows, null))
    .catch(error => callback(null, error));
}

/**
 * Execute a SQL statement (INSERT, UPDATE, DELETE)
 *
 * @param {string} sql - SQL statement
 * @param {Array} params - Optional parameters
 * @returns {Object} Result with changes count
 */
export function execute(sql, params = []) {
  if (!db) {
    throw new Error('Database not initialized');
  }

  try {
    if (params.length > 0) {
      db.run(sql, params);
    } else {
      db.run(sql);
    }

    return {
      changes: db.getRowsModified()
    };
  } catch (error) {
    console.error('Execute error:', error);
    throw error;
  }
}

/**
 * Insert a row into a table
 *
 * @param {string} table - Table name
 * @param {Object} valuesDict - Object with column names as keys
 * @returns {boolean} Success status
 */
export function insert(table, valuesDict) {
  if (!db) {
    throw new Error('Database not initialized');
  }

  try {
    const fields = Object.keys(valuesDict);
    const values = Object.values(valuesDict);
    const placeholders = fields.map(() => '?').join(',');

    const sql = `INSERT INTO ${table} (${fields.join(',')}) VALUES (${placeholders})`;
    db.run(sql, values);

    console.log(`Row inserted into ${table}`);
    return true;
  } catch (error) {
    console.error('Insert error:', error);
    throw error;
  }
}

/**
 * Update rows in a table
 *
 * @param {string} table - Table name
 * @param {Object} valuesDict - Object with column names as keys
 * @param {string} whereClause - WHERE clause (without 'WHERE')
 * @param {Array} whereParams - Parameters for WHERE clause
 * @returns {number} Number of rows affected
 */
export function update(table, valuesDict, whereClause, whereParams = []) {
  if (!db) {
    throw new Error('Database not initialized');
  }

  try {
    const fields = Object.keys(valuesDict);
    const values = Object.values(valuesDict);
    const setClause = fields.map(f => `${f} = ?`).join(', ');

    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    db.run(sql, [...values, ...whereParams]);

    return db.getRowsModified();
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
}

/**
 * Delete rows from a table
 *
 * @param {string} table - Table name
 * @param {string} whereClause - WHERE clause (without 'WHERE')
 * @param {Array} whereParams - Parameters for WHERE clause
 * @returns {number} Number of rows deleted
 */
export function deleteRows(table, whereClause, whereParams = []) {
  if (!db) {
    throw new Error('Database not initialized');
  }

  try {
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    db.run(sql, whereParams);

    return db.getRowsModified();
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

/**
 * Get all tables in the database
 *
 * @returns {Promise<Array>} Array of table names
 */
export async function getTables() {
  const results = await rawQuery(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  );
  return results.map(r => r.name);
}

/**
 * Close the database connection
 */
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    isReady = false;
    console.log('Database closed');
  }
}

/**
 * Download database from server
 *
 * @param {string} url - Download URL
 * @param {Function} progressCallback - Optional callback for progress updates
 * @returns {Promise<boolean>} Success status
 */
export async function downloadDatabase(url = dbUrl, progressCallback = null) {
  try {
    const destPath = await getDatabasePath();

    if (progressCallback) {
      progressCallback({ status: 'downloading', message: 'Downloading database...' });
    }

    await window.electronAPI.downloadDatabase(url, destPath);

    if (progressCallback) {
      progressCallback({ status: 'complete', message: 'Database downloaded successfully' });
    }

    // Reinitialize with new database
    await initDatabase();

    return true;
  } catch (error) {
    console.error('Download error:', error);
    if (progressCallback) {
      progressCallback({ status: 'error', message: error.message });
    }
    throw error;
  }
}

// Legacy exports for backward compatibility
export { rawQueryCallback as rawQueryLegacy };
export const dbReady = () => isReady;
export const conn = () => db;

// Default export for easy importing
export default {
  initDatabase,
  isDbExist,
  isDatabaseReady,
  getDatabasePath,
  saveDatabase,
  rawQuery,
  rawQueryCallback,
  execute,
  insert,
  update,
  deleteRows,
  getTables,
  closeDatabase,
  downloadDatabase,
  dbUrl
};
