
<template>
  <div style="height: 100%;">
    <StatusBar/>
    <div class="container-fluid" style="height: 100%;">
      <div class="row no-gutters" style="height: 100%;">
        <div class="col-md-4 no-float left-panel" style="background: #252526; padding-bottom: 50px; margin-right: 0px;">
          <nav>
         <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
            <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#tabs-1" role="tab" aria-controls="nav-home" aria-selected="true" style="text-align: center;">Select <img src="../../assets/fbis_icon.png" height="11"> FBIS Fish Site</a>
            <a class="nav-item nav-link" data-toggle="tab" href="#tabs-2" role="tab" aria-controls="nav-profile" aria-selected="false">Select Hydrological Sites</a>
          </div>
          </nav>
          <div class="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
            <div class="tab-pane fade show active" id="tabs-1" role="tabpanel">
              <!-- BioTree using BaseCatchmentTree with unique ID -->
              <BaseCatchmentTree
                ref="bioTree"
                tree-id="fish-bio-sites"
                title=""
                :refreshable="false"
                :selectable="true"
                :search-enabled="true"
                container-height="300px"
                @tree-clicked="onBioTreeClickedHandler"
                @tree-ready="onBioTreeReadyHandler"
              />
            </div>
            <div class="tab-pane fade" id="tabs-2" role="tabpanel">
              <!-- HydroTree using BaseCatchmentTree with unique ID -->
              <BaseCatchmentTree
                ref="hydroTree"
                tree-id="fish-hydro-sites"
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
                 <multiselect placeholder="Select Species" :options="fishSpecies" v-model="selectedSpecies" :multiple="true"></multiselect>
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

          <hr>
          <div class="row no-gutters">
            <div class="col-md-12">
            <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;"><h2 style="color:white;">Indicators of Hydrologic Alteration (IHA)</h2></div>
          <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;"><h6 style="color:white;">Methodology based on <i href="https://www.conservationgateway.org/Documents/1996.pdf">Richter et.al. 1996</i>, Descriptors derived from <i href="https://www.blm.gov/sites/default/files/documents/files/Library_BLMResourceNote58.pdf">Swanson, 2002</i></h6></div>
        </div>  
          <div class="col-md-6">
                  <SiteOverview ref="siteComponent" style="margin-top: 5px;"/>
              </div>
              <div class="col-md-6" style="padding-left: 2px;">
                  <FishRadar ref="radarComponent" style="margin-top: 5px;"/>
              </div>             
            <div class="col-md-6" style="padding-left: 2px;">
                  <FishDuration ref="durationComponent" style="margin-top: 5px;"/>
              </div>
              <div class="col-md-6">
                  <FishTimeseries ref="timeseriesComponent" style="margin-top: 5px;"/>
              </div>
              <hr>
              <div class="col-md-12">
                <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;">
                  <div class="numberCircle">1</div></div>
                  <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;"><h5 style="color:white;">Magnitude of monthly water conditions</h5></div>
                  <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;">
                    <div class="col-md-1"></div>
                    <div class="col-md-10">      
                    <p style="color:white;">
                    1. Mean value for each calendar month (12 parameters)
                  </p>
                  </div>
                  <div class="col-md-1"></div>
                </div>

                </div>
             


               <div class="col-md-6" style="padding-left: 2px;">
                  <MonthlyMeans ref="monthlyComponent" style="margin-top: 5px;"/>
              </div>
              <div class="col-md-6" style="padding-left: 2px;"></div>
              <hr>
              <div class="col-md-12">
                <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;">
                  <div class="numberCircle">2</div></div>
                  <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;"><h5 style="color:white;">Magnitude and duration of annual extreme water conditions (mean daily flow)</h5></div>
                  <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;">
                   <div class="col-md-1"></div>
                    <div class="col-md-10">
                    <p style="color:white;">
                    1. Annual 1-day minima, 2. Annual 3-day minima, 3. Annual 7-day minima, 4. Annual 30-day minima, 5. Annual 90-day minima, 6. Annual 1-day maxima, 7. Annual 3-day maxima, 8. Annual 7-day maxima, 9. Annual 30-day maxima, 10. Annual 90-day maxima, 11. Number of zero-flow days, 12. 7-day minima/mean for year
                  </p>   
                </div> 
                <div class="col-md-1"></div>              
                </div>
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
              <hr>
              <div class="col-md-12">
                <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;">
                  <div class="numberCircle">3</div></div>
                  <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;"><h5 style="color:white;">Timing of annual extreme water conditions</h5></div>
                  <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;">
                   <div class="col-md-1"></div>
                    <div class="col-md-10">
                    <p style="color:white;">
                      1. Julian date of each annual 1-day maxima, 2. Julian date of each annual 1-day minima</p>   
                </div> 
                <div class="col-md-1"></div>              
                </div>
                </div>
               <div class="col-md-6" style="padding-left: 2px;">
                  <JulianMax ref="julianmaxComponent" style="margin-top: 5px;"/>
              </div>
               <div class="col-md-6" style="padding-left: 2px;">
                  <JulianMin ref="julianminComponent" style="margin-top: 5px;"/>
              </div>
              <hr>
              <div class="col-md-12">
                <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;">
                  <div class="numberCircle">4</div></div>
                  <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;"><h5 style="color:white;">Frequency and duration of high and low pulses</h5></div>
                  <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;">
                   <div class="col-md-1"></div>
                    <div class="col-md-10">
                    <p style="color:white;">
                      1. Number of low pulses within each year, 2. Mean duration of low pulses each year, 3. Number of high pulses within each year, 4. Mean duration of high pulses each year</p>   
                </div> 
                <div class="col-md-1"></div>              
                </div>
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
                  <FishBox ref="boxComponent" style="margin-top: 5px;"/>
              </div>
              <hr>
              <div class="col-md-12">
                <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;">
                  <div class="numberCircle">5</div></div>
                  <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;"><h5 style="color:white;">Rate and frequency of water condition changes</h5></div>
                  <div class="row h-100 justify-content-center align-items-center" style="margin-bottom: 5px;">
                   <div class="col-md-1"></div>
                    <div class="col-md-10">
                      <p style="color:white;">1. Means of all positive differences between consecutive daily values, 2. Means of all negative differences, between consecutive daily values, 3. Number of hydrologic reversals</p>   
                    </div> 
                <div class="col-md-1"></div>              
                </div>
                </div>
              <br>
          </div>
           <grid-loader :loading="loading" :color="color" :size="size" class="loading_disks"></grid-loader>
        </div>
      </div>
      <NavButtons/>
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
  import SiteOverview from './SiteOverview';
  import FishBox from './FishBox';
  import FishRadar from './FishRadar';
  import FishDuration from './FishDuration';
  import FishTimeseries from './FishTimeseries';
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
  import 'vue-multiselect/dist/vue-multiselect.min.css';
  import Multiselect from 'vue-multiselect';
  import GeoJSON from 'ol/format/GeoJSON';
  import {Fill, Stroke, Style} from 'ol/style';
  import { GridLoader } from 'vue-spinner/dist/vue-spinner.min.js';
  import $ from 'jquery';
  import { remote } from '../../services/electron-compat';
  // Import the event bus composable for automatic cleanup
  import { useEventBus } from '../../composables/useEventBus';
  const { dialog, app } = remote;
  require('promise.prototype.finally').shim();

  export default {
    name: 'FishDashboard',

    components: {
      Header,
      NavButtons,
      MapDashboard,
      GridLoader,
      BaseCatchmentTree,
      Multiselect,
      SiteOverview,
      StatusBar,
      FishTimeseries,
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
      FishBox,
      FishDuration,
      FishRadar
    },

    setup() {
      // Use the event bus composable - listeners will be auto-cleaned on unmount
      const { on, emit } = useEventBus();
      return { busOn: on, busEmit: emit };
    },

    data () {
      return {
        fishAPI: 'https://inwards.award.org.za/app_json/fish_sites.php',
        verifiedAPI: 'https://inwards.award.org.za/app_json/verified_stations.php',
        stationsCoordinates: {}, // To stored all stations with their coordinates
        stationsFeatures: {}, // To stored station features
        stationsRequest: null,
        selectedBioStations: [],
        selectedHydroStations: [],
        selectedSpecies: null,
        selectedWMAs: [],
        fishSelected: [],
        fishSpecies: [],
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
      bioTreeRef() {
        return this.$refs.bioTree;
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
        self.bioTreeRef.toggleNode(station, selected);
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
      loadSpecies (fishSelected) {
        // console.log('http://inwards.award.org.za/app_json/fish_species.php?site=' + fishSelected);
        axios.get('http://inwards.award.org.za/app_json/fish_species.php?site=' + fishSelected).then(response => {
          this.fishSpecies = response.data;
        }).catch(e => {
        });
      },
      doAnalysis () {
        // console.log(this.selectedSpecies);
        // console.log(this.selectedBioStations[0]);
        // console.log(this.selectedHydroStations[0]);
        if (this.selectedBioStations.length === 0) {
          dialog.showMessageBox(null, {
            type: 'warning',
            message: 'Please select at least one fish site',
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
        this.$refs.siteComponent.siteTable(this.selectedBioStations);
        this.selectedSpecies = ["All"];
        // this.$refs.boxComponent.displayChart(this.selectedBioStations, this.selectedVariable[0], this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedVariable[1]);
        this.$refs.timeseriesComponent.displayChart(this.selectedHydroStations, this.selectedBioStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedSpecies);
        // this.$refs.durationComponent.displayChart(this.selectedBioStations, this.selectedVariable[0], this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedVariable[1]);
        this.$refs.durationComponent.displayChart(this.selectedHydroStations, this.selectedBioStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedSpecies);
        this.$refs.radarComponent.displayChart(this.selectedHydroStations, this.selectedBioStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedSpecies);
        this.$refs.lowComponent.displayChart(this.selectedHydroStations, this.selectedBioStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedSpecies);
        this.$refs.highComponent.displayChart(this.selectedHydroStations, this.selectedBioStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedSpecies);
        this.$refs.zeroComponent.displayChart(this.selectedHydroStations, this.selectedBioStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedSpecies);
        this.$refs.baseComponent.displayChart(this.selectedHydroStations, this.selectedBioStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedSpecies);
        this.$refs.julianmaxComponent.displayChart(this.selectedHydroStations, this.selectedBioStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedSpecies);
        this.$refs.julianminComponent.displayChart(this.selectedHydroStations, this.selectedBioStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedSpecies);
        this.$refs.highpulseComponent.displayChart(this.selectedHydroStations, this.selectedBioStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedSpecies);
        this.$refs.highdurationComponent.displayChart(this.selectedHydroStations, this.selectedBioStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedSpecies);
        this.$refs.extremepulsesComponent.displayChart(this.selectedHydroStations, this.selectedBioStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedSpecies);
        this.$refs.extremedurationComponent.displayChart(this.selectedHydroStations, this.selectedBioStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedSpecies);
        this.$refs.monthlyComponent.displayChart(this.selectedHydroStations, this.selectedBioStations, this.formatDate(dateStart), this.formatDate(dateEnd), this.selectedSpecies);
        this.loading = false;
      },
      async fetchStations () {
        let self = this;
        let wmaNames = Object.assign([], self.selectedWMAs);
        // console.log(self.selectedWMAs);

        // Helper function to compute hash code for URL
        const hashCode = (str) => str.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);

        // Get userData path and set up stations directory
        const userDataPath = await window.electronAPI.getUserDataPath();
        const dir = userDataPath + '/stations';

        // TODO : Create an util class for file storage
        const dirExists = await window.electronAPI.fileExists(dir);
        if (!dirExists) {
          await window.electronAPI.mkdir(dir);
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
        let bioUrl = `${self.fishAPI}?wma=${wmaNames.join()}`;

        console.log(bioUrl);
        let bioFile = `${dir}/${hashCode(bioUrl)}.json`;
        // console.log(bioFile);
        // Check if online
        if (navigator.onLine) {
          let cancelToken = null;
          if (self.stationsRequest) {
            cancelToken = self.stationsRequest.token;
          }
          axios.get(bioUrl, { cancelToken: cancelToken }).then(async response => {
            self.mapDashboardRef.loadBioStationsToMap(response.data);
            await window.electronAPI.writeFile(bioFile, JSON.stringify(response.data));
            self.createBioTree(response.data);
          }).catch(error => {
            console.log(error);
          });
        } else {
          const bioFileExists = await window.electronAPI.fileExists(bioFile);
          if (bioFileExists) {
            let jsonData = await window.electronAPI.readFile(bioFile);
            let stationsData = JSON.parse(jsonData);
            self.mapDashboardRef.loadBioStationsToMap(stationsData);
            self.createBioTree(stationsData);
          }
        }
        let hydroUrl = `${self.verifiedAPI}?wma=${wmaNames.join()}`;

        // console.log(url);
        let hydroFile = `${dir}/${hashCode(hydroUrl)}.json`;
        // console.log(bioFile);
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
          stateStore.keys.selectedBioStations,
          function (selectedBioStations) {
            if (!selectedBioStations || typeof selectedBioStations === 'undefined') {
              selectedBioStations = {};
            }
            for (let i = 0; i < stations.length; i++) {
              if (!selectedBioStations[stations[i]]) {
                selectedBioStations[stations[i]] = {
                  'feature': self.stationsFeatures[stations[i]],
                  'stationCoord': self.stationsCoordinates[stations[i]],
                  'chartStored': [chartStoredId]
                };
              } else {
                if (selectedBioStations[stations[i]]['chartStored'].indexOf(chartStoredId) < 0) {
                  selectedBioStations[stations[i]]['chartStored'].push(chartStoredId);
                }
              }
            }
            stateStore.setState(
              stateStore.keys.selectedBioStations,
              selectedBioStations
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
      createBioTree (stationsData) {
        let self = this;
        // Start adding stations data to catchment
        let bioData = self.mapDashboardRef.getCatchmentsData();
        for (let i = 0; i < stationsData.features.length; i++) {
          // let primary = stationsData.features[i]['properties']['primary'];
          let secondary = stationsData.features[i]['properties']['secondary'];
          let station = stationsData.features[i]['properties']['station'];
          let place = stationsData.features[i]['properties']['site'];

          this.stationsFeatures[station] = stationsData.features[i];
          this.stationsCoordinates[station] = stationsData.features[i].geometry.coordinates;

          if (bioData.hasOwnProperty(secondary)) {
            let stationName = station + ': ' + place;
            bioData[secondary].push(stationName);
            bioData[secondary].sort();
          }
        }
        // console.log(catchmentsData);
        let treeData = self.generateBioTreeData(bioData);
        this.bioTreeRef.createTree(treeData, this.onBioTreeSelectedHandler, this.onBioTreeReady);
      },
      // Raw callback for createTree (receives event, data directly)
      onBioTreeReady (event, data) {
        const self = this;
        stateStore.getState(
          stateStore.keys.selectedBio,
          function (selectedBio) {
            if (!selectedBio) {
              return false;
            }
            self.bioTreeRef.toggleMultipleNodes(selectedBio, true);
          }
        );
      },
      // Component event handler (receives { event, data } object)
      onBioTreeReadyHandler ({ event, data }) {
        this.onBioTreeReady(event, data);
      },
      generateBioTreeData (dictionary) {
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
            c['children'] = self.generateBioTreeData(catchment);
          };
          treeData.push(c);
        });
        return treeData;
      },
      // Raw callback for createTree (receives event, data directly)
      onBioTreeSelectedHandler (event, data) {
        // On catchment tree clicked
        let i = [];
        let selected = '';
        let selectedBio = [];
        let _selectedBioStations = [];
        let selectedBits = [];
        let _unselectedBioStations = Object.assign([], this.selectedBioStations);
        // console.log(_unselectedBioStations);
        for (i = 0; i < data.selected.length; i++) {
          selected = data.instance.get_node(data.selected[i]).text;
          selectedBits = selected.split(':');
          let type = data.instance.get_node(data.selected[i]).type;
          if (type === 'layer') {
            selectedBio.push(selectedBits[0]);
          } else if (type === 'station') {
            _selectedBioStations.push(selectedBits[0]);
            if (_unselectedBioStations.indexOf(selectedBits[0]) !== -1) _unselectedBioStations.splice(_unselectedBioStations.indexOf(selectedBits[0]), 1);
          }
        }
        this.mapDashboardRef.toggleSelectedBioStationsByStationNames(
          _selectedBioStations,
          _unselectedBioStations
        );
        this.selectedBioStations = _selectedBioStations;
        stateStore.setState(stateStore.keys.selectedBio, this.selectedBioStations);
        this.mapDashboardRef.selectBio(selectedBio);
        this.loadSpecies(_selectedBioStations);
      },
      // Component event handler (receives { event, data } object)
      onBioTreeClickedHandler ({ event, data }) {
        this.onBioTreeSelectedHandler(event, data);
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