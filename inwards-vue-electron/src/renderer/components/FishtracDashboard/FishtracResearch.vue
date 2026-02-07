<template>
  <div class="research-container">
    <!-- Parallel Coordinates -->
    <div class="panel">
      <div class="panel-header">
        <i class="fa fa-sliders"></i>
        <span>Multivariate Analysis</span>
        <span class="panel-sub">Parallel coordinates &bull; All PhD variables &bull; Color by fish</span>
      </div>
      <div ref="parallelChart" class="chart-area tall"></div>
    </div>

    <!-- Bottom Row: Box Plots + Tagging Response -->
    <div class="bottom-row">
      <!-- Box Plots -->
      <div class="panel">
        <div class="panel-header">
          <i class="fa fa-bar-chart"></i>
          <span>Activity Distributions</span>
          <div class="group-selector">
            <select v-model="groupBy" class="group-select" @change="fetchBoxplot">
              <option value="fish">By Fish</option>
              <option value="river">By River</option>
              <option value="tod">By Time of Day</option>
            </select>
          </div>
        </div>
        <div ref="boxChart" class="chart-area"></div>
      </div>

      <!-- Days From Tagging -->
      <div class="panel">
        <div class="panel-header">
          <i class="fa fa-calendar"></i>
          <span>Post-Tagging Response</span>
          <span class="panel-sub">Stress recovery curve with LOWESS smoothing</span>
        </div>
        <div ref="taggingChart" class="chart-area"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { useFishtracStore } from '../../store/fishtracStore'
import { useFishtracTheme } from '../../composables/useFishtracTheme'
import Plotly from 'plotly.js-dist'

const FISH_COLORS = {
  LNAT01: '#007ACC',
  LNAT02: '#4EC9B0',
  SINT01: '#CE9178'
}

