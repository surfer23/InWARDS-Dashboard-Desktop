<script>
  import ChartContainer from './ChartContainer';
  import $ from 'jquery';
  export default {
    extends: ChartContainer,
    data () {
      return {
        chartId: 'station',
        chartTitle: 'Gauging station: ',
        errored: false,
        loading: true,
        styleObject: {
          display: 'none'
        }
      };
    },
    methods: {
      displayChart (stations, sd, ed) {
        this.urlParameters.stations = stations;
        this.urlParameters.sd = sd;
        this.urlParameters.ed = ed;
        this.loading = false;
        this.styleObject.display = 'block';
        let chartTitle = $(this.$el).find('.chart-title');
        chartTitle.html('Gauging station:' + stations[0]);
        let div = $(this.$el).find('.chart-container');
        let img = $('<img style="height: 100%; width: 100%; display: block; margin: 0;">');
        div.html(img);
        div.css('background', 'rgba(222, 226, 230, 0.41)');
        img.attr('src', 'https://inwards.award.org.za/images/' + stations[0].substring(0, 6) + '.jpg');
      }
    }
  };
</script>