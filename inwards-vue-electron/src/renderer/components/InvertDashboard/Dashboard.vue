
<template>
  <div style="height: 100%;">
    <StatusBar/>
    <div id="content">
    <div class="container-fluid" style="height: 100%;">
      <div class="row no-gutters" style="height: 100%;">
        <div class="col-md-4 no-float left-panel" style="background: #252526; padding-bottom: 50px; margin-right: 0px;">
          <nav>
         <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
            <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#tabs-1" role="tab" aria-controls="nav-home" aria-selected="true" style="text-align: center;">Select <img src="../../assets/fbis_icon.png" height="11"> FBIS Invert Site</a>
            <a class="nav-item nav-link" data-toggle="tab" href="#tabs-2" role="tab" aria-controls="nav-profile" aria-selected="false">Select Hydrological Sites</a>
          </div>
          </nav>
          <div class="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
            <div class="tab-pane fade show active" id="tabs-1" role="tabpanel">
              <!-- InvertTree using BaseCatchmentTree with unique ID -->
              <BaseCatchmentTree
                ref="invertTree"
                tree-id="invert-sites"
                title=""
                :refreshable="false"
                :selectable="true"
                :search-enabled="true"
                container-height="300px"
                @tree-clicked="onInvertTreeClickedHandler"
                @tree-ready="onInvertTreeReadyHandler"
              />
            </div>
            <div class="tab-pane fade" id="tabs-2" role="tabpanel">
              <!-- HydroTree using BaseCatchmentTree with unique ID -->
              <BaseCatchmentTree
                ref="hydroTree"
                tree-id="invert-hydro-sites"
                title=""
                :refreshable="false"
                :selectable="true"
                :search-enabled="true"
                container-height="300px"
                @tree-clicked="onHydroTreeClickedHandler"
                @tree-ready="onHydroTreeReadyHandler"
              />
            </div>
          </div>
          <div class="v-space"></div>
           <MapDashboard ref="mapDashboard"/>
          <div class="v-space"></div>

          <div class="card rounded-0">

            <div class="card-body">
                    <div class="row no-gutters">
                <div class="col-md-12">
                 <multiselect placeholder="Select Family" :options="invertFamily" v-model="selectedFamily" :multiple="true"></multiselect>
                </div>
                    </div>
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
              </div>
          <div class="v-space"></div>
          <div class="card rounded-0">
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                <button class="btn inwards_button" type="button" style="width: 100%" @click="doAnalysis()">
                  <i class="fa fa-line-chart"></i>View Analysis
                </button>
                </div>
              </div>
            </div>
          </div>
          </div>
            </div>
        <div class="col-md-8 no-float right-panel" style="background: #1E1E1E; padding-bottom: 50px; padding-left: 10px; padding-right: 10px;">

          <div class="row no-gutters">
            <div class="col-md-6">
                  <InvertSiteOverview ref="invertsiteComponent" style="margin-top: 5px;"/>
              </div>
              <div class="col-md-6" style="padding-left: 2px;">
                  <InvertRadar ref="radarComponent" style="margin-top: 5px;"/>
              </div>
            <div class="col-md-6" style="padding-left: 2px;">
                  <InvertDuration ref="invertdurationComponent" style="margin-top: 5px;"/>
              </div>

            <div class="col-md-6">
                  <InvertTimeseries ref="inverttimeseriesComponent" style="margin-top: 5px;"/>
              </div>

               <div class="col-md-6" style="padding-left: 2px;">
                  <MonthlyMeans ref="monthlyComponent" style="margin-top: 5px;"/>
              </div>
              <div class="col-md-6" style="padding-left: 2px;">
                  <LowFlowTimeseries ref="lowComponent" style="margin-top: 5px;"/>
              </div>
               <div class="col-md-6" style="padding-left: 2px;">
                  <HighFlowTimeseries ref="highComponent" style="margin-top: 5px;"/>
              </div>
               <div class="col-md-6" style="padding-left: 2px;">
                  <ZeroFlows ref="zeroComponent" style="margin-top: 5px;"/>
              </div>
               <div class="col-md-6" style="padding-left: 2px;">
                  <BaseFlowIndex ref="baseComponent" style="margin-top: 5px;"/>
              </div>
               <div class="col-md-6" style="padding-left: 2px;">
                  <JulianMax ref="julianmaxComponent" style="margin-top: 5px;"/>
              </div>
               <div class="col-md-6" style="padding-left: 2px;">
                  <JulianMin ref="julianminComponent" style="margin-top: 5px;"/>
              </div>
               <div class="col-md-6" style="padding-left: 2px;">
                  <HighPulse ref="highpulseComponent" style="margin-top: 5px;"/>
              </div>
               <div class="col-md-6" style="padding-left: 2px;">
                  <HighFlowDuration ref="highdurationComponent" style="margin-top: 5px;"/>
              </div>
               <div class="col-md-6" style="padding-left: 2px;">
                  <ExtremeLowPulses ref="extremepulsesComponent" style="margin-top: 5px;"/>
              </div>
               <div class="col-md-6" style="padding-left: 2px;">
                  <ExtremeLowDuration ref="extremedurationComponent" style="margin-top: 5px;"/>
              </div>
              <div class="col-md-6" style="padding-left: 2px;">
                  <InvertBox ref="boxComponent" style="margin-top: 5px;"/>
              </div>
              <br>
          </div>
           <grid-loader :loading="loading" :color="color" :size="size" class="loading_disks"></grid-loader>
        </div>
      </div>
      <NavButtons/>
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
  .chartDivId.c3-line-[Discharge] {
    stroke-width: 0.5px;
  }
  .right-panel {
      overflow-y: scroll;
  }
  .left-panel {
      overflow-y: scroll;
  }
  .c3-line-Reserve {
      stroke-width: 2px;
  }
  .c3-line-Observed {
      stroke-width: 2px;
  }
  .c3-line-Last_Year {
      stroke-width: 2px;
      stroke-dasharray: 5.5;
  }
  .c3-circle-Events {
      stroke-width: 15px;
      stroke: rgb(0, 0, 0);
  }  
