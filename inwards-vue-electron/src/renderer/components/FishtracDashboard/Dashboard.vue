<template>
  <div :class="['fishtrac-dashboard', store.themeClass]">
    <!-- Header Bar -->
    <div class="fishtrac-header">
      <div class="header-brand">
        <i class="fa fa-podcast brand-icon"></i>
        <span class="brand-text">Fishtrac</span>
      </div>
      <div class="header-tabs">
        <button v-for="tab in tabs" :key="tab.id"
          :class="['tab-btn', { active: store.activeTab === tab.id }]"
          @click="switchTab(tab.id)">
          <i :class="tab.icon"></i>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>
      <button class="ft-theme-toggle" @click="store.toggleTheme()" :title="store.isDarkTheme ? 'Switch to Light' : 'Switch to Dark'">
        <i :class="store.isDarkTheme ? 'fa fa-sun-o' : 'fa fa-moon-o'"></i>
      </button>
      <div class="header-status">
        <span class="status-dot" :class="{ live: store.isLive }"></span>
        <span class="status-text">{{ store.isLive ? 'LIVE' : 'OFFLINE' }}</span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="fishtrac-body">
      <!-- Sidebar -->
      <div class="fishtrac-sidebar ft-scrollable" v-if="showSidebar">
        <FishtracFilters
          v-if="store.activeTab !== 'tracker'"
          :activeTab="store.activeTab"
        />
        <FishtracLegend
          v-if="store.activeTab === 'tracker'"
        />
      </div>

      <!-- Main Panel -->
      <div class="fishtrac-main ft-scrollable">
        <FishtracPulse v-if="store.activeTab === 'pulse'" />
        <FishtracTrackerMap v-if="store.activeTab === 'tracker'" />
        <FishtracAlarmDashboard v-if="store.activeTab === 'alarms'" />
        <FishtracEnvironment v-if="store.activeTab === 'environment'" />
        <FishtracResearch v-if="store.activeTab === 'research'" />
        <FishtracRegistry v-if="store.activeTab === 'registry'" />
        <FishtracExport v-if="store.activeTab === 'export'" />
      </div>
    </div>

    <NavButtons />
  </div>
</template>

<script>
import { useFishtracStore } from '../../store/fishtracStore'
import NavButtons from '../NavButtons.vue'
import FishtracFilters from './FishtracFilters.vue'
import FishtracLegend from './FishtracLegend.vue'
import FishtracPulse from './FishtracPulse.vue'
import FishtracTrackerMap from './FishtracTrackerMap.vue'
import FishtracAlarmDashboard from './FishtracAlarmDashboard.vue'
import FishtracEnvironment from './FishtracEnvironment.vue'
import FishtracResearch from './FishtracResearch.vue'
import FishtracRegistry from './FishtracRegistry.vue'
import FishtracExport from './FishtracExport.vue'

export default {
  name: 'FishtracDashboard',

  components: {
    NavButtons,
    FishtracFilters,
    FishtracLegend,
    FishtracPulse,
    FishtracTrackerMap,
    FishtracAlarmDashboard,
    FishtracEnvironment,
    FishtracResearch,
    FishtracRegistry,
    FishtracExport
  },

  setup() {
    const store = useFishtracStore()
    return { store }
  },

  data() {
    return {
      tabs: [
        { id: 'pulse', label: 'Pulse', icon: 'fa fa-heartbeat' },
        { id: 'tracker', label: 'Tracker', icon: 'fa fa-map' },
        { id: 'alarms', label: 'Alarms', icon: 'fa fa-bell' },
        { id: 'environment', label: 'Environment', icon: 'fa fa-thermometer-half' },
        { id: 'research', label: 'Research', icon: 'fa fa-flask' },
        { id: 'registry', label: 'Registry', icon: 'fa fa-list-alt' },
        { id: 'export', label: 'Export', icon: 'fa fa-download' }
      ]
    }
  },

  computed: {
    showSidebar() {
      return ['pulse', 'alarms', 'environment', 'research', 'tracker'].includes(this.store.activeTab)
    }
  },

  mounted() {
    this.store.fetchRivers()
    this.store.fetchFishList(this.store.selectedRiver)
    this.store.fetchProbeList(this.store.selectedRiver)
    this.store.fetchPulseData()
  },

  methods: {
    switchTab(tabId) {
      this.store.activeTab = tabId
    }
  }
}
</script>

<style scoped>
/* ─── Layout ─── */
.fishtrac-dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--ft-bg-deepest);
  font-family: 'Open Sans', sans-serif;
  color: var(--ft-text-secondary);
}

/* ─── Header ─── */
.fishtrac-header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 48px;
  background: var(--ft-bg-surface);
  border-bottom: 1px solid var(--ft-border);
  flex-shrink: 0;
}

.header-brand {
  display: flex;
  align-items: center;
  margin-right: 24px;
}

.brand-icon {
  font-size: 18px;
  color: var(--ft-accent);
  margin-right: 8px;
}

.brand-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--ft-text-primary);
  letter-spacing: 0.5px;
}

.header-tabs {
  display: flex;
  gap: 2px;
  flex: 1;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--ft-text-muted);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s;
  height: 48px;
  font-family: inherit;
}

.tab-btn:hover {
  color: var(--ft-text-secondary);
  background: var(--ft-row-hover);
}

.tab-btn.active {
  color: var(--ft-text-primary);
  border-bottom-color: var(--ft-accent);
  background: var(--ft-accent-subtle);
}

.tab-btn i {
  font-size: 13px;
}

/* Theme Toggle (spacing override) */
.ft-theme-toggle {
  margin-right: 12px;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ft-border-hover);
}

.status-dot.live {
  background: #4EC9B0;
  box-shadow: 0 0 6px rgba(78, 201, 176, 0.6);
  animation: ft-pulse-dot 2s ease-in-out infinite;
}

.status-text {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--ft-text-muted);
}

/* ─── Body ─── */
.fishtrac-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.fishtrac-sidebar {
  width: 260px;
  background: var(--ft-bg-surface);
  border-right: 1px solid var(--ft-border);
  overflow-y: auto;
  flex-shrink: 0;
}

.fishtrac-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

</style>
