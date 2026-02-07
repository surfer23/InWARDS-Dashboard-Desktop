<template>
  <div style="height: 100%;">
    <StatusBar/>
    <div class="container-fluid" style="height: 100%;">
      <div class="row no-gutters" style="height: 100%;">
        <div class="col-md-4 no-float left-panel" style="background: #252526; margin-top: 5px; padding-bottom: 50px; margin-right: 0px;">
          <!-- Using BaseMapDashboard with unique mapId -->
          <BaseMapDashboard
            ref="mapDashboard"
            map-id="iucma-dashboard-map"
            map-height="410px"
            :connected-to-tree="false"
          />
          <hr>
          <div class="card rounded-0">
           <div class="card-header inwards_card rounded-0"><h6 style="color: white;"><i class="fa fa-tasks" style="padding-right: 10px;"></i>Select Chart Components</h6></div>
            <div class="card-body">
              <div class="row" style="margin-top: 0.1em;">
                  <hr>
                <div class="col-md-6">
                <div class="form-inline" style="padding-left: 2px;">
                  <div class="form-group">
                    <label class="datepicker" for="dateStart" style="padding-left: 0px;">Start Date:</label>
                    <input type="date" class="form-control datepicker" id="dateStart" style="margin-left: 4px; width: 65%">
                  </div>
                </div>
                </div>
                <div class="col-md-6">
                <div class="form-inline" style="padding-left: 0px;">
                  <div class="form-group">
                    <label class="datepicker" for="dateEnd" style="padding-right: 4px;">End Date:</label>
                    <input type="date" class="form-control datepicker" id="dateEnd" style="margin-right: 2px; width: 65%;" @onload="setDates()">
                  </div>
                </div>
                </div>
              </div>
              <hr>
                  <div class="row" style="margin-bottom: 0.1rem;">
                  <div class="col-md-12">
                    <div class="funkyradio">
                      <div class="form-check form-check-inline funkyradio-primary" >
                        <input name="chart_components" id="60th" type="checkbox"  checked="checked" class="form-check-input"> 
                        <label for="60th" class="form-check-label">60th</label>
                      </div>
                      <div class="form-check form-check-inline funkyradio-primary">
                        <input name="chart_components" id="70th" type="checkbox" class="form-check-input form-check-input"> 
                        <label for="70th" class="form-check-label">70th</label>
                      </div>
                      <div class="form-check form-check-inline funkyradio-primary">
                        <input name="chart_components" id="80th" type="checkbox" class="form-check-input form-check-input"> 
                        <label for="80th" class="form-check-label">80th</label>
                      </div>
                      <div class="form-check form-check-inline funkyradio-primary">
                        <input name="chart_components" id="90th" type="checkbox" class="form-check-input form-check-input"> 
                        <label for="90th" class="form-check-label">90th</label>
                      </div>
                      <div class="form-check form-check-inline funkyradio-primary">
                        <input name="chart_components" id="99th" type="checkbox" class="form-check-input form-check-input"> 
                        <label for="99th" class="form-check-label">99th</label>
                      </div>

                      <div class="form-check form-check-inline funkyradio-primary">
                        <input name="chart_components" id="critical" type="checkbox" class="form-check-input form-check-input"> 
                        <label for="critical" class="form-check-label">Critical</label>
                      </div>
                      <div class="form-check form-check-inline funkyradio-primary">
                        <input name="chart_components" id="veryHigh" type="checkbox" class="form-check-input form-check-input"> 
                        <label for="veryHigh" class="form-check-label">Very High Worry</label>
                      </div>
                      <div class="form-check form-check-inline funkyradio-primary">
                        <input name="chart_components" id="high" type="checkbox" class="form-check-input form-check-input"> 
                        <label for="high" class="form-check-label">High Worry</label>
                      </div>

                      <div class="form-check  form-check-inline funkyradio-primary">
                        <input name="chart_components_2" id="inform" type="checkbox" class="form-check-input form-check-input"> 
                        <label for="inform" class="form-check-label">Inform</label>
                      </div>
                      <div class="form-check form-check-inline funkyradio-primary">
                        <input name="chart_components_2" id="medium" type="checkbox" class="form-check-input form-check-input"> 
                        <label for="medium" class="form-check-label">Medium Worry</label>
                      </div>
                      <div class="form-check form-check-inline funkyradio-primary">
                        <input name="chart_components_2" id="low" type="checkbox" class="form-check-input"> 
                        <label for="low" class="form-check-label">Low Worry</label>
                      </div>
                      <div class="form-check form-check-inline funkyradio-primary">
                        <input name="chart_components_3" id="lastYear" type="checkbox" class="form-check-input form-check-input"> 
                        <label for="lastYear" class="form-check-label">Last Year</label>
                      </div>
                      <div class="form-check form-check-inline funkyradio-primary">
                        <input name="chart_components_3" id="verifiedDischarge" type="checkbox" checked="checked" class="form-check-input form-check-input"> 
                        <label for="verifiedDischarge" class="form-check-label">Verified</label>
                    </div>
                      <div class="form-check form-check-inline funkyradio-primary">
                        <input name="chart_components_3" id="iima" type="checkbox" class="form-check-input form-check-input"> 
                        <label for="iima" class="form-check-label">IIMA</label>
                    </div>
                      <div class="form-check form-check-inline funkyradio-primary">
                        <input name="chart_components_3" id="crimib" type="checkbox" class="form-check-input form-check-input"> 
                        <label for="crimib" class="form-check-label">CRMIB</label>
                      </div>
                    </div>
                  </div>
                </div>
                <hr>
                <div class="row no-gutters">
                  <div class="col-md-4">
                    <button class="btn inwards_button btn-labeled text-left" style="width: 100%; font-size: x-small;" @click="updateCharts()" type="button"><span class="btn-label"><font-awesome-icon icon="fa-solid fa-refresh" style="color: rgb(255, 255, 255)"></font-awesome-icon></span>Apply<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right; "></i></button>               
                  </div>
                  <div class="col-md-4">
                    <button class="btn inwards_button btn-labeled text-left" style="width: 100%; font-size: x-small;" @click="exportReport()" type="button"><span class="btn-label"><font-awesome-icon icon="fa-solid fa-save" style="color: rgb(255, 255, 255)"></font-awesome-icon></span>Report<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right; "></i></button>
                  </div>
                  <div class="col-md-4">
                    <button class="btn inwards_button btn-labeled text-left" style="width: 100%; font-size: x-small;" @click="showRiverLog()" type="button"><span class="btn-label"><font-awesome-icon icon="fa-solid fa-chart-line" style="color: rgb(255, 255, 255)"></font-awesome-icon></span>Logbook<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right; "></i></button>
                  </div>
                  <div class="col-md-4">
                    <button class="btn inwards_button btn-labeled text-left" style="width: 100%; font-size: x-small;" @click="submitRiverLog()" type="button"><span class="btn-label"><font-awesome-icon icon="fa-solid fa-chart-line" style="color: rgb(255, 255, 255)"></font-awesome-icon></span>Submit Log<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right; "></i></button>
                  </div>
                  <div class="col-md-4">
                    <button class="btn inwards_button btn-labeled text-left" style="width: 100%; font-size: x-small;" @click="showPlatesForm()" type="button"><span class="btn-label"><font-awesome-icon icon="fa-solid fa-chart-line" style="color: rgb(255, 255, 255)"></font-awesome-icon></span>Plate submissions<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right; "></i></button>
                  </div>
                  <div class="col-md-4">
                    <button class="btn inwards_button btn-labeled text-left" style="width: 100%; font-size: x-small;" @click="showSubmitForm()" type="button"><span class="btn-label"><font-awesome-icon icon="fa-solid fa-chart-line" style="color: rgb(255, 255, 255)"></font-awesome-icon></span>Submit Plate<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right; "></i></button>
                  </div>
                  <div class="col-md-4">
                    <button class="btn inwards_button btn-labeled text-left" style="width: 100%; font-size: x-small;" @click="dischargeVerification()" type="button"><span class="btn-label"><font-awesome-icon icon="fa-solid fa-magnifying-glass-chart" style="color: rgb(255, 255, 255)"></font-awesome-icon></span>Verify Discharge<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right; "></i></button>
                  </div>
                  <div class="col-md-4">
                    <button class="btn inwards_button btn-labeled text-left" style="width: 100%; font-size: x-small;" @click="manageVerifications()" type="button"><span class="btn-label"><font-awesome-icon icon="fa-solid fa-magnifying-glass-chart" style="color: rgb(255, 255, 255)"></font-awesome-icon></span>Manage Verifications<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right; "></i></button>
                  </div>
              </div>
            </div>
          </div>
          <hr>
          <div class="card rounded-0" style="margin-top: 0px; margin-bottom: 5px;">
            <div class="card-body">
              <nav>
                  <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                      <a class="nav-item nav-link active" id="nav-verified-tab" data-toggle="tab" href="#verified-tab" role="tab" aria-controls="nav-verified" aria-selected="true" style="text-align: center;">Verified Compliance</a>
                      <a class="nav-item nav-link" id ="nav-iucma-tab" data-toggle="tab" href="#iucma-unverified-tab" role="tab" aria-controls="nav-iucma" aria-selected="false">Unverified Compliance IUCMA</a>

                      <a class="nav-item nav-link" id="nav-unverified-tab" data-toggle="tab" href="#unverified-tab" role="tab" aria-controls="nav-unverified" aria-selected="false">Unverified Compliance DWS</a>
                    </div>
                    </nav>
                    <div class="tab-content py-1 px-1 px-sm-0" id="nav-tabContent-login">
                        <div class="tab-pane fade show active" id="verified-tab" role="tabpanel" aria-labelledby="home-tab" >            
                          <ComplianceTable ref="complianceTable"/>
                          
                        </div>
                        <div class="tab-pane fade" id="iucma-unverified-tab" role="tabpanel" aria-labelledby="home-tab" >            
                          <UnverifiedIUCMA ref="iucmaTable"/>
                        </div>
                        <div class="tab-pane fade" id="unverified-tab" role="tabpanel" aria-labelledby="home-tab" >            
                          <UnverifiedCompliance ref="unverifiedTable"/>
                        </div>
                </div>            
            </div>
          </div>
        </div>
        <hr>
        <div class="col-md-8 no-float right-panel" style="background: #1E1E1E; padding-bottom: 50px; padding-left: 10px; padding-right: 10px;">

          <div class="row no-gutters">
            <div class="col-md-12">
                  <CrocChart ref="crocComponent" style="margin-top: 5px;"/>
              </div>
            <div class="col-md-12" style="padding-left: 2px;">
                  <SabieChart ref="sabieComponent" style="margin-top: 5px;"/>
              </div>
            <div class="col-md-12">
              <ExeChart ref="exeterComponent" style="margin-top: 5px;"/>
              </div>
            <div class="col-md-12">
              <SabieS3 ref="sabieS3Component" style="margin-top: 5px;"/>
              </div>
            <div class="col-md-12">
              <SabieS1 ref="sabieS1Component" style="margin-top: 5px;"/>
              </div>
            <div class="col-md-12">
              <CrocC2 ref="crocC2Component" style="margin-top: 5px;"/>
              </div>
            <div class="col-md-12">
              <CrocC3 ref="crocC3Component" style="margin-top: 5px;"/>
              </div>
            <div class="col-md-12">
              <CrocC4 ref="crocC4Component" style="margin-top: 5px;"/>
              </div>
            <div class="col-md-12">
              <CrocC5 ref="crocC5Component" style="margin-top: 5px;"/>
              </div>
             <div class="col-md-12">
              <CrocC7 ref="crocC7Component" style="margin-top: 5px;"/>
              </div>
            <div class="col-md-12">
              <MacmacS4 ref="macmacS4Component" style="margin-top: 5px;"/>
              </div>
            <div class="col-md-12">
              <MariteS5 ref="mariteS5Component" style="margin-top: 5px;"/>
              </div>
              <br>
          </div>
        </div>
        <NavButtons/>
      </div>
      <RiverLog ref="logComponent" style="margin-top: 5px;"/>
      <SubmitForm ref="submitComponent" style="margin-top: 5px;"/>
      <PlateSubmissions ref="submissionsComponent" style="margin-top: 5px;"/>
      <SubmitLog ref="submitLogComponent" style="margin-top: 5px;"/>
      <UpdateLog ref="submitLogUpdateComponent" style="margin-top: 5px;"/>
      <VerifyDischarge ref="verifyDischargeComponent" style="margin-top: 5px;"/>
      <ManageVerifications ref="manageVerificationsComponent" style="margin-top: 5px;"/>


    </div>
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
nav > .nav.nav-tabs {
  border: white;
  color: #fff;
  background: #272e38;
  border-radius: 0;
}

