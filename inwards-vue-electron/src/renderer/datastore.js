/**
 * Datastore Module (Legacy Compatibility Layer)
 *
 * This module provides backward compatibility for existing code that uses
 * the old NeDB API. It wraps the new JSON-based datastore service.
 *
 * For new code, import directly from '@/services/datastore' instead.
 */

import {
  initDatastore,
  ensureReady,
  nedbCompatible,
  insert,
  find,
  findOne,
  update,
  remove,
  get,
  set,
  del,
  clearAll,
  forceSave
} from './services/datastore';

// Auto-initialize datastore when this module is imported
// (maintains backward compatibility with NeDB which auto-loads)
initDatastore().catch(err => {
  console.warn('Failed to initialize datastore:', err);
});

// Export the NeDB-compatible API as default
// This maintains backward compatibility with existing code like:
// db.insert(doc, callback)
// db.find(query, callback)
export default nedbCompatible;

// Also export individual functions for direct usage
export {
  initDatastore,
  ensureReady,
  insert,
  find,
  findOne,
  update,
  remove,
  get,
  set,
  del,
  clearAll,
  forceSave
};
