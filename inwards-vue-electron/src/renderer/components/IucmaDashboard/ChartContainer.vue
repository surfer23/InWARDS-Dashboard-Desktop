<template>
  <div class="card rounded-0 box" v-bind:style="styleObject">
    <div class="card-header inwards_card">{{ chartTitle }}
    </div>
    <div class="card-body chart-container">
      <section v-if="errored">
        <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
      </section>
      <section v-else style="height: 100%;">
        <div v-if='loading'>Loading...</div>
        <div v-else style="height: 100%">
          <div :id="chartDivId" style="height: 100%;">Loading...</div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import stateStore from '../../store/state_handler';
const { dialog } = require('electron').remote;
export default {
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
      chartData: null,
      errored: false,
      loading: true,
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
    displayChart (id, stations, sd, ed, critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh) {
      this.styleObject.display = 'block';
      this.urlParameters.stations = stations;
      this.urlParameters.sd = sd;
      this.urlParameters.ed = ed;
      this.urlParameters.critical = critical;
      this.urlParameters.very_high = veryHigh;
      this.urlParameters.high = high;
      this.urlParameters.medium = medium;
      this.urlParameters.low = low;
      this.urlParameters.inform = inform;
      this.urlParameters.last_year = lastYear;
      this.urlParameters.verified = verifiedDischarge;
      this.urlParameters.target_reserve_iima = iima;
      this.urlParameters.target_reserve_crmib = crimib;
      this.urlParameters.sixTh = sixTh;
      this.urlParameters.sevTh = sevTh;
      this.urlParameters.eigTh = eigTh;
      this.urlParameters.ninTh = ninTh;
      this.urlParameters.nininTh = nininTh;
      this.chartId = this.chartId;
      this.chartDivId = id;
      this.fetchChartData();
    }
  }
};
</script>