<template>
  <div class="ft-chart-card" v-bind:style="styleObject">
    <div class="ft-chart-header">
      <h6 class="ft-chart-title chart-title">{{ chartTitle }}</h6>
      <div class="ft-chart-actions">
        <button
          v-if="deletable"
          type="button"
          class="ft-chart-btn"
          title="Remove from your dashboard"
          @click="removeFromStore"
        ><i class="fa fa-minus"></i></button>
        <button
          v-else
          type="button"
          class="ft-chart-btn"
          title="Add to your dashboard"
          @click="addToStore"
        ><i class="fa fa-plus"></i></button>
      </div>
    </div>
    <div class="ft-chart-body chart-container">
      <section v-if="errored">
        <p style="padding: 10px; color: var(--ft-text-muted);">We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
      </section>
      <section v-else style="height: 100%;">
        <div v-if="loading"><ring-loader :loading="loading" :color="color" :size="size" class="loading_disks"></ring-loader></div>
        <div v-else style="height: 100%">
          <div :id="chartDivId" style="height: 100%;"><ring-loader :loading="loading" :color="color" :size="size" class="loading_disks"></ring-loader></div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import stateStore from '../../store/state_handler';
import { RingLoader } from 'vue-spinner/dist/vue-spinner.min.js';
import { remote } from '../../services/electron-compat';
const { getCurrentWindow, dialog } = remote;
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
    async removed (itemId) {
      // Called when item has been removed from store
      itemId = itemId.replace('chartComponent-', '');
      console.log(itemId);
      let items = this.grid.getItems();
      for (let i = 0; i < items.length; i++) {
        let key = items[i].getElement().children[0].dataset.key;
        this.currentCharts[key]['order'] = i;
      }
      let currentChart = this.currentCharts[itemId];
      this.grid.remove(currentChart['order'], {removeElements: true});
      delete this.currentCharts[itemId];
      await stateStore.setState(stateStore.keys.selectedCharts, this.currentCharts);
      getCurrentWindow().reload();
    },
    removeFromStore () {
    console.log("before message box");
    dialog.showMessageBox(
      {
        message: "Would you like to remove " + this.chartId + " from your dashboard?",
        buttons: ["Yes", "No"],
        defaultId: 0, // bound to buttons array
        cancelId: 1 // bound to buttons array
      })
      .then(result => {
        if (result.response === 0) {
          // bound to buttons array
          console.log("Removing chart from user dashboard!");
          this.removed(this.chartId);
        } else if (result.response === 1) {
          // bound to buttons array
          console.log("Cancel Removal Process");
        }
      }
    );
    console.log("after message box");
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
    getThemedPlotlyLayout () {
      // Read CSS custom properties from the nearest theme container
      const el = this.$el ? this.$el.closest('.theme-dark, .theme-light') : null;
      const style = el ? getComputedStyle(el) : null;
      const get = (prop, fallback) => style ? (style.getPropertyValue(prop).trim() || fallback) : fallback;
      return {
        paper_bgcolor: get('--ft-bg-surface', '#252526'),
        plot_bgcolor: get('--ft-bg-surface', '#252526'),
        font: {
          family: 'Open Sans, Raleway, Calibri, sans-serif',
          size: 10,
          color: get('--ft-text-secondary', '#CCCCCC')
        },
        margin: { l: 50, r: 20, b: 40, t: 20, pad: 4 },
        xaxis: {
          gridcolor: get('--ft-border', '#3E3E42'),
          zerolinecolor: get('--ft-border', '#3E3E42')
        },
        yaxis: {
          gridcolor: get('--ft-border', '#3E3E42'),
          zerolinecolor: get('--ft-border', '#3E3E42')
        }
      };
    },
    fetchChartData () {
      // Override this function get the chart data
      return false;
    },
    displayChart (stations, sd, ed, type = 0) {
      this.styleObject.display = 'block';
      this.urlParameters.stations = stations;
      this.urlParameters.sd = sd;
      this.urlParameters.ed = ed;
      this.urlParameters.type = type;
      this.chartId = this.chartId;
      this.chartDivId = this.chartId.replace(/,/g, '-');
      this.fetchChartData();
    }
  }
};
</script>