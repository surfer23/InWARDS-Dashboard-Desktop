/**
 * Vuex Persisted State Plugin (Browser-compatible)
 *
 * Replaces vuex-electron's createPersistedState which requires Node.js.
 * Uses localStorage for persistence in the browser context.
 */

const STORAGE_KEY = 'vuex-state';

/**
 * Creates a Vuex plugin that persists state to localStorage
 * @param {Object} options - Configuration options
 * @param {string[]} options.paths - State paths to persist (default: all)
 * @param {string} options.key - Storage key (default: 'vuex-state')
 * @returns {Function} Vuex plugin
 */
export function createPersistedState(options = {}) {
  const key = options.key || STORAGE_KEY;
  const paths = options.paths || null;

  return (store) => {
    // Restore state from localStorage on init
    try {
      const savedState = localStorage.getItem(key);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        store.replaceState(mergeDeep(store.state, parsed));
      }
    } catch (e) {
      console.warn('Failed to restore persisted state:', e);
    }

    // Subscribe to mutations and save state
    store.subscribe((mutation, state) => {
      try {
        const stateToSave = paths ? extractPaths(state, paths) : state;
        localStorage.setItem(key, JSON.stringify(stateToSave));
      } catch (e) {
        console.warn('Failed to persist state:', e);
      }
    });
  };
}

/**
 * Creates a no-op shared mutations plugin
 * In single-window apps, this isn't needed
 * @returns {Function} Vuex plugin (no-op)
 */
export function createSharedMutations() {
  return (store) => {
    // No-op for single window apps with contextIsolation
    // If multi-window support is needed, use IPC through electronAPI
  };
}

/**
 * Deep merge two objects
 */
function mergeDeep(target, source) {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Extract specific paths from state
 */
function extractPaths(state, paths) {
  const result = {};

  paths.forEach(path => {
    const keys = path.split('.');
    let value = state;
    let target = result;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i === keys.length - 1) {
        target[key] = value[key];
      } else {
        if (value[key] === undefined) break;
        target[key] = target[key] || {};
        target = target[key];
        value = value[key];
      }
    }
  });

  return result;
}

export default {
  createPersistedState,
  createSharedMutations
};
