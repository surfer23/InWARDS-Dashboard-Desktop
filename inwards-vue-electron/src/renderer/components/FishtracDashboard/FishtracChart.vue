<template>
  <div class="fishtrac-chart-container">
    <div class="chart-header">
      <h3 class="chart-title">Fish Activity Over Time</h3>
      <div class="chart-legend">
        <div class="legend-item">
          <span class="legend-line solid blue"></span>
          <span>Fish Activity per Minute</span>
        </div>
        <div class="legend-item">
          <span class="legend-line dashed orange"></span>
          <span>Pressure (kPa)</span>
        </div>
        <div class="legend-item">
          <span class="legend-line dashed green"></span>
          <span>Conductivity (µS/cm)</span>
        </div>
        <div class="legend-item">
          <span class="legend-line dashed yellow"></span>
          <span>Temperature (°C)</span>
        </div>
        <div class="legend-item">
          <span class="legend-line dotted brown"></span>
          <span>Depth (m)</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="chart-loading">
      <i class="fa fa-spinner fa-spin"></i> Loading chart data...
    </div>

    <div v-else ref="chartContainer" class="chart-area"></div>
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist'

export default {
  name: 'FishtracChart',

  props: {
    chartData: {
      type: Object,
      default: () => ({
        timestamps: [],
        activity: [],
        pressure: [],
        conductivity: [],
        temperature: [],
        depth: []
      })
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    chartData: {
      handler() {
        this.renderChart()
      },
      deep: true
    }
  },

  mounted() {
    this.renderChart()
    window.addEventListener('resize', this.handleResize)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    if (this.$refs.chartContainer) {
      Plotly.purge(this.$refs.chartContainer)
    }
  },

  methods: {
    handleResize() {
      if (this.$refs.chartContainer) {
        Plotly.Plots.resize(this.$refs.chartContainer)
      }
    },

    renderChart() {
      if (!this.$refs.chartContainer || this.loading) return
      if (!this.chartData.timestamps || this.chartData.timestamps.length === 0) return

      const traces = [
        {
          x: this.chartData.timestamps,
          y: this.chartData.activity,
          type: 'scatter',
          mode: 'lines',
          name: 'Activity per Minute',
          line: { color: '#3498db', width: 2 },
          yaxis: 'y'
        },
        {
          x: this.chartData.timestamps,
          y: this.chartData.pressure,
          type: 'scatter',
          mode: 'lines',
          name: 'Pressure (kPa)',
          line: { color: '#e67e22', width: 1.5, dash: 'dash' },
          yaxis: 'y2',
          visible: 'legendonly'
        },
        {
          x: this.chartData.timestamps,
          y: this.chartData.conductivity,
          type: 'scatter',
          mode: 'lines',
          name: 'Conductivity (µS/cm)',
          line: { color: '#27ae60', width: 1.5, dash: 'dash' },
          yaxis: 'y3',
          visible: 'legendonly'
        },
        {
          x: this.chartData.timestamps,
          y: this.chartData.temperature,
          type: 'scatter',
          mode: 'lines',
          name: 'Temperature (°C)',
          line: { color: '#f1c40f', width: 1.5, dash: 'dash' },
          yaxis: 'y4',
          visible: 'legendonly'
        },
        {
          x: this.chartData.timestamps,
          y: this.chartData.depth,
          type: 'scatter',
          mode: 'lines',
          name: 'Depth (m)',
          line: { color: '#8b4513', width: 1.5, dash: 'dot' },
          yaxis: 'y5',
          visible: 'legendonly'
        }
      ]

      const layout = {
        autosize: true,
        height: 350,
        margin: { l: 60, r: 60, t: 20, b: 60 },
        paper_bgcolor: 'white',
        plot_bgcolor: 'white',
        font: { family: 'Open Sans, sans-serif', size: 11 },
        xaxis: {
          title: '',
          showgrid: true,
          gridcolor: '#f0f0f0',
          tickangle: -45
        },
        yaxis: {
          title: 'Activity per Minute',
          titlefont: { color: '#3498db' },
          tickfont: { color: '#3498db' },
          showgrid: true,
          gridcolor: '#f0f0f0'
        },
        yaxis2: {
          title: 'Pressure (kPa)',
          titlefont: { color: '#e67e22' },
          tickfont: { color: '#e67e22' },
          overlaying: 'y',
          side: 'right',
          showgrid: false
        },
        yaxis3: {
          title: 'Conductivity',
          titlefont: { color: '#27ae60' },
          tickfont: { color: '#27ae60' },
          overlaying: 'y',
          side: 'right',
          position: 0.95,
          showgrid: false,
          visible: false
        },
        yaxis4: {
          title: 'Temperature',
          titlefont: { color: '#f1c40f' },
          tickfont: { color: '#f1c40f' },
          overlaying: 'y',
          side: 'right',
          position: 0.9,
          showgrid: false,
          visible: false
        },
        yaxis5: {
          title: 'Depth',
          titlefont: { color: '#8b4513' },
          tickfont: { color: '#8b4513' },
          overlaying: 'y',
          side: 'right',
          position: 0.85,
          showgrid: false,
          visible: false
        },
        showlegend: false,
        hovermode: 'x unified'
      }

      const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        displaylogo: false
      }

      Plotly.newPlot(this.$refs.chartContainer, traces, layout, config)
    }
  }
}
</script>

<style scoped>
.fishtrac-chart-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 11px;
  color: #666;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-line {
  width: 24px;
  height: 2px;
}

.legend-line.solid {
  background: currentColor;
}

.legend-line.dashed {
  background: repeating-linear-gradient(
    90deg,
    currentColor 0px,
    currentColor 6px,
    transparent 6px,
    transparent 10px
  );
}

.legend-line.dotted {
  background: repeating-linear-gradient(
    90deg,
    currentColor 0px,
    currentColor 2px,
    transparent 2px,
    transparent 6px
  );
}

.legend-line.blue { color: #3498db; }
.legend-line.orange { color: #e67e22; }
.legend-line.green { color: #27ae60; }
.legend-line.yellow { color: #f1c40f; }
.legend-line.brown { color: #8b4513; }

.chart-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 350px;
  color: #7f8c8d;
  font-size: 14px;
}

.chart-loading i {
  margin-right: 8px;
}

.chart-area {
  width: 100%;
  min-height: 350px;
}
</style>
