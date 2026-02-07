/**
 * Datastore Service
 *
 * A simple JSON-based local storage that replaces NeDB
 * This provides similar functionality without native module dependencies
 */

let dataPath = null;
let data = {};
let isLoaded = false;
let saveTimeout = null;
let initPromise = null; // Track initialization promise

/**
 * Parse NeDB line-delimited JSON format
 */
function parseNedbFormat(content) {
  const lines = content.split('\n').filter(line => line.trim());
  const documents = [];

  for (const line of lines) {
    try {
      const doc = JSON.parse(line);
      // Skip deleted documents (NeDB marks deletions with $$deleted: true)
      if (!doc.$$deleted) {
        documents.push(doc);
      }
    } catch (e) {
      // Skip malformed lines
      console.warn('Skipping malformed line in NeDB file');
    }
  }

  return { documents };
}

/**
 * Initialize the datastore
 */
export async function initDatastore() {
  // If already initialized, return immediately
  if (isLoaded) {
    return true;
  }

  // If initialization is in progress, wait for it
  if (initPromise) {
    return initPromise;
  }

  // Start initialization
  initPromise = (async () => {
    try {
      dataPath = await window.electronAPI.getNedbPath();

      // Load existing data if file exists
      const exists = await window.electronAPI.fileExists(dataPath);

      if (exists) {
        const buffer = await window.electronAPI.readFile(dataPath);
        const content = new TextDecoder().decode(buffer);

        try {
          // Try parsing as JSON first (new format)
          data = JSON.parse(content);
          console.log('Datastore loaded from:', dataPath);
        } catch (jsonError) {
          // If JSON parsing fails, try parsing as NeDB format (line-delimited JSON)
          console.log('Attempting to parse NeDB format...');
          try {
            data = parseNedbFormat(content);
            console.log('Datastore loaded from NeDB format:', dataPath);
            // Save in new JSON format for future loads
            scheduleSave();
          } catch (nedbError) {
            console.warn('Could not parse datastore file, starting fresh:', nedbError);
            data = {};
          }
        }
      } else {
        data = {};
        console.log('New datastore created');
      }

      isLoaded = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize datastore:', error);
      // Start with empty data if load fails
      data = {};
      isLoaded = true;
      return false;
    }
  })();

  return initPromise;
}

/**
 * Save datastore to disk (debounced)
 */
function scheduleSave() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(async () => {
    try {
      // Wait for initialization if still in progress
      if (initPromise) {
        await initPromise;
      }

      if (!dataPath) {
        console.warn('Datastore path not set, skipping save');
        return;
      }

      const content = JSON.stringify(data, null, 2);
      const buffer = new TextEncoder().encode(content);
      await window.electronAPI.writeFile(dataPath, buffer);
      console.log('Datastore saved');
    } catch (error) {
      console.error('Failed to save datastore:', error);
    }
  }, 500); // Debounce 500ms
}

/**
 * Force immediate save
 */
export async function forceSave() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }

  // Wait for initialization if still in progress
  if (initPromise) {
    await initPromise;
  }

  if (!dataPath) {
    console.warn('Datastore path not set, skipping save');
    return false;
  }

  try {
    const content = JSON.stringify(data, null, 2);
    const buffer = new TextEncoder().encode(content);
    await window.electronAPI.writeFile(dataPath, buffer);
    console.log('Datastore force saved');
    return true;
  } catch (error) {
    console.error('Failed to force save datastore:', error);
    return false;
  }
}

/**
 * Wait for datastore to be ready
 * @returns {Promise<boolean>}
 */
export async function ensureReady() {
  if (isLoaded) {
    return true;
  }
  if (initPromise) {
    return initPromise;
  }
  // If not initialized yet, initialize now
  return initDatastore();
}

/**
 * Insert a document
 *
 * @param {Object} doc - Document to insert
 * @returns {Object} Inserted document with _id
 */
export function insert(doc) {
  const _id = doc._id || generateId();
  const newDoc = { ...doc, _id, createdAt: new Date().toISOString() };

  if (!data.documents) {
    data.documents = [];
  }

  data.documents.push(newDoc);
  scheduleSave();

  return newDoc;
}

/**
 * Find documents matching a query
 *
 * @param {Object} query - Query object (simple key-value matching)
 * @returns {Array} Matching documents
 */
export function find(query = {}) {
  if (!data.documents) {
    return [];
  }

  if (Object.keys(query).length === 0) {
    return [...data.documents];
  }

  return data.documents.filter(doc => {
    return Object.entries(query).every(([key, value]) => doc[key] === value);
  });
}

/**
 * Find a single document
 *
 * @param {Object} query - Query object
 * @returns {Object|null} First matching document or null
 */
export function findOne(query) {
  const results = find(query);
  return results.length > 0 ? results[0] : null;
}

