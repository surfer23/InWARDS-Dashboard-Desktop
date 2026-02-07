const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

/**
 * Preload script for INWARDS application
 * Provides a secure bridge between the main and renderer processes
 * using contextBridge (Electron security best practice)
 */

contextBridge.exposeInMainWorld('electronAPI', {
  // ============================================
  // Application Paths
  // ============================================
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  getDatabasePath: () => ipcRenderer.invoke('get-database-path'),
  getNedbPath: () => ipcRenderer.invoke('get-nedb-path'),

  // ============================================
  // File System Operations
  // ============================================
  fileExists: (filePath) => ipcRenderer.invoke('file-exists', filePath),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
  deleteFile: (filePath) => ipcRenderer.invoke('delete-file', filePath),

  // ============================================
  // Window Controls
  // ============================================
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),
  isWindowMaximized: () => ipcRenderer.invoke('window-is-maximized'),

  // ============================================
  // Dialogs
  // ============================================
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),

  // ============================================
  // Navigation (from main menu)
  // ============================================
  onChangeView: (callback) => {
    ipcRenderer.on('change-view', (event, data) => callback(data));
  },
  removeChangeViewListener: () => {
    ipcRenderer.removeAllListeners('change-view');
  },

  // ============================================
  // Database Download
  // ============================================
  downloadDatabase: (url, destPath) => ipcRenderer.invoke('download-database', url, destPath),

  // ============================================
  // App Info
  // ============================================
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => process.platform,
  getElectronVersion: () => process.versions.electron,
  getNodeVersion: () => process.versions.node,
  getChromeVersion: () => process.versions.chrome,
});

// Expose versions for the status display
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

console.log('Preload script loaded successfully');
