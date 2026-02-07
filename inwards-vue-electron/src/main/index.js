'use strict';

const { app, BrowserWindow, Menu, MenuItem, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

// Set app name
app.name = 'INWARDS';

// Disable security warnings in development
const isDev = process.env.NODE_ENV === 'development';
const isDebug = process.argv.includes('--debug');

if (isDev) {
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
}

let mainWindow = null;

// ============================================
// Application Menu
// ============================================
const menu = new Menu();

menu.append(new MenuItem({
  label: 'Home',
  click: () => navigateTo('home')
}));

menu.append(new MenuItem({
  label: 'Dashboards',
  submenu: [
    {
      label: 'Real-time Discharge',
      click: () => navigateTo('unverified')
    },
    { type: 'separator' },
    {
      label: 'Verified Discharge',
      click: () => navigateTo('home')
    },
    { type: 'separator' },
    {
      label: 'Dam Dashboard',
      click: () => navigateTo('damDash')
    },
    { type: 'separator' },
    {
      label: 'Kruger National Park (KNP) TPC Dashboard',
      click: () => navigateTo('knpDash')
    },
    { type: 'separator' },
    {
      label: 'IUCMA Operational Dashboard',
      click: () => navigateTo('iucmaDash')
    },
    { type: 'separator' },
    {
      label: 'IUCMA RQO Dashboard',
      click: () => navigateTo('iucmaWqDash')
    },
    { type: 'separator' },
    {
      label: 'Water Quality Dashboard',
      click: () => navigateTo('wqDash')
    },
    { type: 'separator' },
    {
      label: 'Water Quality Health Dashboard',
      click: () => navigateTo('healthDash')
    },
    { type: 'separator' },
    {
      label: 'Fish Dashboard',
      click: () => navigateTo('fishDash')
    },
    { type: 'separator' },
    {
      label: 'Fishtrac Dashboard',
      click: () => navigateTo('fishtracDash')
    },
    { type: 'separator' },
    {
      label: 'Invertebrate Dashboard',
      click: () => navigateTo('invertDash')
    },
    { type: 'separator' },
    {
      label: 'Load Dashboard',
      click: () => navigateTo('loadDash')
    },
    { type: 'separator' },
    {
      label: 'Spatial Risk Dashboard',
      click: () => navigateTo('ebaDash')
    }
  ]
}));

menu.append(new MenuItem({
  label: 'Your Dashboard',
  click: () => navigateTo('userDash')
}));

menu.append(new MenuItem({
  label: 'Options',
  submenu: [
    {
      label: 'Admin Dashboard',
      click: () => navigateTo('adminDash')
    },
    {
      label: 'Reset Application',
      click: () => navigateTo('reset')
    }
  ]
}));

// ============================================
// Single Instance Lock
// ============================================
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock && !isDev) {
  app.quit();
  process.exit(0);
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// ============================================
// IPC Handlers
// ============================================

// Path handlers
ipcMain.handle('get-user-data-path', () => {
  return app.getPath('userData');
});

ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
});

ipcMain.handle('get-database-path', () => {
  return path.join(app.getPath('userData'), 'inwards_template.sqlite3');
});

ipcMain.handle('get-nedb-path', () => {
  return path.join(app.getPath('userData'), 'data.db');
});

// File system handlers
ipcMain.handle('file-exists', async (event, filePath) => {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const data = await fs.promises.readFile(filePath);
    return data;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
});

ipcMain.handle('write-file', async (event, filePath, data) => {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(filePath, Buffer.from(data));
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
});

ipcMain.handle('delete-file', async (event, filePath) => {
  try {
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
});

// Window control handlers
ipcMain.handle('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// Dialog handlers
ipcMain.handle('show-open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-message-box', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});

// App info handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

// Database download handler
ipcMain.handle('download-database', (event, url, destPath) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);

    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        protocol.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(true);
          });
        }).on('error', (err) => {
          fs.unlink(destPath, () => {}); // Delete the file on error
          reject(err);
        });
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      }
    }).on('error', (err) => {
      fs.unlink(destPath, () => {}); // Delete the file on error
      reject(err);
    });
  });
});

// ============================================
// Window Creation
// ============================================
function createWindow() {
  // Get the correct preload path
  // In dev: __dirname is dist/, preload is at dist/preload.js
  // In prod: same, preload is bundled to dist/preload.js
  const preloadPath = path.join(__dirname, 'preload.js');
  console.log('Preload path:', preloadPath);

  mainWindow = new BrowserWindow({
    backgroundColor: '#1E1E1E',
    width: 1600,
    height: 900,
    minWidth: 960,
    minHeight: 540,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // Required for preload to access Node APIs
      preload: preloadPath,
      webSecurity: !isDev, // Allow file:// in dev only
    }
  });

  Menu.setApplicationMenu(menu);

  if (isDev) {
    mainWindow.loadURL('http://localhost:9080');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    console.log('\nApplication exiting...');
    mainWindow = null;
  });

  mainWindow.maximize();

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.on('did-frame-finish-load', () => {
      setTimeout(() => {
        mainWindow.webContents.openDevTools({ mode: 'right' });
      }, 3000);
    });
  }

  if (isDebug) {
    setTimeout(() => {
      mainWindow.webContents.openDevTools();
    }, 3000);
  }
}

// Navigation helper - sends IPC message to renderer
function navigateTo(target) {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('change-view', { route: getRouteForTarget(target) });
  }
}

// Map menu targets to routes
function getRouteForTarget(target) {
  const routes = {
    'home': '/',
    'unverified': '/dashboard',
    'damDash': '/dam-dashboard',
    'knpDash': '/knp-dashboard',
    'iucmaDash': '/iucma-dashboard',
    'iucmaWqDash': '/iucma-wq-dashboard',
    'wqDash': '/wq-dashboard',
    'healthDash': '/wq-health-dashboard',
    'fishDash': '/fish-dashboard',
    'fishtracDash': '/fishtrac-dashboard',
    'invertDash': '/invert-dashboard',
    'loadDash': '/load-dashboard',
    'ebaDash': '/eba-dashboard',
    'userDash': '/user-dashboard',
    'adminDash': '/admin-dashboard',
    'reset': '/reset'
  };
  return routes[target] || '/';
}

// ============================================
// App Lifecycle
// ============================================
app.on('ready', () => {
  createWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ============================================
// Auto Updater (uncomment when ready)
// ============================================
/*
const { autoUpdater } = require('electron-updater');

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
*/
