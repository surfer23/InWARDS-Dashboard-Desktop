<template>
  <div class="card rounded-0 box" v-bind:style="styleObject">
    <div class="card-header inwards_card">
   <div class="row">
    <div class="col-md-12">  
    <h6 style="color: white; margin-top: 10px; width: 70%; float: left;" class="chart-title">{{ chartTitle }}</h6>
      <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups" style="float: right;">
        <div class="btn-group mr-2" role="group" aria-label="First group">
            <span v-if='deletable'>
              <button type="button" class="btn inwards_button_group" data-toggle="tooltip" data-placement="top" title="Remove from your dashboard" v-on:click="removeFromStore"><i class="fa fa-minus" style="padding-right: 10px;"></i></button>
            </span>
            <span v-else>
              <button type="button" class="btn inwards_button_group" data-toggle="tooltip" data-placement="top" title="Add to your dashboard" v-on:click="addToStore"><i class="fa fa-plus" style="padding-right: 10px;"></i></button>
            </span>
          </div>
      </div>
    </div>
    </div>
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
import { RingLoader } from 'vue-spinner/dist/vue-spinner.min.js';
import ChartContainerVue from '../FishDashboard/ChartContainer.vue';
const { getCurrentWindow } = require('electron').remote;
const { dialog } = require('electron').remote;
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