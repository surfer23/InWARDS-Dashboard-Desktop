<template>
  <div class="tracker-container">
    <!-- Map -->
    <div ref="mapContainer" class="tracker-map"></div>

    <!-- Overlay Controls -->
    <div class="map-controls">
      <button class="ctrl-btn" :class="{ active: showHeatmap }" @click="showHeatmap = !showHeatmap" title="Heatmap">
        <i class="fa fa-th"></i>
      </button>
      <button class="ctrl-btn" :class="{ active: showProbes }" @click="toggleProbes" title="Probes">
        <i class="fa fa-thermometer-half"></i>
      </button>
      <button class="ctrl-btn" :class="{ active: showTrails }" @click="showTrails = !showTrails" title="Trails">
        <i class="fa fa-code-fork"></i>
      </button>
    </div>

    <!-- Playback Controls -->
    <div class="playback-bar">
      <div class="playback-left">
        <button class="play-btn" @click="togglePlay">
          <i :class="store.playback.playing ? 'fa fa-pause' : 'fa fa-play'"></i>
        </button>
        <div class="speed-btns">
          <button v-for="s in [1, 2, 5]" :key="s"
            :class="['speed-btn', { active: store.playback.speed === s }]"
            @click="store.playback.speed = s">
            {{ s }}x
          </button>
        </div>
      </div>

      <div class="playback-track">
        <input type="range" class="track-slider"
          :min="0" :max="totalFrames"
          :value="currentFrame"
          @input="seekTo($event.target.value)" />
        <div class="track-labels">
          <span>{{ store.startDate }}</span>
          <span class="current-time">{{ currentTimeLabel }}</span>
          <span>{{ store.endDate }}</span>
        </div>
      </div>
    </div>

    <!-- Popup -->
    <div ref="popup" class="map-popup-dark">
      <div ref="popupContent" class="popup-content-dark"></div>
    </div>
  </div>
</template>

<script>
import { useFishtracStore } from '../../store/fishtracStore'
import { useFishtracTheme } from '../../composables/useFishtracTheme'
import Map from 'ol/Map'
import View from 'ol/View'
import { fromLonLat } from 'ol/proj'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import Overlay from 'ol/Overlay'