nav > div a.nav-item.nav-link {
  border: white;
  border-width: 0.1rem;  /* Reduced border width */
  padding: 5px 0.5px;  /* Reduced padding */
  font-size: 13px;  /* Reduced font size */
  color: #fff;
  background: #272e38;
  border-radius: 0;
}

nav > div a.nav-item.nav-link.active {
  border: white;
  border-width: 0.1rem;  /* Reduced border width */
  padding: 5px 0.5px;  /* Reduced padding */
  color: #fff;
  background: #10556A;
  border-radius: 0;
}

nav > div a.nav-item.nav-link.active:after {
  content: "";
  position: relative;
  bottom: -8px;  /* Adjusted bottom position */
  left: 0%;
  border: 14px solid transparent;  /* Reduced border size */
  border-top-color: #272e38;
}

.nav-pills .nav-link.active, .nav-pills .show > .nav-link {
  color: #fff;
  background-color: #272e38;
}

.tab-content {
  background: #fdfdfd;
  line-height: 1px;
  border: 1px solid #ddd;
  border-top: 5px solid #272e38;
  border-bottom: 5px solid #272e38;
  padding: 0, 0, 0, 0;
}

nav > div a.nav-item.nav-link:hover {
  border: none;
  background: #4CAF50;
  color: #fff;
  border-radius: 0;
  transition: background 0.20s linear;
}

