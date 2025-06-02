<template>
  <div style="width: 100%; height: 100%; margin: 0; padding: 0">
    <StatusBar />
    <Header />
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content" class="ol-popup-content"></div>
    </div>
    <div id="overlay">
      <div class="row" style="height: 100%">
        <div class="col-md-12">
          <div class="card rounded-0">
            <div class="card-header inwards_card">
              <h6 style="color: white">
                <i class="fa fa-map" style="padding-right: 10px"></i>Your
                selected WMAs
              </h6>
            </div>
            <div class="card-body">
              <div
                class="row justify-content-md-center"
                style="margin-top: 5px; margin-bottom: 5px"
              >
                <div class="col-md-12">
                  <label class="custom-control wma-toggle custom-checkbox">
                    <input
                      id="limpopo"
                      type="checkbox"
                      class="custom-control-input"
                    />Limpopo WMA
                    <span
                      class="custom-control-indicator"
                      style="padding-left: 10px; float: right"
                    ></span>
                  </label>
                </div>
                <div class="col-md-12">
                  <label class="custom-control wma-toggle custom-checkbox">
                    <input
                      id="olifants_letaba"
                      type="checkbox"
                      class="custom-control-input"
                    />Olifants-Letaba WMA
                    <span
                      class="custom-control-indicator"
                      style="padding-left: 10px; float: right"
                    ></span>
                  </label>
                </div>
                <div class="col-md-12">
                  <label class="custom-control wma-toggle custom-checkbox">
                    <input
                      id="inkomati_usuthu"
                      type="checkbox"
                      class="custom-control-input"
                    />Inkomati-Usuthu WMA
                    <span
                      class="custom-control-indicator"
                      style="padding-left: 10px; float: right"
                    ></span>
                  </label>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="btn-group-vertical" style="width: 100%">
                    <button
                      id="home"
                      class="btn inwards_button btn-labeled text-left"
                      style="width: 100%; display: none"
                      @click="goHome()"
                      type="button"
                    >
                      <span class="btn-label"
                        ><i
                          class="fa fa-line-chart"
                          aria-hidden="true"
                        ></i></span
                      >Home<i
                        class="fa fa-chevron-right vertical-center"
                        style="padding-left: 10px; float: right"
                      ></i>
                    </button>
                    <button
                      id="unverified"
                      class="btn inwards_button btn-labeled text-left"
                      style="width: 100%"
                      @click="saveSelection()"
                      type="button"
                    >
                      <span class="btn-label"
                        ><i
                          class="fa fa-line-chart"
                          aria-hidden="true"
                        ></i></span
                      >Real-time Dashboard<i
                        class="fa fa-chevron-right vertical-center"
                        style="padding-left: 10px; float: right"
                      ></i>
                    </button>
                    <button
                      id="damDash"
                      class="btn inwards_button btn-labeled text-left"
                      style="width: 100%"
                      @click="navDam()"
                      type="button"
                    >
                      <span class="btn-label"
                        ><i
                          class="fa fa-pie-chart"
                          aria-hidden="true"
                        ></i></span
                      >Dam Dashboard<i
                        class="fa fa-chevron-right vertical-center"
                        style="padding-left: 10px; float: right"
                      ></i>
                    </button>
                    <button
                      id="wqDash"
                      class="btn inwards_button btn-labeled text-left"
                      style="width: 100%"
                      @click="goToWqDashboard()"
                      type="button"
                    >
                      <span class="btn-label"
                        ><i class="fa fa-flask" aria-hidden="true"></i></span
                      >DWS WQ Dashboard<i
                        class="fa fa-chevron-right vertical-center"
                        style="padding-left: 10px; float: right"
                      ></i>
                    </button>
                    <button
                      id="healthDash"
                      class="btn inwards_button btn-labeled text-left"
                      style="width: 100%"
                      @click="goToHealthDashboard()"
                      type="button"
                    >
                      <span class="btn-label"
                        ><i
                          class="fa fa-heartbeat"
                          aria-hidden="true"
                        ></i></span
                      >WQ Health Dashboard<i
                        class="fa fa-chevron-right vertical-center"
                        style="padding-left: 10px; float: right"
                      ></i>
                    </button>
                    <button
                      id="knpDash"
                      class="btn inwards_button btn-labeled text-left"
                      style="width: 100%"
                      @click="goToKnpDashboard()"
                      type="button"
                    >
                      <span class="btn-label"
                        ><i class="fa fa-paw" aria-hidden="true"></i></span
                      >KNP Dashboard<i
                        class="fa fa-chevron-right vertical-center"
                        style="padding-left: 10px; float: right"
                      ></i>
                    </button>
                    <button
                      id="iucmaDash"
                      class="btn inwards_button btn-labeled text-left"
                      style="width: 100%"
                      @click="goToIUCMADashboard()"
                      type="button"
                    >
                      <span class="btn-label"
                        ><i
                          class="fa fa-area-chart"
                          aria-hidden="true"
                        ></i></span
                      >IUCMA EWR Dashboard<i
                        class="fa fa-chevron-right vertical-center"
                        style="padding-left: 10px; float: right"
                      ></i>
                    </button>
                    <button
                      id="iucmaDash"
                      class="btn inwards_button btn-labeled text-left"
                      style="width: 100%"
                      @click="goToIUCMAWqDashboard()"
                      type="button"
                    >
                      <span class="btn-label"
                        ><i class="fa fa-bullseye" aria-hidden="true"></i></span
                      >IUCMA RQO Dashboard<i
                        class="fa fa-chevron-right vertical-center"
                        style="padding-left: 10px; float: right"
                      ></i>
                    </button>
                    <button
                      id="loadDash"
                      class="btn inwards_button btn-labeled text-left"
                      style="width: 100%"
                      @click="goToLoadDashboard()"
                      type="button"
                    >
                      <span class="btn-label"
                        ><i class="fa fa-bullseye" aria-hidden="true"></i></span
                      >Licensing Load Dashboard<i
                        class="fa fa-chevron-right vertical-center"
                        style="padding-left: 10px; float: right"
                      ></i>
                    </button>
                    <button
                      id="verifiedDash"
                      class="btn inwards_button text-left"
                      style="width: 100%; display: none"
                      type="button"
                    >
                      <span class="btn-label"
                        ><i
                          class="fa fa-line-chart"
                          aria-hidden="true"
                        ></i></span
                      >Verified Dashboard<i
                        class="fa fa-chevron-right vertical-center"
                        style="padding-left: 10px; float: right"
                      ></i>
                    </button>
                    <button
                      id="fishDash"
                      class="btn inwards_button btn-labeled text-left"
                      style="width: 100%"
                      @click="goToFishDashboard()"
                      type="button"
                    >
                      <span class="btn-label"
                        ><font-awesome-icon
                          icon="fa-solid fa-fish-fins" /></span
                      >Fish Dashboard<i
                        class="fa fa-chevron-right vertical-center"
                        style="padding-left: 10px; float: right"
                      ></i>
                    </button>
                    <button
                      id="invertDash"
                      class="btn inwards_button btn-labeled text-left"
                      style="width: 100%"
                      @click="goToInvertDashboard()"
                      type="button"
                    >
                      <span class="btn-label"
                        ><font-awesome-icon icon="fa-solid fa-bug" /></span
                      >Invert Dashboard<i
                        class="fa fa-chevron-right vertical-center"
                        style="padding-left: 10px; float: right"
                      ></i>
                    </button>
                    <button
                      id="ebaDash"
                      class="btn inwards_button btn-labeled text-left"
                      style="width: 100%"
                      @click="goToEbaDashboard()"
                      type="button"
                    >
                      <span class="btn-label"
                        ><font-awesome-icon icon="fa-solid fa-map" /></span
                      >Spatial Risk Dashboard<i
                        class="fa fa-chevron-right vertical-center"
                        style="padding-left: 10px; float: right"
                      ></i>
                    </button>
                    <button
                      id="userDash"
                      class="btn inwards_button btn-labeled text-left"
                      style="width: 100%"
                      @click="goToUserDefinedDashboard()"
                      type="button"
                    >
                      <span class="btn-label"
                        ><i class="fa fa-user" aria-hidden="true"></i></span
                      >User Dashboard<i
                        class="fa fa-chevron-right vertical-center"
                        style="padding-left: 10px; float: right"
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="overlay-logos">
      <div
        class="container-fluid container-fluid-logo"
        style="margin-top: 0; margin-bottom: 0; position: absolute; bottom: 0"
      >
        <div class="grid grid-logo" style="margin-bottom: 2px">
          <div><img src="../../assets/award.svg" alt="" /></div>
          <div><img src="../../assets/knp.png" alt="" /></div>
          <div><img src="../../assets/iucma.png" alt="" /></div>
          <div><img src="../../assets/dws.png" alt="" /></div>
          <div><img src="@/assets/jrs_square_logo.png" alt="" /></div>
          <div><img src="../../assets/usaid.png" alt="" /></div>
          <div><img src="../../assets/fbis_logo.png" alt="" /></div>
          <div><img src="../../assets/kartoza.png" alt="" /></div>
          <div><img src="../../assets/frc.svg" alt="" /></div>
          <div><img src="../../assets/wrc.jpg" alt="" /></div>
        </div>
      </div>
    </div>
    <div id="overlay-legend">
      <div class="row" style="height: 100%">
        <div class="col-md-12">
          <div class="card rounded-0">
            <div class="card-header inwards_card">
              <h6 style="color: white">
                <i class="fa fa-line-chart" style="padding-right: 10px"></i>Flow
                Status
              </h6>
            </div>
            <div class="card-body">
              <div class="container">
                <i style="font-size: smaller"
                  ><i class="dot" style="background: #0033cc"></i> High</i
                ><br />
                <i style="font-size: smaller"
                  ><i class="dot" style="background: #3399ff"></i> Moderately
                  High</i
                ><br />
                <i style="font-size: smaller"
                  ><i class="dot" style="background: #99cc33"></i> Normal</i
                ><br />
                <i style="font-size: smaller"
                  ><i class="dot" style="background: #ffff00"></i> Moderately
                  Low</i
                ><br />
                <i style="font-size: smaller"
                  ><i class="dot" style="background: #ffcc00"></i> Low</i
                ><br />
                <i style="font-size: smaller"
                  ><i class="dot" style="background: #ff0000"></i> Very Low</i
                ><br />
                <i style="font-size: smaller"
                  ><i class="dot" style="background: rgb(0, 0, 0)"></i>None</i
                ><br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="map-container">
      <div class="container-fluid" style="height: 100%; width: 100%">
        <div
          class="col-md-12"
          style="width: 100%; height: 100%; margin: 0; padding: 0"
        >
          <div
            id="map"
            style="width: 100%; height: 100%; position: fixed"
          ></div>
          <div id="tooltip" class="ol-tooltip">
            <div id="tooltip-content"></div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="reset-application-data-container"
      style="
        position: absolute;
        bottom: 0;
        margin-bottom: 50px;
        margin-left: 20px;
      "
    >
      <div
        id="reset"
        style="display: none"
        class="btn inwards_button"
        v-on:click="resetApplicationData"
      >
        Reset application data
      </div>
      <div
        id="adminDash"
        style="display: none"
        class="btn inwards_button"
        v-on:click="goAdminDash"
      >
        Admin Dashboard
      </div>
    </div>
  </div>
