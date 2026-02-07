<template>
  <div class="fishtrac-legend">
    <div class="legend-header">
      <i class="fa fa-map-signs"></i>
      <span>Legend</span>
    </div>

    <!-- Station Type Markers -->
    <div class="legend-section">
      <div class="section-title">Station Types</div>
      <div class="marker-item">
        <span class="marker-ring relay"></span>
        <span class="marker-label">Relay Station</span>
      </div>
      <div class="marker-item">
        <span class="marker-ring base"></span>
        <span class="marker-label">Base Station</span>
      </div>
      <div class="marker-item">
        <span class="marker-ring probe"></span>
        <span class="marker-label">Water Quality Probe</span>
      </div>
    </div>

    <!-- Fish Trail Colors -->
    <div class="legend-section">
      <div class="section-title">Fish Trails</div>
      <div class="trail-item" v-for="(fish, idx) in store.fishList.slice(0, 6)" :key="fish.ciduid">
        <span class="trail-line" :style="{ background: trailColors[idx % trailColors.length] }"></span>
        <span class="marker-label">{{ fish.name }}</span>
      </div>
    </div>

    <!-- Activity Legend -->
    <div class="legend-section">
      <div class="section-title">Activity Level</div>
      <div class="activity-scale">
        <div class="scale-bar">
          <span class="scale-low"></span>
          <span class="scale-mid"></span>
          <span class="scale-high"></span>
        </div>
        <div class="scale-labels">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </div>

    <!-- River Summary -->
    <div class="legend-section" v-if="riverSummary">
      <div class="section-title">{{ store.selectedRiver }} Summary</div>
      <div class="summary-row">
        <span class="summary-label">Temperature</span>
        <span class="summary-value">{{ riverSummary.temperature }}°C</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Conductivity</span>
        <span class="summary-value">{{ riverSummary.conductivity }} µS/cm</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Depth</span>
        <span class="summary-value">{{ riverSummary.depth }} m</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Discharge</span>
        <span class="summary-value">{{ riverSummary.discharge }} m³/s</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useFishtracStore } from '../../store/fishtracStore'

export default {
  name: 'FishtracLegend',

  setup() {
    const store = useFishtracStore()
    return { store }
  },

  data() {
    return {
      trailColors: ['#007ACC', '#4EC9B0', '#CE9178', '#DCDCAA', '#C586C0', '#9CDCFE']
    }
  },

  computed: {
    riverSummary() {
      const summaries = this.store.pulseData?.riverSummaries || []
      return summaries.find(s => s.river === this.store.selectedRiver) || null
    }
  }
}
</script>

<style scoped>
.fishtrac-legend {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
}

.legend-header {
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

.legend-header i {
  color: var(--ft-accent);
  font-size: 14px;
}

.legend-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--ft-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Station Markers */
.marker-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.marker-ring {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid;
}

.marker-ring.relay {
  background: rgba(52, 152, 219, 0.4);
  border-color: #3498db;
}

.marker-ring.base {
  background: rgba(46, 204, 113, 0.4);
  border-color: #2ecc71;
}

.marker-ring.probe {
  background: rgba(155, 89, 182, 0.4);
  border-color: #9b59b6;
}

.marker-label {
  font-size: 12px;
  color: var(--ft-text-secondary);
}

/* Trail Colors */
.trail-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.trail-line {
  width: 20px;
  height: 3px;
  border-radius: 2px;
  flex-shrink: 0;
}

/* Activity Scale */
.activity-scale {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.scale-bar {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.scale-low {
  flex: 1;
  background: linear-gradient(to right, #264F78, #007ACC);
}

.scale-mid {
  flex: 1;
  background: linear-gradient(to right, #007ACC, #4EC9B0);
}

.scale-high {
  flex: 1;
  background: linear-gradient(to right, #4EC9B0, #CE9178);
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--ft-text-muted);
}

/* River Summary */
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.summary-label {
  font-size: 12px;
  color: var(--ft-text-muted);
}

.summary-value {
  font-size: 12px;
  color: #4EC9B0;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
</style>
