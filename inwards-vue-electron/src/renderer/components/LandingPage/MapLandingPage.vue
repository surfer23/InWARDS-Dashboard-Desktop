<template>
  <div :class="['landing-page', themeClass]">
    <StatusBar />
    <Header />

    <!-- Map Popups (OL overlays) -->
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content" class="ol-popup-content"></div>
    </div>
    <div id="tooltip" class="ol-tooltip">
      <div id="tooltip-content"></div>
    </div>

    <!-- Main Layout -->
    <div class="main-container">
      <!-- Map Section -->
      <div class="map-section">
        <div id="map" class="map-container"></div>

        <!-- WMA Selection Overlay -->
        <div class="ft-glass wma-card">
          <div class="ft-glass-header">
            <i class="fa fa-map-o"></i>
            <span>Water Management Areas</span>
          </div>
          <div class="wma-list">
            <label class="wma-item">
              <input id="limpopo" type="checkbox" />
              <span class="wma-checkbox"></span>
              <span class="wma-label">Limpopo</span>
            </label>
            <label class="wma-item">
              <input id="olifants_letaba" type="checkbox" />
              <span class="wma-checkbox"></span>
              <span class="wma-label">Olifants-Letaba</span>
            </label>
            <label class="wma-item">
              <input id="inkomati_usuthu" type="checkbox" />
              <span class="wma-checkbox"></span>
              <span class="wma-label">Inkomati-Usuthu</span>
            </label>
          </div>
          <div class="wma-count" v-if="selectedWMACount > 0">
            <span class="count-badge">{{ selectedWMACount }}</span>
            area{{ selectedWMACount !== 1 ? 's' : '' }} selected
          </div>
        </div>

        <!-- Flow Legend Overlay -->
        <div class="ft-glass legend-card">
          <div class="ft-glass-header">
            <i class="fa fa-tint"></i>
            <span>Flow Status</span>
          </div>
          <div class="legend-items">
            <div class="legend-row">
              <span class="legend-dot" style="background: #0033cc"></span>
              <span>High</span>
            </div>
            <div class="legend-row">
              <span class="legend-dot" style="background: #3399ff"></span>
              <span>Moderately High</span>
            </div>
            <div class="legend-row">
              <span class="legend-dot" style="background: #99cc33"></span>
              <span>Normal</span>
            </div>
            <div class="legend-row">
              <span class="legend-dot" style="background: #ffff00; border-color: #ccc"></span>
              <span>Moderately Low</span>
            </div>
            <div class="legend-row">
              <span class="legend-dot" style="background: #ffcc00"></span>
              <span>Low</span>
            </div>
            <div class="legend-row">
              <span class="legend-dot" style="background: #ff0000"></span>
              <span>Very Low</span>
            </div>
            <div class="legend-row">
              <span class="legend-dot" style="background: #000000"></span>
              <span>None</span>
            </div>
          </div>
        </div>

        <!-- Admin Controls -->
        <div class="admin-controls">
          <button
            id="reset"
            style="display: none"
            class="btn admin-btn"
            @click="resetApplicationData"
          >
            <i class="fa fa-refresh"></i> Reset
          </button>
          <button
            id="adminDash"
            style="display: none"
            class="btn admin-btn"
            @click="goAdminDash"
          >
            <i class="fa fa-cog"></i> Admin
          </button>
        </div>
      </div>

      <!-- Dashboard Panel -->
      <div class="dashboard-panel">
        <!-- Panel Header -->
        <div class="panel-header">
          <div class="panel-title-area">
            <h1 class="panel-title">INWARDS</h1>
            <span class="panel-subtitle">Integrated Water Resources Decision Support</span>
          </div>
          <div class="panel-controls">
            <div class="ft-status-badge" :class="{ online: isOnline }">
              <span class="ft-status-dot"></span>
              <span>{{ isOnline ? 'Online' : 'Offline' }}</span>
            </div>
            <button
              class="ft-theme-toggle"
              @click="toggleTheme"
              :title="isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <i :class="isDarkTheme ? 'fa fa-sun-o' : 'fa fa-moon-o'"></i>
            </button>
          </div>
        </div>

        <!-- Selection Prompt -->
        <div class="selection-prompt" v-if="selectedWMACount === 0">
          <i class="fa fa-map-marker prompt-icon"></i>
          <span>Select a Water Management Area on the map to enable dashboards</span>
        </div>

        <!-- Scrollable Content -->
        <div class="panel-content ft-scrollable">
          <!-- Real-time Monitoring -->
          <div class="card-category">
            <div class="ft-category-divider">
              <span class="ft-divider-line"></span>
              <span class="ft-divider-label">Real-time Monitoring</span>
              <span class="ft-divider-line"></span>
            </div>
            <div class="ft-card-grid">
              <button
                id="unverified"
                class="ft-dash-card"
                @click="saveSelection()"
                :disabled="selectedWMACount === 0"
              >
                <div class="ft-dash-card-icon realtime">
                  <i class="fa fa-line-chart"></i>
                </div>
                <div class="ft-dash-card-text">
                  <h4>Real-time</h4>
                  <p>Live stream flow</p>
                </div>
                <i class="fa fa-chevron-right ft-dash-card-arrow"></i>
              </button>
              <button
                id="damDash"
                class="ft-dash-card"
                @click="navDam()"
                :disabled="selectedWMACount === 0"
              >
                <div class="ft-dash-card-icon dam">
                  <i class="fa fa-pie-chart"></i>
                </div>
                <div class="ft-dash-card-text">
                  <h4>Dam Levels</h4>
                  <p>Storage & capacity</p>
                </div>
                <i class="fa fa-chevron-right ft-dash-card-arrow"></i>
              </button>
            </div>
          </div>

          <!-- Water Quality -->
          <div class="card-category">
            <div class="ft-category-divider">
              <span class="ft-divider-line"></span>
              <span class="ft-divider-label">Water Quality</span>
              <span class="ft-divider-line"></span>
            </div>
            <div class="ft-card-grid">
              <button
                id="wqDash"
                class="ft-dash-card"
                @click="goToWqDashboard()"
                :disabled="selectedWMACount === 0"
              >
                <div class="ft-dash-card-icon wq">
                  <i class="fa fa-flask"></i>
                </div>
                <div class="ft-dash-card-text">
                  <h4>DWS WQ</h4>
                  <p>Water & Sanitation</p>
                </div>
                <i class="fa fa-chevron-right ft-dash-card-arrow"></i>
              </button>
              <button
                id="healthDash"
                class="ft-dash-card"
                @click="goToHealthDashboard()"
                :disabled="selectedWMACount === 0"
              >
                <div class="ft-dash-card-icon health">
                  <i class="fa fa-heartbeat"></i>
                </div>
                <div class="ft-dash-card-text">
                  <h4>WQ Health</h4>
                  <p>Health indicators</p>
                </div>
                <i class="fa fa-chevron-right ft-dash-card-arrow"></i>
              </button>
            </div>
          </div>

          <!-- Biodiversity & Ecology -->
          <div class="card-category">
            <div class="ft-category-divider">
              <span class="ft-divider-line"></span>
              <span class="ft-divider-label">Biodiversity & Ecology</span>
              <span class="ft-divider-line"></span>
            </div>
            <div class="ft-card-grid">
              <button
                id="knpDash"
                class="ft-dash-card"
                @click="goToKnpDashboard()"
                :disabled="selectedWMACount === 0"
              >
                <div class="ft-dash-card-icon knp">
                  <i class="fa fa-paw"></i>
                </div>
                <div class="ft-dash-card-text">
                  <h4>KNP</h4>
                  <p>Kruger Park</p>
                </div>
                <i class="fa fa-chevron-right ft-dash-card-arrow"></i>
              </button>
              <button
                id="fishDash"
                class="ft-dash-card"
                @click="goToFishDashboard()"
                :disabled="selectedWMACount === 0"
              >
                <div class="ft-dash-card-icon fish">
                  <font-awesome-icon icon="fa-solid fa-fish-fins" />
                </div>
                <div class="ft-dash-card-text">
                  <h4>Fish</h4>
                  <p>Species monitoring</p>
                </div>
                <i class="fa fa-chevron-right ft-dash-card-arrow"></i>
              </button>
              <button
                id="invertDash"
                class="ft-dash-card"
                @click="goToInvertDashboard()"
                :disabled="selectedWMACount === 0"
              >
                <div class="ft-dash-card-icon invert">
                  <font-awesome-icon icon="fa-solid fa-bug" />
                </div>
                <div class="ft-dash-card-text">
                  <h4>Invertebrates</h4>
                  <p>Bioassessment</p>
                </div>
                <i class="fa fa-chevron-right ft-dash-card-arrow"></i>
              </button>
              <button
                id="fishtracDash"
                class="ft-dash-card"
                @click="goToFishtracDashboard()"
              >
                <div class="ft-dash-card-icon fishtrac">
                  <i class="fa fa-podcast"></i>
                </div>
                <div class="ft-dash-card-text">
                  <h4>Fishtrac</h4>
                  <p>Tracking & telemetry</p>
                </div>
                <i class="fa fa-chevron-right ft-dash-card-arrow"></i>
              </button>
            </div>
          </div>

          <!-- Specialized Analysis -->
          <div class="card-category">
            <div class="ft-category-divider">
              <span class="ft-divider-line"></span>
              <span class="ft-divider-label">Specialized Analysis</span>
              <span class="ft-divider-line"></span>
            </div>
            <div class="ft-card-grid">
              <button
                id="iucmaDash"
                class="ft-dash-card"
                @click="goToIUCMADashboard()"
              >
                <div class="ft-dash-card-icon iucma">
                  <i class="fa fa-area-chart"></i>
                </div>
                <div class="ft-dash-card-text">
                  <h4>IUCMA EWR</h4>
                  <p>Environmental water</p>
                </div>
                <i class="fa fa-chevron-right ft-dash-card-arrow"></i>
              </button>
              <button
                class="ft-dash-card"
                @click="goToIUCMAWqDashboard()"
              >
                <div class="ft-dash-card-icon iucma-wq">
                  <i class="fa fa-bullseye"></i>
                </div>
                <div class="ft-dash-card-text">
                  <h4>IUCMA RQO</h4>
                  <p>Quality objectives</p>
                </div>
                <i class="fa fa-chevron-right ft-dash-card-arrow"></i>
              </button>
              <button
                id="loadDash"
                class="ft-dash-card"
                @click="goToLoadDashboard()"
                :disabled="selectedWMACount === 0"
              >
                <div class="ft-dash-card-icon load">
                  <i class="fa fa-balance-scale"></i>
                </div>
                <div class="ft-dash-card-text">
                  <h4>Licensing</h4>
                  <p>Water use analysis</p>
                </div>
                <i class="fa fa-chevron-right ft-dash-card-arrow"></i>
              </button>
              <button
                id="ebaDash"
                class="ft-dash-card"
                @click="goToEbaDashboard()"
                :disabled="selectedWMACount === 0"
              >
                <div class="ft-dash-card-icon spatial">
                  <font-awesome-icon icon="fa-solid fa-map" />
                </div>
                <div class="ft-dash-card-text">
                  <h4>Spatial Risk</h4>
                  <p>Risk mapping</p>
                </div>
                <i class="fa fa-chevron-right ft-dash-card-arrow"></i>
              </button>
              <button
                id="userDash"
                class="ft-dash-card"
                @click="goToUserDefinedDashboard()"
                :disabled="selectedWMACount === 0"
              >
                <div class="ft-dash-card-icon user">
                  <i class="fa fa-sliders"></i>
                </div>
                <div class="ft-dash-card-text">
                  <h4>Custom</h4>
                  <p>Your analytics</p>
                </div>
                <i class="fa fa-chevron-right ft-dash-card-arrow"></i>
              </button>
            </div>
          </div>

          <!-- Hidden programmatic buttons -->
          <button id="home" style="display: none" @click="goHome()"></button>
          <button id="verifiedDash" style="display: none"></button>

          <!-- Partner Logos -->
          <div class="ft-partner-section">
            <span class="ft-partner-label">In collaboration with</span>
            <div class="ft-partner-logos">
              <img src="../../assets/award.svg" alt="AWARD" />
              <img src="../../assets/knp.png" alt="KNP" />
              <img src="../../assets/iucma.png" alt="IUCMA" />
              <img src="../../assets/dws.png" alt="DWS" />
              <img src="@/assets/jrs_square_logo.png" alt="JRS" />
              <img src="../../assets/usaid.png" alt="USAID" />
              <img src="../../assets/fbis_logo.png" alt="FBIS" />
              <img src="../../assets/kartoza.png" alt="Kartoza" />
              <img src="../../assets/frc.svg" alt="FRC" />
              <img src="../../assets/wrc.jpg" alt="WRC" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Map from 'ol/Map'
