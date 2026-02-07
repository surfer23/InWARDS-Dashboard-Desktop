<template>
  <div class="env-container">
    <!-- Parameter Selector -->
    <div class="param-bar">
      <span class="param-label">Environment Parameter:</span>
      <button v-for="p in params" :key="p.key"
        :class="['param-btn', { active: selectedParam === p.key }]"
        @click="selectParam(p.key)">
        <i :class="p.icon"></i> {{ p.label }}
      </button>
    </div>

    <!-- Top Row: Correlation Scatter + Diel Pattern -->
    <div class="top-row">
      <!-- Correlation Scatter -->
      <div class="panel flex-2">
        <div class="panel-header">
          <i class="fa fa-dot-circle-o"></i>
          <span>Activity vs {{ selectedParamLabel }}</span>
          <span class="panel-sub">Color by alarm code &bull; Trendline</span>
        </div>
        <div ref="scatterChart" class="chart-area"></div>
      </div>

      <!-- Diel Pattern -->
      <div class="panel flex-1">
        <div class="panel-header">
          <i class="fa fa-sun-o"></i>
          <span>Diel Pattern (24h)</span>
          <span class="panel-sub">Circadian activity cycle</span>
        </div>
        <div ref="dielChart" class="chart-area"></div>
      </div>
    </div>

    <!-- Synchronized Timeseries -->
    <div class="panel">
      <div class="panel-header">
        <i class="fa fa-area-chart"></i>
        <span>Environmental Timeseries</span>
        <span class="panel-sub">Linked zoom &bull; Fish activity + probe readings</span>
      </div>
      <div ref="timeseriesChart" class="chart-area timeseries"></div>
    </div>
  </div>
</template>

<script>
import { useFishtracStore } from '../../store/fishtracStore'
import { useFishtracTheme } from '../../composables/useFishtracTheme'
import Plotly from 'plotly.js-dist'

const ALARM_COLORS = {
  '-3': '#264F78', '-2': '#2C6B9E', '-1': '#3E8CC4',
  '0': '#808080',
  '1': '#CE9178', '2': '#D96C3B', '3': '#E74C3C'
}

