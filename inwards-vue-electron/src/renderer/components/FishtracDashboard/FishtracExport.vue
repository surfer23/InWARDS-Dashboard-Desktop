<template>
  <div class="export-container">
    <div class="export-layout">
      <!-- Config Panel -->
      <div class="config-panel">
        <div class="config-header">
          <i class="fa fa-download"></i>
          <span>Export Configuration</span>
        </div>

        <!-- Data Source -->
        <div class="config-group">
          <label class="config-label">Data Source</label>
          <select v-model="selectedTable" class="config-select" @change="updatePreview">
            <option v-for="t in tables" :key="t.key" :value="t.key">{{ t.label }}</option>
          </select>
        </div>

        <!-- River Filter -->
        <div class="config-group">
          <label class="config-label">River</label>
          <select v-model="selectedRiver" class="config-select">
            <option value="">All Rivers</option>
            <option v-for="r in store.rivers" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>

        <!-- Fish Filter -->
        <div class="config-group" v-if="showFishFilter">
          <label class="config-label">Fish</label>
          <select v-model="selectedFishId" class="config-select">
            <option value="">All Fish</option>
            <option v-for="f in store.fishList" :key="f.ciduid" :value="f.ciduid">{{ f.name }}</option>
          </select>
        </div>

        <!-- Date Range -->
        <div class="config-group">
          <label class="config-label">Date Range</label>
          <div class="date-row">
            <input type="date" v-model="dateStart" class="config-input" />
            <span class="date-to">to</span>
            <input type="date" v-model="dateEnd" class="config-input" />
          </div>
        </div>

        <!-- Format -->
        <div class="config-group">
          <label class="config-label">Format</label>
          <div class="format-btns">
            <button :class="['fmt-btn', { active: format === 'csv' }]" @click="format = 'csv'">
              <i class="fa fa-file-text-o"></i> CSV
            </button>
            <button :class="['fmt-btn', { active: format === 'json' }]" @click="format = 'json'">
              <i class="fa fa-code"></i> JSON
            </button>
          </div>
        </div>

        <!-- Row Limit -->
        <div class="config-group">
          <label class="config-label">Row Limit</label>
          <select v-model="rowLimit" class="config-select">
            <option :value="100">100 rows</option>
            <option :value="1000">1,000 rows</option>
            <option :value="5000">5,000 rows</option>
            <option :value="0">All rows</option>
          </select>
        </div>

        <!-- Export Button -->
        <button class="export-btn" @click="doExport">
          <i class="fa fa-download"></i> Download {{ format.toUpperCase() }}
        </button>

        <!-- Table Info -->
        <div class="table-info">
          <div class="info-row">
            <span class="info-key">Table</span>
            <span class="info-val">{{ selectedTableInfo.label }}</span>
          </div>
          <div class="info-row">
            <span class="info-key">Approx Rows</span>
            <span class="info-val">{{ selectedTableInfo.rows.toLocaleString() }}</span>
          </div>
          <div class="info-row">
            <span class="info-key">Description</span>
            <span class="info-val">{{ selectedTableInfo.desc }}</span>
          </div>
        </div>
      </div>

      <!-- Preview Panel -->
      <div class="preview-panel">
        <div class="preview-header">
          <i class="fa fa-eye"></i>
          <span>Preview (first {{ previewRows.length }} rows)</span>
        </div>
        <div class="preview-scroll" v-if="previewRows.length">
          <table class="preview-table">
            <thead>
              <tr>
                <th v-for="col in previewCols" :key="col">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in previewRows" :key="i">
                <td v-for="col in previewCols" :key="col">{{ row[col] != null ? row[col] : '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="preview-empty" v-else>
          <i class="fa fa-database"></i>
          <span>Select a data source and click to generate preview</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useFishtracStore } from '../../store/fishtracStore'

export default {
  name: 'FishtracExport',

  setup() {
    const store = useFishtracStore()
    return { store }
  },

  data() {
    return {
      selectedTable: 'FishActivityLIVE',
      selectedRiver: '',
      selectedFishId: '',
      dateStart: '2024-01-01',
      dateEnd: '2025-12-31',
      format: 'csv',
      rowLimit: 1000,
      previewRows: [],
      previewCols: [],
      tables: [
        { key: 'FishActivityLIVE', label: 'Fish Activity (Live)', rows: 27352, desc: 'Live fish activity telemetry with GPS positions' },
        { key: 'EWMA_alarms', label: 'EWMA Alarms', rows: 9444, desc: 'Behavioral anomaly detection with alarm codes' },
        { key: 'ProbeLive', label: 'Probe Data (Live)', rows: 43797, desc: 'Environmental probe readings' },
        { key: 'Hydro', label: 'Hydrological Data', rows: 9997, desc: 'Water depth and discharge measurements' },
        { key: 'Records', label: 'Master Registry', rows: 108, desc: 'All tagged fish and probes' },
        { key: 'Matt_PhD_Data', label: 'PhD Research Data', rows: 90271, desc: 'Multivariate research dataset with 12+ variables' },
        { key: 'fish_master_view', label: 'Fish Master View', rows: 9444, desc: 'Simplified alarm view per fish' },
        { key: 'probs_master_view', label: 'Probe Master View', rows: 30572, desc: 'Combined probe and hydro data' }
      ]
    }
  },

  computed: {
    selectedTableInfo() {
      return this.tables.find(t => t.key === this.selectedTable) || this.tables[0]
    },
    showFishFilter() {
      return ['FishActivityLIVE', 'EWMA_alarms', 'Matt_PhD_Data', 'fish_master_view'].includes(this.selectedTable)
    }
  },

  mounted() {
    this.generatePreview()
  },

  methods: {
    updatePreview() {
      this.generatePreview()
    },

    generatePreview() {
      const dummy = this.getDummyData()
      if (dummy.length > 0) {
        this.previewCols = Object.keys(dummy[0])
        this.previewRows = dummy.slice(0, 20)
      }
    },

    getDummyData() {
      const key = this.selectedTable
      if (key === 'FishActivityLIVE') {
        return Array.from({ length: 20 }, (_, i) => ({
          Name: i % 2 === 0 ? 'Tag48- 3 Musket' : 'Tag49- Largemouth',
          date_h_rounded: `2024-02-${String(i + 1).padStart(2, '0')} ${String(i % 24).padStart(2, '0')}:00:00`,
          activity_per_minute: Math.round(Math.random() * 200 + 20),
          lat: (-25.119 + Math.random() * 0.01).toFixed(5),
          lng: (31.915 + Math.random() * 0.01).toFixed(5),
          temp_fish: (20 + Math.random() * 5).toFixed(1)
        }))
      } else if (key === 'EWMA_alarms') {
        return Array.from({ length: 20 }, (_, i) => ({
          Name: 'Tag48- 3 Musket',
          date_h_rounded: `2024-02-${String(i + 1).padStart(2, '0')} 12:00:00`,
          apm: Math.round(Math.random() * 150 + 30),
          ewma: (50 + Math.random() * 20).toFixed(1),
          alarm_class_code: Math.floor(Math.random() * 7) - 3,
          alarm_trigger: Math.random() > 0.8 ? 1 : 0
        }))
      } else if (key === 'ProbeLive') {
        return Array.from({ length: 20 }, (_, i) => ({
          Name: 'Tag50- LS Bridge',
          DateTime: `2024-02-${String(i + 1).padStart(2, '0')} 12:00:00`,
          temp_probe: (20 + Math.random() * 4).toFixed(1),
          conductivity_us_cm: (60 + Math.random() * 40).toFixed(1),
          pressure_mbar: (1100 + Math.random() * 20).toFixed(1)
        }))
      } else if (key === 'Records') {
        return this.store.records.length ? this.store.records.slice(0, 20) : [
          { project: 'SANParks Sabie', fish_wq: 'fish', ciduid: '650:48', species: 'L. marequensis', river: 'Sabie', active: 1 }
        ]
      } else {
        return Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          date: `2024-02-${String(i + 1).padStart(2, '0')}`,
          value: (Math.random() * 100).toFixed(2)
        }))
      }
    },

    doExport() {
      const data = this.getDummyData()
      if (!data.length) return

      let content, filename, mimeType

      if (this.format === 'csv') {
        const headers = Object.keys(data[0])
        const rows = data.map(row => headers.map(h => {
          const val = row[h]
          if (typeof val === 'string' && val.includes(',')) return `"${val}"`
          return val
        }).join(','))
        content = [headers.join(','), ...rows].join('\n')
        filename = `${this.selectedTable}_export.csv`
        mimeType = 'text/csv'
      } else {
        content = JSON.stringify(data, null, 2)
        filename = `${this.selectedTable}_export.json`
        mimeType = 'application/json'
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }
  }
}
</script>

