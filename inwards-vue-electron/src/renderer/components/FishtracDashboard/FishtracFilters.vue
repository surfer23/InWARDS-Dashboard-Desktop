<template>
  <div class="fishtrac-filters">
    <div class="filters-header">
      <i class="fa fa-sliders"></i>
      <span>Filters</span>
    </div>

    <!-- River Selection (all tabs) -->
    <div class="filter-group">
      <label class="filter-label">River</label>
      <select v-model="store.selectedRiver" class="filter-select" @change="onRiverChange">
        <option v-for="river in store.rivers" :key="river" :value="river">{{ river }}</option>
      </select>
    </div>

    <!-- Fish Selection (alarms, environment, research) -->
    <div class="filter-group" v-if="showFishFilter">
      <label class="filter-label">Fish</label>
      <select v-model="localFish" class="filter-select" @change="onFishChange">
        <option value="">All Fish</option>
        <option v-for="f in store.fishList" :key="f.ciduid" :value="f.ciduid">
          {{ f.name }}
        </option>
      </select>
    </div>

    <!-- Probe Selection (environment) -->
    <div class="filter-group" v-if="activeTab === 'environment'">
      <label class="filter-label">Probe</label>
      <select v-model="store.selectedProbe" class="filter-select">
        <option v-for="p in store.probeList" :key="p.ciduid" :value="p.ciduid">
          {{ p.name }}
        </option>
      </select>
    </div>

    <!-- Date Range -->
    <div v-if="showDateRange" class="filter-group">
      <label class="filter-label">Date Range</label>
      <div class="date-inputs">
        <input type="date" v-model="store.startDate" class="filter-input" />
        <span class="date-sep">to</span>
        <input type="date" v-model="store.endDate" class="filter-input" />
      </div>
    </div>

    <!-- Live Toggle (pulse) -->
    <div class="filter-group" v-if="activeTab === 'pulse'">
      <label class="toggle-label">
        <input type="checkbox" v-model="store.isLive" class="toggle-checkbox" />
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span class="toggle-text">Live Updates</span>
      </label>
    </div>

    <!-- Apply Button -->
    <button class="apply-btn" @click="applyFilters">
      <i class="fa fa-refresh"></i> Apply
    </button>
  </div>
</template>

<script>
import { useFishtracStore } from '../../store/fishtracStore'

export default {
  name: 'FishtracFilters',

  props: {
    activeTab: {
      type: String,
      default: 'pulse'
    }
  },

  setup() {
    const store = useFishtracStore()
    return { store }
  },

  data() {
    return {
      localFish: ''
    }
  },

  computed: {
    showFishFilter() {
      return ['alarms', 'environment', 'research'].includes(this.activeTab)
    },
    showDateRange() {
      return ['alarms', 'environment', 'research'].includes(this.activeTab)
    }
  },

  methods: {
    onRiverChange() {
      this.store.fetchFishList(this.store.selectedRiver)
      this.store.fetchProbeList(this.store.selectedRiver)
    },
    onFishChange() {
      if (this.localFish) {
        this.store.selectedFish = [this.localFish]
      } else {
        this.store.selectedFish = []
      }
    },
    applyFilters() {
      const tab = this.activeTab
      if (tab === 'pulse') {
        this.store.fetchPulseData()
        this.store.fetchSparklines(this.store.selectedRiver)
      } else if (tab === 'alarms') {
        const fish = this.localFish || null
        this.store.fetchAlarmHeatmap(fish, this.store.startDate, this.store.endDate)
        this.store.fetchEwmaDetail(fish, this.store.startDate, this.store.endDate)
        this.store.fetchAlarmSummary(this.store.selectedRiver)
      } else if (tab === 'environment') {
        this.store.fetchEnvTimeseries(this.localFish, this.store.selectedProbe, this.store.startDate, this.store.endDate)
        this.store.fetchCorrelation(this.localFish, 'temperature', this.store.startDate, this.store.endDate)
        this.store.fetchDielPattern(this.localFish, this.store.selectedRiver)
      } else if (tab === 'research') {
        this.store.fetchPhdMultivariate(this.localFish || 'all')
        this.store.fetchPhdBoxplot('fish', 'APM')
        this.store.fetchPhdTaggingResponse(this.localFish)
      }
    }
  }
}
</script>

<style scoped>
.fishtrac-filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.filters-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ft-text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--ft-border);
}

.filters-header i {
  color: var(--ft-accent);
  font-size: 14px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 11px;
  color: var(--ft-text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select,
.filter-input {
  padding: 8px 10px;
  border: 1px solid var(--ft-border);
  border-radius: 4px;
  font-size: 13px;
  color: var(--ft-text-secondary);
  background: var(--ft-bg-deepest);
  transition: border-color 0.15s;
  outline: none;
  font-family: inherit;
}

.filter-select:focus,
.filter-input:focus {
  border-color: var(--ft-accent);
}

.filter-select option {
  background: var(--ft-bg-deepest);
  color: var(--ft-text-secondary);
}

.date-inputs {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.date-sep {
  font-size: 11px;
  color: var(--ft-text-muted);
  text-align: center;
}

/* Toggle Switch */
.toggle-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 10px;
}

.toggle-checkbox {
  display: none;
}

.toggle-track {
  position: relative;
  width: 36px;
  height: 20px;
  background: var(--ft-border);
  border-radius: 10px;
  transition: background 0.2s;
  flex-shrink: 0;
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: var(--ft-text-muted);
  border-radius: 50%;
  transition: transform 0.2s, background 0.2s;
}

.toggle-checkbox:checked + .toggle-track {
  background: var(--ft-accent);
}

.toggle-checkbox:checked + .toggle-track .toggle-thumb {
  transform: translateX(16px);
  background: var(--ft-text-on-accent);
}

.toggle-text {
  font-size: 13px;
  color: var(--ft-text-secondary);
}

/* Apply Button */
.apply-btn {
  width: 100%;
  padding: 10px;
  background: var(--ft-accent);
  color: var(--ft-text-on-accent);
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 8px;
  font-family: inherit;
}

.apply-btn:hover {
  background: var(--ft-accent-hover);
}

.apply-btn i {
  margin-right: 6px;
}
</style>
