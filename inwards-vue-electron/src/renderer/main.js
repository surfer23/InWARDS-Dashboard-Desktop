import { createApp } from 'vue'
import axios from 'axios'
import mitt from 'mitt'

// jQuery - imports-loader will inject this into bootstrap-table
import $ from 'jquery'
window.$ = $
window.jQuery = $

// Bootstrap and plugins (imports-loader handles jQuery injection)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/js/dist/util.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-table/dist/bootstrap-table.min.css'
import 'bootstrap-table'

import vSelect from 'vue-select'
import 'ol/ol.css'
import './static/css/font-awesome.min.css'
import 'vue-select/dist/vue-select.css'
import 'material-design-iconic-font/dist/css/material-design-iconic-font.css'
import 'material-design-icons/iconfont/material-icons.css'
import '@knight-lab/timelinejs/dist/css/timeline.css'
import './static/css/custom.css'
import './static/css/dashboard.css'
import { helperMixin } from '../utilities/helpers.js'

import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'

// Import new services
import { initDatabase } from './services/database'
import { initDatastore, nedbCompatible as db } from './services/datastore'

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBug, faFishFins, faMap, faUserSecret, faUser, faVial, faTint,
  faMapMarkedAlt, faWater, faSliders, faArrowUp, faArrowDown, faCircle,
  faRightLeft, faFile, faFolderOpen, faSave, faProjectDiagram, faCalculator,
  faFaucetDrip, faArrowUpFromWaterPump, faArrowUpFromGroundWater, faCube,
  faTrash, faRefresh, faChartLine, faMagnifyingGlassChart, faInfo
} from '@fortawesome/free-solid-svg-icons'

// jQuery UI
import 'jquery-ui/dist/jquery-ui.js'
import 'jquery-ui/ui/widgets/resizable.js'
import 'jquery-ui/ui/widgets/draggable.js'
import 'jquery-ui/themes/base/all.css'

// Multiselect
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

// KaTeX - Vue 3 version
import 'katex/dist/katex.min.css'

// Add FontAwesome icons
library.add(
  faUserSecret, faFishFins, faMap, faBug, faUser, faVial, faTint,
  faMapMarkedAlt, faWater, faSliders, faArrowUp, faArrowDown, faCircle,
  faRightLeft, faFile, faFolderOpen, faSave, faProjectDiagram, faCalculator,
  faFaucetDrip, faArrowUpFromWaterPump, faArrowUpFromGroundWater, faCube,
  faTrash, faRefresh, faChartLine, faMagnifyingGlassChart, faInfo
)

// Create event bus using mitt (replaces Vue 2 event bus)
const emitter = mitt()

// Create Pinia store
const pinia = createPinia()

// Electron API helper (use IPC via preload)
const electronHelper = {
  // Window controls
  minimize: () => window.electronAPI?.minimizeWindow(),
  maximize: () => window.electronAPI?.maximizeWindow(),
  close: () => window.electronAPI?.closeWindow(),
  isMaximized: () => window.electronAPI?.isWindowMaximized(),

  // Paths
  getUserDataPath: () => window.electronAPI?.getUserDataPath(),
  getDatabasePath: () => window.electronAPI?.getDatabasePath(),

  // File operations
  fileExists: (path) => window.electronAPI?.fileExists(path),
  readFile: (path) => window.electronAPI?.readFile(path),
  writeFile: (path, data) => window.electronAPI?.writeFile(path, data),

  // Dialogs
  showOpenDialog: (options) => window.electronAPI?.showOpenDialog(options),
  showSaveDialog: (options) => window.electronAPI?.showSaveDialog(options),
  showMessageBox: (options) => window.electronAPI?.showMessageBox(options),
}

// Initialize services and create Vue app
async function initApp() {
  try {
    // Initialize datastore (for user preferences)
    await initDatastore()
    console.log('Datastore initialized')

    // Initialize database (SQLite via sql.js)
    // This will be done lazily when needed, not blocking app startup
    // await initDatabase()

  } catch (error) {
    console.error('Failed to initialize services:', error)
  }

  // Create Vue 3 app
  const app = createApp(App)

  // Use plugins
  app.use(router)
  app.use(pinia)

  // Register global mixin for helper methods
  app.mixin(helperMixin)

  // Register global components
  app.component('font-awesome-icon', FontAwesomeIcon)
  app.component('v-select', vSelect)
  app.component('multiselect', Multiselect)

  // Global properties (Vue 3 style)
  app.config.globalProperties.$db = db
  app.config.globalProperties.$ = $
  app.config.globalProperties.$bus = emitter // mitt event bus
  app.config.globalProperties.isLoggedIn = false
  app.config.globalProperties.$electron = electronHelper
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.axios = axios

  // Mount the app
  app.mount('#app')
}

// Handle menu navigation from main process
if (window.electronAPI) {
  window.electronAPI.onChangeView((data) => {
    if (data.route) {
      router.push(data.route).catch(err => {
        // Ignore navigation duplicated errors
        if (err.name !== 'NavigationDuplicated') {
          console.error('Navigation error:', err)
        }
      })
    }
  })
}

// Display version info when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  if (window.versions) {
    replaceText('chrome-version', window.versions.chrome())
    replaceText('node-version', window.versions.node())
    replaceText('electron-version', window.versions.electron())
  }
})

// Start the application
initApp()
