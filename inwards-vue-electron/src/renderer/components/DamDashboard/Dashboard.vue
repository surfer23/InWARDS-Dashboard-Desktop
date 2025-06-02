<template>
  <div style="height: 100%">
    <StatusBar />
    <div class="container-fluid" style="height: 100%">
      <div class="row no-gutters" style="height: 100%">
        <div
          class="col-md-4 no-float left-panel"
          style="background: #252526; padding-left: 8px"
        >
          <CatchmentTree ref="catchmentTree" />
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
                          for="dateStart"
                          style="padding-left: 0px"
                          >Start Date:</label
                        >
                        <input
                          class="form-control datepicker"
                          id="dateStart"
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
                          for="dateEnd"
                          style="margin-right: 2px"
                          >End Date:</label
                        >
                        <input
                          class="form-control datepicker"
                          id="dateEnd"
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
                          id="ts"
                          type="checkbox"
                          class="form-check-input"
                          checked="true"
                        />
                        <label
                          for="ts"
                          class="form-check-label"
                          style="width: 11rem; font-size: 11px"
                          >Timeseries</label
                        >
                      </div>
                      <div
                        class="form-check form-check-inline funkyradio-primary"
                      >
                        <input
                          id="bx"
                          type="checkbox"
                          class="form-check-input"
                          checked="true"
                        />
                        <label
                          for="bx"
                          class="form-check-label"
                          style="width: 11rem; font-size: 11px"
                          >Boxplot</label
                        >
                      </div>
                      <div
                        class="form-check form-check-inline funkyradio-primary"
                      >
                        <input
                          id="fdc"
                          type="checkbox"
                          class="form-check-input"
                          checked="true"
                        />
                        <label
                          for="fdc"
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
          <MapDashboard ref="mapDashboard" />
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
import MapDashboard from './MapDashboard'
import CatchmentTree from './CatchmentTree'
import UnverifiedChart from './UnverifiedChart'
import DurationCurve from './DurationCurve'
import BoxChart from './BoxChart'
import Station from './Station'
import $ from 'jquery'
import stateStore from '../../store/state_handler'
import StatusBar from '../StatusBar'
import path from 'path'
require('promise.prototype.finally').shim()
const { dialog, app } = require('electron').remote

export default {
  data() {
    return {
      stationsApi: 'https://inwards.award.org.za/app_json/res_real_stations.php',
      stationsCoordinates: {}, // To stored all stations with their coordinates
      stationsFeatures: {}, // To stored station features
      stationsRequest: null,
      selectedDamSites: [],
      selectedWMAs: [],
    }
  },
  mounted() {
    let self = this
    self.mapDashboardRef = self.$refs.mapDashboard
    self.catchmentTreeRef = self.$refs.catchmentTree
    stateStore.getState(stateStore.keys.selectedWMAs, function (selectedWMAs) {
      if (!selectedWMAs) {
        return false
      }
      if (selectedWMAs.length === 0) {
        return false
      }
      self.selectedWMAs = selectedWMAs
      self.mapDashboardRef.showSelectedWMA(selectedWMAs)
      self.fetchStations()
    })
    self.$bus.$on('stationSelectedFromMap', (station, isStationSelected) => {
      self.catchmentTreeRef.toggleNode(station, isStationSelected)
    })
    self.$bus.$on('refreshStations', () => {
      self.fetchStations()
    })
    self.$bus.$on('addStationsToStore', (stations, chartStoredId) => {
      self.addStationsToStore(stations, chartStoredId)
    })
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
    startDate.setDate(startDate.getDate() - 14)
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
  components: {
    Header,
    NavButtons,
    MapDashboard,
    CatchmentTree,
    BoxChart,
    UnverifiedChart,
    DurationCurve,
    Station,
    StatusBar,
  },
  methods: {
    fetchUnverified() {
      const selectedDamSites = this.mapDashboardRef.getselectedDamSites()
      if (selectedDamSites.length === 0) {
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
      let tsChart = document.getElementById('ts').checked
      if (tsChart === true) {
        this.$refs.chartComponent.displayChart(
          selectedDamSites,
          this.formatDate(dateStart),
          this.formatDate(dateEnd)
        )
      }
      let bxChart = document.getElementById('bx').checked
      if (bxChart === true) {
        this.$refs.boxComponent.displayChart(
          selectedDamSites,
          this.formatDate(dateStart),
          this.formatDate(dateEnd)
        )
      }
      let fdcChart = document.getElementById('fdc').checked
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
    fetchStations() {
      let self = this
      let wmaNames = Object.assign([], self.selectedWMAs)
      let fs = require('fs')
      let dir = path.join(app.getPath('userData'), '/stations')
      // TODO : Create an util class for file storage
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
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
      let url = `${self.stationsApi}?wma=${wmaNames.join()}`
      console.log(url)
      let stationFile = `${dir}/${url.hashCode()}.json`
      // Check if online
      if (navigator.onLine) {
        let cancelToken = null
        if (self.stationsRequest) {
          cancelToken = self.stationsRequest.token
        }
        axios
          .get(url, { cancelToken: cancelToken })
          .then((response) => {
            self.mapDashboardRef.loadStationsToMap(response.data)
            self.createCatchmentTree(response.data)
            fs.writeFileSync(stationFile, JSON.stringify(response.data))
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        if (fs.existsSync(stationFile)) {
          let jsonData = fs.readFileSync(stationFile, 'utf-8')
          let stationsData = JSON.parse(jsonData)
          self.mapDashboardRef.loadStationsToMap(stationsData)
          self.createCatchmentTree(stationsData)
        }
      }
    },
    addStationsToStore(stations, chartStoredId) {
      let self = this
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
    createCatchmentTree(stationsData) {
      let self = this
      // Start adding stations data to catchment
      let catchmentsData = self.mapDashboardRef.getCatchmentsData()
      for (let i = 0; i < stationsData.features.length; i++) {
        // let primary = stationsData.features[i]['properties']['primary'];
        let secondary = stationsData.features[i]['properties']['secondary']
        let station = stationsData.features[i]['properties']['station']
        let place = stationsData.features[i]['properties']['place']
        let latestReading = stationsData.features[i]['properties']['latest']
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
      let treeData = self.generateTreeData(catchmentsData)
      this.catchmentTreeRef.createTree(
        treeData,
        this.onCatchmentTreeSelectedHandler,
        this.onTreeReady
      )
    },
    onTreeReady(event, data) {
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
    onCatchmentTreeSelectedHandler(event, data) {
      // On catchment tree clicked
      let i = []
      let selected = ''
      let selectedCatchments = []
      let _selectedDamSites = []
      let selectedBits = []
      let _unselectedDamSites = Object.assign([], this.selectedDamSites)
      for (i = 0; i < data.selected.length; i++) {
        selected = data.instance.get_node(data.selected[i]).text
        selectedBits = selected.split(':')
        let type = data.instance.get_node(data.selected[i]).type
        if (type === 'layer') {
          selectedCatchments.push(selectedBits[0])
        } else if (type === 'station') {
          _selectedDamSites.push(selectedBits[0])
          if (_unselectedDamSites.indexOf(selectedBits[0]) !== -1)
            _unselectedDamSites.splice(
              _unselectedDamSites.indexOf(selectedBits[0]),
              1
            )
        }
      }
      this.mapDashboardRef.toggleselectedDamSitesByStationNames(
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