import axios from 'axios'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Fill, Stroke, Style, Text } from 'ol/style'
import { Circle as CircleStyle } from 'ol/style'
import WmaJson from '../../assets/wma_merge.json'
import Header from '../../components/Header'
import $ from 'jquery'
import stateStore from '../../store/state_handler'
import router from '../../router/index'
import StatusBar from '../StatusBar'
import Overlay from 'ol/Overlay'

export default {
  data() {
    return {
      theme: localStorage.getItem('inwards-landing-theme') || 'light',
      isOnline: navigator.onLine,
      onlineTimer: null,
      stationsApi:
        'https://inwards.award.org.za/app_json/iucma_verification/station_status.php',
      selectedWMA: [],
      selectedFeatures: {},
      popups: [],
      stylesPerPoint: [],
      stationsVectorLayer: new VectorLayer({
        source: new VectorSource(),
        style: function (feature) {
          return new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({ color: 'rgba(255,0,0,0.5)' }),
              stroke: new Stroke({ color: 'red', width: 1 }),
            }),
          })
        },
      }),
    }
  },
  computed: {
    themeClass() {
      return this.theme === 'dark' ? 'theme-dark' : 'theme-light'
    },
    isDarkTheme() {
      return this.theme === 'dark'
    },
    selectedWMACount() {
      return Object.keys(this.selectedFeatures).length
    },
  },
  mounted() {
    let self = this
    var tooltipContainer = document.getElementById('tooltip')
    var tooltipContent = document.getElementById('tooltip-content')
    let container = document.getElementById('popup')
    let closer = document.getElementById('popup-closer')

    // Online status polling
    this.onlineTimer = setInterval(() => {
      this.isOnline = navigator.onLine
    }, 5000)

    // Create overlay
    this.overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 20,
      },
    })

    // Create tile layer (OpenTopoMap)
    let tileLayer = new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attributions: '&copy; OpenTopoMap',
      }),
    })

    // Create map
    let map = new Map({
      target: 'map',
      layers: [tileLayer],
      overlays: [this.overlay],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    })

    // Add tooltip
    var tooltip = new Overlay({
      element: tooltipContainer,
      autoPan: false,
      autoPanAnimation: {
        duration: 250,
      },
    })
    map.addOverlay(tooltip)

    // Create WMA vector layer
    let vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON({
          defaultDataProjection: 'EPSG:4326',
        }).readFeatures(WmaJson, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        }),
      }),
      updateWhileAnimating: true,
      updateWhileInteracting: true,
    })

    // Styles
    let highlightStyle = new Style({
      stroke: new Stroke({
        color: [76, 175, 80, 0.6],
        width: 2,
      }),
      fill: new Fill({
        color: [76, 175, 80, 0.4],
      }),
      zIndex: 1,
    })

    let selectedStyle = new Style({
      stroke: new Stroke({
        color: [76, 97, 174, 0.9],
        width: 2,
      }),
      fill: new Fill({
        color: [76, 97, 174, 0.8],
      }),
      zIndex: 1,
    })

    let highlightedFeature = null

    // Add layers
    this.stationsVectorLayer.setZIndex(1)
    map.addLayer(this.stationsVectorLayer)
    map.addLayer(vectorLayer)
    map.getView().fit(vectorLayer.getSource().getExtent())

    // Load station data
    let wmaNames = ['limpopo', 'olifants_letaba', 'inkomati_usuthu']
    wmaNames = wmaNames.sort()
    for (let i = 0; i < wmaNames.length; i++) {
      wmaNames[i] = `'${wmaNames[i]}'`
    }
    let url = `${self.stationsApi}?wma=${wmaNames.join()}`

    if (navigator.onLine) {
      axios
        .get(url)
        .then((response) => {
          this.loadStationsToMap(response.data)
          this.styleStationsByFlowStatus()
        })
        .catch((error) => {
          console.log(error)
        })
    }

    // Map hover
    map.on('pointermove', function (e) {
      if (
        highlightedFeature !== null &&
        !self.selectedFeatures.hasOwnProperty(highlightedFeature.ol_uid)
      ) {
        highlightedFeature.setStyle(undefined)
        highlightedFeature = null
      }
      map.forEachFeatureAtPixel(e.pixel, function (f) {
        if (!self.selectedFeatures.hasOwnProperty(f.ol_uid)) {
          highlightedFeature = f
          f.setStyle(highlightStyle)
          return true
        }
      })
    })

    // Checkbox event listeners
    document
      .getElementById('limpopo')
      .addEventListener('change', function (element) {
        let check = document.getElementById('limpopo').checked
        let features = vectorLayer.getSource().getFeatures()
        let feature = features[0]
        if (check === false) {
          delete self.selectedFeatures[feature.ol_uid]
          feature.setStyle(undefined)
        } else {
          self.selectedFeatures[feature.ol_uid] = feature
          feature.setStyle(selectedStyle)
        }
      })

    document
      .getElementById('olifants_letaba')
      .addEventListener('change', function (element) {
        let check = document.getElementById('olifants_letaba').checked
        let features = vectorLayer.getSource().getFeatures()
        let feature = features[1]
        if (check === false) {
          delete self.selectedFeatures[feature.ol_uid]
          feature.setStyle(undefined)
        } else {
          self.selectedFeatures[feature.ol_uid] = feature
          feature.setStyle(selectedStyle)
        }
      })

    document
      .getElementById('inkomati_usuthu')
      .addEventListener('change', function (element) {
        let check = document.getElementById('inkomati_usuthu').checked
        let features = vectorLayer.getSource().getFeatures()
        let feature = features[2]
        if (check === false) {
          delete self.selectedFeatures[feature.ol_uid]
          feature.setStyle(undefined)
        } else {
          self.selectedFeatures[feature.ol_uid] = feature
          feature.setStyle(selectedStyle)
        }
      })

    // Check stored selections
    stateStore.getState(stateStore.keys.selectedWMAs, function (selectedWMAs) {
      if (!selectedWMAs) {
        return
      }
      let features = vectorLayer.getSource().getFeatures()
      for (let i = 0; i < features.length; i++) {
        let feature = features[i]
        if (selectedWMAs.indexOf(feature.get('wma')) !== -1) {
          feature.setStyle(selectedStyle)
          self.selectedFeatures[feature.ol_uid] = feature
          document.getElementById(feature.get('wma')).checked = true
        }
      }
      if (Object.keys(self.selectedFeatures).length > 0) {
        $('.save-selection').attr('disabled', false)
      }
    })

    // Map click - toggle WMA selection
    map.on('click', function (e) {
      map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        if (!self.selectedFeatures.hasOwnProperty(feature.ol_uid)) {
          let check = feature.values_.wma
          document.getElementById(check).checked = true
          self.selectedFeatures[feature.ol_uid] = feature
          feature.setStyle(selectedStyle)
        } else {
          delete self.selectedFeatures[feature.ol_uid]
          feature.setStyle(undefined)
          let check = feature.values_.wma
          document.getElementById(check).checked = false
        }
        if (Object.keys(self.selectedFeatures).length > 0) {
          $('.save-selection').attr('disabled', false)
        } else {
          $('.save-selection').attr('disabled', true)
        }
        return true
      })
    })

    // Add KNP layer
    self.addKnpLayer(map)

    // Close popup
    if (closer) {
      closer.onclick = function () {
        self.overlay.setPosition(undefined)
        closer.blur()
        return false
      }
    }
  },
  beforeUnmount() {
    if (this.onlineTimer) {
      clearInterval(this.onlineTimer)
    }
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('inwards-landing-theme', this.theme)
    },

    loadStationsToMap(stationsGeoJSONData) {
      let self = this
      self.stationsVectorLayer.setSource(
        new VectorSource({
          features: new GeoJSON({
            defaultDataProjection: 'EPSG:4326',
          }).readFeatures(stationsGeoJSONData, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          }),
        })
      )
    },

    styleStationsByFlowStatus() {
      let self = this
      let content = document.getElementById('popup-content')
      let x = 0
      let styles = []

      const colorMap = {
        min: '#FF0000',
        '95th': '#FFCC00',
        '50th': '#FFFF00',
        '25th': '#99CC33',
        '5th': '#3399ff',
        max: '#0033cc',
        none: '#000000',
      }

      this.stationsVectorLayer
        .getSource()
        .forEachFeature(function (feature) {
          let station = feature.get('station')
          let latest = feature.get('record')
          let color = feature.get('color')

          content.innerHTML =
            '<p>' + station + '</p><br><p>' + latest + '</p>'
          let siteText = station + ': \n' + latest + ' m\u00B3.s\u207B\u00B9'

          if (colorMap[color]) {
            styles[x] = new Style({
              image: new CircleStyle({
                radius: 9,
                fill: new Fill({ color: colorMap[color] }),
                stroke: new Stroke({ color: 'green', width: 1 }),
              }),
              text: new Text({
                font: 'bold 12px "Open Sans", "Arial Unicode MS", "sans-serif"',
                text: siteText,
                placement: 'point',
                fill: new Fill({ color: '#000' }),
                stroke: new Stroke({ color: '#fff', width: 1 }),
                offsetX: 0,
                offsetY: -25,
              }),
            })
            feature.setStyle(styles[x])
          }
          x++
        })
    },

    // Navigation methods
    saveSelection() {
      let self = this
      let _selectedWMA = []
      for (let id in self.selectedFeatures) {
        _selectedWMA.push(self.selectedFeatures[id].get('wma'))
      }
      stateStore.setState(stateStore.keys.selectedWMAs, _selectedWMA)
      router.push({ path: 'dashboard' })
    },

    navDam() {
      let self = this
      let _selectedWMA = []
      for (let id in self.selectedFeatures) {
        _selectedWMA.push(self.selectedFeatures[id].get('wma'))
      }
      stateStore.setState(stateStore.keys.selectedWMAs, _selectedWMA)
      router.push({ path: 'dam-dashboard' })
    },

    goToUserDefinedDashboard() {
      let self = this
      let _selectedWMA = []
      for (let id in self.selectedFeatures) {
        _selectedWMA.push(self.selectedFeatures[id].get('wma'))
      }
      stateStore.setState(stateStore.keys.selectedWMAs, _selectedWMA)
      router.push({ path: 'user-dashboard' })
    },

    goToKnpDashboard() {
      let self = this
      let _selectedWMA = []
      for (let id in self.selectedFeatures) {
        _selectedWMA.push(self.selectedFeatures[id].get('wma'))
      }
      stateStore.setState(stateStore.keys.selectedWMAs, _selectedWMA)
      router.push({ path: 'knp-dashboard' })
    },

    goToIUCMADashboard() {
      let _selectedWMA = []
      _selectedWMA.push('inkomati_usuthu')
      stateStore.setState(stateStore.keys.selectedWMAs, _selectedWMA)
      router.push({ path: 'iucma-dashboard' })
    },

    goToIUCMAWqDashboard() {
      let _selectedWMA = []
      _selectedWMA.push('inkomati_usuthu')
      stateStore.setState(stateStore.keys.selectedWMAs, _selectedWMA)
      router.push({ path: 'iucma-wq-dashboard' })
    },

    goToWqDashboard() {
      let self = this
      let _selectedWMA = []
      for (let id in self.selectedFeatures) {
        _selectedWMA.push(self.selectedFeatures[id].get('wma'))
      }
      stateStore.setState(stateStore.keys.selectedWMAs, _selectedWMA)
      router.push({ path: 'wq-dashboard' })
    },

    goToFishDashboard() {
      let self = this
      let _selectedWMA = []
      for (let id in self.selectedFeatures) {
        _selectedWMA.push(self.selectedFeatures[id].get('wma'))
      }
      stateStore.setState(stateStore.keys.selectedWMAs, _selectedWMA)
      router.push({ path: 'fish-dashboard' })
    },

    goToInvertDashboard() {
      let self = this
      let _selectedWMA = []
      for (let id in self.selectedFeatures) {
        _selectedWMA.push(self.selectedFeatures[id].get('wma'))
      }
      stateStore.setState(stateStore.keys.selectedWMAs, _selectedWMA)
      router.push({ path: 'invert-dashboard' })
    },

    goToFishtracDashboard() {
      router.push({ path: 'fishtrac-dashboard' })
    },

    goToEbaDashboard() {
      let self = this
      let _selectedWMA = []
      for (let id in self.selectedFeatures) {
        _selectedWMA.push(self.selectedFeatures[id].get('wma'))
      }
      stateStore.setState(stateStore.keys.selectedWMAs, _selectedWMA)
      router.push({ path: 'eba-dashboard' })
    },

    goToHealthDashboard() {
      let self = this
      let _selectedWMA = []
      for (let id in self.selectedFeatures) {
        _selectedWMA.push(self.selectedFeatures[id].get('wma'))
      }
      stateStore.setState(stateStore.keys.selectedWMAs, _selectedWMA)
      router.push({ path: 'wq-health-dashboard' })
    },

    goToLoadDashboard() {
      let self = this
      let _selectedWMA = []
      for (let id in self.selectedFeatures) {
        _selectedWMA.push(self.selectedFeatures[id].get('wma'))
      }
      stateStore.setState(stateStore.keys.selectedWMAs, _selectedWMA)
      router.push({ path: 'load-dashboard' })
    },

    goHome() {
      let self = this
      let _selectedWMA = []
      for (let id in self.selectedFeatures) {
        _selectedWMA.push(self.selectedFeatures[id].get('wma'))
      }
      stateStore.setState(stateStore.keys.selectedWMAs, _selectedWMA)
      router.push({ path: '/' })
    },

    goAdminDash() {
      let self = this
      let _selectedWMA = []
      for (let id in self.selectedFeatures) {
        _selectedWMA.push(self.selectedFeatures[id].get('wma'))
      }
      stateStore.setState(stateStore.keys.selectedWMAs, _selectedWMA)
      router.push({ path: 'admin-dashboard' })
    },

    resetApplicationData(e) {
      stateStore.clearAll(() => {
        setTimeout(function () {
          window.location.reload()
        }, 200)
      })
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
        updateWhileInteracting: true,
      })
      map.addLayer(knpLayer)
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
  },
  components: {
    StatusBar,
    Header,
  },
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════
   Base Layout
   ═══════════════════════════════════════════════════ */
