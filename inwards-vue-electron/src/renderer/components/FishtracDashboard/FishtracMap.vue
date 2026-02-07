<template>
  <div class="fishtrac-map-container">
    <div ref="mapContainer" class="map-area"></div>

    <!-- Popup Overlay -->
    <div ref="popup" class="map-popup">
      <div ref="popupContent" class="popup-content"></div>
    </div>
  </div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { fromLonLat } from 'ol/proj'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import OSM from 'ol/source/OSM'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import Overlay from 'ol/Overlay'

export default {
  name: 'FishtracMap',

  props: {
    stations: {
      type: Array,
      default: () => []
    },
    selectedReach: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      map: null,
      stationsLayer: null,
      overlay: null
    }
  },

  watch: {
    stations: {
      handler() {
        this.updateStations()
      },
      deep: true
    },
    selectedReach() {
      this.centerOnReach()
    }
  },

  mounted() {
    this.initMap()
  },

  beforeUnmount() {
    if (this.map) {
      this.map.setTarget(null)
      this.map = null
    }
  },

  methods: {
    initMap() {
      // Create popup overlay
      this.overlay = new Overlay({
        element: this.$refs.popup,
        autoPan: true,
        autoPanAnimation: { duration: 250 }
      })

      // Create stations layer
      this.stationsLayer = new VectorLayer({
        source: new VectorSource(),
        style: (feature) => this.getStationStyle(feature)
      })

      // Create map
      this.map = new Map({
        target: this.$refs.mapContainer,
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          this.stationsLayer
        ],
        overlays: [this.overlay],
        view: new View({
          center: fromLonLat([31.92, -25.12]),
          zoom: 12
        })
      })

      // Add click handler
      this.map.on('click', (evt) => {
        const feature = this.map.forEachFeatureAtPixel(evt.pixel, (f) => f)
        if (feature) {
          const coords = feature.getGeometry().getCoordinates()
          const name = feature.get('name')
          const type = feature.get('type')
          this.$refs.popupContent.innerHTML = `
            <strong>${name}</strong><br>
            <span style="color: #666; font-size: 12px;">${this.formatType(type)}</span>
          `
          this.overlay.setPosition(coords)
        } else {
          this.overlay.setPosition(undefined)
        }
      })

      // Add pointer cursor on hover
      this.map.on('pointermove', (evt) => {
        const hit = this.map.hasFeatureAtPixel(evt.pixel)
        this.map.getTargetElement().style.cursor = hit ? 'pointer' : ''
      })

      // Load initial stations
      this.updateStations()
    },

    updateStations() {
      if (!this.stationsLayer) return

      const source = this.stationsLayer.getSource()
      source.clear()

      const features = this.stations.map((station) => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([station.lng, station.lat])),
          name: station.name,
          type: station.type,
          color: station.color
        })
        feature.setId(station.id)
        return feature
      })

      source.addFeatures(features)

      // Fit view to stations if any
      if (features.length > 0) {
        const extent = source.getExtent()
        this.map.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          maxZoom: 14
        })
      }
    },

    getStationStyle(feature) {
      const type = feature.get('type')
      let fillColor, strokeColor, radius

      switch (type) {
        case 'base':
          fillColor = 'rgba(46, 204, 113, 0.6)'
          strokeColor = '#27ae60'
          radius = 12
          break
        case 'relay':
          fillColor = 'rgba(52, 152, 219, 0.6)'
          strokeColor = '#2980b9'
          radius = 14
          break
        case 'probe':
          fillColor = 'rgba(155, 89, 182, 0.6)'
          strokeColor = '#8e44ad'
          radius = 10
          break
        default:
          fillColor = 'rgba(149, 165, 166, 0.6)'
          strokeColor = '#7f8c8d'
          radius = 10
      }

      // Create outer ring style for visual effect
      return [
        new Style({
          image: new CircleStyle({
            radius: radius + 15,
            fill: new Fill({ color: fillColor.replace('0.6', '0.15') }),
            stroke: new Stroke({ color: strokeColor, width: 1.5 })
          })
        }),
        new Style({
          image: new CircleStyle({
            radius: radius,
            fill: new Fill({ color: fillColor }),
            stroke: new Stroke({ color: strokeColor, width: 2 })
          })
        }),
        new Style({
          image: new CircleStyle({
            radius: 4,
            fill: new Fill({ color: strokeColor })
          })
        })
      ]
    },

    formatType(type) {
      const types = {
        base: 'Base Station',
        relay: 'Relay Station',
        probe: 'Water Quality Probe'
      }
      return types[type] || type
    },

    centerOnReach() {
      // Center points for different reaches
      const reachCenters = {
        Sabie: [31.92, -25.12],
        Crocodile: [31.45, -25.35],
        Olifants: [31.20, -24.05],
        Letaba: [31.35, -23.85]
      }

      const center = reachCenters[this.selectedReach]
      if (center && this.map) {
        this.map.getView().animate({
          center: fromLonLat(center),
          zoom: 12,
          duration: 500
        })
      }
    }
  }
}
</script>

<style scoped>
.fishtrac-map-container {
  position: relative;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.map-area {
  width: 100%;
  height: 500px;
}

.map-popup {
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  transform: translate(-50%, -100%);
  margin-top: -12px;
}

.map-popup::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid white;
}

.popup-content {
  font-size: 13px;
  color: #2c3e50;
}
</style>