/**
 * Update documents matching a query
 *
 * @param {Object} query - Query to match documents
 * @param {Object} update - Update operations
 * @param {Object} options - Options (multi: update multiple docs, upsert: insert if not found)
 * @returns {number} Number of documents updated (or 1 if upserted)
 */
export function update(query, updateDoc, options = {}) {
  if (!data.documents) {
    data.documents = [];
  }

  let count = 0;
  const { multi = false, upsert: shouldUpsert = false } = options;

  for (let i = 0; i < data.documents.length; i++) {
    const doc = data.documents[i];
    const matches = Object.entries(query).every(([key, value]) => doc[key] === value);

    if (matches) {
      // Handle $set operator
      if (updateDoc.$set) {
        Object.assign(data.documents[i], updateDoc.$set);
      } else {
        // Direct replacement (keep _id)
        const _id = doc._id;
        data.documents[i] = { ...updateDoc, _id };
      }

      data.documents[i].updatedAt = new Date().toISOString();
      count++;

      if (!multi) break;
    }
  }

  // Handle upsert: if no documents matched and upsert is true, insert a new document
  if (count === 0 && shouldUpsert) {
    const newDoc = { ...query };
    if (updateDoc.$set) {
      Object.assign(newDoc, updateDoc.$set);
    } else {
      Object.assign(newDoc, updateDoc);
    }
    insert(newDoc);
    count = 1;
  } else if (count > 0) {
    scheduleSave();
  }

  return count;
}

/**
 * Upsert - update or insert
 *
 * @param {Object} query - Query to match documents
 * @param {Object} doc - Document to update/insert
 * @returns {Object} Result with updated/inserted status
 */
export function upsert(query, doc) {
  const existing = findOne(query);

  if (existing) {
    update(query, { $set: doc });
    return { updated: true, inserted: false, doc: { ...existing, ...doc } };
  } else {
    const newDoc = insert({ ...query, ...doc });
    return { updated: false, inserted: true, doc: newDoc };
  }
}

/**
 * Remove documents matching a query
 *
 * @param {Object} query - Query to match documents
 * @param {Object} options - Options (multi: remove multiple docs)
 * @returns {number} Number of documents removed
 */
export function remove(query, options = {}) {
  if (!data.documents) {
    return 0;
  }

  const { multi = false } = options;
  let count = 0;

  if (Object.keys(query).length === 0 && multi) {
    // Remove all
    count = data.documents.length;
    data.documents = [];
  } else {
    const toRemove = [];

    for (let i = 0; i < data.documents.length; i++) {
      const doc = data.documents[i];
      const matches = Object.entries(query).every(([key, value]) => doc[key] === value);

      if (matches) {
        toRemove.push(i);
        if (!multi) break;
      }
    }

    // Remove in reverse order to maintain indices
    for (let i = toRemove.length - 1; i >= 0; i--) {
      data.documents.splice(toRemove[i], 1);
      count++;
    }
  }

  if (count > 0) {
    scheduleSave();
  }

  return count;
}

/**
 * Get a value by key (simple key-value store)
 *
 * @param {string} key - Key to retrieve
 * @returns {any} Stored value
 */
export function get(key) {
  return data[key];
}

/**
 * Set a value by key (simple key-value store)
 *
 * @param {string} key - Key to store
 * @param {any} value - Value to store
 */
export function set(key, value) {
  data[key] = value;
  scheduleSave();
}

/**
 * Delete a key (simple key-value store)
 *
 * @param {string} key - Key to delete
 */
export function del(key) {
  delete data[key];
  scheduleSave();
}

/**
 * Clear all data
 */
export function clearAll() {
  data = {};
  scheduleSave();
}

/**
 * Generate a unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Check if datastore is loaded
 */
export function isDatastoreReady() {
  return isLoaded;
}

// NeDB-compatible API wrapper
export const nedbCompatible = {
  insert: (doc, callback) => {
    try {
      const result = insert(doc);
      if (callback) callback(null, result);
      return result;
    } catch (error) {
      if (callback) callback(error);
      throw error;
    }
  },

  find: (query, callback) => {
    try {
      const results = find(query);
      if (callback) callback(null, results);
      return { exec: (cb) => cb ? cb(null, results) : results };
    } catch (error) {
      if (callback) callback(error);
      throw error;
    }
  },

  findOne: (query, callback) => {
    try {
      const result = findOne(query);
      if (callback) callback(null, result);
      return result;
    } catch (error) {
      if (callback) callback(error);
      throw error;
    }
  },

  update: (query, updateDoc, options, callback) => {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    try {
      const count = update(query, updateDoc, options);
      if (callback) callback(null, count);
      return count;
    } catch (error) {
      if (callback) callback(error);
      throw error;
    }
  },

  remove: (query, options, callback) => {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    try {
      const count = remove(query, options);
      if (callback) callback(null, count);
      return count;
    } catch (error) {
      if (callback) callback(error);
      throw error;
    }
  }
};

// Default export for backward compatibility with NeDB usage
export default nedbCompatible;