export default {
  name: 'FishtracTrackerMap',

  setup() {
    const store = useFishtracStore()
    const { tileUrl } = useFishtracTheme()
    return { store, tileUrl }
  },

  data() {
    return {
      map: null,
      tileLayer: null,
      trailLayer: null,
      fishLayer: null,
      probeLayer: null,
      overlay: null,
      showHeatmap: false,
      showProbes: true,
      showTrails: true,
      currentFrame: 0,
      animTimer: null,
      trailColors: ['#007ACC', '#4EC9B0', '#CE9178', '#DCDCAA', '#C586C0', '#9CDCFE']
    }
  },

  computed: {
    totalFrames() {
      if (!this.store.fishPositions.length) return 100
      const dates = this.store.fishPositions.map(p => new Date(p.date_h_rounded).getTime())
      return Math.max(1, new Set(dates).size - 1)
    },
    sortedTimestamps() {
      const unique = [...new Set(this.store.fishPositions.map(p => p.date_h_rounded))]
      return unique.sort()
    },
    currentTimeLabel() {
      if (!this.sortedTimestamps.length) return '--'
      const idx = Math.min(this.currentFrame, this.sortedTimestamps.length - 1)
      return this.sortedTimestamps[idx] || '--'
    }
  },

  mounted() {
    this.initMap()
    this.store.fetchFishPositions(this.store.selectedRiver, this.store.startDate, this.store.endDate)
    this.store.fetchProbePositions(this.store.selectedRiver)
  },

  watch: {
    'store.fishPositions'() {
      this.drawTrails()
      this.drawFishMarkers()
    },
    'store.probePositions'() {
      this.drawProbeMarkers()
    },
    currentFrame() {
      this.drawFishMarkers()
    },
    'store.theme'() {
      this.swapTiles()
    }
  },

  beforeUnmount() {
    this.stopPlay()
    if (this.map) {
      this.map.setTarget(null)
      this.map = null
    }
  },

  methods: {
    swapTiles() {
      if (this.tileLayer) {
        this.tileLayer.setSource(new XYZ({
          url: this.tileUrl,
          attributions: '&copy; CartoDB'
        }))
      }
    },

    initMap() {
      this.overlay = new Overlay({
        element: this.$refs.popup,
        autoPan: true,
        autoPanAnimation: { duration: 250 }
      })

      this.trailLayer = new VectorLayer({ source: new VectorSource() })
      this.fishLayer = new VectorLayer({ source: new VectorSource() })
      this.probeLayer = new VectorLayer({ source: new VectorSource() })

      this.tileLayer = new TileLayer({
        source: new XYZ({
          url: this.tileUrl,
          attributions: '&copy; CartoDB'
        })
      })

      this.map = new Map({
        target: this.$refs.mapContainer,
        layers: [
          this.tileLayer,
          this.trailLayer,
          this.fishLayer,
          this.probeLayer
        ],
        overlays: [this.overlay],
        view: new View({
          center: fromLonLat([31.92, -25.12]),
          zoom: 13
        })
      })

      this.map.on('click', (evt) => {
        const feature = this.map.forEachFeatureAtPixel(evt.pixel, (f) => f)
        if (feature && feature.get('popupHtml')) {
          this.overlay.setPosition(feature.getGeometry().getCoordinates())
          this.$refs.popupContent.innerHTML = feature.get('popupHtml')
        } else {
          this.overlay.setPosition(undefined)
        }
      })

      this.map.on('pointermove', (evt) => {
        const hit = this.map.hasFeatureAtPixel(evt.pixel)
        this.map.getTargetElement().style.cursor = hit ? 'pointer' : ''
      })
    },

    drawTrails() {
      if (!this.trailLayer) return
      const source = this.trailLayer.getSource()
      source.clear()

      const grouped = {}
      this.store.fishPositions.forEach(p => {
        if (!grouped[p.name]) grouped[p.name] = []
        grouped[p.name].push(p)
      })

      const names = Object.keys(grouped)
      names.forEach((name, idx) => {
        const points = grouped[name]
          .sort((a, b) => a.date_h_rounded.localeCompare(b.date_h_rounded))
          .map(p => fromLonLat([p.lng, p.lat]))

        if (points.length < 2) return

        const color = this.trailColors[idx % this.trailColors.length]
        const feature = new Feature({ geometry: new LineString(points), name })
        feature.setStyle(new Style({
          stroke: new Stroke({ color, width: 2, lineDash: [6, 4] })
        }))
        source.addFeature(feature)
      })
    },

    drawFishMarkers() {
      if (!this.fishLayer) return
      const source = this.fishLayer.getSource()
      source.clear()

      const ts = this.sortedTimestamps[this.currentFrame]
      if (!ts) return

      const grouped = {}
      this.store.fishPositions.forEach(p => {
        if (!grouped[p.name]) grouped[p.name] = []
        grouped[p.name].push(p)
      })

      const names = Object.keys(grouped)
      names.forEach((name, idx) => {
        const points = grouped[name].sort((a, b) => a.date_h_rounded.localeCompare(b.date_h_rounded))
        const closest = points.reduce((prev, curr) => {
          return Math.abs(curr.date_h_rounded.localeCompare(ts)) < Math.abs(prev.date_h_rounded.localeCompare(ts)) ? curr : prev
        })

        const color = this.trailColors[idx % this.trailColors.length]
        const radius = Math.min(14, 6 + (closest.activity_per_minute / 50))

        const feature = new Feature({
          geometry: new Point(fromLonLat([closest.lng, closest.lat])),
          popupHtml: `<strong>${name}</strong><br>
            <span>Activity: ${closest.activity_per_minute} APM</span><br>
            <span>Temp: ${closest.temp_fish}°C</span><br>
            <span style="color:#808080;font-size:11px">${closest.date_h_rounded}</span>`
        })

        feature.setStyle([
          new Style({
            image: new CircleStyle({
              radius: radius + 8,
              fill: new Fill({ color: color.replace(')', ',0.15)').replace('rgb', 'rgba').replace('#', '') === color ? this.hexToRgba(color, 0.15) : 'rgba(0,122,204,0.15)' })
            })
          }),
          new Style({
            image: new CircleStyle({
              radius,
              fill: new Fill({ color: this.hexToRgba(color, 0.7) }),
              stroke: new Stroke({ color, width: 2 })
            })
          }),
          new Style({
            image: new CircleStyle({
              radius: 3,
              fill: new Fill({ color: '#FFFFFF' })
            })
          })
        ])

        source.addFeature(feature)
      })
    },

    drawProbeMarkers() {
      if (!this.probeLayer) return
      const source = this.probeLayer.getSource()
      source.clear()

      this.store.probePositions.forEach(p => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([p.lng, p.lat])),
          popupHtml: `<strong>${p.name}</strong><br>
            <span>Temp: ${p.temp_probe}°C</span><br>
            <span>Cond: ${p.conductivity_us_cm} µS/cm</span><br>
            <span>Depth: ${p.water_depth} m</span>`
        })

        feature.setStyle([
          new Style({
            image: new CircleStyle({
              radius: 10,
              fill: new Fill({ color: 'rgba(155,89,182,0.3)' }),
              stroke: new Stroke({ color: '#9b59b6', width: 2 })
            })
          }),
          new Style({
            image: new CircleStyle({
              radius: 4,
              fill: new Fill({ color: '#9b59b6' })
            })
          })
        ])

        source.addFeature(feature)
      })
    },

    toggleProbes() {
      this.showProbes = !this.showProbes
      if (this.probeLayer) this.probeLayer.setVisible(this.showProbes)
    },

    togglePlay() {
      if (this.store.playback.playing) {
        this.stopPlay()
      } else {
        this.startPlay()
      }
    },

    startPlay() {
      this.store.playback.playing = true
      const interval = 200 / this.store.playback.speed
      this.animTimer = setInterval(() => {
        if (this.currentFrame >= this.totalFrames) {
          this.currentFrame = 0
        }
        this.currentFrame++
      }, interval)
    },

    stopPlay() {
      this.store.playback.playing = false
      if (this.animTimer) {
        clearInterval(this.animTimer)
        this.animTimer = null
      }
    },

    seekTo(val) {
      this.currentFrame = parseInt(val)
    },

    hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r},${g},${b},${alpha})`
    }
  }
}
</script>

<style scoped>
.tracker-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tracker-map {
  flex: 1;
  min-height: 500px;
}

/* Map Controls */
.map-controls {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;
}

.ctrl-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--ft-border);
  background: var(--ft-bg-surface);
  color: var(--ft-text-muted);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.ctrl-btn:hover {
  color: var(--ft-text-secondary);
  border-color: var(--ft-border-hover);
}

.ctrl-btn.active {
  color: var(--ft-accent);
  border-color: var(--ft-accent);
  background: var(--ft-accent-subtle);
}

/* Playback Bar */
.playback-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: var(--ft-bg-surface);
  border-top: 1px solid var(--ft-border);
}

.playback-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.play-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--ft-border);
  background: transparent;
  color: var(--ft-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.play-btn:hover {
  background: var(--ft-accent);
  border-color: var(--ft-accent);
  color: var(--ft-text-on-accent);
}

.speed-btns {
  display: flex;
  gap: 2px;
}

.speed-btn {
  padding: 4px 8px;
  border: 1px solid var(--ft-border);
  background: transparent;
  color: var(--ft-text-muted);
  font-size: 11px;
  cursor: pointer;
  border-radius: 3px;
  font-family: inherit;
}

.speed-btn.active {
  background: var(--ft-accent);
  border-color: var(--ft-accent);
  color: var(--ft-text-on-accent);
}

.playback-track {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.track-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--ft-border);
  border-radius: 2px;
  outline: none;
}

.track-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--ft-accent);
  cursor: pointer;
  border: 2px solid var(--ft-bg-surface);
}

.track-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--ft-text-muted);
}

.current-time {
  color: #4EC9B0;
  font-weight: 600;
}

/* Popup */
.map-popup-dark {
  background: var(--ft-popup-bg);
  border: 1px solid var(--ft-popup-border);
  border-radius: 6px;
  padding: 10px 14px;
  box-shadow: 0 4px 16px var(--ft-popup-shadow);
  transform: translate(-50%, -100%);
  margin-top: -12px;
  min-width: 150px;
}

.map-popup-dark::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid var(--ft-popup-arrow);
}

.popup-content-dark {
  font-size: 12px;
  color: var(--ft-text-secondary);
  line-height: 1.6;
}
</style>
