<template>
  <div class="card rounded-0 box" v-bind:style="styleObject">
    <div class="card-header inwards_card">{{ chartTitle }}
    </div>
    <div class="card-body chart-container">
      <section v-if="errored">
        <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
      </section>
      <section v-else style="height: 100%;">
        <div v-if='loading'><ring-loader :loading="loading" :color="color" :size="size" class="loading_disks"></ring-loader></div>
        <div v-else style="height: 100%">
          <div :id="chartDivId" style="height: 100%;"><ring-loader :loading="loading" :color="color" :size="size" class="loading_disks"></ring-loader></div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import stateStore from '../../store/state_handler';
import saveSvgAsPng from 'save-svg-as-png';
import { RingLoader } from 'vue-spinner/dist/vue-spinner.min.js';
const { dialog } = require('electron');
export default {
  components: {
    RingLoader
  },
  name: 'chart-container',
  data () {
    return {
      chartId: null,
      chartDivId: null,
      chartUrl: '',
      deletable: false,
      mounted: false,
      urlParameters: {
        stations: [],
        sd: '',
        ed: '',
        type: 0
      },
      color: '#177a98',
      height: '35px',
      width: '4px',
      margin: '2px',
      size: '100px',
      loading: false,
      radius: '2px',
      chartData: null,
      errored: false,
      stationsCoordinates: {},
      styleObject: {
        display: 'none'
      }
    };
  },
  mounted () {
    let self = this;
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      self.mounted = true;
    });
  },
  methods: {
    removed () {
      // Called when item has been removed from store
    },
    removeFromStore () {
      const options = {
        type: 'question',
        buttons: ['Yes, please', 'No, thanks'],
        defaultId: 2,
        title: 'Remove a chart',
        message: 'Are you sure you want to delete this chart from your dashboard?'
      };

      dialog.showMessageBox(null, options, (response) => {
        if (response === 0) {
          this.removed(this.chartId);
        }
      });
    },
    addToStore () {
      let self = this;
      let stations = this.urlParameters['stations'];
      let chartStoreId = self.chartId + '-' + stations.join('-');
      self.$bus.emit('addStationsToStore', stations, chartStoreId);
      stateStore.getState(
        stateStore.keys.selectedCharts,
        function (selectedCharts) {
          if (selectedCharts) {
            if (selectedCharts.hasOwnProperty(chartStoreId)) {
              dialog.showMessageBox(null, {
                type: 'warning',
                message: 'This chart has been already added to user dashboard',
                buttons: ['OK']
              });
              return;
            }
            selectedCharts[chartStoreId] = {
              'chartId': self.chartId,
              'chartStations': stations,
              'order': Object.keys(selectedCharts).length - 1
            };
          } else {
            selectedCharts = {};
            selectedCharts[chartStoreId] = {
              'chartId': self.chartId,
              'chartStations': stations,
              'order': 0
            };
          }
          dialog.showMessageBox(null, {
            type: 'info',
            message: 'Successfully added to user dashboard',
            buttons: ['OK']
          });
          stateStore.setState(stateStore.keys.selectedCharts, selectedCharts);
        }
      );
    },
    fetchChartData () {
      // Override this function get the chart data
      return false;
    },
    displayChart (stations, variable, sd, ed, unit) {
      this.styleObject.display = 'block';
      this.urlParameters.stations = stations;
      this.urlParameters.variable = variable;
      this.urlParameters.sd = sd;
      this.urlParameters.ed = ed;
      this.urlParameters.unit = unit;
      this.chartId = this.chartId;
      console.log(this.chartId);
      this.chartDivId = this.chartId.replace(/,/g, '-');
      this.fetchChartData();
    },
    displayLoad (allocatble, userCode, scenario_id) {
      this.styleObject.display = 'block';
      this.urlParameters.allocatble = allocatble;
      this.urlParameters.userCode = userCode;
      this.urlParameters.scenario_id = scenario_id;
      this.chartId = this.chartId;
      this.chartDivId = this.chartId.replace(/,/g, '-');
      this.fetchChartData();
    },
    savePNG () {
      saveSvgAsPng(document.getElementById(this.chartDivId), 'diagram.png');
    }
  }
};
</script>