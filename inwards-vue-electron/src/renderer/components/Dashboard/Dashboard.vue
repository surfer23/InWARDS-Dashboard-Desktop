<template>
  <div style="height: 1010px;">
    <div class="container-fluid" style="height: 1010px;">
      <div class="row" style="height: 100%;">
        <div class="col-md-3 no-float" style="background: #252526;">
          <div class="card rounded-0" style="margin-top: 5px; margin-bottom: 5px;">
            <div class="card-body">
              <button class="btn rounded-0 inwards_button" @click="backToMapSelect()" type="button">
                <i class="fa fa-chevron-left"></i>Back to Dashbaord Selection
              </button>
            </div>
          </div>
          <CatchmentTree ref="catchmentTree"/>
          <div class="v-space"></div>
          <MapDashboard ref="mapDashboard"/>
          <div class="v-space"></div>
          <div class="card rounded-0">
            <div class="card-body">
              <div class="row">
                <div class="col-sm-6" style="padding-right: 2px;">
                  <div class="form-group">
                    <label for="dateStart" style="padding-left: 8px;">Start Date:</label> 
                    <input type="date" class="form-control" id="dateStart" style="margin-left: 4px;">
                  </div>
                </div>
                <div class="col-sm-6" style="padding-left: 2px;">
                  <div class="form-group">
                    <label for="dateEnd" style="padding-left: 8px;">End Date:</label>
                    <input type="date" class="form-control" id="dateEnd" style="margin-right: 10px;" @onload="setDates()">
                  </div>
                </div>
              </div>
              <div class="row" style="margin-top: 5px; margin-bottom: 5px;">
                  <div class="col-md-4">
                     <label class="custom-control custom-checkbox" style="margin-left: 5px">
                      <input id="ts" type="checkbox" class="custom-control-input" checked="true">T/S
                      <span class="custom-control-indicator"></span>
                  </label>
                  </div>
                  <div class="col-md-4">
                     <label class="custom-control custom-checkbox">
                      <input id="bx" type="checkbox" class="custom-control-input" checked="true">Boxplot
                      <span class="custom-control-indicator"></span>
                  </label>
                  </div>
                  <div class="col-md-4">
                     <label class="custom-control custom-checkbox">
                      <input id="fdc" type="checkbox" class="custom-control-input" checked="true">FDC
                      <span class="custom-control-indicator"></span>
                  </label>
                </div>
              </div>
                <div class="row">
                <div class="col-md-12">
                <button class="btn inwards_button" @click="fetchUnverified()" type="button" style="width: 100%">
                  <i class="fa fa-line-chart"></i>Chart Unverified
                </button>
                </div>
              </div>
            </div>
          </div>
          <div class="v-space"></div>
        </div>
        <div class="col-md-9 no-float" style="background: #1E1E1E;">
          <div class="row">
            <div class="col-md-6">
              <Chart ref="chartComponent" style="margin-top: 5px;"/>
            </div>
            <div class="col-md-6">
              <BoxChart ref="boxComponent" style="margin-top: 5px;"/>
            </div>
            <div class="col-md-6">
              <DurationCurve ref="durationComponent" style="margin-top: 5px;"/>
            </div>
            <div class="col-md-6">
                <Station ref="stationComponent" style="margin-top: 5px;"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .v-space {
    height: 10px;
  }
  .jstree-container {
    max-height: 200px;
    height: 200px;
    overflow-y: auto;
  }