export default {
  name: 'FishtracEnvironment',

  setup() {
    const store = useFishtracStore()
    const { plotlyLayout, legendBg, colors } = useFishtracTheme()
    return { store, plotlyLayout, legendBg, colors }
  },

  data() {
    return {
      selectedParam: 'temperature',
      params: [
        { key: 'temperature', label: 'Temperature', icon: 'fa fa-thermometer-half' },
        { key: 'conductivity', label: 'Conductivity', icon: 'fa fa-bolt' },
        { key: 'depth', label: 'Depth', icon: 'fa fa-tint' },
        { key: 'discharge', label: 'Discharge', icon: 'fa fa-exchange' }
      ]
    }
  },

  computed: {
    selectedParamLabel() {
      const p = this.params.find(p => p.key === this.selectedParam)
      return p ? p.label : ''
    }
  },

  mounted() {
    this.store.fetchEnvTimeseries(null, null, this.store.startDate, this.store.endDate)
    this.store.fetchCorrelation(null, this.selectedParam, this.store.startDate, this.store.endDate)
    this.store.fetchDielPattern(null, this.store.selectedRiver)
  },

  watch: {
    'store.correlationData'() { this.renderScatter() },
    'store.envTimeseriesData'() { this.renderTimeseries() },
    'store.dielPatternData'() { this.renderDiel() },
    'store.theme'() { this.relayoutAll() }
  },

  beforeUnmount() {
    if (this.$refs.scatterChart) Plotly.purge(this.$refs.scatterChart)
    if (this.$refs.dielChart) Plotly.purge(this.$refs.dielChart)
    if (this.$refs.timeseriesChart) Plotly.purge(this.$refs.timeseriesChart)
  },

  methods: {
    getLayout(overrides = {}) {
      const base = this.plotlyLayout
      return { ...base, ...overrides }
    },

    getAxisProps() {
      const c = this.colors.plotly
      return { gridcolor: c.gridcolor, zerolinecolor: c.zerolinecolor }
    },

    relayoutAll() {
      const base = this.plotlyLayout
      const ax = this.getAxisProps()
      const themeUpdate = {
        paper_bgcolor: base.paper_bgcolor,
        plot_bgcolor: base.plot_bgcolor,
        font: base.font
      }
      if (this.$refs.scatterChart && this.$refs.scatterChart.data) {
        Plotly.relayout(this.$refs.scatterChart, {
          ...themeUpdate,
          'xaxis.gridcolor': ax.gridcolor, 'xaxis.zerolinecolor': ax.zerolinecolor,
          'yaxis.gridcolor': ax.gridcolor, 'yaxis.zerolinecolor': ax.zerolinecolor,
          'legend.bgcolor': this.legendBg
        })
      }
      if (this.$refs.dielChart && this.$refs.dielChart.data) {
        Plotly.relayout(this.$refs.dielChart, {
          ...themeUpdate,
          'polar.bgcolor': base.plot_bgcolor,
          'polar.radialaxis.gridcolor': ax.gridcolor,
          'polar.radialaxis.linecolor': ax.zerolinecolor,
          'polar.angularaxis.gridcolor': ax.gridcolor,
          'polar.angularaxis.linecolor': ax.zerolinecolor
        })
      }
      if (this.$refs.timeseriesChart && this.$refs.timeseriesChart.data) {
        Plotly.relayout(this.$refs.timeseriesChart, themeUpdate)
      }
    },

    selectParam(key) {
      this.selectedParam = key
      this.store.fetchCorrelation(null, key, this.store.startDate, this.store.endDate)
    },

    renderScatter() {
      const data = this.store.correlationData
      if (!data.length) return

      const colors = data.map(d => ALARM_COLORS[String(d.alarm_class_code)] || '#808080')
      const ax = this.getAxisProps()

      // Simple linear regression
      const n = data.length
      const sumX = data.reduce((a, d) => a + d.env_value, 0)
      const sumY = data.reduce((a, d) => a + d.apm, 0)
      const sumXY = data.reduce((a, d) => a + d.env_value * d.apm, 0)
      const sumX2 = data.reduce((a, d) => a + d.env_value * d.env_value, 0)
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
      const intercept = (sumY - slope * sumX) / n

      const xRange = [Math.min(...data.map(d => d.env_value)), Math.max(...data.map(d => d.env_value))]
      const trendY = xRange.map(x => slope * x + intercept)

      // R-squared
      const meanY = sumY / n
      const ssTotal = data.reduce((a, d) => a + Math.pow(d.apm - meanY, 2), 0)
      const ssResid = data.reduce((a, d) => a + Math.pow(d.apm - (slope * d.env_value + intercept), 2), 0)
      const r2 = (1 - ssResid / ssTotal).toFixed(3)

      const traces = [
        {
          x: data.map(d => d.env_value),
          y: data.map(d => d.apm),
          type: 'scatter',
          mode: 'markers',
          marker: { color: colors, size: 5, opacity: 0.7 },
          name: 'Data Points',
          hovertemplate: `${this.selectedParamLabel}: %{x}<br>Activity: %{y} APM<extra></extra>`
        },
        {
          x: xRange,
          y: trendY,
          type: 'scatter',
          mode: 'lines',
          line: { color: '#4EC9B0', width: 2, dash: 'dash' },
          name: `Trend (R²=${r2})`
        }
      ]

      Plotly.newPlot(this.$refs.scatterChart, traces, this.getLayout({
        xaxis: { title: this.selectedParamLabel, ...ax },
        yaxis: { title: 'Activity (APM)', ...ax },
        showlegend: true,
        legend: { x: 0.02, y: 0.98, bgcolor: this.legendBg, font: { size: 10 } }
      }), { responsive: true, displayModeBar: false })
    },

    renderDiel() {
      const data = this.store.dielPatternData
      if (!data.length) return

      const grouped = {}
      data.forEach(d => {
        if (!grouped[d.name]) grouped[d.name] = { hours: [], values: [] }
        grouped[d.name].hours.push(d.hour)
        grouped[d.name].values.push(d.avg_apm)
      })

      const dielColors = ['#007ACC', '#4EC9B0', '#CE9178', '#DCDCAA']
      const ax = this.getAxisProps()
      const traces = Object.entries(grouped).map(([name, d], idx) => ({
        type: 'scatterpolar',
        r: d.values,
        theta: d.hours.map(h => h * 15),
        name,
        fill: 'toself',
        fillcolor: dielColors[idx % dielColors.length].replace(')', ',0.1)').replace('rgb', 'rgba'),
        line: { color: dielColors[idx % dielColors.length], width: 2 },
        marker: { size: 3 }
      }))

      Plotly.newPlot(this.$refs.dielChart, traces, this.getLayout({
        polar: {
          bgcolor: this.plotlyLayout.plot_bgcolor,
          radialaxis: {
            gridcolor: ax.gridcolor,
            linecolor: ax.zerolinecolor,
            tickfont: { size: 9, color: this.colors.plotly.font.color }
          },
          angularaxis: {
            gridcolor: ax.gridcolor,
            linecolor: ax.zerolinecolor,
            tickfont: { size: 9, color: this.colors.plotly.font.color },
            tickvals: [0, 90, 180, 270],
            ticktext: ['0h', '6h', '12h', '18h'],
            direction: 'clockwise'
          }
        },
        showlegend: true,
        legend: { x: 0, y: -0.15, orientation: 'h', font: { size: 10 } }
      }), { responsive: true, displayModeBar: false })
    },

    renderTimeseries() {
      const d = this.store.envTimeseriesData
      if (!d.timestamps || !d.timestamps.length) return

      const ts = d.timestamps
      const ax = this.getAxisProps()
      const axisBase = { ...ax, showgrid: false }

      const traces = [
        {
          x: ts, y: d.apm, type: 'bar',
          marker: { color: d.alarm_code.map(c => ALARM_COLORS[String(c)] || '#808080'), opacity: 0.6 },
          name: 'Activity', yaxis: 'y'
        },
        {
          x: ts, y: d.temp_probe, type: 'scatter', mode: 'lines',
          line: { color: '#CE9178', width: 1.5 },
          name: 'Temperature', yaxis: 'y2'
        },
        {
          x: ts, y: d.conductivity, type: 'scatter', mode: 'lines',
          line: { color: '#DCDCAA', width: 1.5 },
          name: 'Conductivity', yaxis: 'y3'
        },
        {
          x: ts, y: d.depth, type: 'scatter', mode: 'lines',
          line: { color: '#007ACC', width: 1.5 },
          name: 'Depth', yaxis: 'y4'
        },
        {
          x: ts, y: d.discharge, type: 'scatter', mode: 'lines',
          line: { color: '#4EC9B0', width: 1.5 },
          name: 'Discharge', yaxis: 'y5'
        }
      ]

      Plotly.newPlot(this.$refs.timeseriesChart, traces, this.getLayout({
        margin: { t: 10, r: 60, b: 40, l: 60 },
        grid: { rows: 5, columns: 1, subplots: [['xy'], ['xy2'], ['xy3'], ['xy4'], ['xy5']], roworder: 'top to bottom' },
        xaxis: { ...axisBase, anchor: 'y' },
        xaxis2: { ...axisBase, anchor: 'y2', matches: 'x' },
        xaxis3: { ...axisBase, anchor: 'y3', matches: 'x' },
        xaxis4: { ...axisBase, anchor: 'y4', matches: 'x' },
        xaxis5: { ...axisBase, anchor: 'y5', matches: 'x', title: 'Date' },
        yaxis: { ...axisBase, title: 'APM', domain: [0.84, 1] },
        yaxis2: { ...axisBase, title: '°C', domain: [0.63, 0.79] },
        yaxis3: { ...axisBase, title: 'µS/cm', domain: [0.42, 0.58] },
        yaxis4: { ...axisBase, title: 'm', domain: [0.21, 0.37] },
        yaxis5: { ...axisBase, title: 'm³/s', domain: [0, 0.16] },
        showlegend: true,
        legend: { x: 0, y: 1.05, orientation: 'h', font: { size: 10 } }
      }), { responsive: true, displayModeBar: false })
    }
  }
}
</script>

