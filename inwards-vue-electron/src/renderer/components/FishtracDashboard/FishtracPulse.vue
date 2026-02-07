<template>
  <div class="pulse-container">
    <!-- KPI Row -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-icon fish"><i class="fa fa-podcast"></i></div>
        <div class="kpi-body">
          <div class="kpi-value">{{ store.pulseData.activeFish }}</div>
          <div class="kpi-label">Active Fish</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon probe"><i class="fa fa-thermometer-half"></i></div>
        <div class="kpi-body">
          <div class="kpi-value">{{ store.pulseData.activeProbes }}</div>
          <div class="kpi-label">Active Probes</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon alarm"><i class="fa fa-bell"></i></div>
        <div class="kpi-body">
          <div class="kpi-value">{{ store.pulseData.recentAlarms }}</div>
          <div class="kpi-label">Alarms (24h)</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon time"><i class="fa fa-clock-o"></i></div>
        <div class="kpi-body">
          <div class="kpi-value kpi-time">{{ formatTime(store.pulseData.latestData) }}</div>
          <div class="kpi-label">Latest Data</div>
        </div>
      </div>
    </div>

    <!-- River Health Cards -->
    <div class="section-header">
      <i class="fa fa-tint"></i>
      <span>River Health</span>
    </div>
    <div class="river-cards">
      <div class="river-card" v-for="river in store.pulseData.riverSummaries" :key="river.river"
        :class="{ selected: river.river === store.selectedRiver }"
        @click="store.selectedRiver = river.river">
        <div class="river-name">
          <span class="river-dot" :class="riverStatus(river)"></span>
          {{ river.river }}
        </div>
        <div class="river-stats">
          <div class="stat">
            <span class="stat-icon"><i class="fa fa-podcast"></i></span>
            <span class="stat-val">{{ river.fish_count }}</span>
            <span class="stat-unit">fish</span>
          </div>
          <div class="stat">
            <span class="stat-icon"><i class="fa fa-bell"></i></span>
            <span class="stat-val" :class="{ 'alarm-hot': river.alarm_count > 5 }">{{ river.alarm_count }}</span>
            <span class="stat-unit">alarms</span>
          </div>
        </div>
        <div class="river-gauges">
          <div class="gauge">
            <div class="gauge-label">Temp</div>
            <div class="gauge-bar">
              <div class="gauge-fill temp" :style="{ width: tempPercent(river.temperature) + '%' }"></div>
            </div>
            <div class="gauge-value">{{ river.temperature }}°C</div>
          </div>
          <div class="gauge">
            <div class="gauge-label">Cond</div>
            <div class="gauge-bar">
              <div class="gauge-fill cond" :style="{ width: condPercent(river.conductivity) + '%' }"></div>
            </div>
            <div class="gauge-value">{{ river.conductivity }} µS</div>
          </div>
          <div class="gauge">
            <div class="gauge-label">Depth</div>
            <div class="gauge-bar">
              <div class="gauge-fill depth" :style="{ width: depthPercent(river.depth) + '%' }"></div>
            </div>
            <div class="gauge-value">{{ river.depth }} m</div>
          </div>
          <div class="gauge">
            <div class="gauge-label">Flow</div>
            <div class="gauge-bar">
              <div class="gauge-fill flow" :style="{ width: flowPercent(river.discharge) + '%' }"></div>
            </div>
            <div class="gauge-value">{{ river.discharge }} m³/s</div>
          </div>
        </div>
        <div class="river-activity">
          <span class="activity-label">Avg Activity</span>
          <span class="activity-value">{{ river.avg_apm }} APM</span>
        </div>
      </div>
    </div>

    <!-- Sparklines -->
    <div class="section-header">
      <i class="fa fa-area-chart"></i>
      <span>24h Activity ({{ store.selectedRiver }})</span>
    </div>
    <div class="sparkline-grid">
      <div class="sparkline-card" v-for="(data, name) in store.sparklineData" :key="name">
        <div class="sparkline-name">{{ name }}</div>
        <div class="sparkline-chart" ref="sparklines">
          <svg :viewBox="'0 0 200 40'" preserveAspectRatio="none" class="spark-svg">
            <polyline
              :points="sparkPoints(data)"
              fill="none"
              stroke="#007ACC"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
            <polyline
              :points="sparkPoints(data)"
              fill="url(#sparkGrad)"
              stroke="none"
            />
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(0,122,204,0.3)" />
                <stop offset="100%" stop-color="rgba(0,122,204,0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="sparkline-stats">
          <span class="spark-stat">Peak: {{ sparkPeak(data) }}</span>
          <span class="spark-stat">Avg: {{ sparkAvg(data) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useFishtracStore } from '../../store/fishtracStore'

export default {
  name: 'FishtracPulse',

  setup() {
    const store = useFishtracStore()
    return { store }
  },

  mounted() {
    if (Object.keys(this.store.sparklineData).length === 0) {
      this.store.fetchSparklines(this.store.selectedRiver)
    }
  },

  methods: {
    formatTime(ts) {
      if (!ts) return '--'
      const d = new Date(ts)
      return d.toLocaleString('en-ZA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    },

    riverStatus(river) {
      if (river.fish_count === 0) return 'offline'
      if (river.alarm_count > 5) return 'warning'
      return 'healthy'
    },

    tempPercent(v) { return Math.min(100, (v / 35) * 100) },
    condPercent(v) { return Math.min(100, (v / 300) * 100) },
    depthPercent(v) { return Math.min(100, (v / 3) * 100) },
    flowPercent(v) { return Math.min(100, (v / 80) * 100) },

    sparkPoints(data) {
      if (!data || !data.length) return ''
      const maxVal = Math.max(...data.map(d => d.apm), 1)
      return data.map((d, i) => {
        const x = (i / (data.length - 1)) * 200
        const y = 40 - (d.apm / maxVal) * 36
        return `${x},${y}`
      }).join(' ')
    },

    sparkPeak(data) {
      if (!data || !data.length) return 0
      return Math.max(...data.map(d => d.apm))
    },

    sparkAvg(data) {
      if (!data || !data.length) return 0
      const sum = data.reduce((a, d) => a + d.apm, 0)
      return Math.round(sum / data.length)
    }
  }
}
</script>

<style scoped>
.pulse-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ─── KPI Row ─── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--ft-bg-surface);
  border: 1px solid var(--ft-border);
  border-radius: 6px;
}

.kpi-icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.kpi-icon.fish { background: rgba(0,122,204,0.15); color: #007ACC; }
.kpi-icon.probe { background: rgba(78,201,176,0.15); color: #4EC9B0; }
.kpi-icon.alarm { background: rgba(206,145,120,0.15); color: #CE9178; }
.kpi-icon.time { background: rgba(220,220,170,0.15); color: #DCDCAA; }

.kpi-body {
  display: flex;
  flex-direction: column;
}

.kpi-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--ft-text-primary);
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.kpi-value.kpi-time {
  font-size: 14px;
  font-weight: 600;
}

.kpi-label {
  font-size: 11px;
  color: var(--ft-text-muted);
  margin-top: 2px;
}

/* ─── Section Header ─── */
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ft-text-secondary);
}

.section-header i {
  color: var(--ft-accent);
}

/* ─── River Cards ─── */
.river-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.river-card {
  background: var(--ft-bg-surface);
  border: 1px solid var(--ft-border);
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.river-card:hover {
  border-color: var(--ft-border-hover);
}

.river-card.selected {
  border-color: var(--ft-accent);
  background: var(--ft-accent-subtle);
}

.river-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--ft-text-primary);
  margin-bottom: 12px;
}

.river-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.river-dot.healthy { background: #4EC9B0; box-shadow: 0 0 6px rgba(78,201,176,0.5); }
.river-dot.warning { background: #CE9178; box-shadow: 0 0 6px rgba(206,145,120,0.5); }
.river-dot.offline { background: var(--ft-border-hover); }

.river-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 14px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-icon {
  font-size: 11px;
  color: var(--ft-text-muted);
}

.stat-val {
  font-size: 16px;
  font-weight: 600;
  color: var(--ft-text-secondary);
  font-variant-numeric: tabular-nums;
}

.stat-val.alarm-hot {
  color: #CE9178;
}

.stat-unit {
  font-size: 11px;
  color: var(--ft-text-muted);
}

/* Gauges */
.river-gauges {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gauge {
  display: grid;
  grid-template-columns: 40px 1fr 70px;
  align-items: center;
  gap: 8px;
}

.gauge-label {
  font-size: 11px;
  color: var(--ft-text-muted);
}

.gauge-bar {
  height: 4px;
  background: var(--ft-bg-deepest);
  border-radius: 2px;
  overflow: hidden;
}

.gauge-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.gauge-fill.temp { background: linear-gradient(to right, #264F78, #CE9178); }
.gauge-fill.cond { background: linear-gradient(to right, #264F78, #DCDCAA); }
.gauge-fill.depth { background: linear-gradient(to right, #264F78, #007ACC); }
.gauge-fill.flow { background: linear-gradient(to right, #264F78, #4EC9B0); }

.gauge-value {
  font-size: 11px;
  color: var(--ft-text-secondary);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.river-activity {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--ft-border);
}

.activity-label {
  font-size: 11px;
  color: var(--ft-text-muted);
}

.activity-value {
  font-size: 14px;
  font-weight: 600;
  color: #4EC9B0;
  font-variant-numeric: tabular-nums;
}

/* ─── Sparklines ─── */
.sparkline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.sparkline-card {
  background: var(--ft-bg-surface);
  border: 1px solid var(--ft-border);
  border-radius: 6px;
  padding: 12px;
}

.sparkline-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--ft-text-secondary);
  margin-bottom: 8px;
}

.sparkline-chart {
  height: 40px;
  margin-bottom: 6px;
}

.spark-svg {
  width: 100%;
  height: 100%;
}

.sparkline-stats {
  display: flex;
  justify-content: space-between;
}

.spark-stat {
  font-size: 10px;
  color: var(--ft-text-muted);
  font-variant-numeric: tabular-nums;
}
</style>
