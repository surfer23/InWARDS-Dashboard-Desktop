<template>
  <div class="registry-container">
    <!-- Tab Toggle: Fish / Probes -->
    <div class="type-toggle">
      <button :class="['toggle-btn', { active: viewType === 'fish' }]" @click="switchType('fish')">
        <i class="fa fa-podcast"></i> Fish
      </button>
      <button :class="['toggle-btn', { active: viewType === 'probe' }]" @click="switchType('probe')">
        <i class="fa fa-thermometer-half"></i> Probes
      </button>
    </div>

    <div class="registry-body">
      <!-- Records Table -->
      <div class="table-panel">
        <div class="table-controls">
          <div class="search-box">
            <i class="fa fa-search"></i>
            <input v-model="searchQuery" placeholder="Search records..." class="search-input" />
          </div>
          <div class="record-count">{{ filteredRecords.length }} records</div>
        </div>

        <div class="table-scroll">
          <table class="registry-table">
            <thead>
              <tr>
                <th @click="sortBy('project_fish_id')">ID <i :class="sortIcon('project_fish_id')"></i></th>
                <th @click="sortBy('species')" v-if="viewType === 'fish'">Species <i :class="sortIcon('species')"></i></th>
                <th @click="sortBy('river')">River <i :class="sortIcon('river')"></i></th>
                <th @click="sortBy('active')">Status <i :class="sortIcon('active')"></i></th>
                <th @click="sortBy('days_tracked')">Days <i :class="sortIcon('days_tracked')"></i></th>
                <th @click="sortBy('no_data_points')">Data Pts <i :class="sortIcon('no_data_points')"></i></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rec in filteredRecords" :key="rec.ciduid"
                :class="{ selected: selectedRecord && selectedRecord.ciduid === rec.ciduid }"
                @click="selectRecord(rec)">
                <td class="id-cell">{{ rec.project_fish_id || rec.ciduid }}</td>
                <td v-if="viewType === 'fish'" class="species-cell">{{ rec.species || '-' }}</td>
                <td>{{ rec.river }}</td>
                <td>
                  <span class="status-badge" :class="rec.active ? 'active' : 'inactive'">
                    {{ rec.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="num-cell">{{ rec.days_tracked }}</td>
                <td class="num-cell">{{ (rec.no_data_points || 0).toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detail Panel -->
      <div class="detail-panel" v-if="selectedRecord">
        <div class="detail-header">
          <h3 class="detail-name">{{ selectedRecord.project_fish_id || selectedRecord.ciduid }}</h3>
          <span class="status-badge" :class="selectedRecord.active ? 'active' : 'inactive'">
            {{ selectedRecord.active ? 'Active' : 'Inactive' }}
          </span>
        </div>

        <!-- Info Grid -->
        <div class="info-grid">
          <div class="info-item" v-if="selectedRecord.species">
            <span class="info-label">Species</span>
            <span class="info-value italic">{{ selectedRecord.species }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Project</span>
            <span class="info-value">{{ selectedRecord.project }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">River</span>
            <span class="info-value">{{ selectedRecord.river }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Location</span>
            <span class="info-value">{{ selectedRecord.nearest_location }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">CID:UID</span>
            <span class="info-value mono">{{ selectedRecord.ciduid }}</span>
          </div>
          <div class="info-item" v-if="selectedRecord.sl_mm">
            <span class="info-label">Size</span>
            <span class="info-value">{{ selectedRecord.sl_mm }} mm / {{ selectedRecord.weight_g }} g</span>
          </div>
        </div>

        <!-- Tracking Period Bar -->
        <div class="tracking-section">
          <div class="info-label">Tracking Period</div>
          <div class="tracking-bar-wrap">
            <div class="tracking-bar">
              <div class="tracking-fill" :style="{ width: trackingPercent + '%' }"></div>
            </div>
            <div class="tracking-dates">
              <span>{{ selectedRecord.start }}</span>
              <span>{{ selectedRecord.days_tracked }} days</span>
              <span>{{ selectedRecord.end || 'ongoing' }}</span>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-row">
          <div class="stat-box">
            <div class="stat-number">{{ (selectedRecord.no_data_points || 0).toLocaleString() }}</div>
            <div class="stat-label">Data Points</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">{{ selectedRecord.days_tracked }}</div>
            <div class="stat-label">Days Tracked</div>
          </div>
        </div>

        <!-- Quick Jump -->
        <div class="quick-jump">
          <div class="info-label">Quick Jump</div>
          <div class="jump-btns">
            <button class="jump-btn" @click="jumpToTab('tracker')">
              <i class="fa fa-map"></i> Tracker
            </button>
            <button class="jump-btn" @click="jumpToTab('alarms')">
              <i class="fa fa-bell"></i> Alarms
            </button>
            <button class="jump-btn" @click="jumpToTab('environment')">
              <i class="fa fa-thermometer-half"></i> Environment
            </button>
          </div>
        </div>

        <!-- Mini Map -->
        <div class="mini-map-section" v-if="selectedRecord.x && selectedRecord.y">
          <div class="info-label">Location</div>
          <div class="coords">
            {{ Math.abs(selectedRecord.x).toFixed(4) }}°S, {{ selectedRecord.y.toFixed(4) }}°E
          </div>
        </div>
      </div>

      <!-- Empty Detail State -->
      <div class="detail-panel empty" v-else>
        <div class="empty-state">
          <i class="fa fa-hand-pointer-o"></i>
          <span>Select a record to view details</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useFishtracStore } from '../../store/fishtracStore'

export default {
  name: 'FishtracRegistry',

  setup() {
    const store = useFishtracStore()
    return { store }
  },

  data() {
    return {
      viewType: 'fish',
      searchQuery: '',
      sortField: 'project_fish_id',
      sortDir: 'asc',
      selectedRecord: null
    }
  },

  computed: {
    filteredRecords() {
      let records = this.store.records.filter(r => r.fish_wq === this.viewType)

      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        records = records.filter(r =>
          (r.project_fish_id || '').toLowerCase().includes(q) ||
          (r.species || '').toLowerCase().includes(q) ||
          (r.river || '').toLowerCase().includes(q) ||
          (r.nearest_location || '').toLowerCase().includes(q)
        )
      }

      return records.sort((a, b) => {
        const aVal = a[this.sortField]
        const bVal = b[this.sortField]
        const dir = this.sortDir === 'asc' ? 1 : -1
        if (typeof aVal === 'number') return (aVal - bVal) * dir
        return String(aVal || '').localeCompare(String(bVal || '')) * dir
      })
    },

    trackingPercent() {
      if (!this.selectedRecord) return 0
      const maxDays = Math.max(...this.store.records.map(r => r.days_tracked || 0), 1)
      return Math.min(100, (this.selectedRecord.days_tracked / maxDays) * 100)
    }
  },

  mounted() {
    this.store.fetchRecords(null)
  },

  methods: {
    switchType(type) {
      this.viewType = type
      this.selectedRecord = null
    },

    sortBy(field) {
      if (this.sortField === field) {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortDir = 'asc'
      }
    },

    sortIcon(field) {
      if (this.sortField !== field) return 'fa fa-sort'
      return this.sortDir === 'asc' ? 'fa fa-sort-asc' : 'fa fa-sort-desc'
    },

    selectRecord(rec) {
      this.selectedRecord = rec
    },

    jumpToTab(tab) {
      if (this.selectedRecord) {
        this.store.selectedFish = [this.selectedRecord.ciduid]
      }
      this.store.activeTab = tab
    }
  }
}
</script>

<style scoped>
.registry-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.type-toggle {
  display: flex;
  gap: 2px;
  background: var(--ft-bg-surface);
  border-radius: 6px;
  padding: 3px;
  width: fit-content;
}

.toggle-btn {
  padding: 8px 20px;
  border: none;
  background: transparent;
  color: var(--ft-text-muted);
  font-size: 13px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s;
  font-family: inherit;
}

.toggle-btn:hover { color: var(--ft-text-secondary); }

.toggle-btn.active {
  background: var(--ft-accent);
  color: var(--ft-text-on-accent);
}

.toggle-btn i { margin-right: 6px; }

.registry-body {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 16px;
  flex: 1;
  min-height: 0;
}

/* Table Panel */
.table-panel {
  background: var(--ft-bg-surface);
  border: 1px solid var(--ft-border);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid var(--ft-border);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--ft-bg-deepest);
  border: 1px solid var(--ft-border);
  border-radius: 4px;
  padding: 6px 10px;
}

.search-box i { color: var(--ft-text-muted); font-size: 12px; }

.search-input {
  border: none;
  background: none;
  color: var(--ft-text-secondary);
  font-size: 12px;
  outline: none;
  width: 180px;
  font-family: inherit;
}

.record-count {
  font-size: 11px;
  color: var(--ft-text-muted);
}

.table-scroll {
  flex: 1;
  overflow-y: auto;
}

.registry-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.registry-table th {
  position: sticky;
  top: 0;
  background: var(--ft-bg-surface);
  text-align: left;
  padding: 8px 10px;
  color: var(--ft-text-muted);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--ft-border);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.registry-table th:hover { color: var(--ft-text-secondary); }
.registry-table th i { margin-left: 4px; font-size: 10px; }

.registry-table td {
  padding: 8px 10px;
  color: var(--ft-text-secondary);
  border-bottom: 1px solid var(--ft-bg-elevated);
}

.registry-table tr { cursor: pointer; transition: background 0.1s; }
.registry-table tr:hover { background: var(--ft-row-hover); }
.registry-table tr.selected { background: var(--ft-accent-subtle); }

.id-cell { font-weight: 600; color: var(--ft-text-primary); }
.species-cell { font-style: italic; color: #4EC9B0; }
.num-cell { font-variant-numeric: tabular-nums; text-align: right; }

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active { background: rgba(78,201,176,0.15); color: #4EC9B0; }
.status-badge.inactive { background: rgba(128,128,128,0.15); color: var(--ft-text-muted); }

/* Detail Panel */
.detail-panel {
  background: var(--ft-bg-surface);
  border: 1px solid var(--ft-border);
  border-radius: 6px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.detail-panel.empty {
  align-items: center;
  justify-content: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--ft-text-muted);
  font-size: 13px;
}

.empty-state i { font-size: 24px; }

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--ft-text-primary);
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 10px;
  color: var(--ft-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.info-value {
  font-size: 13px;
  color: var(--ft-text-secondary);
}

.info-value.italic { font-style: italic; color: #4EC9B0; }
.info-value.mono { font-family: 'Consolas', monospace; font-size: 12px; }

/* Tracking Bar */
.tracking-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tracking-bar-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tracking-bar {
  height: 6px;
  background: var(--ft-bg-deepest);
  border-radius: 3px;
  overflow: hidden;
}

.tracking-fill {
  height: 100%;
  background: linear-gradient(to right, #007ACC, #4EC9B0);
  border-radius: 3px;
  transition: width 0.5s;
}

.tracking-dates {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--ft-text-muted);
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stat-box {
  background: var(--ft-bg-deepest);
  border-radius: 4px;
  padding: 10px;
  text-align: center;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: var(--ft-text-primary);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 10px;
  color: var(--ft-text-muted);
  margin-top: 2px;
}

/* Quick Jump */
.quick-jump {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.jump-btns {
  display: flex;
  gap: 6px;
}

.jump-btn {
  flex: 1;
  padding: 6px;
  border: 1px solid var(--ft-border);
  background: transparent;
  color: var(--ft-text-muted);
  font-size: 11px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.jump-btn:hover {
  color: var(--ft-accent);
  border-color: var(--ft-accent);
}

.jump-btn i { margin-right: 4px; }

.coords {
  font-size: 12px;
  color: #4EC9B0;
  font-family: 'Consolas', monospace;
}
</style>
