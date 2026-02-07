<script>
  import 'c3/c3.min.css';
  import axios from 'axios';
  import 'jquery/dist/jquery.min.js';
  import Plotly from 'plotly.js-dist';
  import $ from 'jquery';
  import ChartContainer from './ChartContainer';
  require('promise.prototype.finally').shim();

  export default {
    extends: ChartContainer,
    data () {
      return {
        chartTitle: 'Unverified timeseries',
        chartId: 'unverified-timeseries',
        baseUrl: 'https://inwards.award.org.za/app_json/plotly_timeseries.php'
      };
    },
    methods: {
      fetchChartData () {
        let self = this;
        this.loading = true;
        if (!self.mounted) {
          setTimeout(function () {
            self.fetchChartData();
          }, 1000);
          return;
        }
        const url = `${this.baseUrl}?${this.dictToUri(this.urlParameters)}`;
        axios.get(url).then(response => {
          let jsonData = response.data;
          let boxData = [];
          setTimeout(() => {
            let baseLayout = this.getThemedPlotlyLayout();
            let layout = Object.assign({}, baseLayout, {
              title: false,
              yaxis: Object.assign({}, baseLayout.yaxis, {
                title: 'Discharge (cumecs)',
                autorange: true,
                showgrid: true,
                zeroline: true,
                gridwidth: 1,
                zerolinewidth: 2,
                rangemode: 'nonnegative'
              }),
              showlegend: true,
              legend: { orientation: 'h' }
            });
            for (let variable in jsonData) {
              boxData.push(jsonData[variable]);
            }
            document.getElementById(self.chartDivId).innerHTML = '';
            let stations = this.urlParameters.stations;
            let chartTitle = $(this.$el).find('.chart-title');
            chartTitle.html('Gauging station:' + stations[0]);
            Plotly.newPlot(self.chartDivId, boxData, layout, {displayModeBar: true});
          }, 1000);
        }).catch(error => {
          console.log(error);
          this.errored = true;
        }).finally(() => { this.loading = false; });
      }
    }
  };
</script>