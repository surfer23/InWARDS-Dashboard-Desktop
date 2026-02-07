<template>
  <div style="height: 100%;">
    <StatusBar/>
    <div class="container-fluid" style="height: 100%;">
      <div class="row no-gutters" style="height: 100%;">
        <div class="col-md-4 no-float left-panel" style="background: #252526; padding-bottom: 50px; margin-right: 0px; margin-top: 6px;">
          <!-- Using BaseMapDashboard with unique mapId -->
          <BaseMapDashboard
            ref="mapDashboard"
            map-id="knp-dashboard-map"
            map-height="410px"
            :connected-to-tree="false"
          />
          <div class="v-space"></div>
          <div class="card rounded-0" style="margin-top: 5px; margin-bottom: 5px;">
            <div class="card-body">
              <ComplianceTable ref="complianceTable"/>
            </div>
          </div>

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
                <div class="row no-gutters">
                <div class="col-md-12" style="padding: 1px; background: none;">
                <button class="btn inwards_button btn-labeled text-left" style="width: 100%" @click="updateCharts()" type="button"><span class="btn-label"><i class="fa fa-line-chart" aria-hidden="true"></i></span>Update<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right; "></i></button>
                </div>
              </div>
              <div class="row no-gutters">
                <div class="col-md-6" style="padding: 1px; background: none;">
                  <button id="viewKNPLogs" class="btn inwards_button btn-labeled text-left" style="width: 100%" @click="showRiverLog()" type="button"><span class="btn-label"><i class="fa fa-book"></i></span>View River Log Book<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right;"></i></button>
                </div>
                <div class="col-md-6" style="padding: 1px; background: none;">
                  <button id="submitLog" class="btn inwards_button btn-labeled text-left" style="width: 100%" @click="submitRiverLog()" type="button"><span class="btn-label"><i class="fa fa-pencil-square-o"></i></span>Submit Log<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right;"></i></button>
                </div>
              </div>
              <div class="row no-gutters">
                <div class="col-md-6" style="padding: 1px; background: none;">
                  <button id="unverified" class="btn inwards_button btn-labeled text-left" style="width: 100%" @click="showSubmitForm()" type="button"><span class="btn-label"><i class="fa fa-file-image-o"></i></span>Submit Plate Reading<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right;"></i></button>
                </div>
                <div class="col-md-6" style="padding: 1px; background: none;">
                  <button id="viewPlates" class="btn inwards_button btn-labeled text-left" style="width: 100%" @click="showPlatesForm()" type="button"><span class="btn-label"><i class="fa fa-file-image-o"></i></span>Plate Submissions<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right;"></i></button>
                </div>
              </div>
            </div>
          </div>
          <div class="v-space"></div>
              <div class="row" style="block: none;">
                <div class="col-md-12">
              <div class="card rounded-0 align-items-center" style="margin-top: 5px; margin-bottom: 1px; background-color: #124103;">
                <div class="card-body align-items-center justify-content-center" style="background-color: #124103;">
                  <img class="align-items-center justify-content-center" height="105px" src="../../assets/sanparks.jpg" alt="" style="margin:1rem;">
                </div>
              </div>
              </div>
        </div>
        </div>
        <div class="col-md-8 no-float right-panel" style="background: #1E1E1E; padding-bottom: 50px; padding-left: 10px; padding-right: 10px;">
          <div class="row no-gutters">
            <div class="col-md-12">
              <div class="card rounded-0 box">
                <div class="card-header inwards_card">KNP Rivers Log Book</div>
                <div class="card-body" style="height: 605px;">
                    <iframe src="https://inwards.award.org.za/timeline.php" height="600px" width="100%"></iframe>
                  </div>
              </div>
              </div>
          </div>
          <div class="row no-gutters">
            <div class="col-md-6">
                  <CrocChart ref="crocComponent" style="margin-top: 5px;"/>
              </div>
            <div class="col-md-6" style="padding-left: 2px;">
                  <SabieChart ref="sabieComponent" style="margin-top: 5px;"/>
              </div>
              <div class="col-md-6">
                  <OliChart ref="oliComponent" style="margin-top: 5px;"/>
              </div>
            <div class="col-md-6">
              <BalChart ref="balComponent" style="margin-top: 5px;"/>
              </div>
            <div class="col-md-6" style="padding-left: 2px;">
                  <LetChart ref="letComponent" style="margin-top: 5px;"/>
              </div>

              <div class="col-md-6" style="padding-left: 2px;">
                  <LimChart ref="limComponent" style="margin-top: 5px;"/>
              </div>
              <br>
          </div>
        </div>
      </div>
      <NavButtons/>
    </div>
    <RiverLog ref="logComponent" style="margin-top: 5px;"/>
    <SubmitForm ref="submitComponent" style="margin-top: 5px;"/>
    <PlateSubmissions ref="submissionsComponent" style="margin-top: 5px;"/>
    <SubmitLog ref="submitLogComponent" style="margin-top: 5px;"/>
    <UpdateLog ref="submitLogUpdateComponent" style="margin-top: 5px;"/>
  </div>