<style scoped>
.env-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.param-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.param-label {
  font-size: 12px;
  color: var(--ft-text-muted);
  margin-right: 4px;
}

.param-btn {
  padding: 6px 12px;
  border: 1px solid var(--ft-border);
  background: transparent;
  color: var(--ft-text-muted);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.param-btn:hover {
  color: var(--ft-text-secondary);
  border-color: var(--ft-border-hover);
}

.param-btn.active {
  background: var(--ft-accent-subtle);
  border-color: var(--ft-accent);
  color: var(--ft-accent);
}

.param-btn i {
  margin-right: 4px;
}

.top-row {
  display: flex;
  gap: 16px;
}

.flex-2 { flex: 2; }
.flex-1 { flex: 1; }

.panel {
  background: var(--ft-bg-surface);
  border: 1px solid var(--ft-border);
  border-radius: 6px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--ft-border);
  font-size: 13px;
  font-weight: 600;
  color: var(--ft-text-secondary);
}

.panel-header i { color: var(--ft-accent); }

.panel-sub {
  font-size: 11px;
  color: var(--ft-text-muted);
  font-weight: 400;
  margin-left: auto;
}

.chart-area {
  width: 100%;
  height: 280px;
}

.chart-area.timeseries {
  height: 500px;
}
</style>
