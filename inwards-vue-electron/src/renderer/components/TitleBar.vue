<template>
  <div class="titlebar">
    <div class="titlebar-drag-region">
      <div class="titlebar-icon">
        <img :src="iconSrc" alt="INWARDS" />
      </div>
      <div class="titlebar-title">INWARDS</div>
    </div>

    <nav class="titlebar-menu">
      <div class="menu-item" @click="navigateTo('/')">
        <span>Home</span>
      </div>

      <div class="menu-item dropdown">
        <span>Dashboards</span>
        <div class="dropdown-content">
          <a @click="navigateTo('/dashboard')">Real-time Discharge</a>
          <a @click="navigateTo('/')">Verified Discharge</a>
          <a @click="navigateTo('/dam-dashboard')">Dam Dashboard</a>
          <a @click="navigateTo('/knp-dashboard')">KNP TPC Dashboard</a>
          <a @click="navigateTo('/iucma-dashboard')">IUCMA Operational Dashboard</a>
          <a @click="navigateTo('/iucma-wq-dashboard')">IUCMA RQO Dashboard</a>
          <a @click="navigateTo('/wq-dashboard')">Water Quality Dashboard</a>
          <a @click="navigateTo('/wq-health-dashboard')">Water Quality Health Dashboard</a>
          <a @click="navigateTo('/fish-dashboard')">Fish Dashboard</a>
          <a @click="navigateTo('/invert-dashboard')">Invertebrate Dashboard</a>
          <a @click="navigateTo('/load-dashboard')">Load Dashboard</a>
          <a @click="navigateTo('/eba-dashboard')">Spatial Risk Dashboard</a>
        </div>
      </div>

      <div class="menu-item" @click="navigateTo('/user-dashboard')">
        <span>Your Dashboard</span>
      </div>

      <div class="menu-item dropdown">
        <span>Options</span>
        <div class="dropdown-content">
          <a @click="navigateTo('/admin-dashboard')">Admin Dashboard</a>
          <a @click="navigateTo('/reset')">Reset Application</a>
        </div>
      </div>
    </nav>

    <div class="titlebar-controls">
      <button class="titlebar-button" @click="minimize" title="Minimize">
        <svg width="10" height="1" viewBox="0 0 10 1">
          <rect fill="currentColor" width="10" height="1"></rect>
        </svg>
      </button>
      <button class="titlebar-button" @click="maximize" title="Maximize">
        <svg v-if="!isMaximized" width="10" height="10" viewBox="0 0 10 10">
          <path fill="currentColor" d="M0 0v10h10V0H0zm1 1h8v8H1V1z"></path>
        </svg>
        <svg v-else width="10" height="10" viewBox="0 0 10 10">
          <path fill="currentColor" d="M2 0v2H0v8h8V8h2V0H2zm6 8H1V3h7v5zm1-6H3V1h6v1z"></path>
        </svg>
      </button>
      <button class="titlebar-button close" @click="close" title="Close">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path fill="currentColor" d="M10 .7L9.3 0 5 4.3.7 0 0 .7 4.3 5 0 9.3l.7.7L5 5.7 9.3 10l.7-.7L5.7 5 10 .7z"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TitleBar',
  data() {
    return {
      isMaximized: false,
      iconSrc: null
    }
  },
  async mounted() {
    // Check initial maximized state
    this.checkMaximized()

    // Load icon
    try {
      this.iconSrc = require('@/assets/icon.png')
    } catch (e) {
      console.warn('Could not load titlebar icon')
    }
  },
  methods: {
    async checkMaximized() {
      if (window.electronAPI) {
        this.isMaximized = await window.electronAPI.isWindowMaximized()
      }
    },
    minimize() {
      if (window.electronAPI) {
        window.electronAPI.minimizeWindow()
      }
    },
    async maximize() {
      if (window.electronAPI) {
        await window.electronAPI.maximizeWindow()
        this.isMaximized = !this.isMaximized
      }
    },
    close() {
      if (window.electronAPI) {
        window.electronAPI.closeWindow()
      }
    },
    navigateTo(route) {
      this.$router.push(route).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('Navigation error:', err)
        }
      })
    }
  }
}
</script>

<style scoped>
.titlebar {
  display: flex;
  align-items: center;
  height: 32px;
  background-color: #3C3C3C;
  color: #CCCCCC;
  font-size: 13px;
  user-select: none;
  -webkit-app-region: drag;
}

.titlebar-drag-region {
  display: flex;
  align-items: center;
  padding-left: 8px;
  -webkit-app-region: drag;
}

.titlebar-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.titlebar-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.titlebar-title {
  font-weight: 500;
  margin-right: 16px;
}

.titlebar-menu {
  display: flex;
  flex: 1;
  height: 100%;
  -webkit-app-region: no-drag;
}

.menu-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 100%;
  cursor: pointer;
  transition: background-color 0.15s;
}

.menu-item:hover {
  background-color: #505050;
}

.menu-item span {
  white-space: nowrap;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 220px;
  background-color: #2D2D2D;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  display: block;
  padding: 8px 16px;
  color: #CCCCCC;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.15s;
}

.dropdown-content a:hover {
  background-color: #094771;
}

.titlebar-controls {
  display: flex;
  height: 100%;
  -webkit-app-region: no-drag;
}

.titlebar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 100%;
  background: none;
  border: none;
  color: #CCCCCC;
  cursor: pointer;
  transition: background-color 0.15s;
}

.titlebar-button:hover {
  background-color: #505050;
}

.titlebar-button.close:hover {
  background-color: #E81123;
  color: white;
}

.titlebar-button:focus {
  outline: none;
}
</style>