</template>
<style>
.chartDivId.c3-line-[Reserve] {
  stroke-width: 5px;
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
  import NavButtons from '../../components/NavButtons';
  // Import base component instead of local one
  import BaseMapDashboard from '../shared/BaseMapDashboard.vue';
  import ComplianceTable from './ComplianceTable';
  import SubmitLog from './SubmitLog';
  import RiverLog from './RiverLog';
  import CrocChart from './CrocChart';
  import SabieChart from './SabieChart';
  import OliChart from './OliChart';
  import LetChart from './LetChart';
  import BalChart from './BalChart';
  import LimChart from './LimChart';
  import StatusBar from '../StatusBar';
  import VectorLayer from 'ol/layer/Vector';
  import VectorSource from 'ol/source/Vector';
  import GeoJSON from 'ol/format/GeoJSON';
  import SubmitForm from './SubmitForm';
  import UpdateLog from './UpdateLog';
  import PlateSubmissions from './PlateSubmissions';
  import stateStore from '../../store/state_handler';
  import $ from 'jquery';
  import {Fill, Stroke, Style} from 'ol/style';
  import { remote } from '../../services/electron-compat';
  import WmaJson from '../../assets/wma_merge.json';
  require('promise.prototype.finally').shim();
  const { app } = remote;
  export default {
    name: 'KnpDashboard',

    components: {
      BaseMapDashboard,
      NavButtons,
      ComplianceTable,
      CrocChart,
      SabieChart,
      OliChart,
      LetChart,
      BalChart,
      LimChart,
      RiverLog,
      SubmitLog,
      StatusBar,
      SubmitForm,
      UpdateLog,
      PlateSubmissions
    },
    data () {
      return {
        stationsApi: 'https://inwards.award.org.za/app_json/tpc_stations.php',
        stationsCoordinates: {}, // To stored all stations with their coordinates
        stationsFeatures: {}, // To stored station features
        stationsRequest: null,
        selectedStations: [],
        selectedWMAs: []
      };
    },

    computed: {
      mapDashboardRef() {
        return this.$refs.mapDashboard;
      }
    },

    mounted () {
      const self = this;
      const map = this.$refs.mapDashboard.getMap();
      let startDate = new Date();
      startDate = new Date(startDate.getFullYear(), (startDate.getMonth()-1), 1);
      let endDate = this.formatDate(new Date());
      this.$refs.letComponent.displayChart('chartComponent-unverified-timeseries-B8H008H3T', ['B8H008H3T'], this.formatDate(startDate), this.formatDate(endDate));
      this.$refs.crocComponent.displayChart('chartComponent-unverified-timeseries-X2H016FW', ['X2H016FW'], this.formatDate(startDate), this.formatDate(endDate));
      this.$refs.sabieComponent.displayChart('chartComponent-unverified-timeseries-X3H021IUCMA', ['X3H021IUCMA'], this.formatDate(startDate), this.formatDate(endDate));
      this.$refs.oliComponent.displayChart('chartComponent-unverified-timeseries-B7H015FW', ['B7H015FW'], this.formatDate(startDate), this.formatDate(endDate));
      this.$refs.balComponent.displayChart('chartComponent-unverified-timeseries-B7H026BFW', ['B7H026BFW'], this.formatDate(startDate), this.formatDate(endDate));
      this.$refs.limComponent.displayChart('chartComponent-unverified-timeseries-A9H012FW', ['A9H012FW'], this.formatDate(startDate), this.formatDate(endDate));
      let selectedWMAs = ['limpopo', 'olifants_letaba', 'inkomati_usuthu'];
      self.mapDashboardRef.showSelectedWMA(selectedWMAs);
      let vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: (new GeoJSON({
            defaultDataProjection: 'EPSG:4326'
          })).readFeatures(WmaJson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
          })
        }),
        updateWhileAnimating: true,
        updateWhileInteracting: true
      });
      map.addLayer(vectorLayer);
      self.addKnpLayer(map);
      self.fetchStations();
    },
    methods: {
      showSubmitForm () {
        this.$refs.submitComponent.showSubmitForm();
      },
      showPlatesForm () {
        this.$refs.submissionsComponent.showPlatesForm();
      },
      async fetchStations () {
        let self = this;
        let wmaNames = ['limpopo', 'olifants_letaba', 'inkomati_usuthu'];

        // Get user data path via IPC
        const userDataPath = await window.electronAPI.getUserDataPath();
        const dir = `${userDataPath}/stations`;

        // TODO : Create an util class for file storage
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
        let url = `${self.stationsApi}?wma=${wmaNames.join()}`;
        // Inline hash function to replace url.hashCode()
        const hashCode = url.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
        let stationFile = `${dir}/${hashCode}.json`;
        // Check if online
        if (navigator.onLine) {
          let cancelToken = null;
          if (self.stationsRequest) {
            cancelToken = self.stationsRequest.token;
          }
          axios.get(url, { cancelToken: cancelToken }).then(response => {
            self.mapDashboardRef.loadStationsToMap(response.data);
          }).catch(error => {
            console.log(error);
          });
        } else {
          const fileExists = await window.electronAPI.fileExists(stationFile);
          if (fileExists) {
            const jsonData = await window.electronAPI.readFile(stationFile);
            let stationsData = JSON.parse(jsonData);
            self.mapDashboardRef.loadStationsToMap(stationsData);
          }
        }
      },
      showRiverLog () {
        this.$refs.logComponent.showLogModal();
      },
      submitRiverLog () {
        this.$refs.submitLogComponent.submitRiverLog();
      },
      submitRiverLogUpdate (id) {
        this.$refs.submitLogUpdateComponent.submitLogUpdate(id);
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
          updateWhileAnimating: true,
          updateWhileInteracting: false
        });
        map.addLayer(knpLayer);
        let knpStyle = new Style({
          stroke: new Stroke({
            color: [51, 204, 51, 0.6],
            width: 1
          }),
          fill: new Fill({
            color: [51, 204, 51, 0.2]
          }),
          zIndex: 1
        });
        knpLayer.setStyle(knpStyle);
      },
      updateCharts () {
        let dateStartString = $('#dateStart').val();
        let dateEndString = $('#dateEnd').val();
        let startDate = new Date(dateStartString);
        let endDate = new Date(dateEndString);
        this.$refs.letComponent.displayChart('chartComponent-unverified-timeseries-B8H008H3T', ['B8H008H3T'], this.formatDate(startDate), this.formatDate(endDate));
        this.$refs.crocComponent.displayChart('chartComponent-unverified-timeseries-X2H016FW', ['X2H016BFW'], this.formatDate(startDate), this.formatDate(endDate));
        this.$refs.sabieComponent.displayChart('chartComponent-unverified-timeseries-X3H021FW', ['X3H021BFW'], this.formatDate(startDate), this.formatDate(endDate));
        this.$refs.oliComponent.displayChart('chartComponent-unverified-timeseries-B7H015FW', ['B7H015FW'], this.formatDate(startDate), this.formatDate(endDate));
        this.$refs.balComponent.displayChart('chartComponent-unverified-timeseries-B7H026BFW', ['B7H026BFW'], this.formatDate(startDate), this.formatDate(endDate));
        this.$refs.limComponent.displayChart('chartComponent-unverified-timeseries-A9H012FW', ['A9H012FW'], this.formatDate(startDate), this.formatDate(endDate));
      }
    }
  };
</script>