</style>
<script>
  import axios from 'axios';
  import Header from '../../components/Header';
  import NavButtons from '../../components/NavButtons';
  import StatusBar from '../StatusBar';
  import MapDashboard from './MapDashboard';
  import InvertSiteOverview from './InvertSiteOverview';
  import InvertBox from './InvertBox';
  import InvertRadar from './InvertRadar';
  import InvertDuration from './InvertDuration';
  import InvertTimeseries from './InvertTimeseries';
  import MonthlyMeans from './MonthlyMeans';
  import LowFlowTimeseries from './LowFlowTimeseries';
  import HighFlowTimeseries from './HighFlowTimeseries';
  import ZeroFlows from './ZeroFlows';
  import HighPulse from './HighPulse';
  import ExtremeLowPulses from './ExtremeLowPulses';
  import HighFlowDuration from './HighFlowDuration';
  import ExtremeLowDuration from './ExtremeLowDuration';
  import JulianMax from './JulianMax';
  import JulianMin from './JulianMin';
  import BaseFlowIndex from './BaseFlowIndex';
  // Import base component for trees
  import BaseCatchmentTree from '../shared/BaseCatchmentTree.vue';
  import stateStore from '../../store/state_handler';
  import VectorLayer from 'ol/layer/Vector';
  import VectorSource from 'ol/source/Vector';
  import Multiselect from 'vue-multiselect';
  import GeoJSON from 'ol/format/GeoJSON';
  import {Fill, Stroke, Style} from 'ol/style';
  import { GridLoader } from 'vue-spinner/dist/vue-spinner.min.js';
  import $ from 'jquery';
  import { remote, dialog } from '../../services/electron-compat';
  // Import the event bus composable for automatic cleanup
  import { useEventBus } from '../../composables/useEventBus';
  const { app } = remote;
  require('promise.prototype.finally').shim();

  export default {
    name: 'InvertDashboard',

    components: {
      Header,
      NavButtons,
      MapDashboard,
      GridLoader,
      BaseCatchmentTree,
      Multiselect,
      InvertSiteOverview,
      StatusBar,
      InvertTimeseries,
      HighPulse,
      MonthlyMeans,
      ZeroFlows,
      JulianMax,
      JulianMin,
      HighFlowDuration,
      ExtremeLowPulses,
      ExtremeLowDuration,
      BaseFlowIndex,
      LowFlowTimeseries,
      HighFlowTimeseries,
      InvertBox,
      InvertDuration,
      InvertRadar
    },

    setup() {
      // Use the event bus composable - listeners will be auto-cleaned on unmount
      const { on, emit } = useEventBus();
      return { busOn: on, busEmit: emit };
    },

    data () {
      return {
        invertAPI: 'https://inwards.award.org.za/app_json/invert_sites.php',
        verifiedAPI: 'https://inwards.award.org.za/app_json/verified_stations.php',
        stationsCoordinates: {}, // To stored all stations with their coordinates
        stationsFeatures: {}, // To stored station features
        stationsRequest: null,
        selectedInvertStations: [],
        selectedHydroStations: [],
        selectedFamily: null,
        selectedWMAs: [],
        invertSelected: [],
        invertFamily: [],
        color: '#177a98',
        height: '35px',
        width: '4px',
        margin: '2px',
        size: '40px',
        loading: true,
        radius: '2px'
      };
    },

    computed: {
      mapDashboardRef() {
        return this.$refs.mapDashboard;
      },
      invertTreeRef() {
        return this.$refs.invertTree;
      },
      hydroTreeRef() {
        return this.$refs.hydroTree;
      }
    },

    mounted () {
      let self = this;
      stateStore.getState(
        stateStore.keys.selectedWMAs,
        function (selectedWMAs) {
          if (!selectedWMAs) {
            return false;
          }
          if (selectedWMAs.length === 0) {
            return false;
          }
          self.selectedWMAs = selectedWMAs;
          self.mapDashboardRef.showSelectedWMA(selectedWMAs);
          self.fetchStations();
        }
      );
      // Use busOn for automatic cleanup on unmount
      self.busOn('stationSelectedFromMap', (payload) => {
        const { station, selected } = payload;
        self.invertTreeRef.toggleNode(station, selected);
        self.hydroTreeRef.toggleNode(station, selected);
      });
      self.busOn('refreshStations', () => {
        self.fetchStations();
      });
      self.busOn('addStationsToStore', (payload) => {
        // Mitt only passes one argument
        const { stations, chartStoredId } = payload;
        self.addStationsToStore(stations, chartStoredId);
      });
      let map = this.$refs.mapDashboard.map;
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
      self.fetchStations();
      self.addKnpLayer(map);
      this.loading = false;
    },
    methods: {
      showSelectMap () {
        this.$refs.selectComponent.showLogModal();
      },
      loadFamily (invertSelected) {
        // console.log('http://inwards.award.org.za/app_json/invert_family.php?site=' + invertSelected);
        axios.get('http://inwards.award.org.za/app_json/invert_family.php?site=' + invertSelected).then(response => {
          this.invertFamily = response.data;
        }).catch(e => {
        });
      },
      doAnalysis () {
        // console.log(this.selectedFamily);
        // console.log(this.selectedInvertStations[0]);
        // console.log(this.selectedHydroStations[0]);
        if (this.selectedInvertStations.length === 0) {
          dialog.showMessageBox(null, {
            type: 'warning',
            message: 'Please select at least one invert site',
            buttons: ['OK']
          });
          return;
        }
        let dateStartString = $('#dateStart').val();
        let dateEndString = $('#dateEnd').val();
        if (!dateStartString || !dateEndString) {
          dialog.showMessageBox(null, {
            type: 'warning',
            message: 'Missing start date / end date',
            buttons: ['OK']
          });
          return;
        }
        let dateStart = new Date(dateStartString);
        let dateEnd = new Date(dateEndString);
        if (dateStart > dateEnd) {
          dialog.showMessageBox(null, {
            type: 'warning',
            message: 'End date should be after start date',
            buttons: ['OK']
          });
          return;
        }
        this.loading = true;
        this.selectedFamily = ["All"];

        this.$refs.invertsiteComponent.invertsiteTable(this.selectedInvertStations);
        // this.$refs.boxComponent.displayChart(this.selectedInvertStations, this.selectedVariable[0], this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedVariable[1]);
        this.$refs.inverttimeseriesComponent.displayChart(this.selectedHydroStations, this.selectedInvertStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedFamily);
        // this.$refs.durationComponent.displayChart(this.selectedInvertStations, this.selectedVariable[0], this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedVariable[1]);
        this.$refs.invertdurationComponent.displayChart(this.selectedHydroStations, this.selectedInvertStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedFamily);
        this.$refs.radarComponent.displayChart(this.selectedHydroStations, this.selectedInvertStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedFamily);
        this.$refs.lowComponent.displayChart(this.selectedHydroStations, this.selectedInvertStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedFamily);
        this.$refs.highComponent.displayChart(this.selectedHydroStations, this.selectedInvertStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedFamily);
        this.$refs.zeroComponent.displayChart(this.selectedHydroStations, this.selectedInvertStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedFamily);
        this.$refs.baseComponent.displayChart(this.selectedHydroStations, this.selectedInvertStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedFamily);
        this.$refs.julianmaxComponent.displayChart(this.selectedHydroStations, this.selectedInvertStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedFamily);
        this.$refs.julianminComponent.displayChart(this.selectedHydroStations, this.selectedInvertStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedFamily);
        this.$refs.highpulseComponent.displayChart(this.selectedHydroStations, this.selectedInvertStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedFamily);
        this.$refs.highdurationComponent.displayChart(this.selectedHydroStations, this.selectedInvertStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedFamily);
        this.$refs.extremepulsesComponent.displayChart(this.selectedHydroStations, this.selectedInvertStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedFamily);
        this.$refs.extremedurationComponent.displayChart(this.selectedHydroStations, this.selectedInvertStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedFamily);
        this.$refs.monthlyComponent.displayChart(this.selectedHydroStations, this.selectedInvertStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedFamily);
        this.loading = false;
      },
      async fetchStations () {
        let self = this;
        let wmaNames = Object.assign([], self.selectedWMAs);
        // console.log(self.selectedWMAs);

        // Helper function to generate hash code for URL
        const hashCode = (str) => str.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);

        // Get user data path and ensure stations directory exists
        const userDataPath = await window.electronAPI.getUserDataPath();
        const dir = `${userDataPath}/stations`;

        // Ensure directory exists
        const dirExists = await window.electronAPI.fileExists(dir);
        if (!dirExists) {
          await window.electronAPI.createDirectory(dir);
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
        // console.log(wmaNames[0]);
        let invertUrl = `${self.invertAPI}?wma=${wmaNames.join()}`;


        // console.log(invertUrl);
        let invertFile = `${dir}/${hashCode(invertUrl)}.json`;
        // console.log(invertFile);
        // Check if online
        if (navigator.onLine) {
          let cancelToken = null;
          if (self.stationsRequest) {
            cancelToken = self.stationsRequest.token;
          }
          axios.get(invertUrl, { cancelToken: cancelToken }).then(async response => {
            self.mapDashboardRef.loadInvertStationsToMap(response.data);
            await window.electronAPI.writeFile(invertFile, JSON.stringify(response.data));
            self.createInvertTree(response.data);
          }).catch(error => {
            console.log(error);
          });
        } else {
          const invertFileExists = await window.electronAPI.fileExists(invertFile);
          if (invertFileExists) {
            let jsonData = await window.electronAPI.readFile(invertFile);
            let stationsData = JSON.parse(jsonData);
            self.mapDashboardRef.loadInvertStationsToMap(stationsData);
            self.createInvertTree(stationsData);
          }
        }
        let hydroUrl = `${self.verifiedAPI}?wma=${wmaNames.join()}`;

        // console.log(url);
        let hydroFile = `${dir}/${hashCode(hydroUrl)}.json`;
        // console.log(invertFile);
        // Check if online
        if (navigator.onLine) {
          let cancelToken = null;
          if (self.stationsRequest) {
            cancelToken = self.stationsRequest.token;
          }
          axios.get(hydroUrl, { cancelToken: cancelToken }).then(async response => {
            self.mapDashboardRef.loadHydroStationsToMap(response.data);
            await window.electronAPI.writeFile(hydroFile, JSON.stringify(response.data));
            self.createHydroTree(response.data);
          }).catch(error => {
            console.log(error);
          });
        } else {
          const hydroFileExists = await window.electronAPI.fileExists(hydroFile);
          if (hydroFileExists) {
            let jsonData = await window.electronAPI.readFile(hydroFile);
            let stationsData = JSON.parse(jsonData);
            self.mapDashboardRef.loadHydroStationsToMap(stationsData);
            self.createHydroTree(stationsData);
          }
        }
        // Note: Event listeners are registered once in mounted() using busOn for auto-cleanup
        // No need to register them here to avoid duplicate listeners
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
        startDate.setDate(startDate.getDate() - 18250);
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
      addStationsToStore (stations, chartStoredId) {
        let self = this;
        stateStore.getState(
          stateStore.keys.selectedInvertStations,
          function (selectedInvertStations) {
            if (!selectedInvertStations || typeof selectedInvertStations === 'undefined') {
              selectedInvertStations = {};
            }
            for (let i = 0; i < stations.length; i++) {
              if (!selectedInvertStations[stations[i]]) {
                selectedInvertStations[stations[i]] = {
                  'feature': self.stationsFeatures[stations[i]],
                  'stationCoord': self.stationsCoordinates[stations[i]],
                  'chartStored': [chartStoredId]
                };
              } else {
                if (selectedInvertStations[stations[i]]['chartStored'].indexOf(chartStoredId) < 0) {
                  selectedInvertStations[stations[i]]['chartStored'].push(chartStoredId);
                }
              }
            }
            stateStore.setState(
              stateStore.keys.selectedInvertStations,
              selectedInvertStations
            );
          }
        );
      },
      addHydroStationsToStore (stations, chartStoredId) {
        let self = this;
        stateStore.getState(
          stateStore.keys.selectedHydroStations,
          function (selectedHydroStations) {
            if (!selectedHydroStations || typeof selectedHydroStations === 'undefined') {
              selectedHydroStations = {};
            }
            for (let i = 0; i < stations.length; i++) {
              if (!selectedHydroStations[stations[i]]) {
                selectedHydroStations[stations[i]] = {
                  'feature': self.stationsFeatures[stations[i]],
                  'stationCoord': self.stationsCoordinates[stations[i]],
                  'chartStored': [chartStoredId]
                };
              } else {
                if (selectedHydroStations[stations[i]]['chartStored'].indexOf(chartStoredId) < 0) {
                  selectedHydroStations[stations[i]]['chartStored'].push(chartStoredId);
                }
              }
            }
            stateStore.setState(
              stateStore.keys.selectedHydroStations,
              selectedHydroStations
            );
          }
        );
      },
      addKnpLayer (map) {
        const knpJson = require('../../assets/knp.json');
        let knpLayer = new VectorLayer({
          source: new VectorSource({
            features: (new GeoJSON({
              defaultDataProjection: 'EPSG:4326'
            })).readFeatures(knpJson, {
              dataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857'
            })
          }),
          updateWhileAnimating: false,
          updateWhileInteracting: false
        });
        let knpStyle = new Style({
          stroke: new Stroke({
            color: [51, 204, 51, 0.6],
            width: 1
          }),
          fill: new Fill({
            color: [51, 204, 51, 0.2]
          }),
          zIndex: -1
        });
        knpLayer.setStyle(knpStyle);
      },
      createInvertTree (stationsData) {
        let self = this;
        // Start adding stations data to catchment
        let invertData = self.mapDashboardRef.getCatchmentsData();
        for (let i = 0; i < stationsData.features.length; i++) {
          // let primary = stationsData.features[i]['properties']['primary'];
          let secondary = stationsData.features[i]['properties']['secondary'];
          let station = stationsData.features[i]['properties']['station'];
          let place = stationsData.features[i]['properties']['site'];

          this.stationsFeatures[station] = stationsData.features[i];
          this.stationsCoordinates[station] = stationsData.features[i].geometry.coordinates;

          if (invertData.hasOwnProperty(secondary)) {
            let stationName = station + ': ' + place;
            invertData[secondary].push(stationName);
            invertData[secondary].sort();
          }
        }
        // console.log(catchmentsData);
        let treeData = self.generateInvertTreeData(invertData);
        this.invertTreeRef.createTree(treeData, this.onInvertTreeSelectedHandler, this.onInvertTreeReady);
      },
      // Raw callback for createTree (receives event, data directly)
      onInvertTreeReady (event, data) {
        const self = this;
        stateStore.getState(
          stateStore.keys.selectedInvert,
          function (selectedInvert) {
            if (!selectedInvert) {
              return false;
            }
            self.invertTreeRef.toggleMultipleNodes(selectedInvert, true);
          }
        );
      },
      // Component event handler (receives { event, data } object)
      onInvertTreeReadyHandler ({ event, data }) {
        this.onInvertTreeReady(event, data);
      },
      generateInvertTreeData (dictionary) {
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
            c['children'] = self.generateInvertTreeData(catchment);
          };
          treeData.push(c);
        });
        return treeData;
      },
      // Raw callback for createTree (receives event, data directly)
      onInvertTreeSelectedHandler (event, data) {
        // On catchment tree clicked
        let i = [];
        let selected = '';
        let selectedInvert = [];
        let _selectedInvertStations = [];
        let selectedBits = [];
        let _unselectedInvertStations = Object.assign([], this.selectedInvertStations);
        // console.log(_unselectedInvertStations);
        for (i = 0; i < data.selected.length; i++) {
          selected = data.instance.get_node(data.selected[i]).text;
          selectedBits = selected.split(':');
          let type = data.instance.get_node(data.selected[i]).type;
          if (type === 'layer') {
            selectedInvert.push(selectedBits[0]);
          } else if (type === 'station') {
            _selectedInvertStations.push(selectedBits[0]);
            if (_unselectedInvertStations.indexOf(selectedBits[0]) !== -1) _unselectedInvertStations.splice(_unselectedInvertStations.indexOf(selectedBits[0]), 1);
          }
        }
        this.mapDashboardRef.toggleSelectedInvertStationsByStationNames(
          _selectedInvertStations,
          _unselectedInvertStations
        );
        this.selectedInvertStations = _selectedInvertStations;
        stateStore.setState(stateStore.keys.selectedInvert, this.selectedInvertStations);
        this.mapDashboardRef.selectInvert(selectedInvert);
        this.loadFamily(_selectedInvertStations);
      },
      // Component event handler (receives { event, data } object)
      onInvertTreeClickedHandler ({ event, data }) {
        this.onInvertTreeSelectedHandler(event, data);
      },
      createHydroTree (stationsData) {
        let self = this;
        // Start adding stations data to catchment
        let hydroData = self.mapDashboardRef.getCatchmentsData();
        for (let i = 0; i < stationsData.features.length; i++) {
          // let primary = stationsData.features[i]['properties']['primary'];
          let secondary = stationsData.features[i]['properties']['secondary'];
          let station = stationsData.features[i]['properties']['station'];
          let place = stationsData.features[i]['properties']['place'];

          this.stationsFeatures[station] = stationsData.features[i];
          this.stationsCoordinates[station] = stationsData.features[i].geometry.coordinates;

          if (hydroData.hasOwnProperty(secondary)) {
            let stationName = station + ': ' + place;
            hydroData[secondary].push(stationName);
            hydroData[secondary].sort();
          }
        }
        // console.log(catchmentsData);
        let treeData = self.generateHydroTreeData(hydroData);
        this.hydroTreeRef.createTree(treeData, this.onHydroTreeSelectedHandler, this.onHydroTreeReady);
      },
      // Raw callback for createTree (receives event, data directly)
      onHydroTreeReady (event, data) {
        const self = this;
        stateStore.getState(
          stateStore.keys.selectedHydro,
          function (selectedHydro) {
            if (!selectedHydro) {
              return false;
            }
            self.hydroTreeRef.toggleMultipleNodes(selectedHydro, true);
          }
        );
      },
      // Component event handler (receives { event, data } object)
      onHydroTreeReadyHandler ({ event, data }) {
        this.onHydroTreeReady(event, data);
      },
      generateHydroTreeData (dictionary) {
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
            c['children'] = self.generateHydroTreeData(catchment);
          };
          treeData.push(c);
        });
        return treeData;
      },
      // Raw callback for createTree (receives event, data directly)
      onHydroTreeSelectedHandler (event, data) {
        // On catchment tree clicked
        let i = [];
        let selected = '';
        let selectedHydro = [];
        let _selectedHydroStations = [];
        let selectedBits = [];
        let _unselectedHydroStations = Object.assign([], this.selectedHydroStations);
        // console.log(_unselectedHydroStations);
        for (i = 0; i < data.selected.length; i++) {
          selected = data.instance.get_node(data.selected[i]).text;
          selectedBits = selected.split(':');
          let type = data.instance.get_node(data.selected[i]).type;
          if (type === 'layer') {
            selectedHydro.push(selectedBits[0]);
          } else if (type === 'station') {
            _selectedHydroStations.push(selectedBits[0]);
            if (_unselectedHydroStations.indexOf(selectedBits[0]) !== -1) _unselectedHydroStations.splice(_unselectedHydroStations.indexOf(selectedBits[0]), 1);
          }
        }
        this.mapDashboardRef.toggleSelectedHydroStationsByStationNames(
          _selectedHydroStations,
          _unselectedHydroStations
        );
        this.selectedHydroStations = _selectedHydroStations;
        stateStore.setState(stateStore.keys.selectedHydro, this.selectedHydroStations);
        this.mapDashboardRef.selectHydro(selectedHydro);
      },
      // Component event handler (receives { event, data } object)
      onHydroTreeClickedHandler ({ event, data }) {
        this.onHydroTreeSelectedHandler(event, data);
      },
      // Helper method to format dates
      formatDate (date) {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return yyyy + '-' + mm + '-' + dd;
      }
    }
  };
</script>