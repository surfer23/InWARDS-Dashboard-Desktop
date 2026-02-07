<template>
  <div :class="['theme-' + theme]" style="height: 100%; display: flex; flex-direction: column;">

    <!-- ═══════════════════════════════════════════════════════
         Dashboard Header with Tabs
         ═══════════════════════════════════════════════════════ -->
    <div class="ft-dashboard-header">
      <div class="ft-header-brand">
        <i class="fa fa-tachometer"></i>
        <span class="ft-brand-text">Real-time Discharge</span>
      </div>

      <div class="ft-header-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="ft-tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="switchTab(tab.id)"
        >
          <i :class="tab.icon"></i>
          <span class="ft-tab-label">{{ tab.label }}</span>
        </button>
      </div>

      <div class="ft-header-actions">
        <button
          class="ft-theme-toggle"
          @click="toggleTheme()"
          :title="theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'"
        >
          <i :class="theme === 'dark' ? 'fa fa-sun-o' : 'fa fa-moon-o'"></i>
        </button>
        <span class="ft-status-badge" :class="{ online: isOnline }">
          <span class="ft-status-dot"></span>
          {{ isOnline ? 'LIVE' : 'OFFLINE' }}
        </span>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         Dashboard Body (Sidebar + Main)
         ═══════════════════════════════════════════════════════ -->
    <div class="ft-dashboard-shell" style="flex: 1; min-height: 0;">

      <!-- ─── Sidebar (contextual per tab) ─── -->
      <div v-if="showSidebar" class="ft-sidebar ft-scrollable">

        <!-- PULSE sidebar: time window filter -->
        <template v-if="activeTab === 'pulse'">
          <div class="ft-card">
            <div class="ft-card-header"><h6><i class="fa fa-filter"></i>Filters</h6></div>
            <div class="ft-card-body">
              <div class="ft-form-group">
                <label class="ft-form-label">Time Window</label>
                <select class="ft-form-select" v-model="pulseTimeWindow">
                  <option value="24h">Last 24 Hours</option>
                  <option value="48h">Last 48 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
              <hr class="ft-hr" />
              <div class="ft-form-group">
                <label class="ft-form-label">Sort By</label>
                <select class="ft-form-select" v-model="pulseSortBy">
                  <option value="name">Station Name</option>
                  <option value="discharge">Discharge (High → Low)</option>
                  <option value="trend">Trend</option>
                  <option value="updated">Last Updated</option>
                </select>
              </div>
              <hr class="ft-hr" />
              <button class="ft-btn ft-btn-primary ft-btn-block" @click="refreshPulse()">
                <i class="fa fa-refresh"></i> Refresh
              </button>
            </div>
          </div>
        </template>

        <!-- EXPLORER sidebar: tree + filters + map -->
        <template v-if="activeTab === 'explorer'">
          <BaseCatchmentTree
            ref="catchmentTree"
            tree-id="dashboard-stations"
            title="Stations"
            header-icon="fa-map-marker"
            :refreshable="true"
            :selectable="true"
            :search-enabled="true"
            container-height="300px"
            @refresh-requested="fetchStations"
            @tree-clicked="onCatchmentTreeSelectedHandler"
            @tree-ready="onTreeReady"
          />

          <div class="ft-card" style="margin-top: 6px;">
            <div class="ft-card-body">
              <div class="ft-form-row">
                <div class="ft-form-group">
                  <label class="ft-form-label" for="dateStart">Start Date</label>
                  <input
                    class="ft-form-input"
                    id="dateStart"
                    placeholder="Start Date"
                    onfocus="(this.type='date')"
                  />
                </div>
                <div class="ft-form-group">
                  <label class="ft-form-label" for="dateEnd">End Date</label>
                  <input
                    class="ft-form-input"
                    id="dateEnd"
                    placeholder="End Date"
                    onfocus="(this.type='date')"
                  />
                </div>
              </div>

              <hr class="ft-hr" />

              <div class="ft-checkbox-group">
                <div class="ft-checkbox-item">
                  <input id="ts" type="checkbox" checked="true" />
                  <label for="ts">Timeseries</label>
                </div>
                <div class="ft-checkbox-item">
                  <input id="bx" type="checkbox" checked="true" />
                  <label for="bx">Boxplot</label>
                </div>
                <div class="ft-checkbox-item">
                  <input id="fdc" type="checkbox" checked="true" />
                  <label for="fdc">Flow Duration</label>
                </div>
              </div>

              <hr class="ft-hr" />

              <button
                class="ft-btn ft-btn-primary ft-btn-block"
                @click="fetchUnverified()"
                type="button"
              >
                <i class="fa fa-line-chart"></i> Chart Unverified
              </button>
            </div>
          </div>

          <hr class="ft-hr" />

          <BaseMapDashboard
            ref="mapDashboard"
            map-id="dashboard-map"
            map-height="320px"
            :connected-to-tree="true"
            @station-selected="onStationSelectedFromMap"
            @station-deselected="onStationDeselectedFromMap"
          />
        </template>

        <!-- STATISTICS sidebar: date range + calculate -->
        <template v-if="activeTab === 'statistics'">
          <div class="ft-card">
            <div class="ft-card-header"><h6><i class="fa fa-calculator"></i>Period Statistics</h6></div>
            <div class="ft-card-body">
              <div class="ft-form-group" style="margin-bottom: 8px;">
                <label class="ft-form-label">Start Date</label>
                <input class="ft-form-input" type="date" v-model="statsStartDate" />
              </div>
              <div class="ft-form-group" style="margin-bottom: 8px;">
                <label class="ft-form-label">End Date</label>
                <input class="ft-form-input" type="date" v-model="statsEndDate" />
              </div>
              <hr class="ft-hr" />
              <button class="ft-btn ft-btn-primary ft-btn-block" @click="fetchStatistics()">
                <i class="fa fa-table"></i> Calculate
              </button>
              <p style="font-size: 10px; color: var(--ft-text-muted); margin-top: 8px;">
                Statistics are computed for all stations in the selected WMAs.
              </p>
            </div>
          </div>
        </template>

        <!-- ALERTS sidebar: threshold config -->
        <template v-if="activeTab === 'alerts'">
          <div class="ft-card">
            <div class="ft-card-header"><h6><i class="fa fa-bell"></i>Thresholds</h6></div>
            <div class="ft-card-body">
              <div class="ft-form-group" style="margin-bottom: 8px;">
                <label class="ft-form-label">High Flow (m&#179;/s)</label>
                <input class="ft-form-input" type="number" v-model.number="alertHighThreshold" placeholder="e.g. 50" />
              </div>
              <div class="ft-form-group" style="margin-bottom: 8px;">
                <label class="ft-form-label">Low Flow (m&#179;/s)</label>
                <input class="ft-form-input" type="number" v-model.number="alertLowThreshold" placeholder="e.g. 0.5" />
              </div>
              <div class="ft-form-group" style="margin-bottom: 8px;">
                <label class="ft-form-label">Rapid Rise (m&#179;/s per hr)</label>
                <input class="ft-form-input" type="number" v-model.number="alertRiseRate" placeholder="e.g. 5" />
              </div>
              <hr class="ft-hr" />
              <button class="ft-btn ft-btn-primary ft-btn-block" @click="fetchAlerts()">
                <i class="fa fa-search"></i> Check Alerts
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- ─── Main Content Area ─── -->
      <div class="ft-main-content ft-scrollable">

        <!-- ═══════════════════════════════════════════════
             TAB: PULSE — Network Overview
             ═══════════════════════════════════════════════ -->
        <div v-if="activeTab === 'pulse'">
          <!-- Loading state -->
          <div v-if="pulseLoading" class="ft-empty-state">
            <i class="fa fa-spinner fa-spin"></i>
            <h4>Loading Pulse Data...</h4>
          </div>
          <template v-else>
            <!-- KPI Summary Row -->
            <div class="ft-kpi-row">
              <div class="ft-kpi-card">
                <div class="ft-kpi-icon stations"><i class="fa fa-map-marker"></i></div>
                <div class="ft-kpi-body">
                  <div class="ft-kpi-value">{{ pulseData.activeStations }}</div>
                  <div class="ft-kpi-label">Active Stations</div>
                </div>
              </div>
              <div class="ft-kpi-card">
                <div class="ft-kpi-icon flow"><i class="fa fa-tint"></i></div>
                <div class="ft-kpi-body">
                  <div class="ft-kpi-value">{{ pulseData.meanDischarge }}</div>
                  <div class="ft-kpi-label">Mean Discharge (m&#179;/s)</div>
                </div>
              </div>
              <div class="ft-kpi-card">
                <div class="ft-kpi-icon peak"><i class="fa fa-arrow-up"></i></div>
                <div class="ft-kpi-body">
                  <div class="ft-kpi-value">{{ pulseData.peakFlow }}</div>
                  <div class="ft-kpi-label">Peak Flow (24h)</div>
                </div>
              </div>
              <div class="ft-kpi-card">
                <div class="ft-kpi-icon coverage"><i class="fa fa-signal"></i></div>
                <div class="ft-kpi-body">
                  <div class="ft-kpi-value">{{ pulseData.coverage }}%</div>
                  <div class="ft-kpi-label">Data Coverage</div>
                </div>
              </div>
              <div class="ft-kpi-card">
                <div class="ft-kpi-icon low"><i class="fa fa-exclamation-triangle"></i></div>
                <div class="ft-kpi-body">
                  <div class="ft-kpi-value">{{ pulseData.alertCount }}</div>
                  <div class="ft-kpi-label">Active Alerts</div>
                </div>
              </div>
            </div>

            <!-- Station Status Cards -->
            <div class="ft-category-divider">
              <span class="ft-divider-label">Station Status</span>
              <span class="ft-divider-line"></span>
            </div>

            <div v-if="pulseData.stations.length > 0" class="ft-station-grid">
              <div
                v-for="station in sortedPulseStations"
                :key="station.id"
                class="ft-station-card"
                :class="{ alert: station.hasAlert }"
                @click="navigateToStation(station.id)"
              >
                <div class="ft-station-header">
                  <span class="ft-station-name">{{ station.id }} — {{ station.place }}</span>
                  <span class="ft-station-trend" :class="station.trend">
                    <i :class="trendIcon(station.trend)"></i>
                    {{ trendLabel(station.trend) }}
                  </span>
                </div>
                <div class="ft-station-value">{{ station.discharge }} m&#179;/s</div>
                <div class="ft-station-sparkline">
                  <svg viewBox="0 0 120 30" preserveAspectRatio="none" class="ft-sparkline-svg">
                    <polyline
                      :points="station.sparkline"
                      fill="none"
                      stroke="var(--ft-accent)"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div class="ft-station-meta">
                  Updated: {{ station.lastUpdated }}
                </div>
              </div>
            </div>
            <div v-else class="ft-empty-state">
              <i class="fa fa-heartbeat"></i>
              <h4>No Station Data</h4>
              <p>No stations returned for the current WMA selection. Select WMAs from the landing page or adjust the time window.</p>
            </div>
          </template>
        </div>

        <!-- ═══════════════════════════════════════════════
             TAB: EXPLORER — Station Charts (existing)
             ═══════════════════════════════════════════════ -->
        <div v-if="activeTab === 'explorer'">
          <div class="ft-chart-grid">
            <UnverifiedChart ref="chartComponent" />
            <BoxChart ref="boxComponent" />
            <DurationCurve ref="durationComponent" />
            <Station ref="stationComponent" />
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════
             TAB: SPATIAL — Full Map View
             ═══════════════════════════════════════════════ -->
        <div v-if="activeTab === 'spatial'" style="height: calc(100vh - 110px); position: relative;">
          <BaseMapDashboard
            ref="spatialMap"
            map-id="spatial-full-map"
            map-height="100%"
            :connected-to-tree="false"
            @station-selected="onSpatialStationSelected"
          />
          <!-- Map legend overlay -->
          <div style="position: absolute; top: 10px; right: 10px;" class="ft-glass" >
            <div class="ft-glass-header"><i class="fa fa-map"></i> Legend</div>
            <div style="padding: 8px 14px 12px; font-size: 11px; color: var(--ft-text-secondary);">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="width: 12px; height: 12px; border-radius: 50%; background: rgba(255,0,0,0.5); border: 1px solid red;"></span>
                Unselected Station
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="width: 12px; height: 12px; border-radius: 50%; background: rgba(51,204,51,0.8); border: 1px solid green;"></span>
                Selected Station
              </div>
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════
             TAB: STATISTICS — Period Summary Table
             ═══════════════════════════════════════════════ -->
        <div v-if="activeTab === 'statistics'">
          <div v-if="statsLoading" class="ft-empty-state">
            <i class="fa fa-spinner fa-spin"></i>
            <h4>Calculating Statistics...</h4>
          </div>
          <div v-else-if="statsData.length > 0" class="ft-stats-table-wrapper">
            <table class="ft-stats-table">
              <thead>
                <tr>
                  <th @click="sortStats('station')">Station <i class="fa fa-sort"></i></th>
                  <th @click="sortStats('place')">Location <i class="fa fa-sort"></i></th>
                  <th @click="sortStats('min')">Min <i class="fa fa-sort"></i></th>
                  <th @click="sortStats('q25')">Q25 <i class="fa fa-sort"></i></th>
                  <th @click="sortStats('median')">Median <i class="fa fa-sort"></i></th>
                  <th @click="sortStats('q75')">Q75 <i class="fa fa-sort"></i></th>
                  <th @click="sortStats('max')">Max <i class="fa fa-sort"></i></th>
                  <th @click="sortStats('mean')">Mean <i class="fa fa-sort"></i></th>
                  <th @click="sortStats('cv')">CV (%) <i class="fa fa-sort"></i></th>
                  <th @click="sortStats('missing')">Missing % <i class="fa fa-sort"></i></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in sortedStatsData" :key="row.station">
                  <td class="station-col">{{ row.station }}</td>
                  <td>{{ row.place }}</td>
                  <td>{{ row.min != null ? row.min : '\u2014' }}</td>
                  <td>{{ row.q25 != null ? row.q25 : '\u2014' }}</td>
                  <td>{{ row.median != null ? row.median : '\u2014' }}</td>
                  <td>{{ row.q75 != null ? row.q75 : '\u2014' }}</td>
                  <td>{{ row.max != null ? row.max : '\u2014' }}</td>
                  <td>{{ row.mean != null ? row.mean : '\u2014' }}</td>
                  <td>{{ row.cv != null ? row.cv : '\u2014' }}</td>
                  <td :class="{ 'ft-cell-warn': row.missing > 10, 'ft-cell-good': row.missing != null && row.missing <= 2 }">{{ row.missing != null ? row.missing + '%' : '\u2014' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="ft-empty-state">
            <i class="fa fa-table"></i>
            <h4>No Statistics Loaded</h4>
            <p>Select a date range in the sidebar and click "Calculate" to compute period statistics for all stations.</p>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════
             TAB: ALERTS — Threshold Monitoring
             ═══════════════════════════════════════════════ -->
        <div v-if="activeTab === 'alerts'">
          <div v-if="alertsLoading" class="ft-empty-state">
            <i class="fa fa-spinner fa-spin"></i>
            <h4>Checking Alerts...</h4>
          </div>
          <div v-else-if="alertsData.length > 0" class="ft-alerts-view">
            <div
              v-for="alert in alertsData"
              :key="alert.id"
              class="ft-alert-card"
              :class="alert.severity"
            >
              <div class="ft-alert-icon">
                <i :class="alertIcon(alert.type)"></i>
              </div>
              <div class="ft-alert-body">
                <div class="ft-alert-title">{{ alert.title }}</div>
                <div class="ft-alert-detail">{{ alert.station }} — {{ alert.message }}</div>
              </div>
              <div class="ft-alert-time">{{ alert.time }}</div>
            </div>
          </div>
          <div v-else class="ft-empty-state">
            <i class="fa fa-bell"></i>
            <h4>No Active Alerts</h4>
            <p>Configure thresholds in the sidebar and click "Check Alerts" to scan the network for anomalies.</p>
          </div>
        </div>

      </div>

      <NavButtons />
    </div>
  </div>
</template>

<style>
.jstree-container {
  max-height: 200px;
  height: 200px;
  overflow-y: auto;
}
</style>

<script>
import axios from 'axios'
import Header from '../../components/Header'
import NavButtons from '../../components/NavButtons'
import BaseMapDashboard from '../shared/BaseMapDashboard.vue'
import BaseCatchmentTree from '../shared/BaseCatchmentTree.vue'
import UnverifiedChart from './UnverifiedChart'
import DurationCurve from './DurationCurve'
import BoxChart from './BoxChart'
import Station from './Station'
import $ from 'jquery'
import stateStore from '../../store/state_handler'
import StatusBar from '../StatusBar'
import { remote } from '../../services/electron-compat'
import { useEventBus } from '../../composables/useEventBus'
require('promise.prototype.finally').shim()

const { dialog, app } = remote

export default {
  name: 'Dashboard',

  components: {
    Header,
    NavButtons,
    BaseMapDashboard,
    BaseCatchmentTree,
    BoxChart,
    UnverifiedChart,
    DurationCurve,
    Station,
    StatusBar,
  },

  setup() {
    const { on, emit } = useEventBus()
    return { busOn: on, busEmit: emit }
  },

  data() {
    return {
      // ── Theme ──
      theme: localStorage.getItem('dashboard-theme') || 'dark',

      // ── Navigation ──
      activeTab: 'pulse',
      tabs: [
        { id: 'pulse', label: 'Pulse', icon: 'fa fa-heartbeat' },
        { id: 'explorer', label: 'Explorer', icon: 'fa fa-line-chart' },
        { id: 'spatial', label: 'Spatial', icon: 'fa fa-globe' },
        { id: 'statistics', label: 'Statistics', icon: 'fa fa-table' },
        { id: 'alerts', label: 'Alerts', icon: 'fa fa-bell' },
      ],

      // ── Connection status ──
      isOnline: navigator.onLine,

      // ── API base ──
      apiBase: 'https://inwards.award.org.za/api/inwards',

      // ── Existing explorer data ──
      stationsApi: 'https://inwards.award.org.za/app_json/stations.php',
      stationsCoordinates: {},
      stationsFeatures: {},
      stationsRequest: null,
      selectedStations: [],
      selectedWMAs: [],

      // ── Pulse tab data ──
      //    API: GET station_pulse.php?wma={wma}&window={24h|48h|7d|30d}
      //    Returns: { activeStations, meanDischarge, peakFlow, coverage,
      //               alertCount, stations: [{ id, place, discharge, trend,
      //               sparkline (array of {x,y}), lastUpdated, hasAlert }] }
      pulseTimeWindow: '24h',
      pulseSortBy: 'name',
      pulseLoading: false,
      pulseData: {
        activeStations: 0,
        meanDischarge: '\u2014',
        peakFlow: '\u2014',
        coverage: 0,
        alertCount: 0,
        stations: []
      },

      // ── Statistics tab data ──
      //    API: GET station_statistics.php?wma={wma}&sd={start}&ed={end}
      //    Returns: [{ station, place, min, q25, median, q75, max, mean, cv, missing }]
      statsStartDate: '',
      statsEndDate: '',
      statsLoading: false,
      statsData: [],
      statsSortKey: 'station',
      statsSortAsc: true,

      // ── Alerts tab data ──
      //    API: GET station_alerts.php?wma={wma}&high={threshold}&low={threshold}&rise={rate}
      //    Returns: [{ id, station, type, severity, title, message, time }]
      alertHighThreshold: 50,
      alertLowThreshold: 0.5,
      alertRiseRate: 5,
      alertsLoading: false,
      alertsData: [],
    }
  },

  computed: {
    mapDashboardRef() {
      return this.$refs.mapDashboard
    },
    catchmentTreeRef() {
      return this.$refs.catchmentTree
    },
    showSidebar() {
      return ['pulse', 'explorer', 'statistics', 'alerts'].includes(this.activeTab)
    },
    sortedPulseStations() {
      const stations = [...this.pulseData.stations]
      switch (this.pulseSortBy) {
        case 'discharge':
          return stations.sort((a, b) => parseFloat(b.discharge) - parseFloat(a.discharge))
        case 'trend':
          const order = { rising: 0, stable: 1, falling: 2 }
          return stations.sort((a, b) => (order[a.trend] || 1) - (order[b.trend] || 1))
        case 'updated':
          return stations.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
        default:
          return stations.sort((a, b) => a.id.localeCompare(b.id))
      }
    },
    sortedStatsData() {
      const data = [...this.statsData]
      const key = this.statsSortKey
      return data.sort((a, b) => {
        const va = a[key]
        const vb = b[key]
        let cmp = 0
        if (typeof va === 'string') cmp = va.localeCompare(vb)
        else cmp = va - vb
        return this.statsSortAsc ? cmp : -cmp
      })
    }
  },

  mounted() {
    const self = this

    // Track online status
    window.addEventListener('online', () => { self.isOnline = true })
    window.addEventListener('offline', () => { self.isOnline = false })

    // Load selected WMAs and initialize map when explorer tab is activated
    stateStore.getState(stateStore.keys.selectedWMAs, function (selectedWMAs) {
      if (!selectedWMAs || selectedWMAs.length === 0) {
        return false
      }
      self.selectedWMAs = selectedWMAs
      // Defer map initialization until explorer tab is shown
      self._wmasLoaded = true
      // Now that WMAs are loaded, fetch pulse data
      self.refreshPulse()
    })

    // Register event bus listeners
    this.busOn('addStationsToStore', (payload) => {
      if (payload && payload.stations) {
        self.addStationsToStore(payload.stations, payload.chartStoredId)
      }
    })

    // Set default dates for stats
    const now = new Date()
    this.statsEndDate = this.formatDate(now)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    this.statsStartDate = this.formatDate(thirtyDaysAgo)
  },

  watch: {
    pulseTimeWindow() {
      this.refreshPulse()
    },
    activeTab(newTab) {
      if (newTab === 'explorer') {
        this.$nextTick(() => {
          this._initExplorerTab()
        })
      }
      if (newTab === 'spatial') {
        this.$nextTick(() => {
          this._initSpatialTab()
        })
      }
    }
  },

  methods: {
    // ── Theme ──
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('dashboard-theme', this.theme)
    },

    // ── Tab navigation ──
    switchTab(tabId) {
      this.activeTab = tabId
    },

    // ── Explorer tab initialization ──
    _explorerInitialized: false,
    _initExplorerTab() {
      if (this._explorerInitialized) return
      this._explorerInitialized = true

      const self = this

      // Initialize map with WMAs and force resize after layout
      if (self._wmasLoaded && self.mapDashboardRef) {
        setTimeout(() => {
          if (self.mapDashboardRef && self.mapDashboardRef.map) {
            self.mapDashboardRef.map.updateSize()
          }
          self.mapDashboardRef.showSelectedWMA(self.selectedWMAs)
          self.fetchStations()
        }, 300)
      }

      // Initialize date pickers
      this.$nextTick(() => {
        stateStore.getState(stateStore.keys.dateEnd, function (dateEnd) {
          if (!dateEnd) {
            const endDate = new Date()
            let dd = endDate.getDate()
            let mm = endDate.getMonth() + 1
            const yyyy = endDate.getFullYear()
            if (dd < 10) dd = '0' + dd
            if (mm < 10) mm = '0' + mm
            dateEnd = yyyy + '-' + mm + '-' + dd
          }
          const el = document.getElementById('dateEnd')
          if (el) el.setAttribute('value', dateEnd)
        })

        const dateEndEl = document.getElementById('dateEnd')
        if (dateEndEl) {
          dateEndEl.onchange = function () {
            stateStore.setState(stateStore.keys.dateEnd, this.value)
          }
        }

        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 14)
        let dd = startDate.getDate()
        let mm = startDate.getMonth() + 1
        const yyyy = startDate.getFullYear()
        if (dd < 10) dd = '0' + dd
        if (mm < 10) mm = '0' + mm
        const startDateStr = yyyy + '-' + mm + '-' + dd
        const dateStartEl = document.getElementById('dateStart')
        if (dateStartEl) dateStartEl.setAttribute('value', startDateStr)
      })
    },

    // ── Spatial tab initialization ──
    _spatialInitialized: false,
    _initSpatialTab() {
      if (this._spatialInitialized) return
      this._spatialInitialized = true

      const self = this
      this.$nextTick(() => {
        setTimeout(() => {
          if (self.$refs.spatialMap) {
            if (self.$refs.spatialMap.map) {
              self.$refs.spatialMap.map.updateSize()
            }
            if (self.selectedWMAs.length > 0) {
              self.$refs.spatialMap.showSelectedWMA(self.selectedWMAs)
            }
          }
        }, 300)
      })
    },

    // ── Pulse tab methods ──
    refreshPulse() {
      const self = this
      self.pulseLoading = true
      const wma = self.selectedWMAs.length > 0 ? self.selectedWMAs.map(w => `'${w}'`).join(',') : ''
      const url = `${self.apiBase}/station_pulse?wma=${encodeURIComponent(wma)}&window=${self.pulseTimeWindow}`
      axios.get(url)
        .then(response => {
          const d = response.data
          self.pulseData = {
            activeStations: d.activeStations || 0,
            meanDischarge: d.meanDischarge != null ? d.meanDischarge : '\u2014',
            peakFlow: d.peakFlow != null ? d.peakFlow : '\u2014',
            coverage: d.coverage || 0,
            alertCount: d.alertCount || 0,
            stations: (d.stations || []).map(s => ({
              id: s.id,
              place: s.place || '',
              discharge: s.discharge != null ? s.discharge : '\u2014',
              trend: s.trend || 'stable',
              sparkline: self.sparklineToPoints(s.sparkline || []),
              lastUpdated: s.lastUpdated || '\u2014',
              hasAlert: !!s.hasAlert
            }))
          }
        })
        .catch(error => {
          console.error('Pulse fetch error:', error)
        })
        .finally(() => { self.pulseLoading = false })
    },

    sparklineToPoints(arr) {
      if (!Array.isArray(arr) || arr.length === 0) return ''
      const max = Math.max(...arr)
      const min = Math.min(...arr)
      const range = max - min || 1
      const step = 120 / Math.max(arr.length - 1, 1)
      return arr.map((v, i) => {
        const x = Math.round(i * step)
        const y = Math.round(30 - ((v - min) / range) * 28)
        return `${x},${y}`
      }).join(' ')
    },

    trendIcon(trend) {
      if (trend === 'rising') return 'fa fa-arrow-up'
      if (trend === 'falling') return 'fa fa-arrow-down'
      return 'fa fa-minus'
    },

    trendLabel(trend) {
      if (trend === 'rising') return 'Rising'
      if (trend === 'falling') return 'Falling'
      return 'Stable'
    },

    navigateToStation(stationId) {
      // Switch to explorer tab and select this station
      this.activeTab = 'explorer'
    },

    // ── Spatial tab methods ──
    onSpatialStationSelected({ station, feature }) {
      console.log('Spatial station selected:', station)
    },

    // ── Statistics tab methods ──
    fetchStatistics() {
      const self = this
      if (!self.statsStartDate || !self.statsEndDate) return
      self.statsLoading = true
      const wma = self.selectedWMAs.length > 0 ? self.selectedWMAs.map(w => `'${w}'`).join(',') : ''
      const url = `${self.apiBase}/station_statistics?wma=${encodeURIComponent(wma)}&sd=${self.statsStartDate}&ed=${self.statsEndDate}`
      axios.get(url)
        .then(response => {
          self.statsData = Array.isArray(response.data) ? response.data : []
        })
        .catch(error => {
          console.error('Statistics fetch error:', error)
          self.statsData = []
        })
        .finally(() => { self.statsLoading = false })
    },

    sortStats(key) {
      if (this.statsSortKey === key) {
        this.statsSortAsc = !this.statsSortAsc
      } else {
        this.statsSortKey = key
        this.statsSortAsc = true
      }
    },

    // ── Alerts tab methods ──
    fetchAlerts() {
      const self = this
      self.alertsLoading = true
      const wma = self.selectedWMAs.length > 0 ? self.selectedWMAs.map(w => `'${w}'`).join(',') : ''
      const params = [
        `wma=${encodeURIComponent(wma)}`,
        `high=${self.alertHighThreshold}`,
        `low=${self.alertLowThreshold}`,
        `rise=${self.alertRiseRate}`
      ].join('&')
      const url = `${self.apiBase}/station_alerts?${params}`
      axios.get(url)
        .then(response => {
          self.alertsData = Array.isArray(response.data) ? response.data : []
        })
        .catch(error => {
          console.error('Alerts fetch error:', error)
          self.alertsData = []
        })
        .finally(() => { self.alertsLoading = false })
    },

    alertIcon(type) {
      switch (type) {
        case 'high_flow': return 'fa fa-arrow-up'
        case 'low_flow': return 'fa fa-arrow-down'
        case 'rapid_rise': return 'fa fa-bolt'
        case 'missing_data': return 'fa fa-chain-broken'
        case 'data_quality': return 'fa fa-chain-broken'
        case 'sensor_error': return 'fa fa-wrench'
        default: return 'fa fa-exclamation'
      }
    },

    // ── Existing Explorer methods (preserved) ──
    onStationSelectedFromMap({ station, feature }) {
      console.log('Station selected from map:', station)
      this.catchmentTreeRef.toggleNode(station, true)
    },

    onStationDeselectedFromMap({ station, feature }) {
      console.log('Station deselected from map:', station)
      this.catchmentTreeRef.toggleNode(station, false)
    },

    fetchUnverified() {
      const selectedStations = this.mapDashboardRef.getSelectedStations()
      if (selectedStations.length === 0) {
        dialog.showMessageBox(null, {
          type: 'warning',
          message: 'Please select at least one station',
          buttons: ['OK'],
        })
        return
      }
      const dateStartString = $('#dateStart').val()
      const dateEndString = $('#dateEnd').val()
      if (!dateStartString || !dateEndString) {
        dialog.showMessageBox(null, {
          type: 'warning',
          message: 'Missing start date / end date',
          buttons: ['OK'],
        })
        return
      }
      const dateStart = new Date(dateStartString)
      const dateEnd = new Date(dateEndString)
      if (dateStart > dateEnd) {
        dialog.showMessageBox(null, {
          type: 'warning',
          message: 'End date should be after start date',
          buttons: ['OK'],
        })
        return
      }
      const tsChart = document.getElementById('ts').checked
      if (tsChart === true) {
        this.$refs.chartComponent.displayChart(
          selectedStations,
          this.formatDate(dateStart),
          this.formatDate(dateEnd)
        )
      }
      const bxChart = document.getElementById('bx').checked
      if (bxChart === true) {
        this.$refs.boxComponent.displayChart(
          selectedStations,
          this.formatDate(dateStart),
          this.formatDate(dateEnd)
        )
      }
      const fdcChart = document.getElementById('fdc').checked
      if (fdcChart === true) {
        this.$refs.durationComponent.displayChart(
          selectedStations,
          this.formatDate(dateStart),
          this.formatDate(dateEnd)
        )
      }
      this.$refs.stationComponent.displayChart(
        selectedStations,
        this.formatDate(dateStart),
        this.formatDate(dateEnd)
      )
    },

    async fetchStations() {
      const self = this
      let wmaNames = Object.assign([], self.selectedWMAs)

      const userDataPath = await window.electronAPI.getUserDataPath()
      const stationsDir = `${userDataPath}/stations`

      if (this.stationsRequest) {
        this.stationsRequest.cancel('Canceling stations request')
        this.stationsRequest = null
      }

      wmaNames = wmaNames.sort()
      for (let i = 0; i < wmaNames.length; i++) {
        wmaNames[i] = `'${wmaNames[i]}'`
      }
      const url = `${self.stationsApi}?wma=${wmaNames.join()}`
      console.log(url)

      const urlHash = url.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      const stationFile = `${stationsDir}/${Math.abs(urlHash)}.json`

      if (navigator.onLine) {
        let cancelToken = null
        if (self.stationsRequest) {
          cancelToken = self.stationsRequest.token
        }
        axios
          .get(url, { cancelToken: cancelToken })
          .then(async (response) => {
            self.mapDashboardRef.loadStationsToMap(response.data)
            self.createCatchmentTree(response.data)
            try {
              const jsonData = JSON.stringify(response.data)
              const buffer = new TextEncoder().encode(jsonData)
              await window.electronAPI.writeFile(stationFile, buffer)
            } catch (err) {
              console.warn('Could not cache stations data:', err)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        try {
          const exists = await window.electronAPI.fileExists(stationFile)
          if (exists) {
            const buffer = await window.electronAPI.readFile(stationFile)
            const jsonData = new TextDecoder().decode(buffer)
            const stationsData = JSON.parse(jsonData)
            self.mapDashboardRef.loadStationsToMap(stationsData)
            self.createCatchmentTree(stationsData)
          }
        } catch (err) {
          console.warn('Could not load cached stations:', err)
        }
      }
    },

    addStationsToStore(stations, chartStoredId) {
      const self = this
      stateStore.getState(
        stateStore.keys.selectedStations,
        function (selectedStations) {
          if (!selectedStations || typeof selectedStations === 'undefined') {
            selectedStations = {}
          }
          for (let i = 0; i < stations.length; i++) {
            if (!selectedStations[stations[i]]) {
              selectedStations[stations[i]] = {
                feature: self.stationsFeatures[stations[i]],
                stationCoord: self.stationsCoordinates[stations[i]],
                chartStored: [chartStoredId],
              }
            } else {
              if (
                selectedStations[stations[i]]['chartStored'].indexOf(
                  chartStoredId
                ) < 0
              ) {
                selectedStations[stations[i]]['chartStored'].push(chartStoredId)
              }
            }
          }
          stateStore.setState(
            stateStore.keys.selectedStations,
            selectedStations
          )
        }
      )
    },

    generateTreeData(dictionary) {
      const treeData = []
      const self = this
      $.each(dictionary, function (key, catchment) {
        let hasChildren = false
        if (typeof catchment === 'object' || catchment instanceof Array) {
          hasChildren = true
        }
        const c = {
          text: hasChildren ? key : catchment,
          id: hasChildren ? key : catchment,
          type: hasChildren ? 'layer' : 'station',
        }
        if (hasChildren) {
          c['children'] = self.generateTreeData(catchment)
        }
        treeData.push(c)
      })
      return treeData
    },

    createCatchmentTree(stationsData) {
      const self = this
      const catchmentsData = self.mapDashboardRef.getCatchmentsData()
      for (let i = 0; i < stationsData.features.length; i++) {
        const secondary = stationsData.features[i]['properties']['secondary']
        const station = stationsData.features[i]['properties']['station']
        const place = stationsData.features[i]['properties']['place']
        const latestReading = stationsData.features[i]['properties']['latest']
        this.stationsFeatures[station] = stationsData.features[i]
        this.stationsCoordinates[station] =
          stationsData.features[i].geometry.coordinates
        if (catchmentsData.hasOwnProperty(secondary)) {
          let stationName = ''
          if (latestReading != null) {
            stationName =
              station +
              ': ' +
              place +
              ': ' +
              latestReading.toString().slice(0, 10)
          } else {
            stationName = 'Problem with Station'
          }
          catchmentsData[secondary].push(stationName)
          catchmentsData[secondary].sort()
        }
      }
      const treeData = self.generateTreeData(catchmentsData)
      this.catchmentTreeRef.createTree(
        treeData,
        this._onCatchmentTreeSelectedCallback,
        this._onTreeReadyCallback
      )
    },

    _onTreeReadyCallback(event, data) {
      const self = this
      stateStore.getState(
        stateStore.keys.selectedCatchments,
        function (selectedCatchments) {
          if (!selectedCatchments) {
            return false
          }
          self.catchmentTreeRef.toggleMultipleNodes(selectedCatchments, true)
        }
      )
    },

    _onCatchmentTreeSelectedCallback(event, data) {
      this._handleTreeSelection(event, data)
    },

    onTreeReady({ event, data }) {
      this._onTreeReadyCallback(event, data)
    },

    onCatchmentTreeSelectedHandler({ event, data }) {
      this._handleTreeSelection(event, data)
    },

    _handleTreeSelection(event, data) {
      let selected = ''
      const selectedCatchments = []
      const _selectedStations = []
      let selectedBits = []
      const _unselectedStations = Object.assign([], this.selectedStations)

      for (let i = 0; i < data.selected.length; i++) {
        selected = data.instance.get_node(data.selected[i]).text
        selectedBits = selected.split(':')
        const type = data.instance.get_node(data.selected[i]).type
        if (type === 'layer') {
          selectedCatchments.push(selectedBits[0])
        } else if (type === 'station') {
          _selectedStations.push(selectedBits[0])
          if (_unselectedStations.indexOf(selectedBits[0]) !== -1) {
            _unselectedStations.splice(
              _unselectedStations.indexOf(selectedBits[0]),
              1
            )
          }
        }
      }

      this.mapDashboardRef.toggleSelectedStationsByStationNames(
        _selectedStations,
        _unselectedStations
      )
      this.selectedStations = _selectedStations
      stateStore.setState(
        stateStore.keys.selectedCatchments,
        this.selectedStations
      )
      this.mapDashboardRef.selectCatchments(selectedCatchments)
    },
  },
}
</script>