<style scoped>
.export-container {
  padding: 20px;
  height: 100%;
}

.export-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 16px;
  height: 100%;
}

/* Config Panel */
.config-panel {
  background: var(--ft-bg-surface);
  border: 1px solid var(--ft-border);
  border-radius: 6px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
}

.config-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ft-text-secondary);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--ft-border);
}

.config-header i { color: var(--ft-accent); }

.config-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.config-label {
  font-size: 11px;
  color: var(--ft-text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.config-select,
.config-input {
  padding: 8px 10px;
  border: 1px solid var(--ft-border);
  border-radius: 4px;
  font-size: 13px;
  color: var(--ft-text-secondary);
  background: var(--ft-bg-deepest);
  outline: none;
  font-family: inherit;
}

.config-select:focus,
.config-input:focus {
  border-color: var(--ft-accent);
}

.config-select option {
  background: var(--ft-bg-deepest);
}

.date-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.date-row .config-input {
  flex: 1;
  min-width: 0;
}

.date-to {
  font-size: 11px;
  color: var(--ft-text-muted);
}

/* Format Buttons */
.format-btns {
  display: flex;
  gap: 6px;
}

.fmt-btn {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--ft-border);
  background: transparent;
  color: var(--ft-text-muted);
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s;
  font-family: inherit;
}

.fmt-btn:hover { color: var(--ft-text-secondary); border-color: var(--ft-border-hover); }

.fmt-btn.active {
  background: var(--ft-accent-subtle);
  border-color: var(--ft-accent);
  color: var(--ft-accent);
}

.fmt-btn i { margin-right: 4px; }

/* Export Button */
.export-btn {
  width: 100%;
  padding: 12px;
  background: var(--ft-accent);
  color: var(--ft-text-on-accent);
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  font-family: inherit;
}

.export-btn:hover { background: var(--ft-accent-hover); }
.export-btn i { margin-right: 6px; }

/* Table Info */
.table-info {
  background: var(--ft-bg-deepest);
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-row {
  display: flex;
  justify-content: space-between;
}

.info-key {
  font-size: 11px;
  color: var(--ft-text-muted);
}

.info-val {
  font-size: 11px;
  color: var(--ft-text-secondary);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* Preview Panel */
.preview-panel {
  background: var(--ft-bg-surface);
  border: 1px solid var(--ft-border);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--ft-border);
  font-size: 13px;
  font-weight: 600;
  color: var(--ft-text-secondary);
  flex-shrink: 0;
}

.preview-header i { color: var(--ft-accent); }

.preview-scroll {
  flex: 1;
  overflow: auto;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.preview-table th {
  position: sticky;
  top: 0;
  background: var(--ft-bg-surface);
  text-align: left;
  padding: 6px 10px;
  color: var(--ft-text-muted);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--ft-border);
  white-space: nowrap;
}

.preview-table td {
  padding: 5px 10px;
  color: var(--ft-text-secondary);
  border-bottom: 1px solid var(--ft-bg-elevated);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.preview-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--ft-text-muted);
  font-size: 13px;
}

.preview-empty i { font-size: 24px; }
</style>
