<template>
  <div class="alarm-container">
    <!-- Alarm Heatmap -->
    <div class="panel">
      <div class="panel-header">
        <i class="fa fa-th"></i>
        <span>Alarm Heatmap</span>
        <span class="panel-sub">Hour × Date matrix colored by alarm code</span>
      </div>
      <div ref="heatmapChart" class="chart-area"></div>
    </div>

    <!-- EWMA Chart -->
    <div class="panel">
      <div class="panel-header">
        <i class="fa fa-line-chart"></i>
        <span>EWMA Analysis</span>
        <span class="panel-sub">Activity vs EWMA bounds with alarm zones</span>
      </div>
      <div ref="ewmaChart" class="chart-area tall"></div>
    </div>

    <!-- Bottom Row: Summary Table + Timeline -->
    <div class="bottom-row">
      <!-- Alarm Summary Table -->
      <div class="panel half">
        <div class="panel-header">
          <i class="fa fa-table"></i>
          <span>Alarm Summary</span>
        </div>
        <div class="table-wrap">
          <table class="alarm-table">
            <thead>
              <tr>
                <th>Fish</th>
                <th>Data Points</th>
                <th>Alarms</th>
                <th>Alarm %</th>
                <th>Max Code</th>
                <th>Min Code</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in store.alarmSummaryData" :key="row.name">
                <td class="name-cell">{{ row.name }}</td>
                <td>{{ (row.total_points || 0).toLocaleString() }}</td>
                <td>{{ row.alarm_count }}</td>
                <td>
                  <div class="pct-bar-wrap">
                    <div class="pct-bar" :style="{ width: row.alarm_pct + '%' }" :class="pctClass(row.alarm_pct)"></div>
                    <span class="pct-text">{{ row.alarm_pct }}%</span>
                  </div>
                </td>
                <td><span class="alarm-badge" :class="'code-' + row.max_alarm_code">+{{ row.max_alarm_code }}</span></td>
                <td><span class="alarm-badge" :class="'code-neg' + Math.abs(row.min_alarm_code)">{{ row.min_alarm_code }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Alarm Timeline -->
      <div class="panel half">
        <div class="panel-header">
          <i class="fa fa-bars"></i>
          <span>Alarm Timeline</span>
          <span class="panel-sub">Gantt-style alarm periods</span>
        </div>
        <div ref="timelineChart" class="chart-area"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { useFishtracStore } from '../../store/fishtracStore'
import { useFishtracTheme } from '../../composables/useFishtracTheme'
import Plotly from 'plotly.js-dist'

const ALARM_COLORS = {
  '-3': '#264F78',
  '-2': '#2C6B9E',
  '-1': '#3E8CC4',
  '0': '#3E3E42',
  '1': '#CE9178',
  '2': '#D96C3B',
  '3': '#E74C3C'
}

export default {
  name: 'FishtracAlarmDashboard',

  setup() {
    const store = useFishtracStore()
    const { plotlyLayout, legendBg, colors } = useFishtracTheme()
    return { store, plotlyLayout, legendBg, colors }
  },

  mounted() {
    this.store.fetchAlarmHeatmap(null, this.store.startDate, this.store.endDate)
    this.store.fetchEwmaDetail(null, this.store.startDate, this.store.endDate)
    this.store.fetchAlarmSummary(this.store.selectedRiver)
  },

  watch: {
    'store.alarmHeatmapData'() { this.renderHeatmap() },
    'store.ewmaDetailData'() { this.renderEwma() },
    'store.alarmSummaryData'() { this.renderTimeline() },
    'store.theme'() { this.relayoutAll() }
  },

  beforeUnmount() {
    if (this.$refs.heatmapChart) Plotly.purge(this.$refs.heatmapChart)
    if (this.$refs.ewmaChart) Plotly.purge(this.$refs.ewmaChart)
    if (this.$refs.timelineChart) Plotly.purge(this.$refs.timelineChart)
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
      if (this.$refs.heatmapChart && this.$refs.heatmapChart.data) {
        Plotly.relayout(this.$refs.heatmapChart, {
          paper_bgcolor: base.paper_bgcolor,
          plot_bgcolor: base.plot_bgcolor,
          font: base.font,
          'xaxis.gridcolor': ax.gridcolor, 'xaxis.zerolinecolor': ax.zerolinecolor,
          'yaxis.gridcolor': ax.gridcolor, 'yaxis.zerolinecolor': ax.zerolinecolor
        })
      }
      if (this.$refs.ewmaChart && this.$refs.ewmaChart.data) {
        Plotly.relayout(this.$refs.ewmaChart, {
          paper_bgcolor: base.paper_bgcolor,
          plot_bgcolor: base.plot_bgcolor,
          font: base.font,
          'xaxis.gridcolor': ax.gridcolor, 'xaxis.zerolinecolor': ax.zerolinecolor,
          'yaxis.gridcolor': ax.gridcolor, 'yaxis.zerolinecolor': ax.zerolinecolor
        })
      }
      if (this.$refs.timelineChart && this.$refs.timelineChart.data) {
        Plotly.relayout(this.$refs.timelineChart, {
          paper_bgcolor: base.paper_bgcolor,
          plot_bgcolor: base.plot_bgcolor,
          font: base.font,
          'xaxis.gridcolor': ax.gridcolor, 'xaxis.zerolinecolor': ax.zerolinecolor,
          'yaxis.gridcolor': ax.gridcolor, 'yaxis.zerolinecolor': ax.zerolinecolor
        })
      }
    },

    renderHeatmap() {
      const data = this.store.alarmHeatmapData
      if (!data.length) return

      const dates = [...new Set(data.map(d => d.date_val))].sort()
      const hours = Array.from({ length: 24 }, (_, i) => i)

      const z = dates.map(date => {
        return hours.map(hour => {
          const point = data.find(d => d.date_val === date && d.hour === hour)
          return point ? point.alarm_class_code : 0
        })
      })

      const ax = this.getAxisProps()

      const trace = {
        z,
        x: hours,
        y: dates,
        type: 'heatmap',
        colorscale: [
          [0, '#264F78'], [0.25, '#3E8CC4'], [0.4, '#2D2D30'],
          [0.5, '#3E3E42'], [0.6, '#2D2D30'],
          [0.75, '#D96C3B'], [1, '#E74C3C']
        ],
        zmin: -3, zmax: 3,
        colorbar: {
          title: { text: 'Alarm Code', font: { size: 11 } },
          tickvals: [-3, -2, -1, 0, 1, 2, 3],
          thickness: 12,
          len: 0.8
        },
        hoverongaps: false
      }

      Plotly.newPlot(this.$refs.heatmapChart, [trace], this.getLayout({
        xaxis: { ...ax, title: 'Hour of Day', dtick: 3 },
        yaxis: { ...ax, title: 'Date', autorange: 'reversed' }
      }), { responsive: true, displayModeBar: false })
    },

    renderEwma() {
      const data = this.store.ewmaDetailData
      if (!data.length) return

      const timestamps = data.map(d => d.date_h_rounded)
      const apm = data.map(d => d.apm)
      const ewma = data.map(d => d.ewma)
      const upper = data.map(d => d.upper_bound)
      const lower = data.map(d => d.lower_bound)
      const codes = data.map(d => d.alarm_class_code)

      const codeColors = codes.map(c => ALARM_COLORS[String(c)] || '#3E3E42')
      const ax = this.getAxisProps()

      const traces = [
        { x: timestamps, y: upper, type: 'scatter', mode: 'lines', line: { color: 'rgba(206,145,120,0.3)', width: 1, dash: 'dot' }, name: 'Upper Bound', showlegend: true },
        { x: timestamps, y: lower, type: 'scatter', mode: 'lines', line: { color: 'rgba(62,140,196,0.3)', width: 1, dash: 'dot' }, name: 'Lower Bound', fill: 'tonexty', fillcolor: 'rgba(45,45,48,0.4)', showlegend: true },
        { x: timestamps, y: ewma, type: 'scatter', mode: 'lines', line: { color: '#4EC9B0', width: 2 }, name: 'EWMA' },
        { x: timestamps, y: apm, type: 'scatter', mode: 'markers', marker: { color: codeColors, size: 3 }, name: 'Activity (APM)' }
      ]

      Plotly.newPlot(this.$refs.ewmaChart, traces, this.getLayout({
        margin: { t: 20, r: 20, b: 50, l: 60 },
        xaxis: { ...ax, title: 'Time' },
        yaxis: { ...ax, title: 'Activity (APM)' },
        legend: { x: 0, y: 1.05, orientation: 'h', font: { size: 10 } },
        showlegend: true
      }), { responsive: true, displayModeBar: false })
    },

    renderTimeline() {
      const summaryData = this.store.alarmSummaryData
      if (!summaryData.length) return

      const names = summaryData.map(s => s.name)
      const alarmPcts = summaryData.map(s => s.alarm_pct)
      const normalPcts = summaryData.map(s => 100 - s.alarm_pct)
      const ax = this.getAxisProps()

      const traces = [
        {
          y: names, x: normalPcts,
          type: 'bar', orientation: 'h',
          marker: { color: '#2D2D30' },
          name: 'Normal',
          hovertemplate: '%{y}: %{x:.1f}% normal<extra></extra>'
        },
        {
          y: names, x: alarmPcts,
          type: 'bar', orientation: 'h',
          marker: { color: '#CE9178' },
          name: 'Alarm',
          hovertemplate: '%{y}: %{x:.1f}% alarm<extra></extra>'
        }
      ]

      Plotly.newPlot(this.$refs.timelineChart, traces, this.getLayout({
        barmode: 'stack',
        xaxis: { ...ax, title: 'Percentage', range: [0, 100] },
        yaxis: { ...ax, automargin: true },
        showlegend: true,
        legend: { x: 0.5, y: 1.05, orientation: 'h', xanchor: 'center', font: { size: 10 } }
      }), { responsive: true, displayModeBar: false })
    },

    pctClass(pct) {
      if (pct > 15) return 'high'
      if (pct > 8) return 'med'
      return 'low'
    }
  }
}
</script>