.landing-page {
  min-height: 100vh;
  background: var(--ft-bg-deepest);
  display: flex;
  flex-direction: column;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--ft-text-secondary);
}

.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ═══════════════════════════════════════════════════
   Map Section
   ═══════════════════════════════════════════════════ */
.map-section {
  flex: 1;
  position: relative;
  background: var(--ft-bg-elevated);
  overflow: hidden;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* Fade edge into panel */
.map-section::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 48px;
  background: linear-gradient(to right, transparent, var(--ft-bg-surface));
  pointer-events: none;
  z-index: 5;
}

/* ═══════════════════════════════════════════════════
   Map Overlay Positioning
   ═══════════════════════════════════════════════════ */
.wma-card {
  position: absolute;
  top: 16px;
  left: 16px;
  min-width: 240px;
  z-index: 10;
}

.legend-card {
  position: absolute;
  bottom: 16px;
  left: 16px;
  z-index: 10;
}

/* ── WMA Selection List ── */
.wma-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 10px 10px;
}

.wma-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s;
  margin: 0;
}

.wma-item:hover {
  background: var(--ft-row-hover);
}

.wma-item input[type='checkbox'] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.wma-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid var(--ft-border-hover);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}

.wma-item input:checked ~ .wma-checkbox {
  background: var(--ft-accent);
  border-color: var(--ft-accent);
}