nav > div a.nav-item.nav-link:focus {
  border: none;
  background: #10556A;
  color: #fff;
  border-radius: 0;
  transition: background 0.20s linear;
}
</style>
<script>
  import axios from 'axios';
  import NavButtons from '../../components/NavButtons';
  // Import base component instead of local one
  import BaseMapDashboard from '../shared/BaseMapDashboard.vue';
  import ComplianceTable from './ComplianceTable';
  import VerifyDischarge from './VerifyDischarge';
  import ManageVerifications from './ManageVerifications';
  import UnverifiedCompliance from './UnverifiedCompliance';
  import UnverifiedIUCMA from './UnverifiedIUCMA';
  import OperationalReserve from './OperationalReserve';
  import RiverLog from '../KnpDashboard/RiverLog';
  import SubmitForm from './SubmitForm';
  import SubmitLog from './SubmitLog';
  import UpdateLog from './UpdateLog';
  import PlateSubmissions from './PlateSubmissions';
  import CrocChart from './CrocChart';
  import SabieChart from './SabieChart';
  import ExeChart from './ExeChart';
  import SabieS1 from './SabieS1';
  import SabieS3 from './SabieS3';
  import CrocC2 from './CrocC2';
  import CrocC3 from './CrocC3';
  import CrocC4 from './CrocC4';
  import CrocC5 from './CrocC5';
  import CrocC7 from './CrocC7';
  import MariteS5 from './MariteS5';
  import MacmacS4 from './MacmacS4';
  import StatusBar from '../StatusBar';
  import VectorLayer from 'ol/layer/Vector';
  import VectorSource from 'ol/source/Vector';
  import GeoJSON from 'ol/format/GeoJSON';
  import $ from 'jquery';
  import {Fill, Stroke, Style} from 'ol/style';
  import { remote } from '../../services/electron-compat';
  require('promise.prototype.finally').shim();
  const { app } = remote;
  import Docxtemplater from "docxtemplater";
  import PizZip from "pizzip";
  import PizZipUtils from "pizzip/utils/index.js";
  import { saveAs } from "file-saver";
  function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
  }
  export default {
    name: 'IucmaDashboard',

    components: {
      BaseMapDashboard,
      NavButtons,
      ComplianceTable,
      UnverifiedCompliance,
      UnverifiedIUCMA,
      VerifyDischarge,
      ManageVerifications,
      CrocChart,
      SabieChart,
      ExeChart,
      CrocC2,
      CrocC3,
      CrocC4,
      CrocC5,
      CrocC7,
      SabieS3,
      SabieS1,
      MacmacS4,
      MariteS5,
      RiverLog,
      OperationalReserve,
      StatusBar,
      SubmitLog,
      SubmitForm,
      UpdateLog,
      PlateSubmissions
    },
    data () {
      return {
        stationsApi: 'https://inwards.award.org.za/app_json/iucma_stations.php',
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
      let currentDate = new Date();
      let year = currentDate.getFullYear();
      let hydrologicalStartDate = new Date(`${year}-10-01`);
      let lastHydrologicalStartDate = new Date(`${year - 1}-10-01`);
      if (currentDate < hydrologicalStartDate) {
        hydrologicalStartDate = lastHydrologicalStartDate;
      }
      let startDate = `${hydrologicalStartDate.getFullYear()}-${String(hydrologicalStartDate.getMonth() + 1).padStart(2, '0')}-${String(hydrologicalStartDate.getDate()).padStart(2, '0')}`;
      let endDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
     
      document.getElementById('dateStart').setAttribute('value', startDate);
      document.getElementById('dateEnd').setAttribute('value', endDate);
      let critical = document.getElementById('critical').checked;
      let veryHigh = document.getElementById('veryHigh').checked;
      let high = document.getElementById('high').checked;
      let inform = document.getElementById('inform').checked;
      let medium = document.getElementById('medium').checked;
      let low = document.getElementById('low').checked;
      let lastYear = document.getElementById('lastYear').checked;
      let verifiedDischarge = document.getElementById('verifiedDischarge').checked;
      let crimib = document.getElementById('crimib').checked;
      let iima = document.getElementById('iima').checked;
      let sixTh = document.getElementById('60th').checked;
      let sevTh = document.getElementById('70th').checked;
      let eigTh = document.getElementById('80th').checked;
      let ninTh = document.getElementById('90th').checked;
      let nininTh = document.getElementById('99th').checked;
      this.$refs.crocComponent.displayChart('chartComponent-unverified-timeseries-X2H016FW', ['X2H016BFW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
      this.$refs.sabieComponent.displayChart('chartComponent-unverified-timeseries-X3H021FW', ['X3H021BFW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
      this.$refs.exeterComponent.displayChart('chartComponent-unverified-timeseries-X3H008FW', ['X3H008FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
      this.$refs.sabieS1Component.displayChart('chartComponent-unverified-timeseries-X3H001FW', ['X3H001FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
      this.$refs.sabieS3Component.displayChart('chartComponent-unverified-timeseries-X3H023FW', ['X3H023FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
      this.$refs.macmacS4Component.displayChart('chartComponent-unverified-timeseries-X3H003FW', ['X3H003FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
      this.$refs.mariteS5Component.displayChart('chartComponent-unverified-timeseries-X3H011FW', ['X3H011FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
      this.$refs.crocC2Component.displayChart('chartComponent-unverified-timeseries-X2H070FW', ['X2H070FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
      this.$refs.crocC3Component.displayChart('chartComponent-unverified-timeseries-X2H013FW', ['X2H013FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
      this.$refs.crocC4Component.displayChart('chartComponent-unverified-timeseries-X2H032FW', ['X2H032FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
      this.$refs.crocC7Component.displayChart('chartComponent-unverified-timeseries-X2H022FW', ['X2H022FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
      this.$refs.crocC5Component.displayChart('chartComponent-unverified-timeseries-X2H097FW', ['X2H097FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
      let selectedWMAs = ['inkomati_usuthu'];
      self.mapDashboardRef.showSelectedWMA(selectedWMAs);
      self.addKnpLayer(map);
      self.addRiverLayer(map);
      self.fetchStations();
    },
    methods: {
      async fetchStations () {
        let self = this;
        let wmaNames = ['inkomati_usuthu'];

        // Get userData path via IPC
        const userDataPath = await window.electronAPI.getUserDataPath();
        const stationsDir = `${userDataPath}/stations`;

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

        // Generate a simple hash for the filename
        const urlHash = url.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
        let stationFile = `${stationsDir}/${Math.abs(urlHash)}.json`;

        // Check if online
        if (navigator.onLine) {
          let cancelToken = null;
          if (self.stationsRequest) {
            cancelToken = self.stationsRequest.token;
          }
          axios.get(url, { cancelToken: cancelToken }).then(async response => {
            self.mapDashboardRef.loadStationsToMap(response.data);
            // Cache the data
            try {
              const jsonData = JSON.stringify(response.data);
              const buffer = new TextEncoder().encode(jsonData);
              await window.electronAPI.writeFile(stationFile, buffer);
            } catch (err) {
              console.warn('Could not cache stations data:', err);
            }
          }).catch(error => {
            console.log(error);
          });
        } else {
          // Try to load from cache
          try {
            const exists = await window.electronAPI.fileExists(stationFile);
            if (exists) {
              const buffer = await window.electronAPI.readFile(stationFile);
              const jsonData = new TextDecoder().decode(buffer);
              let stationsData = JSON.parse(jsonData);
              self.mapDashboardRef.loadStationsToMap(stationsData);
            }
          } catch (err) {
            console.warn('Could not load cached stations:', err);
          }
        }
      },
      showRiverLog () {
        this.$refs.logComponent.showLogModal();
      },
      showOperationalReserve () {
        this.$refs.operationalComponent.showOperationalModal();
      },
      showSubmitForm () {
        this.$refs.submitComponent.showSubmitForm();
      },
      showPlatesForm () {
        this.$refs.submissionsComponent.showPlatesForm();
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

      exportReport(){
            loadFile("https://inwards.award.org.za/app_json/iucma_verification/ewr_report_template.docx", function(
            error,
            content
          ) {
            if (error) {
              throw error;
            }
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

            doc.setData({
              reportTitle: 'EWR Compliance Report for the Inkomati Usuthu Catchment Management Agency (IUCMA)'
            });            
            try {
              // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
              doc.render();
            } catch (error) {
              // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
              function replaceErrors(key, value) {
                if (value instanceof Error) {
                  return Object.getOwnPropertyNames(value).reduce(function(
                    error,
                    key
                  ) {
                    error[key] = value[key];
                    return error;
                  },
                  {});
                }
                return value;
              }
              console.log(JSON.stringify({ error: error }, replaceErrors));

              if (error.properties && error.properties.errors instanceof Array) {
                const errorMessages = error.properties.errors
                  .map(function(error) {
                    return error.properties.explanation;
                  })
                  .join("\n");
                console.log("errorMessages", errorMessages);
                // errorMessages is a humanly readable message looking like this :
                // 'The tag beginning with "foobar" is unopened'
              }
              throw error;
            }
            const out = doc.getZip().generate({
              type: "blob",
              mimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            });
            // Output the document using Data-URI
            saveAs(out, "ewr_report_iucma.docx");
          });

/*           const template = fs.readFileSync('../../assets/ewr_report_template.docx', 'binary')
          const zip = new PizZip(template)
          const doc = new Docxtemplater().loadZip(zip)

          // Fill in text
          doc.setData({
              reportTitle: 'EWR Compliance Report for the Inkomati Usuthu Catchment Management Agency (IUCMA)',
              // ... other placeholders
          })

          // Convert the Plotly graph to an image and embed in the report
          Plotly.toImage('chartComponent-unverified-timeseries-X2H016FW', { format: 'png' }).then((dataURL) => {
              const imageBase64 = dataURL.split(',')[1]
              doc.setData({
                  chartImage: imageBase64
              }) 
              // You can similarly fill table data and other placeholders
          })
                        // Render the doc
          doc.render()
          const buf = doc.getZip().generate({ type: 'nodebuffer' })
            // Save the document somewhere, for instance:
            dialog.showSaveDialog({
                title: 'Save the report',
                defaultPath: 'IUCMA_EWR_REPORT.docx',
                filters: [
                    { name: 'Word Document', extensions: ['docx'] }
                ]
            }).then(result => {
                if (!result.canceled && result.filePath) {
                    fs.writeFileSync(result.filePath, buf)
                }
            }).catch(err => {
                console.error(err)
            }) */
      },
      dischargeVerification(){
        this.$refs.verifyDischargeComponent.showVerifyForm();

      },
      manageVerifications(){
        this.$refs.manageVerificationsComponent.showVerificationsForm();
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
      addRiverLayer (map) {
        const riverJson = require('../../assets/major_rivers.json');
        let riverLayer = new VectorLayer({
          source: new VectorSource({
            features: (new GeoJSON({
              defaultDataProjection: 'EPSG:4326'
            })).readFeatures(riverJson, {
              dataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857'
            })
          }),
          updateWhileAnimating: true,
          updateWhileInteracting: false
        });
        map.addLayer(riverLayer);
        let riverStyle = new Style({
          stroke: new Stroke({
            color: [59, 179, 208],
            width: 1
          }),
          fill: new Fill({
            color: [59, 179, 208]
          }),
          zIndex: 1
        });
        riverLayer.setStyle(riverStyle);
      },
      updateCharts () {
        let dateStartString = $('#dateStart').val();
        let dateEndString = $('#dateEnd').val();
        let startDate = new Date(dateStartString);
        let endDate = new Date(dateEndString);
        let critical = document.getElementById('critical').checked;
        let veryHigh = document.getElementById('veryHigh').checked;
        let high = document.getElementById('high').checked;
        let inform = document.getElementById('inform').checked;
        let medium = document.getElementById('medium').checked;
        let low = document.getElementById('low').checked;
        let lastYear = document.getElementById('lastYear').checked;
        let verifiedDischarge = document.getElementById('verifiedDischarge').checked;
        let crimib = document.getElementById('crimib').checked;
        let iima = document.getElementById('iima').checked;
        let sixTh = document.getElementById('60th').checked;
        let sevTh = document.getElementById('70th').checked;
        let eigTh = document.getElementById('80th').checked;
        let ninTh = document.getElementById('90th').checked;
        let nininTh = document.getElementById('99th').checked;
        this.$refs.crocComponent.displayChart('chartComponent-unverified-timeseries-X2H016FW', ['X2H016BFW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
        this.$refs.sabieComponent.displayChart('chartComponent-unverified-timeseries-X3H021FW', ['X3H021FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
        this.$refs.exeterComponent.displayChart('chartComponent-unverified-timeseries-X3H008FW', ['X3H008FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
        this.$refs.sabieS1Component.displayChart('chartComponent-unverified-timeseries-X3H001FW', ['X3H001FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
        this.$refs.sabieS3Component.displayChart('chartComponent-unverified-timeseries-X3H023FW', ['X3H023FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
        this.$refs.macmacS4Component.displayChart('chartComponent-unverified-timeseries-X3H003FW', ['X3H003FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
        this.$refs.mariteS5Component.displayChart('chartComponent-unverified-timeseries-X3H011FW', ['X3H011FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
        this.$refs.crocC2Component.displayChart('chartComponent-unverified-timeseries-X2H070FW', ['X2H070FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
        this.$refs.crocC3Component.displayChart('chartComponent-unverified-timeseries-X2H013FW', ['X2H013FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
        this.$refs.crocC4Component.displayChart('chartComponent-unverified-timeseries-X2H032FW', ['X2H032FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
        this.$refs.crocC7Component.displayChart('chartComponent-unverified-timeseries-X2H022FW', ['X2H022FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
        this.$refs.crocC5Component.displayChart('chartComponent-unverified-timeseries-X2H097FW', ['X2H097FW'], this.formatDate(startDate), this.formatDate(endDate), critical, veryHigh, high, medium, low, inform, lastYear, verifiedDischarge, iima, crimib, sixTh, sevTh, eigTh, ninTh, nininTh);
        this.$refs.complianceTable.updateTable();
      }
    }
  };
</script>