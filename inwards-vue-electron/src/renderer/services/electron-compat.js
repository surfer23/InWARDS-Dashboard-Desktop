/**
 * Electron Compatibility Layer
 *
 * This module provides backward compatibility for code that uses
 * require('electron').remote pattern.
 *
 * It wraps the new IPC-based API (window.electronAPI) in an interface
 * that matches the old remote API.
 *
 * Usage (in components that use remote):
 * Replace:
 *   const { dialog } = require('electron').remote;
 * With:
 *   import { dialog } from '@/services/electron-compat';
 *
 * Or keep using require pattern:
 *   const { dialog } = require('@/services/electron-compat');
 */

// Dialog API compatibility
export const dialog = {
  /**
   * Show an open file dialog
   * @param {Object} options - Dialog options
   * @returns {Promise<{canceled: boolean, filePaths: string[]}>}
   */
  showOpenDialog: async (options) => {
    if (window.electronAPI) {
      return window.electronAPI.showOpenDialog(options);
    }
    console.warn('electronAPI not available');
    return { canceled: true, filePaths: [] };
  },

  /**
   * Show an open file dialog (sync-style with callback)
   * @param {BrowserWindow} browserWindow - Optional browser window
   * @param {Object} options - Dialog options
   * @param {Function} callback - Optional callback
   */
  showOpenDialogSync: (browserWindowOrOptions, optionsOrCallback, callback) => {
    // Handle different calling signatures
    let options = browserWindowOrOptions;
    let cb = optionsOrCallback;

    if (typeof browserWindowOrOptions === 'object' && browserWindowOrOptions.webContents) {
      options = optionsOrCallback;
      cb = callback;
    }

    if (window.electronAPI) {
      window.electronAPI.showOpenDialog(options).then(result => {
        if (cb) cb(result.filePaths);
      });
    }
    return [];
  },

  /**
   * Show a save file dialog
   * @param {Object} options - Dialog options
   * @returns {Promise<{canceled: boolean, filePath: string}>}
   */
  showSaveDialog: async (options) => {
    if (window.electronAPI) {
      return window.electronAPI.showSaveDialog(options);
    }
    console.warn('electronAPI not available');
    return { canceled: true, filePath: '' };
  },

  /**
   * Show a message box
   * Supports both signatures:
   *   showMessageBox(options)
   *   showMessageBox(browserWindow, options)
   * @param {Object} browserWindowOrOptions - BrowserWindow or options
   * @param {Object} options - Message box options (if first arg is BrowserWindow)
   * @returns {Promise<{response: number, checkboxChecked: boolean}>}
   */
  showMessageBox: async (browserWindowOrOptions, options) => {
    // Handle both calling conventions:
    // 1. showMessageBox(options)
    // 2. showMessageBox(browserWindow, options) - browserWindow can be null
    let opts = options;
    if (browserWindowOrOptions === null || browserWindowOrOptions === undefined) {
      // First argument is null/undefined (browser window), use second arg as options
      opts = options;
    } else if (!options && typeof browserWindowOrOptions === 'object' && browserWindowOrOptions.type) {
      // First argument is the options object (has 'type' property)
      opts = browserWindowOrOptions;
    } else if (options) {
      // First argument is browser window, second is options
      opts = options;
    }
    if (window.electronAPI) {
      return window.electronAPI.showMessageBox(opts);
    }
    console.warn('electronAPI not available');
    return { response: 0, checkboxChecked: false };
  },

  /**
   * Show a message box (sync-style)
   */
  showMessageBoxSync: (options) => {
    if (window.electronAPI) {
      window.electronAPI.showMessageBox(options);
    }
    return 0;
  },

  /**
   * Show an error box
   */
  showErrorBox: (title, content) => {
    if (window.electronAPI) {
      window.electronAPI.showMessageBox({
        type: 'error',
        title: title,
        message: content
      });
    } else {
      alert(`${title}\n\n${content}`);
    }
  }
};

// App API compatibility
export const app = {
  /**
   * Get a special directory path
   * @param {string} name - Path name ('userData', 'appData', etc.)
   * @returns {Promise<string>}
   */
  getPath: async (name) => {
    if (name === 'userData' && window.electronAPI) {
      return window.electronAPI.getUserDataPath();
    }
    if (window.electronAPI) {
      return window.electronAPI.getAppPath();
    }
    console.warn('electronAPI not available');
    return '';
  },

  /**
   * Get app version
   * @returns {Promise<string>}
   */
  getVersion: async () => {
    if (window.electronAPI) {
      return window.electronAPI.getAppVersion();
    }
    return '0.0.0';
  },

  /**
   * Get app name
   */
  getName: () => 'INWARDS',

  /**
   * Quit the application
   */
  quit: () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    }
  }
};

// getCurrentWindow compatibility
export function getCurrentWindow() {
  return {
    minimize: () => window.electronAPI?.minimizeWindow(),
    maximize: () => window.electronAPI?.maximizeWindow(),
    unmaximize: () => window.electronAPI?.maximizeWindow(),
    close: () => window.electronAPI?.closeWindow(),
    isMaximized: () => window.electronAPI?.isWindowMaximized() || false,
    setTitle: (title) => { document.title = title; },
    getTitle: () => document.title,
  };
}

// BrowserWindow mock (for compatibility)
export const BrowserWindow = {
  getFocusedWindow: getCurrentWindow,
  getAllWindows: () => [getCurrentWindow()]
};

// Create a remote-like object for maximum compatibility
export const remote = {
  dialog,
  app,
  getCurrentWindow,
  BrowserWindow,
  getGlobal: (name) => {
    console.warn(`remote.getGlobal('${name}') is not supported in the new API`);
    return null;
  }
};

// Shell API compatibility (for openExternal, etc.)
export const shell = {
  openExternal: (url) => {
    window.open(url, '_blank');
  },
  openPath: (path) => {
    console.warn('shell.openPath is not supported in renderer');
  }
};

// ipcRenderer compatibility (for code that uses it directly)
export const ipcRenderer = {
  send: (channel, ...args) => {
    console.warn(`ipcRenderer.send('${channel}') - use window.electronAPI instead`);
  },
  invoke: async (channel, ...args) => {
    console.warn(`ipcRenderer.invoke('${channel}') - use window.electronAPI instead`);
    return null;
  },
  on: (channel, listener) => {
    console.warn(`ipcRenderer.on('${channel}') - use window.electronAPI instead`);
    return ipcRenderer;
  },
  once: (channel, listener) => {
    console.warn(`ipcRenderer.once('${channel}') - use window.electronAPI instead`);
    return ipcRenderer;
  },
  removeListener: (channel, listener) => {
    return ipcRenderer;
  }
};

// Default export matching the old pattern
export default {
  remote,
  dialog,
  app,
  getCurrentWindow,
  BrowserWindow,
  shell,
  ipcRenderer
};

// Module exports for CommonJS compatibility
if (typeof module !== 'undefined') {
  module.exports = {
    remote,
    dialog,
    app,
    getCurrentWindow,
    BrowserWindow,
    shell,
    ipcRenderer
  };
}