export default {
  name: 'FishtracResearch',

  setup() {
    const store = useFishtracStore()
    const { plotlyLayout, legendBg, colors } = useFishtracTheme()
    return { store, plotlyLayout, legendBg, colors }
  },

  data() {
    return {
      groupBy: 'fish'
    }
  },

  mounted() {
    this.store.fetchPhdMultivariate('all')
    this.store.fetchPhdBoxplot(this.groupBy, 'APM')
    this.store.fetchPhdTaggingResponse(null)
  },

  watch: {
    'store.phdMultivariateData'() { this.renderParallel() },
    'store.phdBoxplotData'() { this.renderBoxplot() },
    'store.phdTaggingData'() { this.renderTagging() },
    'store.theme'() { this.relayoutAll() }
  },

  beforeUnmount() {
    if (this.$refs.parallelChart) Plotly.purge(this.$refs.parallelChart)
    if (this.$refs.boxChart) Plotly.purge(this.$refs.boxChart)
    if (this.$refs.taggingChart) Plotly.purge(this.$refs.taggingChart)
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
      if (this.$refs.parallelChart && this.$refs.parallelChart.data) {
        Plotly.relayout(this.$refs.parallelChart, themeUpdate)
      }
      if (this.$refs.boxChart && this.$refs.boxChart.data) {
        Plotly.relayout(this.$refs.boxChart, {
          ...themeUpdate,
          'xaxis.gridcolor': ax.gridcolor,
          'yaxis.gridcolor': ax.gridcolor, 'yaxis.zerolinecolor': ax.zerolinecolor
        })
      }
      if (this.$refs.taggingChart && this.$refs.taggingChart.data) {
        Plotly.relayout(this.$refs.taggingChart, {
          ...themeUpdate,
          'xaxis.gridcolor': ax.gridcolor, 'xaxis.zerolinecolor': ax.zerolinecolor,
          'yaxis.gridcolor': ax.gridcolor, 'yaxis.zerolinecolor': ax.zerolinecolor,
          'legend.bgcolor': this.legendBg
        })
      }
    },

    fetchBoxplot() {
      this.store.fetchPhdBoxplot(this.groupBy, 'APM')
    },

    renderParallel() {
      const data = this.store.phdMultivariateData
      if (!data.length) return

      const names = [...new Set(data.map(d => d.name))]
      const colorMap = {}
      names.forEach((n, i) => { colorMap[n] = i })

      const dims = [
        { label: 'APM', values: data.map(d => d.apm) },
        { label: 'Tag Temp', values: data.map(d => d.tag_temp) },
        { label: 'Water Temp', values: data.map(d => d.water_temp) },
        { label: 'Discharge', values: data.map(d => d.discharge) },
        { label: 'Conductivity', values: data.map(d => d.conductivity) },
        { label: 'Air Temp', values: data.map(d => d.air_temp) },
        { label: 'Pressure', values: data.map(d => d.pressure) },
        { label: 'Days from Tag', values: data.map(d => d.days_from_tag) },
        { label: 'Hour', values: data.map(d => d.tod) }
      ]

      const trace = {
        type: 'parcoords',
        line: {
          color: data.map(d => colorMap[d.name]),
          colorscale: [[0, '#007ACC'], [0.5, '#4EC9B0'], [1, '#CE9178']],
          showscale: false
        },
        dimensions: dims.map(dim => ({
          label: dim.label,
          values: dim.values,
          range: [Math.min(...dim.values), Math.max(...dim.values)]
        }))
      }

      Plotly.newPlot(this.$refs.parallelChart, [trace], this.getLayout({
        margin: { t: 40, r: 40, b: 20, l: 40 }
      }), { responsive: true, displayModeBar: false })
    },

    renderBoxplot() {
      const data = this.store.phdBoxplotData
      if (!data || typeof data !== 'object') return

      const groups = Object.keys(data)
      const boxColors = ['#007ACC', '#4EC9B0', '#CE9178', '#DCDCAA', '#C586C0', '#9CDCFE']
      const ax = this.getAxisProps()

      const traces = groups.map((group, idx) => ({
        y: data[group],
        type: 'box',
        name: group,
        marker: { color: boxColors[idx % boxColors.length], outliercolor: boxColors[idx % boxColors.length] },
        line: { color: boxColors[idx % boxColors.length] },
        fillcolor: boxColors[idx % boxColors.length] + '33',
        boxpoints: 'outliers'
      }))

      Plotly.newPlot(this.$refs.boxChart, traces, this.getLayout({
        xaxis: { gridcolor: ax.gridcolor },
        yaxis: { title: 'Activity (APM)', gridcolor: ax.gridcolor, zerolinecolor: ax.zerolinecolor },
        showlegend: false
      }), { responsive: true, displayModeBar: false })
    },

    renderTagging() {
      const data = this.store.phdTaggingData
      if (!data.length) return

      const days = data.map(d => d.day_from_tag)
      const avgApm = data.map(d => d.avg_apm)
      const stdApm = data.map(d => d.std_apm)
      const ax = this.getAxisProps()

      // LOWESS approximation (simple moving average)
      const windowSize = 15
      const smoothed = avgApm.map((_, i) => {
        const start = Math.max(0, i - Math.floor(windowSize / 2))
        const end = Math.min(avgApm.length, i + Math.floor(windowSize / 2) + 1)
        const slice = avgApm.slice(start, end)
        return slice.reduce((a, b) => a + b, 0) / slice.length
      })

      const upperBand = smoothed.map((v, i) => v + (stdApm[i] || 0))
      const lowerBand = smoothed.map((v, i) => Math.max(0, v - (stdApm[i] || 0)))

      const traces = [
        {
          x: days, y: upperBand,
          type: 'scatter', mode: 'lines',
          line: { width: 0 }, showlegend: false
        },
        {
          x: days, y: lowerBand,
          type: 'scatter', mode: 'lines',
          line: { width: 0 }, fill: 'tonexty',
          fillcolor: 'rgba(0,122,204,0.1)', showlegend: false
        },
        {
          x: days, y: avgApm,
          type: 'scatter', mode: 'markers',
          marker: { color: '#007ACC', size: 3, opacity: 0.5 },
          name: 'Daily Avg APM'
        },
        {
          x: days, y: smoothed,
          type: 'scatter', mode: 'lines',
          line: { color: '#4EC9B0', width: 2.5 },
          name: 'LOWESS Smoothing'
        }
      ]

      // Stress recovery annotation
      const peakDay = days[avgApm.indexOf(Math.max(...avgApm.slice(0, 30)))]

      Plotly.newPlot(this.$refs.taggingChart, traces, this.getLayout({
        xaxis: { title: 'Days from Tagging', ...ax },
        yaxis: { title: 'Activity (APM)', ...ax },
        showlegend: true,
        legend: { x: 0.7, y: 0.98, bgcolor: this.legendBg, font: { size: 10 } },
        shapes: [{
          type: 'rect',
          x0: 0, x1: peakDay + 10, y0: 0, y1: 1,
          xref: 'x', yref: 'paper',
          fillcolor: 'rgba(206,145,120,0.08)',
          line: { width: 0 }
        }],
        annotations: [{
          x: (peakDay + 10) / 2, y: 1.02,
          xref: 'x', yref: 'paper',
          text: 'Stress Period',
          showarrow: false,
          font: { size: 10, color: '#CE9178' }
        }]
      }), { responsive: true, displayModeBar: false })
    }
  }
}
</script>

<style scoped>
.research-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

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

.group-selector {
  margin-left: auto;
}

.group-select {
  padding: 4px 8px;
  border: 1px solid var(--ft-border);
  border-radius: 3px;
  background: var(--ft-bg-deepest);
  color: var(--ft-text-secondary);
  font-size: 11px;
  outline: none;
  font-family: inherit;
}

.group-select:focus {
  border-color: var(--ft-accent);
}

.chart-area {
  width: 100%;
  height: 300px;
}

.chart-area.tall {
  height: 380px;
}

.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
</style>