</style>
<script>
  import axios from 'axios';
  import Header from '@/components/Header';
  import MapDashboard from './MapDashboard';
  import CatchmentTree from './CatchmentTree';
  import Chart from './Chart';
  import DurationCurve from './DurationCurve';
  import BoxChart from './BoxChart';
  import Station from './Station';
  import router from '@/router/index';
  import $ from 'jquery';
  import stateStore from '../../store/state_handler';
  require('promise.prototype.finally').shim();
  
  export default {
    data () {
      return {
        stationsApi: 'http://inwards.award.org.za/app_json/stations.php',
        stationsCoordinates: {}, // To stored all stations with their coordinates
        stationsRequest: null,
        selectedStations: []
      };
    },
    mounted () {
      let self = this;
      stateStore.getState(
        stateStore.keys.selectedWMAs,
        function (selectedWMAs) {
          self.$refs.mapDashboard.showSelectedWMA(selectedWMAs);
          self.fetchStations(selectedWMAs);
        }
      );
      self.$bus.$on('stationSelectedFromMap', (station, isStationSelected) => {
        self.$refs.catchmentTree.toggleNode(station, isStationSelected);
      });
      stateStore.getState(
        stateStore.keys.dateEnd,
        function (dateEnd) {
          if (!dateEnd) {
            var endDate = new Date();
            var dd = endDate.getDate();
            var mm = endDate.getMonth() + 1;
            var yyyy = endDate.getFullYear();
            if (dd < 10) {
              dd = '0' + dd;
            }
            if (mm < 10) {
              mm = '0' + mm;
            }
            dateEnd = yyyy + '-' + mm + '-' + dd;
          }
          document.getElementById('dateEnd').setAttribute('value', dateEnd);
        }
      );
      document.getElementById('dateEnd').onchange = function () {
        stateStore.setState(
          stateStore.keys.dateEnd,
          this.value
        );
      };
      var startDate = new Date();
      startDate.setDate(startDate.getDate() - 14);
      var dd = startDate.getDate();
      var mm = startDate.getMonth() + 1;
      var yyyy = startDate.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      startDate = yyyy + '-' + mm + '-' + dd;
      document.getElementById('dateStart').setAttribute('value', startDate);
    },
    components: {
      Header,
      MapDashboard,
      CatchmentTree,
      BoxChart,
      Chart,
      DurationCurve,
      Station
    },
    methods: {
      backToMapSelect () {
        router.push({ path: '/' });
      },
      fetchUnverified () {
        const selectedStations = this.$refs.mapDashboard.getSelectedStations();
        if (selectedStations.length === 0) {
          alert('Please select at least one station');
          return;
        }
        let dateStartString = $('#dateStart').val();
        let dateEndString = $('#dateEnd').val();
        if (!dateStartString || !dateEndString) {
          alert('Missing start date / end date');
          return;
        }
        let dateStart = new Date(dateStartString);
        let dateEnd = new Date(dateEndString);
        if (dateStart > dateEnd) {
          alert('End date should be after start date');
          return;
        }
        let tsChart = document.getElementById('ts').checked;
        if (tsChart === true) {
          this.$refs.chartComponent.displayChart(selectedStations, this.formatDate(dateStart), this.formatDate(dateEnd));
        }
        let bxChart = document.getElementById('bx').checked;
        if (bxChart === true) {
          this.$refs.boxComponent.displayBox(selectedStations, this.formatDate(dateStart), this.formatDate(dateEnd));
        }
        let fdcChart = document.getElementById('fdc').checked;
        if (fdcChart === true) {
          this.$refs.durationComponent.displayDurationCurve(selectedStations, this.formatDate(dateStart), this.formatDate(dateEnd));
        }
        this.$refs.stationComponent.displayStationImages(selectedStations);
      },
      fetchStations (wmaNames) {
        let self = this;
        let fs = require('fs');
        let dir = '../../media';
        // TODO : Create an util class for file storage
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        // Cancel previous request if any
        if (this.stationsRequest) {
          this.stationsRequest.cancel('Canceling stations request');
          this.stationsRequest = null;
        }
        // Wrap wma name with single quotes, for api purposes
        wmaNames = wmaNames.sort();
        for (let i = 0; i < wmaNames.length; i++) {
          wmaNames[i] = `'${wmaNames[i]}'`;
        }
        let url = `${self.stationsApi}?wma=${wmaNames.join()}`;
        let stationFile = `${dir}/${url.hashCode()}.json`;
        if (fs.existsSync(stationFile)) {
          let jsonData = fs.readFileSync(stationFile, 'utf-8');
          let stationsData = JSON.parse(jsonData);
          self.$refs.mapDashboard.loadStationsToMap(stationsData);
          self.createCatchmentTree(stationsData);
        } else {
          self.stationsRequest = axios.CancelToken.source();
          axios.get(url, { cancelToken: self.stationsRequest.token }).then(response => {
            self.$refs.mapDashboard.loadStationsToMap(response.data);
            self.createCatchmentTree(response.data);
            fs.writeFileSync(stationFile, JSON.stringify(response.data));
          }).catch(error => {
            console.log(error);
          });
        }
      },
      generateTreeData (dictionary) {
        let treeData = [];
        let self = this;
        $.each(dictionary, function (key, catchment) {
          let hasChildren = false;
          if (typeof catchment === 'object' || catchment instanceof Array) {
            hasChildren = true;
          }
          let c = {
            text: hasChildren ? key : catchment,
            id: hasChildren ? key : catchment,
            type: hasChildren ? 'layer' : 'station'
          };
          if (hasChildren) {
            c['children'] = self.generateTreeData(catchment);
          };
          treeData.push(c);
        });
        return treeData;
      },
      createCatchmentTree (stationsData) {
        let self = this;
        // Start adding stations data to catchment
        let catchmentsData = self.$refs.mapDashboard.getCatchmentsData();
        for (let i = 0; i < stationsData.features.length; i++) {
          // let primary = stationsData.features[i]['properties']['primary'];
          let secondary = stationsData.features[i]['properties']['secondary'];
          let station = stationsData.features[i]['properties']['station'];
          let place = stationsData.features[i]['properties']['place'];
          let latestReading = stationsData.features[i]['properties']['latest'];
          this.stationsCoordinates[station] = stationsData.features[i].geometry.coordinates;
          if (catchmentsData.hasOwnProperty(secondary)) {
            if (latestReading != null) {
              catchmentsData[secondary].push(station + ': ' + place + ': ' + latestReading.toString().slice(0, 10));
              catchmentsData[secondary].sort();
            } else {
              catchmentsData[secondary].push('Problem with Station');
              catchmentsData[secondary].sort();
            }
          }
        }
        let treeData = self.generateTreeData(catchmentsData);
        this.$refs.catchmentTree.createTree(treeData, this.onCatchmentTreeSelectedHandler, this.onTreeReady);
      },
      onTreeReady (event, data) {
        const self = this;
        stateStore.getState(
          stateStore.keys.selectedCatchments,
          function (selectedCatchments) {
            self.$refs.catchmentTree.toggleMultipleNodes(selectedCatchments, true);
          }
        );
      },
      onCatchmentTreeSelectedHandler (event, data) {
        // On catchment tree clicked
        let i = [];
        let selected = '';
        let selectedCatchments = [];
        let _selectedStations = [];
        let selectedBits = [];
        let _unselectedStations = this.selectedStations;
        for (i = 0; i < data.selected.length; i++) {
          selected = data.instance.get_node(data.selected[i]).text;
          selectedBits = selected.split(':');
          let type = data.instance.get_node(data.selected[i]).type;
          if (type === 'layer') {
            selectedCatchments.push(selectedBits[0]);
          } else if (type === 'station') {
            _selectedStations.push(selectedBits[0]);
            if (_unselectedStations.indexOf(selectedBits[0]) !== -1) _unselectedStations.splice(_unselectedStations.indexOf(selectedBits[0]), 1);
          }
        }
        this.$refs.mapDashboard.toggleSelectedStationsByStationNames(
          _selectedStations,
          _unselectedStations
        );
        this.selectedStations = _selectedStations;
        stateStore.setState(stateStore.keys.selectedCatchments, this.selectedStations);
        this.$refs.mapDashboard.selectCatchments(selectedCatchments);
      }
    }
  };
</script>