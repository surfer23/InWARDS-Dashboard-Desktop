<template>
  <div style="height: 100%">
    <StatusBar />
    <div class="container-fluid" style="height: 100%">
      <div class="row no-gutters" style="height: 100%">
        <div
          class="col-md-3 no-float left-panel"
          style="background: #252526; padding-left: 8px"
        >                    
        <button class="btn inwards_button btn-labeled text-left" style="width: 100%; font-size: x-small;" @click="submitData()" type="button"><span class="btn-label"><font-awesome-icon icon="fa-solid fa-refresh" style="color: rgb(255, 255, 255)"></font-awesome-icon></span>Submit Data<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right; "></i></button>               

          <div
            class="card rounded-0"
            style="margin-top: 5px; margin-bottom: 5px; width: 100%"
          >
            <div class="card-header inwards_card">
              <h6 style="color: white">
                <i class="fa fa-bar-chart" style="padding-right: 10px"></i
                >Parameters
              </h6>
            </div>
            <div class="card-body">
              <div class="row" style="margin-bottom: 0.1rem">
                <div class="col-md-12">
                  <p class="divider-text">
                    <span class="bg-light">Data Source Selection</span>
                  </p>
                  <div class="funkyradio">
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="veryHigh"
                        type="checkbox"
                        class="form-check-input form-check-input"
                        checked
                      />
                      <label for="veryHigh" class="form-check-label"
                        >IUCMA Data</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="high"
                        type="checkbox"
                        class="form-check-input form-check-input"
                        disabled
                      />
                      <label for="high" class="form-check-label"
                        >DWS Data</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="merge"
                        type="checkbox"
                        class="form-check-input form-check-input"
                        disabled
                      />
                      <label for="merge" class="form-check-label"
                        >Merge Datasets</label
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <p class="divider-text">
                    <span class="bg-light">Case Study Inputs</span>
                  </p>
                  <div class="form-group" style="margin-right: 0.5rem">
                    <select
                      class="form-control rounded-0 inwards_label"
                      style="
                        margin-left: 4px;
                        margin-right: 10px;
                        margin-top: 5px;
                      "
                      name="typeSelect"
                      v-model="selectedType"
                    >
                      <option value="" disabled selected hidden>
                        Select a site type (e.g. River)
                      </option>
                      <option
                        class="dropdown-item inwards_label"
                        v-for="siteType in types"
                        v-bind:key="siteType.type"
                        v-bind:value="siteType.type"
                      >
                        {{ siteType.type }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group" style="margin-right: 0.5rem">
                    <select
                      class="form-control rounded-0 inwards_label"
                      style="margin-left: 4px; margin-right: 10px"
                      name="variableSelect"
                      v-model="selectedVariable"
                      placeholder="Please Select Water Quality Variable"
                      @change="changeVariable()"
                    >
                      <option value="" disabled selected hidden>
                        Select a variable
                      </option>
                      <option
                        class="dropdown-item"
                        v-for="variable in variables"
                        v-bind:key="variable.id"
                        v-bind:value="[
                          variable.mon_variable_abbr,
                          variable.measure_unit_abbr,
                        ]"
                      >
                        {{ variable.mon_variable_name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6" style="padding-right: 5px">
                  <div class="form-group">
                    <input
                      class="form-control rounded-0 inwards_label"
                      id="dateStart"
                      style="margin-left: 4px"
                      placeholder="Start Date"
                      onfocus="(this.type='date')"
                    />
                  </div>
                </div>
                <div class="col-sm-6" style="padding-left: 2px">
                  <div class="form-group" style="margin-right: 0.2rem">
                    <input
                      class="form-control rounded-0 inwards_label"
                      id="dateEnd"
                      style="margin-right: 0px"
                      placeholder="End Date"
                      onfocus="(this.type='date')"
                    />
                  </div>
                </div>
              </div>
              <div class="row" style="margin-bottom: 0.1rem">
                <div class="col-md-12">
                  <p class="divider-text">
                    <span class="bg-light">Limits and Standards</span>
                  </p>
                  <div class="funkyradio">
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="rqoLimits"
                        type="checkbox"
                        class="form-check-input"
                        v-model="rqoSelected"
                      />
                      <label for="rqoLimits" class="form-check-label"
                        >RQOs</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="sansLimits"
                        type="checkbox"
                        class="form-check-input"
                        v-model="sansSelected"
                      />
                      <label for="sansLimits" class="form-check-label"
                        >SANS241</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="dwsDomestic"
                        type="checkbox"
                        class="form-check-input"
                      />
                      <label for="dwsDomestic" class="form-check-label"
                        >DWS Domestic</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="dwsIrrigation"
                        type="checkbox"
                        class="form-check-input"
                        disabled
                      />
                      <label for="dwsIrrigation" class="form-check-label"
                        >DWS Irrigation</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="dwsLivestock"
                        type="checkbox"
                        class="form-check-input"
                        disabled
                      />
                      <label for="dwsLivestock" class="form-check-label"
                        >DWS Livestock</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="dwsIndustry"
                        type="checkbox"
                        class="form-check-input"
                        disabled
                      />
                      <label for="dwsIndustry" class="form-check-label"
                        >DWS Industry</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="nwrqos"
                        type="checkbox"
                        class="form-check-input"
                        v-model="nwrqoSelected"
                      />
                      <label for="nwrqos" class="form-check-label"
                        >DWS NWRQOs</label
                      >
                    </div>
                  </div>
                  <p class="divider-text">
                    <span class="bg-light">Assesment Scale</span>
                  </p>
                  <div class="funkyradio">
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="catchmentView"
                        type="checkbox"
                        checked="checked"
                        class="form-check-input"
                      />
                      <label for="catchmentView" class="form-check-label"
                        >Catchment</label
                      >
                      <div
                        class="form-check form-check-inline funkyradio-primary"
                      >
                        <input
                          name="chart_components"
                          id="siteView"
                          type="checkbox"
                          checked="checked"
                          class="form-check-input"
                        />
                        <label for="siteView" class="form-check-label"
                          >Site</label
                        >
                      </div>
                    </div>
                    <p class="divider-text">
                      <span class="bg-light">Data Parameters</span>
                    </p>
                    <div class="funkyradio">
                      <div
                        class="form-check form-check-inline funkyradio-primary"
                      >
                        <input
                          name="chart_components"
                          id="variableSpecific"
                          type="checkbox"
                          class="form-check-input"
                          checked
                        />
                        <label for="variableSpecific" class="form-check-label"
                          >Varaible Specific</label
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="funkyradio">
                <div class="form-check form-check-inline funkyradio-primary">
                  <input
                    name="chart_components"
                    id="siteOverview"
                    type="checkbox"
                    checked="checked"
                    class="form-check-input"
                  />
                  <label for="siteOverview" class="form-check-label"
                    >Timeseries</label
                  >
                </div>
                <div class="form-check form-check-inline funkyradio-primary">
                  <input
                    name="chart_components"
                    id="veryHigh"
                    type="checkbox"
                    class="form-check-input form-check-input"
                  />
                  <label for="veryHigh" class="form-check-label"
                    >Boxplots</label
                  >
                </div>
                <div class="form-check form-check-inline funkyradio-primary">
                  <input
                    name="chart_components"
                    id="high"
                    type="checkbox"
                    class="form-check-input form-check-input"
                  />
                  <label for="high" class="form-check-label"
                    >Duration Curve</label
                  >
                </div>
                <div class="form-check form-check-inline funkyradio-primary">
                  <input
                    name="chart_components"
                    id="critical"
                    type="checkbox"
                    class="form-check-input form-check-input"
                  />
                  <label for="critical" class="form-check-label">Table</label>
                </div>
              </div>
            </div>
          </div>
          <!-- Using BaseCatchmentTree with unique treeId -->
          <BaseCatchmentTree
            ref="catchmentTree"
            tree-id="iucma-wq-dashboard-stations"
            title="Stations"
            header-icon="fa-map-marker"
            :refreshable="true"
            :selectable="true"
            :search-enabled="true"
            container-height="380px"
            @refresh-requested="fetchStations"
            @tree-clicked="onCatchmentTreeSelectedHandler"
            @tree-ready="onTreeReady"
          />
          <div class="card rounded-0">
            <div class="card-body">
              <div class="row no-gutters">
                <button
                  class="btn inwards_button"
                  type="button"
                  style="width: 100%"
                  @click="doAnalysis()"
                >
                  <i class="fa fa-line-chart"></i>Analyse
                </button>
              </div>
            </div>
          </div>
          <div class="card rounded-0">
            <div class="card-body">
              <div class="row no-gutters">
                <RouterLink
                  class="btn inwards_button"
                  type="button"
                  style="width: 100%"
                  to="limits-dashboard"
                >
                  <i class="fa fa-info"></i>
                  <span>View All Limtis and Naratives</span>
                </RouterLink>
              </div>
            </div>
          </div>
          <!-- Using BaseMapDashboard with unique mapId -->
          <BaseMapDashboard
            ref="mapDashboard"
            map-id="iucma-wq-dashboard-map"
            map-height="410px"
            :connected-to-tree="true"
            @station-selected="onStationSelectedFromMap"
            @station-deselected="onStationDeselectedFromMap"
          />
        </div>
        <div
          class="col-md-9 no-float right-panel no-gutters"
          style="
            background: #1e1e1e;
            padding-bottom: 5px;
            padding-left: 1px;
            padding-right: 1px;
            padding-top: 5px;
          "
        >
          <div class="row no-gutters" style="background-color: white">
            <ul
              class="nav nav-tabs"
              id="myTab"
              role="tablist"
              style="width: 100%, margin: 0; padding: 0;"
            >
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link active"
                  id="nav-complianceTab-tab"
                  data-toggle="tab"
                  data-target="#complianceTab"
                  type="button"
                  role="tab"
                  aria-controls="complianceTab"
                  aria-selected="true"
                  style="text-align: center"
                >
                  Compliance
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="nav-wqTab-tab"
                  data-toggle="tab"
                  data-target="#wqTab"
                  type="button"
                  role="tab"
                  aria-controls="wqTab"
                  aria-selected="false"
                  style="text-align: center"
                >
                  Water Quality Analysis
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="nav-riskTab-tab"
                  data-toggle="tab"
                  data-target="#riskTab"
                  type="button"
                  role="tab"
                  aria-controls="riskTab"
                  aria-selected="false"
                  style="text-align: center"
                >
                  All Sites Overview for selected variable
                </button>
              </li>
            </ul>
            <div
              class="tab-content no-gutters"
              id="myTabContent"
              style="
                height: calc(100vh - (75px)) !important;
                width: calc(100vw - (40px)) !important;
              "
            >
              <div
                class="tab-pane fade show active"
                id="complianceTab"
                role="tabpanel"
                aria-labelledby="nav-complianceTab-tab"
              >
                <h5>
                  RQOs for RIVERS for water quality (ecological and user) in
                  priority Resource Units
                </h5>
                <div class="row no-gutters">
                  <div class="col-md-2">
                    <div
                      class="btn inwards_button"
                      @click="viewRQOs()"
                      style="float: bottom"
                    >
                      View RQO Info
                    </div>
                    <nav>
                      <div
                        class="nav flex-column nav-pills"
                        id="v-pills-tab"
                        role="tablist"
                        aria-orientation="vertical"
                      >
                        <a
                          class="nav-item nav-link nav-vertical active"
                          id="v-pills-ecoli-tab"
                          data-toggle="pill"
                          style="border-bottom: 1px solid grey; padding: 10px"
                          href="#v-pills-ecoli"
                          role="tab"
                          aria-controls="v-pills-ecoli"
                          aria-selected="true"
                          >E.COLI</a
                        >
                        <a
                          class="nav-item nav-link nav-vertical"
                          id="v-pills-phos-tab"
                          data-toggle="pill"
                          style="border-bottom: 1px solid grey; padding: 10px"
                          href="#v-pills-phos"
                          role="tab"
                          aria-controls="v-pills-phos"
                          aria-selected="false"
                          >Orthophosphates</a
                        >
                        <a
                          class="nav-item nav-link nav-vertical"
                          id="v-pills-eCon-tab"
                          data-toggle="pill"
                          style="border-bottom: 1px solid grey; padding: 10px"
                          href="#v-pills-eCon"
                          role="tab"
                          aria-controls="v-pills-eCon"
                          aria-selected="false"
                          >Electrical Conductivity</a
                        >
                        <a
                          class="nav-item nav-link nav-vertical"
                          id="v-pills-arse-tab"
                          data-toggle="pill"
                          style="border-bottom: 1px solid grey; padding: 10px"
                          href="#v-pills-arse"
                          role="tab"
                          aria-controls="v-pills-arse"
                          aria-selected="false"
                          >Arsenic</a
                        >
                        <a
                          class="nav-item nav-link nav-vertical"
                          id="v-pills-TIN-tab"
                          data-toggle="pill"
                          style="border-bottom: 1px solid grey; padding: 10px"
                          href="#v-pills-TIN"
                          role="tab"
                          aria-controls="v-pills-TIN"
                          aria-selected="false"
                          >Total Inorganic Nitrogen</a
                        >
                        <a
                          class="nav-item nav-link nav-vertical"
                          id="v-pills-turb-tab"
                          data-toggle="pill"
                          style="border-bottom: 1px solid grey; padding: 10px"
                          href="#v-pills-turb"
                          role="tab"
                          aria-controls="v-pills-turb"
                          aria-selected="false"
                          >Turbidity</a
                        >
                        <a
                          class="nav-item nav-link nav-vertical"
                          id="v-pills-temp-tab"
                          data-toggle="pill"
                          style="border-bottom: 1px solid grey; padding: 10px"
                          href="#v-pills-temp"
                          role="tab"
                          aria-controls="v-pills-temp"
                          aria-selected="false"
                          >Temp(TBC)</a
                        >
                        <a
                          class="nav-item nav-link nav-vertical"
                          id="v-pills-phLower-tab"
                          data-toggle="pill"
                          style="border-bottom: 1px solid grey; padding: 10px"
                          href="#v-pills-phLower"
                          role="tab"
                          aria-controls="v-pills-phLower"
                          aria-selected="false"
                          >pH lower</a
                        >
                        <a
                          class="nav-item nav-link nav-vertical"
                          id="v-pills-phUpper-tab"
                          data-toggle="pill"
                          style="border-bottom: 1px solid grey; padding: 10px"
                          href="#v-pills-phUpper"
                          role="tab"
                          aria-controls="v-pills-phUpper"
                          aria-selected="false"
                          >pH upper</a
                        >
                        <a
                          class="nav-item nav-link nav-vertical"
                          id="v-pills-cad-tab"
                          data-toggle="pill"
                          style="border-bottom: 1px solid grey; padding: 10px"
                          href="#v-pills-cad"
                          role="tab"
                          aria-controls="v-pills-cad"
                          aria-selected="true"
                          >Cyanide</a
                        >
                      </div>
                    </nav>
                  </div>
                  <div class="col-md-10">
                    <div
                      class="tab-content"
                      id="v-pills-tabContent"
                      style="height: calc(100vh - (75px)) !important"
                    >
                      <div
                        class="tab-pane fade show active"
                        id="v-pills-ecoli"
                        role="tabpanel"
                        aria-labelledby="v-pills-ecoli-tab"
                      >
                        <EcoliCompliance
                          ref="ecoliComponent"
                          style="margin-top: 5px"
                        />
                      </div>
                      <div
                        class="tab-pane fade"
                        id="v-pills-phos"
                        role="tabpanel"
                        aria-labelledby="v-pills-phos-tab"
                      >
                        <PhosCompliance
                          ref="phosComponent"
                          style="margin-top: 5px"
                        />
                      </div>
                      <div
                        class="tab-pane fade"
                        id="v-pills-eCon"
                        role="tabpanel"
                        aria-labelledby="v-pills-eCon-tab"
                      >
                        <EcCompliance
                          ref="ecComponent"
                          style="margin-top: 5px"
                        />
                      </div>
                      <div
                        class="tab-pane fade"
                        id="v-pills-arse"
                        role="tabpanel"
                        aria-labelledby="v-pills-arse-tab"
                      >
                        <ArseCompliance
                          ref="arrqoComponent"
                          style="margin-top: 5px"
                        />
                      </div>
                      <div
                        class="tab-pane fade"
                        id="v-pills-TIN"
                        role="tabpanel"
                        aria-labelledby="v-pills-TIN-tab"
                      >
                        <TINCompliance
                          ref="TINrqoComponent"
                          style="margin-top: 5px"
                        />
                      </div>
                      <div
                        class="tab-pane fade"
                        id="v-pills-turb"
                        role="tabpanel"
                        aria-labelledby="v-pills-turb-tab"
                      >
                        <TurbidityCompliance
                          ref="turbidityrqoComponent"
                          style="margin-top: 5px"
                        />
                      </div>
                      <div
                        class="tab-pane fade"
                        id="v-pills-temp"
                        role="tabpanel"
                        aria-labelledby="v-pills-temp-tab"
                      ></div>
                      <div
                        class="tab-pane fade"
                        id="v-pills-phLower"
                        role="tabpanel"
                        aria-labelledby="v-pills-phLower-tab"
                      ></div>
                      <div
                        class="tab-pane fade"
                        id="v-pills-phUpper"
                        role="tabpanel"
                        aria-labelledby="v-pills-phUpper-tab"
                      ></div>
                      <div
                        class="tab-pane fade"
                        id="v-pills-cad"
                        role="tabpanel"
                        aria-labelledby="v-pills-cad-tab"
                      >
                        <CnCompliance
                          ref="cnComponent"
                          style="margin-top: 5px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="tab-pane fade"
                id="wqTab"
                role="tabpanel"
                aria-labelledby="nav-wqTab-tab"
                style="height: calc(100vh - (75px)) !important"
              >
                <div class="row no-gutters">
                  <div class="col-md-6">
                    <TimeseriesChart
                      ref="timeseriesComponent"
                      style="margin-top: 5px"
                    />
                  </div>
                  <div class="col-md-6" style="padding-left: 2px">
                    <BoxChart ref="boxComponent" style="margin-top: 5px" />
                  </div>
                  <div class="col-md-6">
                    <LoadChart ref="loadComponent" style="margin-top: 5px" />
                  </div>
                  <div class="col-md-6" style="padding-left: 2px">
                    <DurationChart
                      ref="durationComponent"
                      style="margin-top: 5px"
                    />
                  </div>
                </div>
              </div>
              <div
                class="tab-pane fade"
                id="riskTab"
                role="tabpanel"
                aria-labelledby="nav-riskTab-tab"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <grid-loader
      :loading="loading"
      :color="color"
      :size="size"
      class="loading_disks"
    ></grid-loader>
    <NavButtons />
    <RQOOverview ref="rqoOverview" />
    <SubmitData ref="submitDataComponent" style="margin-top: 5px;"/>

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
import axios from 'axios'
import NavButtons from '../../components/NavButtons'
// Import base components instead of local ones
import BaseMapDashboard from '../shared/BaseMapDashboard.vue'
import BaseCatchmentTree from '../shared/BaseCatchmentTree.vue'
import MaxHazard from './MaxHazard'
import BoxChart from './BoxChart'
import TimeseriesChart from './TimeseriesChart'
import DurationChart from './DurationChart'
import LoadChart from './LoadChart'
import SiteRisk from './SiteRisk'
import RiskHazard from './RiskHazard'
import EcoliCompliance from './EcoliCompliance'
import TINCompliance from './TINCompliance'
import EcCompliance from './EcCompliance'
import PhosCompliance from './PhosCompliance'
import TurbidityCompliance from './TurbidityCompliance'
import ArseCompliance from './ArseCompliance'
import CnCompliance from './CnCompliance'
import LatestRisk from './LatestRisk'
import MedianRisk from './MedianRisk'
import HealthNaratives from './HealthNaratives'
import HeighestRisk from './HeighestRisk'
import AllSites from './AllSites'
import MinRisk from './MinRisk'
import StatusBar from '../StatusBar'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import NarativeBlock from './NarativeBlock'
import RQOOverview from './RQOOverview'
import SubmitData from './SubmitData'
import { Fill, Stroke, Style } from 'ol/style'
import { GridLoader } from 'vue-spinner/dist/vue-spinner.min.js'
import $ from 'jquery'
import { remote } from '../../services/electron-compat'
import stateStore from '../../store/state_handler'
// Import the event bus composable for automatic cleanup
import { useEventBus } from '../../composables/useEventBus'
require('promise.prototype.finally').shim()
const { dialog, app } = remote

export default {
  name: 'IucmaWaterQualityDashboard',

  components: {
    BaseMapDashboard,
    BaseCatchmentTree,
    NavButtons,
    TurbidityCompliance,
    GridLoader,
    RQOOverview,
    BoxChart,
    TimeseriesChart,
    DurationChart,
    LoadChart,
    SubmitData,
    MaxHazard,
    SiteRisk,
    HeighestRisk,
    AllSites,
    MedianRisk,
    MinRisk,
    LatestRisk,
    StatusBar,
    EcoliCompliance,
    TINCompliance,
    PhosCompliance,
    EcCompliance,
    CnCompliance,
    ArseCompliance,
    RiskHazard,
    HealthNaratives,
    NarativeBlock,
  },

  setup() {
    // Use the event bus composable - listeners will be auto-cleaned on unmount
    const { on, emit } = useEventBus()
    return { busOn: on, busEmit: emit }
  },

  data() {
    return {
      stationsApi:
        'https://inwards.award.org.za/app_json/iucma_wq_stations.php',
      boxplotApi: 'https://inwards.award.org.za/app_json/wq_boxplot.php',
      stationsCoordinates: {}, // To stored all stations with their coordinates
      stationsFeatures: {}, // To stored station features
      stationsRequest: null,
      selectedStations: [],
      selectedWMAs: [],
      mergeAPI: 'false',
      selectedType: '',
      types: [],
      selectedVariable: '',
      variableUnit: '',
      variables: [],
      variableSample: 'All',
      stationsList: 'all',
      color: '#177a98',
      height: '35px',
      width: '4px',
      margin: '2px',
      size: '40px',
      loading: false,
      rqoSelected: true,
      nwrqoSelected: false,
      sansSelected: false,
      radius: '2px',
    }
  },
  computed: {
    mapDashboardRef() {
      return this.$refs.mapDashboard
    },
    catchmentTreeRef() {
      return this.$refs.catchmentTree
    }
  },

  beforeMount() {
    this.loadVariables()
    this.loadTypes()
  },

  mounted() {
    const self = this

    // Load selected WMAs and initialize map
    stateStore.getState(stateStore.keys.selectedWMAs, function (selectedWMAs) {
      if (!selectedWMAs || selectedWMAs.length === 0) {
        return false
      }
      self.selectedWMAs = selectedWMAs
      self.mapDashboardRef.showSelectedWMA(selectedWMAs)
    })

    // Register event bus listeners using composable (auto-cleanup on unmount)
    this.busOn('addStationsToStore', (payload) => {
      if (payload && payload.stations) {
        self.addStationsToStore(payload.stations, payload.chartStoredId)
      }
    })

    // Add KNP layer to map
    const map = this.$refs.mapDashboard.getMap()
    if (map) {
      self.addKnpLayer(map)
    }

    // Initialize range slider
    $('#customRange3').on('input', function () {
      const v = $('#customRange3').val()
      $('div.minSamples').text(v)
    })
  },

  methods: {
    // Handle station selection from map - called via component event
    onStationSelectedFromMap({ station, feature }) {
      console.log('IUCMA WQ station selected from map:', station)
      this.catchmentTreeRef.toggleNode(station, true)
    },

    // Handle station deselection from map - called via component event
    onStationDeselectedFromMap({ station, feature }) {
      console.log('IUCMA WQ station deselected from map:', station)
      this.catchmentTreeRef.toggleNode(station, false)
    },

    doAnalysis() {
      console.log(this.selectedVariable)
      this.variableSample = this.selectedVariable
      console.log(this.selectedStations[0])
      console.log(this.selectedType)
      console.log(this.variables)
      if (this.selectedStations.length === 0) {
        dialog.showMessageBox(null, {
          type: 'warning',
          message: 'Please select at least one station',
          buttons: ['OK'],
        })
        return
      }
      let dateStartString = $('#dateStart').val()
      let dateEndString = $('#dateEnd').val()
      if (!dateStartString || !dateEndString) {
        dialog.showMessageBox(null, {
          type: 'warning',
          message: 'Missing start date / end date',
          buttons: ['OK'],
        })
        return
      }
      let dateStart = new Date(dateStartString)
      let dateEnd = new Date(dateEndString)
      if (dateStart > dateEnd) {
        dialog.showMessageBox(null, {
          type: 'warning',
          message: 'End date should be after start date',
          buttons: ['OK'],
        })
        return
      }
      let mergeDWS = document.getElementById('merge').checked
      let rqo = document.getElementById('rqoLimits').checked
      let nwrqo = document.getElementById('nwrqos').checked
      let sans = document.getElementById('sansLimits').checked

      if (mergeDWS === true) {
        this.mergeAPI = 'true'
      }

      this.loading = true
      this.$refs.boxComponent.displayChart(
        this.selectedStations,
        this.selectedVariable[0],
        this.formatDate(dateStart),
        this.formatDate(dateEnd),
        this.selectedVariable[1],
        nwrqo,
        sans,
        rqo
      )
      this.$refs.timeseriesComponent.displayChart(
        this.selectedStations,
        this.selectedVariable[0],
        this.formatDate(dateStart),
        this.formatDate(dateEnd),
        this.selectedVariable[1],
        nwrqo,
        sans,
        rqo
      )
      this.$refs.durationComponent.displayChart(
        this.selectedStations,
        this.selectedVariable[0],
        this.formatDate(dateStart),
        this.formatDate(dateEnd),
        this.selectedVariable[1],
        nwrqo,
        sans,
        rqo
      )
      this.$refs.loadComponent.displayChart(
        this.selectedStations,
        this.selectedVariable[0],
        this.formatDate(dateStart),
        this.formatDate(dateEnd),
        this.selectedVariable[1],
        nwrqo,
        sans,
        rqo
      )
      /*       this.$refs.maxComponent.updateTable(
        this.selectedStations,
        this.selectedVariable[0],
        this.formatDate(dateStart),
        this.formatDate(dateEnd),
        this.selectedVariable[1]
      ) */
      /* this.$refs.siteComponent.showRiskTable(
        'stations=' +
          this.selectedStations +
          '&variable=' +
          this.selectedVariable[0] +
          '&sd=' +
          this.formatDate(dateStart) +
          '&ed=' +
          this.formatDate(dateEnd) +
          '&unit=' +
          this.selectedVariable[1] +
          '&type=' +
          this.selectedType +
          '&merge=' +
          this.mergeAPI
      )
      this.$refs.heighestComponent.showRiskTable(
        'stations=' +
          this.selectedStations +
          '&variable=' +
          this.selectedVariable[0] +
          '&sd=' +
          this.formatDate(dateStart) +
          '&ed=' +
          this.formatDate(dateEnd) +
          '&unit=' +
          this.selectedVariable[1] +
          '&type=' +
          this.selectedType +
          '&merge=' +
          this.mergeAPI
      )
      this.$refs.allComponent.showRiskTable(
        'stations=' +
          this.selectedStations +
          '&variable=' +
          this.selectedVariable[0] +
          '&sd=' +
          this.formatDate(dateStart) +
          '&ed=' +
          this.formatDate(dateEnd) +
          '&unit=' +
          this.selectedVariable[1] +
          '&type=' +
          this.selectedType +
          '&merge=' +
          this.mergeAPI
      )
      this.$refs.medianComponent.showRiskTable(
        'stations=' +
          this.selectedStations +
          '&variable=' +
          this.selectedVariable[0] +
          '&sd=' +
          this.formatDate(dateStart) +
          '&ed=' +
          this.formatDate(dateEnd) +
          '&unit=' +
          this.selectedVariable[1] +
          '&type=' +
          this.selectedType +
          '&merge=' +
          this.mergeAPI
      )
      this.$refs.minComponent.showRiskTable(
        'stations=' +
          this.selectedStations +
          '&variable=' +
          this.selectedVariable[0] +
          '&sd=' +
          this.formatDate(dateStart) +
          '&ed=' +
          this.formatDate(dateEnd) +
          '&unit=' +
          this.selectedVariable[1] +
          '&type=' +
          this.selectedType +
          '&merge=' +
          this.mergeAPI
      )
      this.$refs.latestComponent.showRiskTable(
        'stations=' +
          this.selectedStations +
          '&variable=' +
          this.selectedVariable[0] +
          '&sd=' +
          this.formatDate(dateStart) +
          '&ed=' +
          this.formatDate(dateEnd) +
          '&unit=' +
          this.selectedVariable[1] +
          '&type=' +
          this.selectedType +
          '&merge=' +
          this.mergeAPI
      )
      this.$refs.ecoliComponent.showRiskTable()
      this.$refs.phosComponent.showRiskTable()
      this.$refs.ecComponent.showRiskTable()
      this.$refs.cnComponent.showRiskTable()
      this.$refs.arrqoComponent.showRiskTable()
      this.$refs.healthnarativesComponent.showNarativesTable(
        'variable=' + this.selectedVariable[0]
      ) */

      this.loading = false
    },
    detectType() {
      // Set tree to loading state and fetch new stations
      this.catchmentTreeRef.setLoading(true)
      console.log(this.selectedType)
      this.fetchStations()
    },
    loadTypes() {
      axios
        .get('http://inwards.award.org.za/app_json/iucma_gauge_types.php')
        .then((response) => {
          this.types = response.data
        })
        .catch((e) => {})
    },
    loadVariables() {
      axios
        .get('http://inwards.award.org.za/app_json/variables.php')
        .then((response) => {
          this.variables = response.data
        })
        .catch((e) => {})
    },
    changeVariable() {
      console.log(this.selectedVariable)
      this.variableSample = this.selectedVariable[0]
      // Set tree to loading state and fetch new stations
      this.catchmentTreeRef.setLoading(true)
      this.fetchStations()
    },
    loadRiskTable(urk_paramters) {
      this.$refs.siteComponent.showRiskTable(urk_paramters)
    },
    showNarativesTable(urk_paramters) {
      this.$refs.healthnarativesComponent.showNarativesTable(urk_paramters)
    },
    showRiskHazard() {
      this.$refs.narativeComponent.showNarativeTable()
    },
    fetchStations() {
      let self = this
      let wmaNames = Object.assign([], self.selectedWMAs)
      // Cancel previous request if any
      if (this.stationsRequest) {
        this.stationsRequest.cancel('Canceling stations request')
        this.stationsRequest = null
      }
      // Wrap wma name with single quotes, for api purposes
      wmaNames = wmaNames.sort()
      for (let i = 0; i < wmaNames.length; i++) {
        wmaNames[i] = `'${wmaNames[i]}'`
      }
      let url = `${self.stationsApi}?wma=${wmaNames.join()}&type=${
        this.selectedType
      }&list=${this.stationsList}&variable=${this.variableSample}`
      console.log(url)
      //console.log(stationFile);
      // Check if online
      let cancelToken = null
      if (self.stationsRequest) {
        cancelToken = self.stationsRequest.token
      }
      axios
        .get(url, { cancelToken: cancelToken })
        .then((response) => {
          self.mapDashboardRef.loadStationsToMap(response.data)
          self.createCatchmentTree(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
      // Initialize date pickers
      stateStore.getState(stateStore.keys.dateEnd, function (dateEnd) {
        if (!dateEnd) {
          var endDate = new Date()
          var dd = endDate.getDate()
          var mm = endDate.getMonth() + 1
          var yyyy = endDate.getFullYear()
          if (dd < 10) {
            dd = '0' + dd
          }
          if (mm < 10) {
            mm = '0' + mm
          }
          dateEnd = yyyy + '-' + mm + '-' + dd
        }
        document.getElementById('dateEnd').setAttribute('value', dateEnd)
      })
      document.getElementById('dateEnd').onchange = function () {
        stateStore.setState(stateStore.keys.dateEnd, this.value)
      }
      var startDate = new Date()
      startDate.setDate(startDate.getDate() - 18250)
      var dd = startDate.getDate()
      var mm = startDate.getMonth() + 1
      var yyyy = startDate.getFullYear()
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }
      startDate = yyyy + '-' + mm + '-' + dd
      document.getElementById('dateStart').setAttribute('value', startDate)
    },
    addStationsToStore(stations, chartStoredId) {
      let self = this
      stateStore.getState(
        stateStore.keys.selectedStations,
        function (selectedStations) {
          if (!selectedStations || typeof selectedStations === 'undefined') {
            selectedStations = {}
          }
          for (let i = 0; i < stations.length; i++) {
            if (!selectedStations[stations[i]]) {
              selectedStations[stations[i]] = {
                feature: self.stationsFeatures[stations[i]],
                stationCoord: self.stationsCoordinates[stations[i]],
                chartStored: [chartStoredId],
              }
            } else {
              if (
                selectedStations[stations[i]]['chartStored'].indexOf(
                  chartStoredId
                ) < 0
              ) {
                selectedStations[stations[i]]['chartStored'].push(chartStoredId)
              }
            }
          }
          stateStore.setState(
            stateStore.keys.selectedStations,
            selectedStations
          )
        }
      )
    },
    addKnpLayer(map) {
      const knpJson = require('../../assets/knp.json')
      let knpLayer = new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON({
            defaultDataProjection: 'EPSG:4326',
          }).readFeatures(knpJson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          }),
        }),
        updateWhileAnimating: true,
        updateWhileInteracting: false,
      })
      // map.addLayer(knpLayer);
      let knpStyle = new Style({
        stroke: new Stroke({
          color: [51, 204, 51, 0.6],
          width: 1,
        }),
        fill: new Fill({
          color: [51, 204, 51, 0.2],
        }),
        zIndex: 1,
      })
      knpLayer.setStyle(knpStyle)
    },
    createCatchmentTree(stationsData) {
      let self = this
      // Start adding stations data to catchment
      let catchmentsData = self.mapDashboardRef.getCatchmentsData()
      for (let i = 0; i < stationsData.features.length; i++) {
        // let primary = stationsData.features[i]['properties']['primary'];
        let secondary = stationsData.features[i]['properties']['secondary']
        let station = stationsData.features[i]['properties']['station']
        let place = stationsData.features[i]['properties']['desc']
        let sampleSize = stationsData.features[i]['properties']['sample_size_iucma']
        let latestReading = stationsData.features[i]['properties']['latest']
        let hydro = stationsData.features[i]['properties']['hydro']
        let rqo = stationsData.features[i]['properties']['ewr_site']
        let iucma = stationsData.features[i]['properties']['iucma']
        this.stationsFeatures[station] = stationsData.features[i]
        this.stationsCoordinates[station] =
          stationsData.features[i].geometry.coordinates
        let flow = 'N'
        if (hydro > 0) {
          flow = 'Y'
        }
        if (catchmentsData.hasOwnProperty(secondary)) {
          let stationName = ''
          if (latestReading != null) {
            stationName =
              station +
              ': ' +
              ' (' +
              iucma +
              ') ' +
              ' (' +
              sampleSize +
              ') ' +
              ' (' +
              rqo +
              ') ' +
              place +
              ' ' +
              latestReading.toString().slice(0, 10)
          } else {
            stationName = 'Problem with Station'
          }
          catchmentsData[secondary].push(stationName)
          catchmentsData[secondary].sort()
        }
      }
      //console.log(catchmentsData);
      let treeData = self.generateTreeData(catchmentsData)
      // Pass callbacks in the format expected by createTree (raw event, data)
      this.catchmentTreeRef.createTree(
        treeData,
        this._onCatchmentTreeSelectedCallback,
        this._onTreeReadyCallback
      )
    },

    // Raw callbacks for createTree (receive event, data directly)
    _onTreeReadyCallback(event, data) {
      const self = this
      stateStore.getState(
        stateStore.keys.selectedIUCMASites,
        function (selectedIUCMASites) {
          if (!selectedIUCMASites) {
            return false
          }
          self.catchmentTreeRef.toggleMultipleNodes(selectedIUCMASites, true)
        }
      )
    },

    _onCatchmentTreeSelectedCallback(event, data) {
      this._handleTreeSelection(event, data)
    },

    // Handle tree ready event from component event (receives { event, data })
    onTreeReady({ event, data }) {
      this._onTreeReadyCallback(event, data)
    },

    // Handle tree clicked event from component event (receives { event, data })
    onCatchmentTreeSelectedHandler({ event, data }) {
      this._handleTreeSelection(event, data)
    },
    generateTreeData(dictionary) {
      let treeData = []
      let self = this
      $.each(dictionary, function (key, catchment) {
        let hasChildren = false
        if (typeof catchment === 'object' || catchment instanceof Array) {
          hasChildren = true
        }
        let c = {
          text: hasChildren ? key : catchment,
          id: hasChildren ? key : catchment,
          type: hasChildren ? 'layer' : 'station',
        }
        if (hasChildren) {
          c['children'] = self.generateTreeData(catchment)
        }
        treeData.push(c)
      })
      return treeData
    },
    viewRQOs() {
      this.$refs.rqoOverview.showRQOOverview()
    },
    submitData () {
      this.$refs.submitDataComponent.submitData();
    },

    // Internal handler for tree selection (used by both callback and event)
    _handleTreeSelection(event, data) {
      // On catchment tree clicked
      let selected = ''
      const selectedIUCMASites = []
      const _selectedStations = []
      let selectedBits = []
      const _unselectedStations = Object.assign([], this.selectedStations)

      for (let i = 0; i < data.selected.length; i++) {
        selected = data.instance.get_node(data.selected[i]).text
        selectedBits = selected.split(':')
        const type = data.instance.get_node(data.selected[i]).type
        if (type === 'layer') {
          selectedIUCMASites.push(selectedBits[0])
        } else if (type === 'station') {
          _selectedStations.push(selectedBits[0])
          if (_unselectedStations.indexOf(selectedBits[0]) !== -1) {
            _unselectedStations.splice(
              _unselectedStations.indexOf(selectedBits[0]),
              1
            )
          }
        }
      }

      this.mapDashboardRef.toggleSelectedStationsByStationNames(
        _selectedStations,
        _unselectedStations
      )
      this.selectedStations = _selectedStations
      stateStore.setState(
        stateStore.keys.selectedIUCMASites,
        this.selectedStations
      )
      this.mapDashboardRef.selectCatchments(selectedIUCMASites)
    },
  },
}
</script>
