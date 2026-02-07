<template>
  <div style="height: 100%">
    <StatusBar />
    <div class="container-fluid" style="height: 100%">
      <div class="row no-gutters" style="height: 100%">
        <div
          class="col-md-4 no-float left-panel"
          style="background: #252526; padding-left: 8px"
        >
          <!-- Using BaseCatchmentTree with unique treeId -->
          <BaseCatchmentTree
            ref="catchmentTree"
            tree-id="dam-dashboard-stations"
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
          <div>
            <div class="card rounded-0">
              <div class="card-body">
                <div class="row" style="margin-top: 2px">
                  <hr />
                  <div class="col-md-6">
                    <div class="form-inline" style="padding-left: 2px">
                      <div class="form-group">
                        <label
                          class="datepicker"
                          for="damDateStart"
                          style="padding-left: 0px"
                          >Start Date:</label
                        >
                        <input
                          class="form-control datepicker"
                          id="damDateStart"
                          style="margin-left: 4px; width: 65%"
                          placeholder="Start Date"
                          onfocus="(this.type='date')"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-inline" style="padding-left: 0px">
                      <div class="form-group">
                        <label
                          class="datepicker"
                          for="damDateEnd"
                          style="margin-right: 2px"
                          >End Date:</label
                        >
                        <input
                          class="form-control datepicker"
                          id="damDateEnd"
                          style="margin-right: 2px; width: 65%"
                          placeholder="End Date"
                          onfocus="(this.type='date')"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div class="row" style="margin-bottom: 0.1rem">
                  <div class="col-md-12">
                    <div class="funkyradio">
                      <div
                        class="form-check form-check-inline funkyradio-primary"
                      >
                        <input
                          id="damTs"
                          type="checkbox"
                          class="form-check-input"
                          checked="true"
                        />
                        <label
                          for="damTs"
                          class="form-check-label"
                          style="width: 11rem; font-size: 11px"
                          >Timeseries</label
                        >
                      </div>
                      <div
                        class="form-check form-check-inline funkyradio-primary"
                      >
                        <input
                          id="damBx"
                          type="checkbox"
                          class="form-check-input"
                          checked="true"
                        />
                        <label
                          for="damBx"
                          class="form-check-label"
                          style="width: 11rem; font-size: 11px"
                          >Boxplot</label
                        >
                      </div>
                      <div
                        class="form-check form-check-inline funkyradio-primary"
                      >
                        <input
                          id="damFdc"
                          type="checkbox"
                          class="form-check-input"
                          checked="true"
                        />
                        <label
                          for="damFdc"
                          class="form-check-label"
                          style="width: 11rem; font-size: 11px"
                          >Flow Duration</label
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div class="row">
                  <div class="col-md-12">
                    <button
                      class="btn inwards_button"
                      @click="fetchUnverified()"
                      type="button"
                      style="width: 100%"
                    >
                      <i class="fa fa-line-chart"></i>Chart Dam and Dam Components
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <!-- Using BaseMapDashboard with unique mapId -->
          <BaseMapDashboard
            ref="mapDashboard"
            map-id="dam-dashboard-map"
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
            padding-bottom: 50px;
            padding-left: 10px;
            padding-right: 10px;
          "
        >
          <div class="row no-gutters">
            <div class="col-md-6">
              <UnverifiedChart ref="chartComponent" style="margin-top: 5px" />
            </div>
            <div class="col-md-6" style="padding-left: 2px">
              <BoxChart ref="boxComponent" style="margin-top: 5px" />
            </div>
            <div class="col-md-6">
              <DurationCurve ref="durationComponent" style="margin-top: 5px" />
            </div>
            <div class="col-md-6" style="padding-left: 2px; margin-top: 5px">
              <Station ref="stationComponent" />
            </div>
          </div>
        </div>
        <NavButtons />
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
import axios from 'axios'
import Header from '../../components/Header'
import NavButtons from '../../components/NavButtons'
// Import base components instead of local ones
import BaseMapDashboard from '../shared/BaseMapDashboard.vue'
import BaseCatchmentTree from '../shared/BaseCatchmentTree.vue'
import UnverifiedChart from './UnverifiedChart'
import DurationCurve from './DurationCurve'
import BoxChart from './BoxChart'
import Station from './Station'
import $ from 'jquery'
import stateStore from '../../store/state_handler'
import StatusBar from '../StatusBar'
import { remote } from '../../services/electron-compat'
// Import the event bus composable for automatic cleanup
import { useEventBus } from '../../composables/useEventBus'
require('promise.prototype.finally').shim()