</template>
<style>
.ol-popup {
  opacity: 0.7;
  font-weight: bold;
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 5px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -40px;
  min-width: 75px;
}
.card-body {
  padding: 0;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 38px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 12px;
  left: 38px;
  margin-left: -12px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: '✖';
}
.ol-popup-content {
  font-size: 12px;
}
.ol-popup-content p {
  max-width: 90px;
  margin-bottom: 0 !important;
}
#dashboard-map-unverified {
  width: 100%;
  height: 410px;
}
.ol-tooltip {
  position: absolute;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 17px;
  left: -50px;
  min-width: 190px;
}
.ol-tooltip:after,
.ol-tooltip:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-tooltip:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-tooltip:before {
  border-top-color: #cccccc;
  border-width: 12px;
  left: 48px;
  margin-left: -12px;
}
.ol-tooltip p {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
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
  mounted() {
    let self = this
    var tooltipContainer = document.getElementById('tooltip')
    var tooltipContent = document.getElementById('tooltip-content')
    let container = document.getElementById('popup')
    let closer = document.getElementById('popup-closer')
    // Create a map
    this.overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 20,
      },
    })
    let map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
          }),
        }),
      ],
      overlays: [this.overlay],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    })

    var tooltip = new Overlay({
      element: tooltipContainer,
      autoPan: false,
      autoPanAnimation: {
        duration: 250,
      },
    })
    map.addOverlay(tooltip)

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
    })
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
    // when we move the mouse over a feature, we can change its style to
    // highlight it temporarily

    let stationsSelectedStyle = new Style({
      image: new CircleStyle({
        radius: 9,
        fill: new Fill({ color: [51, 204, 51, 0.8] }),
        stroke: new Stroke({ color: 'green', width: 1 }),
      }),
    })

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
    let highlightedFeature = null

    this.stationsVectorLayer.setZIndex(1)
    map.addLayer(this.stationsVectorLayer)
    map.addLayer(vectorLayer)
    map.getView().fit(vectorLayer.getSource().getExtent())

    let wmaNames = ['limpopo', 'olifants_letaba', 'inkomati_usuthu']
    wmaNames = wmaNames.sort()
    for (let i = 0; i < wmaNames.length; i++) {
      wmaNames[i] = `'${wmaNames[i]}'`
    }
    let url = `${self.stationsApi}?wma=${wmaNames.join()}`
    console.log(url)

    let content = document.getElementById('popup-content')
    if (navigator.onLine) {
      let cancelToken = null
      if (self.stationsRequest) {
        cancelToken = self.stationsRequest.token
      }
      axios
        .get(url, { cancelToken: cancelToken })
        .then((response) => {
          console.log(response.data)

          this.loadStationsToMap(response.data)
          let self = this
          let x = 0
          let styles = []
          this.stationsVectorLayer
            .getSource()
            .forEachFeature(function (feature) {
              let station = feature.get('station')
              let latest = feature.get('record')
              let color = feature.get('color')
              //console.log(x);
              //console.log(latest);
              content.innerHTML =
                '<p>' + station + '</p><br><p>' + latest + '</p>'
              let siteText = station + ': \n' + latest + ' m3.s-1'

              //console.log(color);
              if (color == 'min') {
                styles[x] = new Style({
                  image: new CircleStyle({
                    radius: 9,
                    fill: new Fill({ color: '#FF0000' }),
                    stroke: new Stroke({ color: 'green', width: 1 }),
                  }),
                  text: new Text({
                    font: 'bold 12px "Open Sans", "Arial Unicode MS", "sans-serif"',
                    placement: 'point',
                    fill: new Fill({ color: '#000' }),
                    stroke: new Stroke({ color: '#fff', width: 1 }),
                    offsetX: 0,
                    offsetY: -25,
                  }),
                })
                let updatedStyle = styles[x].getText().setText(siteText)
                styles.push(updatedStyle)
                feature.setStyle(styles[x])
              }
              if (color == '95th') {
                styles[x] = new Style({
                  image: new CircleStyle({
                    radius: 9,
                    fill: new Fill({ color: '#FFCC00' }),
                    stroke: new Stroke({ color: 'green', width: 1 }),
                  }),
                  text: new Text({
                    font: 'bold 12px "Open Sans", "Arial Unicode MS", "sans-serif"',
                    placement: 'point',
                    fill: new Fill({ color: '#000' }),
                    stroke: new Stroke({ color: '#fff', width: 1 }),
                    offsetX: 0,
                    offsetY: -25,
                  }),
                })
                let updatedStyle = styles[x].getText().setText(siteText)
                styles.push(updatedStyle)
                feature.setStyle(styles[x])
              }
              if (color == '50th') {
                styles[x] = new Style({
                  image: new CircleStyle({
                    radius: 9,
                    fill: new Fill({ color: '#FFFF00' }),
                    stroke: new Stroke({ color: 'green', width: 1 }),
                  }),
                  text: new Text({
                    font: 'bold 12px "Open Sans", "Arial Unicode MS", "sans-serif"',
                    placement: 'point',
                    fill: new Fill({ color: '#000' }),
                    stroke: new Stroke({ color: '#fff', width: 1 }),
                    offsetX: 0,
                    offsetY: -25,
                  }),
                })
                let updatedStyle = styles[x].getText().setText(siteText)
                styles.push(updatedStyle)
                feature.setStyle(styles[x])
              }
              if (color == '25th') {
                styles[x] = new Style({
                  image: new CircleStyle({
                    radius: 9,
                    fill: new Fill({ color: '#99CC33' }),
                    stroke: new Stroke({ color: 'green', width: 1 }),
                  }),
                  text: new Text({
                    font: 'bold 12px "Open Sans", "Arial Unicode MS", "sans-serif"',
                    placement: 'point',
                    fill: new Fill({ color: '#000' }),
                    stroke: new Stroke({ color: '#fff', width: 1 }),
                    offsetX: 0,
                    offsetY: -25,
                  }),
                })
                let updatedStyle = styles[x].getText().setText(siteText)
                styles.push(updatedStyle)
                feature.setStyle(styles[x])
              }
              if (color == '5th') {
                styles[x] = new Style({
                  image: new CircleStyle({
                    radius: 9,
                    fill: new Fill({ color: '#3399ff' }),
                    stroke: new Stroke({ color: 'green', width: 1 }),
                  }),
                  text: new Text({
                    font: 'bold 12px "Open Sans", "Arial Unicode MS", "sans-serif"',
                    text: 'hello',
                    padding: [8, 8, 0, 0],
                    placement: 'point',
                    fill: new Fill({ color: '#000' }),
                    stroke: new Stroke({ color: '#fff', width: 1 }),
                    offsetX: 0,
                    offsetY: -25,
                  }),
                })
                let updatedStyle = styles[x].getText().setText(siteText)
                styles.push(updatedStyle)
                feature.setStyle(styles[x])
              }
              if (color == 'max') {
                styles[x] = new Style({
                  image: new CircleStyle({
                    radius: 9,
                    fill: new Fill({ color: '#0033cc' }),
                    stroke: new Stroke({ color: 'green', width: 1 }),
                  }),
                  text: new Text({
                    font: 'bold 12px "Open Sans", "Arial Unicode MS", "sans-serif"',
                    placement: 'point',
                    fill: new Fill({ color: '#000' }),
                    stroke: new Stroke({ color: '#fff', width: 1 }),
                    offsetX: 0,
                    offsetY: -25,
                  }),
                })
                let updatedStyle = styles[x].getText().setText(siteText)
                styles.push(updatedStyle)
                feature.setStyle(styles[x])
              }
              if (color == 'none') {
                styles[x] = new Style({
                  image: new CircleStyle({
                    radius: 9,
                    fill: new Fill({ color: '#000' }),
                    stroke: new Stroke({ color: 'green', width: 1 }),
                  }),
                  text: new Text({
                    font: 'bold 12px "Open Sans", "Arial Unicode MS", "sans-serif"',
                    placement: 'point',
                    textBaseline: 'top',
                    fill: new Fill({ color: '#000' }),
                    stroke: new Stroke({ color: '#fff', width: 1 }),
                    offsetX: 0,
                    offsetY: -25,
                  }),
                })
                let updatedStyle = styles[x].getText().setText(siteText)
                styles.push(updatedStyle)
                feature.setStyle(styles[x])
              }
              //console.log(styles[x]);
              x++
            })
        })
        .catch((error) => {
          console.log(error)
        })
    }
    // Map on hover
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
          //console.log(highlightedFeature);
          highlightedFeature = f
          f.setStyle(highlightStyle)
          return true
        }
      })
    })

    // When map selected update the style
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
    // Check selected map from db
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
    map.on('click', function (e) {
      // Check if there is a feature
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
    self.addKnpLayer(map)
  },
  methods: {
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
    fetchStations() {
      let self = this
      let wmaNames = ['limpopo', 'olifants_letaba', 'inkomati_usuthu']
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
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        if (fs.existsSync(stationFile)) {
          let jsonData = fs.readFileSync(stationFile, 'utf-8')
          let stationsData = JSON.parse(jsonData)
          self.mapDashboardRef.loadStationsToMap(stationsData)
        }
      }
    },
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