<style scoped>
.alarm-container {
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

.panel-header i {
  color: var(--ft-accent);
}

.panel-sub {
  font-size: 11px;
  color: var(--ft-text-muted);
  font-weight: 400;
  margin-left: auto;
}

.chart-area {
  width: 100%;
  height: 260px;
}

.chart-area.tall {
  height: 340px;
}

.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Table */
.table-wrap {
  overflow-x: auto;
  padding: 8px;
}

.alarm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.alarm-table th {
  text-align: left;
  padding: 8px 10px;
  color: var(--ft-text-muted);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--ft-border);
}

.alarm-table td {
  padding: 8px 10px;
  color: var(--ft-text-secondary);
  border-bottom: 1px solid var(--ft-bg-elevated);
  font-variant-numeric: tabular-nums;
}

.name-cell {
  font-weight: 600;
  color: var(--ft-text-primary);
}

.pct-bar-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pct-bar {
  height: 6px;
  border-radius: 3px;
  min-width: 4px;
}

.pct-bar.low { background: #4EC9B0; }
.pct-bar.med { background: #DCDCAA; }
.pct-bar.high { background: #CE9178; }

.pct-text {
  font-size: 11px;
  color: var(--ft-text-muted);
  font-variant-numeric: tabular-nums;
}

.alarm-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.alarm-badge.code-1 { background: rgba(206,145,120,0.2); color: #CE9178; }
.alarm-badge.code-2 { background: rgba(217,108,59,0.2); color: #D96C3B; }
.alarm-badge.code-3 { background: rgba(231,76,60,0.2); color: #E74C3C; }
.alarm-badge.code-neg1 { background: rgba(62,140,196,0.2); color: #3E8CC4; }
.alarm-badge.code-neg2 { background: rgba(44,107,158,0.2); color: #2C6B9E; }
.alarm-badge.code-neg3 { background: rgba(38,79,120,0.2); color: #5A9FD4; }
</style>
