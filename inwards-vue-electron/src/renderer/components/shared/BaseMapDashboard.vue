<template>
  <div>
    <!-- Popup Overlay -->
    <div :id="popupId" ref="popup" class="ol-popup">
      <a href="#" :id="popupCloserId" ref="popupCloser" class="ol-popup-closer"></a>
      <div :id="popupContentId" ref="popupContent" class="ol-popup-content"></div>
    </div>

    <!-- Dynamic child components (popups) -->
    <template v-for="(child) in popups" :key="child.name">
      <component :is="child" :ref="child.id"></component>
    </template>

    <!-- Map Container -->
    <div class="card rounded-0">
      <div class="card-body map-card-body">
        <div :id="mapContainerId" :style="mapContainerStyle"></div>
        <!-- Tooltip Overlay -->
        <div v-if="showTooltip" :id="tooltipId" ref="tooltip" class="ol-tooltip">
          <div :id="tooltipContentId" ref="tooltipContent"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import Map from 'ol/Map';
import View from 'ol/View';
import { transform } from 'ol/proj';
import { Group as LayerGroup, Tile as TileLayer } from 'ol/layer';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import * as Extent from 'ol/extent';

// Counter for unique instance IDs
let instanceCounter = 0;

export default {
  name: 'BaseMapDashboard',

  props: {
    // Unique identifier for this map instance (required to avoid DOM ID conflicts)
    mapId: {
      type: String,
      required: true,
      validator: (value) => value && value.length > 0
    },

    // Map dimensions
    mapHeight: {
      type: String,
      default: '410px'
    },
    mapWidth: {
      type: String,
      default: '100%'
    },

    // Initial view settings
    initialCenter: {
      type: Array,
      default: () => [0, 0]
    },
    initialZoom: {
      type: Number,
      default: 2
    },

    // Station styling
    defaultStationStyle: {
      type: Object,
      default: () => ({
        radius: 7,
        fillColor: 'rgba(255,0,0,0.5)',
        strokeColor: 'red',
        strokeWidth: 1
      })
    },
    selectedStationStyle: {
      type: Object,
      default: () => ({
        radius: 9,
        fillColor: 'rgba(51,204,51,0.8)',
        strokeColor: 'green',
        strokeWidth: 1
      })
    },

    // Catchment styling
    selectedCatchmentStyle: {
      type: Object,
      default: () => ({
        strokeColor: [51, 204, 51, 0.4],
        strokeWidth: 4,
        fillColor: [51, 204, 51, 0.1]
      })
    },

    // Feature keys (property names in GeoJSON)
    featureKeys: {
      type: Object,
      default: () => ({
        selected: 'selected',
        station: 'station',
        place: 'place'
      })
    },

    // Behavior options
    connectedToTree: {
      type: Boolean,
      default: true
    },
    showPopup: {
      type: Boolean,
      default: true
    },
    showTooltip: {
      type: Boolean,
      default: true
    },

    // Tile layer URL
    tileLayerUrl: {
      type: String,
      default: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }
  },

  emits: [
    'station-selected',    // When a station is selected from the map
    'station-deselected',  // When a station is deselected from the map
    'map-clicked',         // General map click event
    'map-ready'            // When the map is fully initialized
  ],

  data() {
    return {
      instanceId: ++instanceCounter,
      popups: [],
      map: null,
      overlay: null,
      tooltipOverlay: null,
      layerGroup: null,
      stationsVectorLayer: null,
      selectedFeatures: [],
      featureDict: {},
      selectedWMA: [],
      selectedStations: [],
      defaultExtent: null,
      // Pre-built OpenLayers styles
      olDefaultStationStyle: null,
      olSelectedStationStyle: null,
      olSelectedCatchmentStyle: null
    };
  },

  computed: {
    // Generate unique IDs for all DOM elements
    mapContainerId() {
      return `map-${this.mapId}`;
    },
    popupId() {
      return `popup-${this.mapId}`;
    },
    popupCloserId() {
      return `popup-closer-${this.mapId}`;
    },
    popupContentId() {
      return `popup-content-${this.mapId}`;
    },
    tooltipId() {
      return `tooltip-${this.mapId}`;
    },
    tooltipContentId() {
      return `tooltip-content-${this.mapId}`;
    },
    mapContainerStyle() {
      return {
        width: this.mapWidth,
        height: this.mapHeight
      };
    }
  },

  mounted() {
    this.initializeStyles();
    this.initializeMap();
    // When rendered inside v-if, the container may have zero dimensions at
    // creation time. Force OL to recalculate once the browser has laid out.
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.map) this.map.updateSize();
      }, 200);
    });
  },

  beforeUnmount() {
    // Clean up map resources
    if (this.map) {
      this.map.setTarget(null);
      this.map = null;
    }
  },

  methods: {
    // Initialize OpenLayers styles from props
    initializeStyles() {
      // Default station style
      this.olDefaultStationStyle = new Style({
        image: new CircleStyle({
          radius: this.defaultStationStyle.radius,
          fill: new Fill({ color: this.defaultStationStyle.fillColor }),
          stroke: new Stroke({
            color: this.defaultStationStyle.strokeColor,
            width: this.defaultStationStyle.strokeWidth
          })
        })
      });

      // Selected station style
      this.olSelectedStationStyle = new Style({
        image: new CircleStyle({
          radius: this.selectedStationStyle.radius,
          fill: new Fill({ color: this.selectedStationStyle.fillColor }),
          stroke: new Stroke({
            color: this.selectedStationStyle.strokeColor,
            width: this.selectedStationStyle.strokeWidth
          })
        })
      });

      // Selected catchment style
      this.olSelectedCatchmentStyle = new Style({
        stroke: new Stroke({
          color: this.selectedCatchmentStyle.strokeColor,
          width: this.selectedCatchmentStyle.strokeWidth
        }),
        fill: new Fill({
          color: this.selectedCatchmentStyle.fillColor
        }),
        zIndex: 1
      });
    },

    // Initialize the OpenLayers map
    initializeMap() {
      const self = this;

      // Get DOM references
      const container = this.$refs.popup;
      const closer = this.$refs.popupCloser;
      const tooltipContainer = this.$refs.tooltip;
      const tooltipContent = this.$refs.tooltipContent;

      // Setup popup closer
      if (closer) {
        closer.onclick = function() {
          if (self.overlay) {
            self.overlay.setPosition(undefined);
          }
          closer.blur();
          return false;
        };
      }

      // Create popup overlay
      this.overlay = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 20
        }
      });

      // Create layer group for WMA layers
      this.layerGroup = new LayerGroup({
        layers: []
      });

      // Create stations vector layer
      this.stationsVectorLayer = new VectorLayer({
        source: new VectorSource(),
        style: (feature) => {
          return this.olDefaultStationStyle;
        }
      });

      // Create the map
      this.map = new Map({
        target: this.mapContainerId,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: this.tileLayerUrl
            })
          })
        ],
        overlays: [this.overlay],
        view: new View({
          center: this.initialCenter,
          zoom: this.initialZoom
        })
      });

      // Add layer group and stations layer
      this.map.addLayer(this.layerGroup);
      this.map.addLayer(this.stationsVectorLayer);

      // Add click handler
      this.map.on('click', this._handleMapClick);

      // Setup tooltip if enabled
      if (this.showTooltip && tooltipContainer) {
        this.tooltipOverlay = new Overlay({
          element: tooltipContainer,
          autoPan: false,
          autoPanAnimation: {
            duration: 250
          }
        });
        this.map.addOverlay(this.tooltipOverlay);

        let featureId = '';
        this.map.on('pointermove', (e) => {
          const feature = this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
            const stationKey = this.featureKeys.station;
            if (featureId === feature.get(stationKey)) {
              return feature;
            }
            featureId = feature.get(stationKey);
            if (featureId !== undefined) {
              const coordinates = feature.getGeometry().getCoordinates();
              const place = feature.get(this.featureKeys.place) || '';
              if (tooltipContent) {
                tooltipContent.innerHTML = `<p>${featureId}</p><p>${place}</p>`;
              }
              this.tooltipOverlay.setPosition(coordinates);
              return feature;
            } else {
              this.tooltipOverlay.setPosition(undefined);
            }
          });
          if (!feature && featureId !== '') {
            featureId = '';
          }
        });
      }

      this.$emit('map-ready', { map: this.map });
    },

    // Internal map click handler
    _handleMapClick(e) {
      this.$emit('map-clicked', { pixel: e.pixel, coordinate: e.coordinate });
      this.selectStation(e.pixel);
    },

    // Get selected station IDs
    getSelectedStations() {
      const selectedIds = [];
      for (let i = 0; i < this.selectedStations.length; i++) {
        selectedIds.push(this.selectedStations[i].split(' ')[0]);
      }
      return selectedIds;
    },

    // Show WMA boundaries on the map
    showSelectedWMA(data) {
      this.defaultExtent = Extent.createEmpty();
      for (let i = 0; i < data.length; i++) {
        const wma = data[i];
        const wmaJsonFile = `${wma}_wma.json`;
        try {
          const vectorLayer = new VectorLayer({
            source: new VectorSource({
              features: new GeoJSON({
                defaultDataProjection: 'EPSG:4326'
              }).readFeatures(require(`../../assets/${wmaJsonFile}`), {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
              })
            }),
            updateWhileAnimating: true,
            updateWhileInteracting: true
          });
          Extent.extend(this.defaultExtent, vectorLayer.getSource().getExtent());
          this.layerGroup.getLayers().push(vectorLayer);
        } catch (e) {
          console.warn(`Could not load WMA file: ${wmaJsonFile}`, e);
        }
      }
      if (this.map && this.defaultExtent) {
        this.map.getView().fit(this.defaultExtent);
      }
    },

    // Load stations from GeoJSON data
    loadStationsToMap(stationsGeoJSONData) {
      this.stationsVectorLayer.setSource(new VectorSource({
        features: new GeoJSON({
          defaultDataProjection: 'EPSG:4326'
        }).readFeatures(stationsGeoJSONData, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        })
      }));
    },

    // Select/highlight catchments by name
    selectCatchments(catchments) {
      // Reset previously selected features
      for (let f = 0; f < this.selectedFeatures.length; f++) {
        this.selectedFeatures[f].setStyle(undefined);
      }
      this.selectedFeatures = [];

      if (!catchments || catchments.length === 0) {
        return;
      }

      const extent = Extent.createEmpty();
      for (let i = 0; i < catchments.length; i++) {
        const catchment = catchments[i];
        const features = this.featureDict[catchment];
        if (features) {
          for (let f = 0; f < features.length; f++) {
            const feature = features[f];
            feature.setStyle(this.olSelectedCatchmentStyle);
            this.selectedFeatures.push(feature);
            Extent.extend(extent, feature.getGeometry().getExtent());
          }
        }
      }
    },

    // Toggle station selection by station names (called from tree)
    toggleSelectedStationsByStationNames(selectedStationNames, unselectedStationNames) {
      const self = this;
      const stationKey = this.featureKeys.station;
      const selectedKey = this.featureKeys.selected;

      this.stationsVectorLayer.getSource().forEachFeature((feature) => {
        const station = feature.get(stationKey);
        const index = self.selectedStations.indexOf(station);

        if (selectedStationNames.indexOf(station) !== -1) {
          feature.set(selectedKey, true);
          feature.setStyle(self.olSelectedStationStyle);
          self.map.getView().fit(feature.getGeometry(), { maxZoom: 12 });
          if (index === -1) {
            self.selectedStations.push(station);
          }
        } else if (unselectedStationNames.indexOf(station) !== -1) {
          feature.set(selectedKey, false);
          feature.setStyle(self.olDefaultStationStyle);
          if (index > -1) {
            self.selectedStations.splice(index, 1);
          }
        }
      });
    },

    // Select a station when clicked on the map
    selectStation(pixel) {
      const self = this;
      const content = this.$refs.popupContent;
      const stationKey = this.featureKeys.station;
      const selectedKey = this.featureKeys.selected;

      this.map.forEachFeatureAtPixel(pixel, (feature, layer) => {
        const station = feature.get(stationKey);

        // Convert to boolean
        const isStationSelected = feature.get(selectedKey) === true;

        if (!self.connectedToTree) {
          if (content && station) {
            content.innerHTML = `<p>${station.split(' ')[0]}</p>`;
          }
          if (self.overlay) {
            self.overlay.setPosition(feature.getGeometry().getCoordinates());
          }
          return false;
        }

        if (!station) return false;

        // Determine new selection state (toggle)
        const newSelectionState = !isStationSelected;

        if (newSelectionState) {
          feature.set(selectedKey, true);
          feature.setStyle(self.olSelectedStationStyle);
          self.selectedStations.push(station);
          if (content) {
            content.innerHTML = `<p>${station.split(' ')[0]}</p>`;
          }
          if (self.overlay) {
            self.overlay.setPosition(feature.getGeometry().getCoordinates());
          }
          self.$emit('station-selected', { station, feature });
        } else {
          feature.set(selectedKey, false);
          feature.setStyle(self.olDefaultStationStyle);
          const index = self.selectedStations.indexOf(station);
          if (index > -1) {
            self.selectedStations.splice(index, 1);
          }
          self.$emit('station-deselected', { station, feature });
        }

        return true;
      });
    },

    // Get catchments data from loaded WMA layers
    getCatchmentsData() {
      const catchmentsData = {};
      const layers = this.layerGroup.getLayers().getArray();

      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const features = layer.getSource().getFeatures();

        for (let f = 0; f < features.length; f++) {
          const feature = features[f];
          const catchmentName = feature.get('NAME');
          if (!catchmentName) continue;

          const secondaryCatchmentName = catchmentName.slice(0, 2);

          // Store feature in local dictionary
          if (!this.featureDict[secondaryCatchmentName]) {
            this.featureDict[secondaryCatchmentName] = [feature];
          } else {
            this.featureDict[secondaryCatchmentName].push(feature);
          }

          if (!catchmentsData.hasOwnProperty(secondaryCatchmentName)) {
            catchmentsData[secondaryCatchmentName] = [];
          }
        }
      }

      // Return sorted
      const orderedCatchmentsData = {};
      Object.keys(catchmentsData).sort().forEach((key) => {
        orderedCatchmentsData[key] = catchmentsData[key];
      });

      return orderedCatchmentsData;
    },

    // Get the map instance for advanced operations
    getMap() {
      return this.map;
    },

    // Clear all selected stations
    clearSelectedStations() {
      const stationKey = this.featureKeys.station;
      const selectedKey = this.featureKeys.selected;

      this.stationsVectorLayer.getSource().forEachFeature((feature) => {
        feature.set(selectedKey, false);
        feature.setStyle(this.olDefaultStationStyle);
      });

      this.selectedStations = [];
    }
  }
};
</script>

<style scoped>
.map-card-body {
  padding: 0;
}
/* OL popup/tooltip styles are now in dashboard.css (global, theme-aware) */
</style>