.wma-item input:checked ~ .wma-checkbox::after {
  content: '\2713';
  font-size: 12px;
  color: white;
  font-weight: bold;
  line-height: 1;
}

.wma-label {
  color: var(--ft-text-secondary);
  font-size: 13px;
  font-weight: 500;
}

.wma-count {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 10px 10px;
  padding-top: 8px;
  border-top: 1px solid var(--ft-glass-border);
  font-size: 11px;
  color: var(--ft-text-muted);
}

.count-badge {
  background: var(--ft-accent);
  color: var(--ft-text-on-accent);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}

/* ── Flow Legend ── */
.legend-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 2px 14px 12px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--ft-text-secondary);
}

.legend-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid var(--ft-border-hover);
  flex-shrink: 0;
}

/* ── Admin Controls ── */
.admin-controls {
  position: absolute;
  bottom: 16px;
  left: 280px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.admin-btn {
  background: var(--ft-glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--ft-text-secondary);
  border: 1px solid var(--ft-glass-border);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.admin-btn:hover {
  background: var(--ft-accent-subtle);
  border-color: var(--ft-accent);
  color: var(--ft-accent);
}

/* ═══════════════════════════════════════════════════
   Dashboard Panel
   ═══════════════════════════════════════════════════ */
.dashboard-panel {
  width: 560px;
  background: var(--ft-bg-surface);
  border-left: 1px solid var(--ft-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* ── Panel Header ── */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--ft-border);
  flex-shrink: 0;
  transition: border-color 0.3s ease;
}

.panel-title-area {
  display: flex;
  flex-direction: column;
}

.panel-title {
  margin: 0;
  font-size: 22px;
  font-weight: 300;
  letter-spacing: 3px;
  color: var(--ft-text-primary);
}

.panel-subtitle {
  font-size: 11px;
  color: var(--ft-text-muted);
  letter-spacing: 0.3px;
  margin-top: 2px;
}

.panel-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ── Selection Prompt ── */
.selection-prompt {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  background: var(--ft-accent-subtle);
  border-bottom: 1px solid var(--ft-border);
  font-size: 12px;
  color: var(--ft-accent);
  flex-shrink: 0;
}

.prompt-icon {
  font-size: 14px;
  animation: ft-prompt-pulse 2s ease-in-out infinite;
}

/* ═══════════════════════════════════════════════════
   Scrollable Content
   ═══════════════════════════════════════════════════ */
.panel-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
}

/* ── Category Spacing ── */
.card-category {
  margin-bottom: 16px;
}

/* ═══════════════════════════════════════════════════
   Responsive
   ═══════════════════════════════════════════════════ */
@media (max-width: 1200px) {
  .dashboard-panel {
    width: 480px;
  }
}

@media (max-width: 992px) {
  .main-container {
    flex-direction: column;
  }

  .map-section {
    height: 45vh;
    flex: none;
  }

  .map-section::after {
    display: none;
  }

  .dashboard-panel {
    width: 100%;
    border-left: none;
    border-top: 1px solid var(--ft-border);
  }
}

@media (max-width: 600px) {
  .dashboard-panel {
    width: 100%;
  }
}
</style>