const { dialog, app } = remote

export default {
  name: 'DamDashboard',

  components: {
    Header,
    NavButtons,
    BaseMapDashboard,
    BaseCatchmentTree,
    BoxChart,
    UnverifiedChart,
    DurationCurve,
    Station,
    StatusBar,
  },

  setup() {
    // Use the event bus composable - listeners will be auto-cleaned on unmount
    const { on, emit } = useEventBus()
    return { busOn: on, busEmit: emit }
  },

  data() {
    return {
      stationsApi: 'https://inwards.award.org.za/app_json/res_real_stations.php',
      stationsCoordinates: {}, // To store all stations with their coordinates
      stationsFeatures: {}, // To store station features
      stationsRequest: null,
      selectedDamSites: [],
      selectedWMAs: [],
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

  mounted() {
    const self = this

    // Load selected WMAs and initialize map
    stateStore.getState(stateStore.keys.selectedWMAs, function (selectedWMAs) {
      if (!selectedWMAs || selectedWMAs.length === 0) {
        return false
      }
      self.selectedWMAs = selectedWMAs
      self.mapDashboardRef.showSelectedWMA(selectedWMAs)
      self.fetchStations()
    })

    // Register event bus listeners using composable (auto-cleanup on unmount)
    // Note: Station selection is now handled via component events, not global bus
    this.busOn('addStationsToStore', (payload) => {
      if (payload && payload.stations) {
        self.addStationsToStore(payload.stations, payload.chartStoredId)
      }
    })

    // Initialize date pickers with unique IDs for this dashboard
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
      document.getElementById('damDateEnd').setAttribute('value', dateEnd)
    })

    document.getElementById('damDateEnd').onchange = function () {
      stateStore.setState(stateStore.keys.dateEnd, this.value)
    }

    // Set start date to 14 days ago
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 14)
    let dd = startDate.getDate()
    let mm = startDate.getMonth() + 1
    const yyyy = startDate.getFullYear()
    if (dd < 10) dd = '0' + dd
    if (mm < 10) mm = '0' + mm
    const startDateStr = yyyy + '-' + mm + '-' + dd
    document.getElementById('damDateStart').setAttribute('value', startDateStr)
  },

  methods: {
    // Handle station selection from map - called via component event
    onStationSelectedFromMap({ station, feature }) {
      console.log('Dam station selected from map:', station)
      // Toggle the corresponding tree node
      this.catchmentTreeRef.toggleNode(station, true)
    },

    // Handle station deselection from map - called via component event
    onStationDeselectedFromMap({ station, feature }) {
      console.log('Dam station deselected from map:', station)
      // Toggle the corresponding tree node
      this.catchmentTreeRef.toggleNode(station, false)
    },

    fetchUnverified() {
      const selectedDamSites = this.mapDashboardRef.getSelectedStations()
      if (selectedDamSites.length === 0) {
        dialog.showMessageBox(null, {
          type: 'warning',
          message: 'Please select at least one station',
          buttons: ['OK'],
        })
        return
      }
      const dateStartString = $('#damDateStart').val()
      const dateEndString = $('#damDateEnd').val()
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
      const tsChart = document.getElementById('damTs').checked
      if (tsChart === true) {
        this.$refs.chartComponent.displayChart(
          selectedDamSites,
          this.formatDate(dateStart),
          this.formatDate(dateEnd)
        )
      }
      const bxChart = document.getElementById('damBx').checked
      if (bxChart === true) {
        this.$refs.boxComponent.displayChart(
          selectedDamSites,
          this.formatDate(dateStart),
          this.formatDate(dateEnd)
        )
      }
      const fdcChart = document.getElementById('damFdc').checked
      if (fdcChart === true) {
        this.$refs.durationComponent.displayChart(
          selectedDamSites,
          this.formatDate(dateStart),
          this.formatDate(dateEnd)
        )
      }
      this.$refs.stationComponent.displayChart(
        selectedDamSites,
        this.formatDate(dateStart),
        this.formatDate(dateEnd)
      )
    },

    async fetchStations() {
      const self = this
      let wmaNames = Object.assign([], self.selectedWMAs)

      // Get userData path via IPC
      const userDataPath = await window.electronAPI.getUserDataPath()
      const stationsDir = `${userDataPath}/stations`

      // Ensure directory exists
      const dirExists = await window.electronAPI.pathExists(stationsDir)
      if (!dirExists) {
        await window.electronAPI.createDirectory(stationsDir)
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
      const url = `${self.stationsApi}?wma=${wmaNames.join()}`
      console.log(url)

      // Generate a simple hash for the filename
      const urlHash = url.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      const stationFile = `${stationsDir}/${Math.abs(urlHash)}.json`

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
            self.createCatchmentTree(response.data)
            // Save to cache using IPC
            try {
              const jsonData = JSON.stringify(response.data)
              await window.electronAPI.writeFile(stationFile, jsonData)
            } catch (err) {
              console.warn('Could not cache stations data:', err)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        // Try to load from cache
        try {
          const exists = await window.electronAPI.pathExists(stationFile)
          if (exists) {
            const jsonData = await window.electronAPI.readFile(stationFile)
            const stationsData = JSON.parse(jsonData)
            self.mapDashboardRef.loadStationsToMap(stationsData)
            self.createCatchmentTree(stationsData)
          }
        } catch (err) {
          console.warn('Could not load cached stations:', err)
        }
      }
    },

    addStationsToStore(stations, chartStoredId) {
      const self = this
      stateStore.getState(
        stateStore.keys.selectedDamSites,
        function (selectedDamSites) {
          if (!selectedDamSites || typeof selectedDamSites === 'undefined') {
            selectedDamSites = {}
          }
          for (let i = 0; i < stations.length; i++) {
            if (!selectedDamSites[stations[i]]) {
              selectedDamSites[stations[i]] = {
                feature: self.stationsFeatures[stations[i]],
                stationCoord: self.stationsCoordinates[stations[i]],
                chartStored: [chartStoredId],
              }
            } else {
              if (
                selectedDamSites[stations[i]]['chartStored'].indexOf(
                  chartStoredId
                ) < 0
              ) {
                selectedDamSites[stations[i]]['chartStored'].push(chartStoredId)
              }
            }
          }
          stateStore.setState(
            stateStore.keys.selectedDamSites,
            selectedDamSites
          )
        }
      )
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
        const place = stationsData.features[i]['properties']['place']
        const latestReading = stationsData.features[i]['properties']['latest']
        this.stationsFeatures[station] = stationsData.features[i]
        this.stationsCoordinates[station] =
          stationsData.features[i].geometry.coordinates
        if (catchmentsData.hasOwnProperty(secondary)) {
          let stationName = ''
          if (latestReading != null) {
            stationName =
              station +
              ': ' +
              place +
              ': ' +
              latestReading.toString().slice(0, 10)
          } else {
            stationName = 'Problem with Station'
          }
          catchmentsData[secondary].push(stationName)
          catchmentsData[secondary].sort()
        }
      }
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
        stateStore.keys.selectedCatchments,
        function (selectedCatchments) {
          if (!selectedCatchments) {
            return false
          }
          self.catchmentTreeRef.toggleMultipleNodes(selectedCatchments, true)
        }
      )
    },

    _onCatchmentTreeSelectedCallback(event, data) {
      // Delegate to the main handler with unwrapped params
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
      const selectedCatchments = []
      const _selectedDamSites = []
      let selectedBits = []
      const _unselectedDamSites = Object.assign([], this.selectedDamSites)

      for (let i = 0; i < data.selected.length; i++) {
        selected = data.instance.get_node(data.selected[i]).text
        selectedBits = selected.split(':')
        const type = data.instance.get_node(data.selected[i]).type
        if (type === 'layer') {
          selectedCatchments.push(selectedBits[0])
        } else if (type === 'station') {
          _selectedDamSites.push(selectedBits[0])
          if (_unselectedDamSites.indexOf(selectedBits[0]) !== -1) {
            _unselectedDamSites.splice(
              _unselectedDamSites.indexOf(selectedBits[0]),
              1
            )
          }
        }
      }

      this.mapDashboardRef.toggleSelectedStationsByStationNames(
        _selectedDamSites,
        _unselectedDamSites
      )
      this.selectedDamSites = _selectedDamSites
      stateStore.setState(
        stateStore.keys.selectedCatchments,
        this.selectedDamSites
      )
      this.mapDashboardRef.selectCatchments(selectedCatchments)
    },
  },
}
</script>
