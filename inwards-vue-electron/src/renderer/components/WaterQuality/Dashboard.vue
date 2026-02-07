<template>
  <div style="height: 100%">
    <StatusBar />
    <div class="container-fluid" style="height: 100%">
      <div class="row no-gutters" style="height: 100%">
        <div
          class="col-md-4 no-float left-panel"
          style="background: #252526; padding-left: 8px"
        >
          <div
            class="card rounded-0"
            style="margin-top: 5px; margin-bottom: 5px; width: 100%"
          >
            <div class="col-md-12" align="center">
              <img
                src="../../assets/dws.png"
                alt=""
                style="align: center"
                height="50px"
              />
            </div>

            <div class="card-header inwards_card">
              <h6 style="color: white">
                <i class="fa fa-bar-chart" style="padding-right: 10px"></i
                >Parameters
              </h6>
            </div>
            <div class="card-body">
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
                      class="form-control rounded-0"
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
                      class="form-control rounded-0"
                      id="wqDateStart"
                      style="margin-left: 4px"
                      placeholder="Start Date"
                      onfocus="(this.type='date')"
                    />
                  </div>
                </div>
                <div class="col-sm-6" style="padding-left: 2px">
                  <div class="form-group" style="margin-right: 0.2rem">
                    <input
                      class="form-control rounded-0"
                      id="wqDateEnd"
                      style="margin-right: 0px"
                      placeholder="End Date"
                      onfocus="(this.type='date')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Using BaseCatchmentTree with unique treeId -->
          <BaseCatchmentTree
            ref="catchmentTree"
            tree-id="wq-dashboard-stations"
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
          <!-- Using BaseMapDashboard with unique mapId -->
          <BaseMapDashboard
            ref="mapDashboard"
            map-id="wq-dashboard-map"
            map-height="410px"
            :connected-to-tree="true"
            @station-selected="onStationSelectedFromMap"
            @station-deselected="onStationDeselectedFromMap"
          />
        </div>
        <div
          class="col-md-8 no-float right-panel"
          style="
            background: #1e1e1e;
            padding-bottom: 5px;
            padding-left: 10px;
            padding-right: 10px;
          "
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
              <DurationChart ref="durationComponent" style="margin-top: 5px" />
            </div>
            <br />
          </div>
          <grid-loader
            :loading="loading"
            :color="color"
            :size="size"
            class="loading_disks"
          ></grid-loader>
        </div>
      </div>
      <NavButtons />
    </div>
    <RiverLog ref="logComponent" style="margin-top: 5px" />
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
import RiverLog from './RiverLog'
import BoxChart from './BoxChart'
import TimeseriesChart from './TimeseriesChart'
import DurationChart from './DurationChart'
import LoadChart from './LoadChart'
import StatusBar from '../StatusBar'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
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
  name: 'WaterQualityDashboard',

  components: {
    BaseMapDashboard,
    BaseCatchmentTree,
    NavButtons,
    GridLoader,
    BoxChart,
    TimeseriesChart,
    DurationChart,
    LoadChart,
    RiverLog,
    StatusBar,
  },

  setup() {
    // Use the event bus composable - listeners will be auto-cleaned on unmount
    const { on, emit } = useEventBus()
    return { busOn: on, busEmit: emit }
  },

  data() {
    return {
      stationsApi: 'https://inwards.award.org.za/app_json/app_wq_stations.php',
      boxplotApi: 'https://inwards.award.org.za/app_json/wq_boxplot.php',
      stationsCoordinates: {}, // To store all stations with their coordinates
      stationsFeatures: {}, // To store station features
      stationsRequest: null,
      selectedRQISstations: [],
      selectedWMAs: [],
      selectedType: '',
      types: [],
      selectedVariable: '',
      variableUnit: '',
      variables: [],
      color: '#177a98',
      height: '35px',
      width: '4px',
      margin: '2px',
      size: '40px',
      loading: false,
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
      console.log(self.selectedWMAs)
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
  },

  methods: {
    // Handle station selection from map - called via component event
    onStationSelectedFromMap({ station, feature }) {
      console.log('WQ station selected from map:', station)
      this.catchmentTreeRef.toggleNode(station, true)
    },

    // Handle station deselection from map - called via component event
    onStationDeselectedFromMap({ station, feature }) {
      console.log('WQ station deselected from map:', station)
      this.catchmentTreeRef.toggleNode(station, false)
    },

    doAnalysis() {
      console.log(this.selectedVariable)
      console.log(this.selectedRQISstations[0])
      console.log(this.selectedType)
      console.log(this.variables)
      if (this.selectedRQISstations.length === 0) {
        dialog.showMessageBox(null, {
          type: 'warning',
          message: 'Please select at least one station',
          buttons: ['OK'],
        })
        return
      }
      const dateStartString = $('#wqDateStart').val()
      const dateEndString = $('#wqDateEnd').val()
      if (!dateStartString || !dateEndString) {
        dialog.showMessageBox(null, {
          type: 'warning',
          message: 'Missing start date / end date',
          buttons: ['OK'],
        })
        return
      }
      const dateStart = new Date(dateStartString)
      const dateEnd = new Date(dateEndString)
      if (dateStart > dateEnd) {
        dialog.showMessageBox(null, {
          type: 'warning',
          message: 'End date should be after start date',
          buttons: ['OK'],
        })
        return
      }
      this.loading = true
      this.$refs.boxComponent.displayChart(
        this.selectedRQISstations,
        this.selectedVariable[0],
        this.formatDate(dateStart),
        this.formatDate(dateEnd),
        this.selectedVariable[1]
      )
      this.$refs.timeseriesComponent.displayChart(
        this.selectedRQISstations,
        this.selectedVariable[0],
        this.formatDate(dateStart),
        this.formatDate(dateEnd),
        this.selectedVariable[1]
      )
      this.$refs.durationComponent.displayChart(
        this.selectedRQISstations,
        this.selectedVariable[0],
        this.formatDate(dateStart),
        this.formatDate(dateEnd),
        this.selectedVariable[1]
      )
      this.$refs.loadComponent.displayChart(
        this.selectedRQISstations,
        this.selectedVariable[0],
        this.formatDate(dateStart),
        this.formatDate(dateEnd),
        this.selectedVariable[1]
      )
      this.loading = false
    },

    detectType() {
      this.catchmentTreeRef.setLoading(true)
      console.log(this.selectedType)
      this.fetchStations()
    },

    changeVariable() {
      console.log(this.selectedVariable)
      this.variableSample = this.selectedVariable[0]
      this.catchmentTreeRef.setLoading(true)
    },

    loadTypes() {
      axios
        .get('http://inwards.award.org.za/app_json/wq_gauge_types.php')
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

    async fetchStations() {
      const self = this
      let wmaNames = Object.assign([], self.selectedWMAs)
      console.log(wmaNames)

      // Get user data path and set up stations directory
      const userDataPath = await window.electronAPI.getUserDataPath()
      const dir = `${userDataPath}/stations`

      const dirExists = await window.electronAPI.fileExists(dir)
      if (!dirExists) {
        await window.electronAPI.createDirectory(dir)
      }

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
      const url = `${self.stationsApi}?wma=${wmaNames.join()}&type=${this.selectedType}`
      console.log(url)

      // Generate a simple hash for the filename
      const urlHash = url.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      const stationFile = `${dir}/${urlHash}.json`
      console.log(stationFile)

      // Check if online
      if (navigator.onLine) {
        let cancelToken = null
        if (self.stationsRequest) {
          cancelToken = self.stationsRequest.token
        }
        axios
          .get(url, { cancelToken: cancelToken })
          .then(async (response) => {
            self.mapDashboardRef.loadStationsToMap(response.data)
            await window.electronAPI.writeFile(stationFile, JSON.stringify(response.data))
            self.createCatchmentTree(response.data)
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        const fileExists = await window.electronAPI.fileExists(stationFile)
        if (fileExists) {
          const jsonData = await window.electronAPI.readFile(stationFile)
          const stationsData = JSON.parse(jsonData)
          self.mapDashboardRef.loadStationsToMap(stationsData)
          self.createCatchmentTree(stationsData)
        }
      }

      // Initialize date pickers
      stateStore.getState(stateStore.keys.dateEnd, function (dateEnd) {
        if (!dateEnd) {
          const endDate = new Date()
          let dd = endDate.getDate()
          let mm = endDate.getMonth() + 1
          const yyyy = endDate.getFullYear()
          if (dd < 10) dd = '0' + dd
          if (mm < 10) mm = '0' + mm
          dateEnd = yyyy + '-' + mm + '-' + dd
        }
        document.getElementById('wqDateEnd').setAttribute('value', dateEnd)
      })

      document.getElementById('wqDateEnd').onchange = function () {
        stateStore.setState(stateStore.keys.dateEnd, this.value)
      }

      // Set start date to 50 years ago (18250 days)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 18250)
      let dd = startDate.getDate()
      let mm = startDate.getMonth() + 1
      const yyyy = startDate.getFullYear()
      if (dd < 10) dd = '0' + dd
      if (mm < 10) mm = '0' + mm
      const startDateStr = yyyy + '-' + mm + '-' + dd
      document.getElementById('wqDateStart').setAttribute('value', startDateStr)
    },

    addStationsToStore(stations, chartStoredId) {
      const self = this
      stateStore.getState(
        stateStore.keys.selectedRQISstations,
        function (selectedRQISstations) {
          if (!selectedRQISstations || typeof selectedRQISstations === 'undefined') {
            selectedRQISstations = {}
          }
          for (let i = 0; i < stations.length; i++) {
            if (!selectedRQISstations[stations[i]]) {
              selectedRQISstations[stations[i]] = {
                feature: self.stationsFeatures[stations[i]],
                stationCoord: self.stationsCoordinates[stations[i]],
                chartStored: [chartStoredId],
              }
            } else {
              if (
                selectedRQISstations[stations[i]]['chartStored'].indexOf(chartStoredId) < 0
              ) {
                selectedRQISstations[stations[i]]['chartStored'].push(chartStoredId)
              }
            }
          }
          stateStore.setState(stateStore.keys.selectedRQISstations, selectedRQISstations)
        }
      )
    },

    showRiverLog() {
      this.$refs.logComponent.showLogModal()
    },

    addKnpLayer(map) {
      const knpJson = require('../../assets/knp.json')
      const knpLayer = new VectorLayer({
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
      const knpStyle = new Style({
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
      // Uncomment to add the KNP layer
      // map.addLayer(knpLayer)
    },

    generateTreeData(dictionary) {
      const treeData = []
      const self = this
      $.each(dictionary, function (key, catchment) {
        let hasChildren = false
        if (typeof catchment === 'object' || catchment instanceof Array) {
          hasChildren = true
        }
        const c = {
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

    createCatchmentTree(stationsData) {
      const self = this
      // Start adding stations data to catchment
      const catchmentsData = self.mapDashboardRef.getCatchmentsData()
      for (let i = 0; i < stationsData.features.length; i++) {
        const secondary = stationsData.features[i]['properties']['secondary']
        const station = stationsData.features[i]['properties']['station']
        const place = stationsData.features[i]['properties']['desc']
        const sampleSize = stationsData.features[i]['properties']['sample_size']
        const latestReading = stationsData.features[i]['properties']['latest']
        const hydro = stationsData.features[i]['properties']['hydro']
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
              sampleSize +
              ') ' +
              ' (' +
              flow +
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
      console.log(catchmentsData)
      const treeData = self.generateTreeData(catchmentsData)
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
        stateStore.keys.selectedRQISSites,
        function (selectedRQISSites) {
          if (!selectedRQISSites) {
            return false
          }
          self.catchmentTreeRef.toggleMultipleNodes(selectedRQISSites, true)
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

    // Internal handler for tree selection (used by both callback and event)
    _handleTreeSelection(event, data) {
      // On catchment tree clicked
      let selected = ''
      const selectedRQISSites = []
      const _selectedRQISstations = []
      let selectedBits = []
      const _unselectedRQISstations = Object.assign([], this.selectedRQISstations)
      console.log(_unselectedRQISstations)

      for (let i = 0; i < data.selected.length; i++) {
        selected = data.instance.get_node(data.selected[i]).text
        selectedBits = selected.split(':')
        const type = data.instance.get_node(data.selected[i]).type
        if (type === 'layer') {
          selectedRQISSites.push(selectedBits[0])
        } else if (type === 'station') {
          _selectedRQISstations.push(selectedBits[0])
          if (_unselectedRQISstations.indexOf(selectedBits[0]) !== -1) {
            _unselectedRQISstations.splice(
              _unselectedRQISstations.indexOf(selectedBits[0]),
              1
            )
          }
        }
      }

      this.mapDashboardRef.toggleSelectedStationsByStationNames(
        _selectedRQISstations,
        _unselectedRQISstations
      )
      this.selectedRQISstations = _selectedRQISstations
      stateStore.setState(
        stateStore.keys.selectedRQISSites,
        this.selectedRQISstations
      )
      console.log(selectedRQISSites)
      this.mapDashboardRef.selectCatchments(selectedRQISSites)
    },
  },
}
</script>
