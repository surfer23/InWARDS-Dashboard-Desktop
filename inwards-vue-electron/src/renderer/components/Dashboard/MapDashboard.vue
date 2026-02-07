<template>
    <div>
      <div id="popup" ref="popup" class="ol-popup">
        <a href="#" id="popup-closer" ref="popupCloser" class="ol-popup-closer"></a>
        <div id="popup-content" ref="popupContent" class="ol-popup-content"></div>
      </div>
      <template v-for="(child) in popups" :key="child.name">
        <component :is="child" :ref="child.id"></component>
      </template>
      <div class="card rounded-0">
        <div class="card-body">
          <div id="dashboard-map-unverified"></div>
          <div id="tooltip" class="ol-tooltip">
            <div id="tooltip-content"></div>
          </div>
        </div>
      </div>
    </div>
</template>
<style>
  /* OL popup/tooltip styles are now in dashboard.css (global, theme-aware) */
  #dashboard-map-unverified {
    width: 100%;
    height: 410px;
  }
</style>

<script>
  /* eslint-disable no-unused-vars */
  import Map from 'ol/Map';
  import View from 'ol/View';
  import {transform} from 'ol/proj';
  import {Group as LayerGroup, Tile as TileLayer} from 'ol/layer';
  import XYZ from 'ol/source/XYZ';
  import VectorLayer from 'ol/layer/Vector';
  import VectorSource from 'ol/source/Vector';
  import GeoJSON from 'ol/format/GeoJSON';
  import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
  import Overlay from 'ol/Overlay';
  import * as Extent from 'ol/extent';
  export default {
    data () {
      return {
        popups: [],
        keys: {
          selected: 'selected',
          station: 'station'
        },
        selectedStyle: new Style({
          stroke: new Stroke({
            color: [51, 204, 51, 0.4],
            width: 4
          }),
          fill: new Fill({
            color: [51, 204, 51, 0.1]
          }),
          zIndex: 1
        }),
        connectedToTree: true,
        selectedFeatures: [],
        featureDict: {},
        selectedWMA: [],
        selectedStations: [],
        defaultExtent: null,
        map: null,
        layerGroup: new LayerGroup({
          layers: []
        }),
        stationsSelectedStyle: new Style({
          image: new CircleStyle({
            radius: 9,
            fill: new Fill({color: [51, 204, 51, 0.8]}),
            stroke: new Stroke({color: 'green', width: 1})
          })
        }),
        stationsDefaultStyle: new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({color: 'rgba(255,0,0,0.5)'}),
            stroke: new Stroke({color: 'red', width: 1})
          })
        }),
        stationsVectorLayer: new VectorLayer({
          source: new VectorSource(),
          style: function (feature) {
            return new Style({
              image: new CircleStyle({
                radius: 7,
                fill: new Fill({color: 'rgba(255,0,0,0.5)'}),
                stroke: new Stroke({color: 'red', width: 1})
              })
            });
          }
        })
      };
    },
    mounted () {
      var tooltipContainer = document.getElementById('tooltip');
      var tooltipContent = document.getElementById('tooltip-content');
      let container = this.$refs.popup;
      let closer = this.$refs.popupCloser;
      let self = this;
      /**
      * Add a click handler to hide the popup.
      * @return {boolean} Don't follow the href.
      */
      if (closer) {
        closer.onclick = function () {
          self.overlay.setPosition(undefined);
          closer.blur();
          return false;
        };
      }
      /**
       * Create an overlay to anchor the popup the map
       */
      this.overlay = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 20
        }
      });

      this.map = new Map({
        target: 'dashboard-map-unverified',
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
          })
        ],
        overlays: [this.overlay],
        view: new View({
          center: [0, 0],
          zoom: 2
        })
      });
      this.map.addLayer(this.layerGroup);
      this.map.addLayer(this.stationsVectorLayer);
      this.map.on('click', this._mapClicked);

      var tooltip = new Overlay({
        element: tooltipContainer,
        autoPan: false,
        autoPanAnimation: {
          duration: 250
        }
      });
      this.map.addOverlay(tooltip);

      var featureId = '';

      this.map.on('pointermove', function (e) {
        var feature = this.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
          if (featureId === feature.get('station')) {
            return feature;
          };
          featureId = feature.get('station');
          if (featureId !== undefined) {
            var coordinates = feature.getGeometry().getCoordinates();
            tooltipContent.innerHTML = '<p>' + featureId + '</p></p>' + feature.get('place') + '</p>';
            tooltip.setPosition(coordinates);
            return feature;
          } else {
            tooltip.setPosition(undefined);
          }
        });
        if (!feature && (featureId !== '')) {
          featureId = '';
        };
      });
    },
    methods: {
      _mapClicked (e) {
        // Clicked map event handler
        this.selectStation(e.pixel);
      },
      getSelectedStations () {
        let _selectedStationsId = [];
        for (let i = 0; i < this.selectedStations.length; i++) {
          _selectedStationsId.push(this.selectedStations[i].split(' ')[0]);
        }
        return _selectedStationsId;
      },
      showSelectedWMA (data) {
        this.defaultExtent = Extent.createEmpty();
        for (let i = 0; i < data.length; i++) {
          let wma = data[i];
          let wmaJsonFile = `${wma}_wma.json`;
          let vectorLayer = new VectorLayer({
            source: new VectorSource({
              features: (new GeoJSON({
                defaultDataProjection: 'EPSG:4326'
              })).readFeatures(require(`../../assets/${wmaJsonFile}`), {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
              })
            }),
            updateWhileAnimating: true,
            updateWhileInteracting: true
          });
          Extent.extend(this.defaultExtent, vectorLayer.getSource().getExtent());
          this.layerGroup.getLayers().push(vectorLayer);
        }
        this.map.getView().fit(this.defaultExtent);
      },
      loadStationsToMap (stationsGeoJSONData) {
        this.stationsVectorLayer.setSource(new VectorSource({
          features: (new GeoJSON({
            defaultDataProjection: 'EPSG:4326'
          })).readFeatures(stationsGeoJSONData, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
          })
        }));
      },
      selectCatchments (catchments) {
        // Style a feature based on selected secondary catchment name
        // catchments = ['X3', 'X4', ...]
        for (let f = 0; f < this.selectedFeatures.length; f++) {
          this.selectedFeatures[f].setStyle(undefined);
        }
        this.selectedFeatures = [];
        if (catchments.length === 0) {
          // this.map.getView().fit(this.defaultExtent);
          return;
        }
        let extent = Extent.createEmpty();
        for (let i = 0; i < catchments.length; i++) {
          let catchment = catchments[i];
          let features = this.featureDict[catchment];
          for (let f = 0; f < features.length; f++) {
            let feature = features[f];
            feature.setStyle(this.selectedStyle);
            this.selectedFeatures.push(feature);
            Extent.extend(extent, feature.getGeometry().getExtent());
          }
        }
        // this.map.getView().fit(extent);
      },
      toggleSelectedStationsByStationNames (selectedStationNames, unselectedStationNames) {
        let self = this;
        this.stationsVectorLayer.getSource().forEachFeature(function (feature) {
          let station = feature.get(self.keys.station);
          const index = self.selectedStations.indexOf(station);
          if (selectedStationNames.indexOf(station) !== -1) {
            feature.set(self.keys.selected, true);
            feature.setStyle(self.stationsSelectedStyle);
            self.map.getView().fit(feature.getGeometry(), { 'maxZoom': 12 });
            if (index === -1) {
              self.selectedStations.push(station);
            }
          } else if (unselectedStationNames.indexOf(station) !== -1) {
            feature.set(self.keys.selected, false);
            feature.setStyle(self.stationsDefaultStyle);
            if (index > -1) {
              self.selectedStations.splice(index, 1);
            }
          }
        });
      },
      selectStation (pixel) {
        // Select and style stations from map based on ol.pixel
        let content = document.getElementById('popup-content');
        let self = this;
        self.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
          let station = feature.get(self.keys.station);
          // Convert to boolean - undefined/null/false all become false
          let isStationSelected = feature.get(self.keys.selected) === true;
          if (!self.connectedToTree) {
            content.innerHTML = `<p>${station.split(' ')[0]}</p>`;
            self.overlay.setPosition(feature.getGeometry().getCoordinates());
            return false;
          }
          if (!station) return false;
          // Determine the new selection state (opposite of current)
          let newSelectionState = !isStationSelected;
          if (newSelectionState) {
            feature.set(self.keys.selected, true);
            feature.setStyle(self.stationsSelectedStyle);
            self.selectedStations.push(station);
            content.innerHTML = `<p>${station.split(' ')[0]}</p>`;
            self.overlay.setPosition(feature.getGeometry().getCoordinates());
          } else {
            feature.set(self.keys.selected, false);
            feature.setStyle(self.stationsDefaultStyle);
            const index = self.selectedStations.indexOf(station);
            if (index > -1) {
              self.selectedStations.splice(index, 1);
            }
          }
          console.log('Emitting stationSelectedFromMap:', station, 'newSelectionState:', newSelectionState);
          // Mitt only passes one payload argument, so we need to pass an object
          self.$bus.emit('stationSelectedFromMap', { station: station, selected: newSelectionState });
          return true;
        });
      },
      getCatchmentsData () {
        // Return catchment data as dict of dict
        let catchmentsData = {};
        let layers = this.layerGroup.getLayers().getArray();
        for (let i = 0; i < layers.length; i++) {
          let layer = layers[i];
          let features = layer.getSource().getFeatures();
          for (let f = 0; f < features.length; f++) {
            let feature = features[f];
            let catchmentName = feature.get('NAME');
            let secondaryCatchmentName = catchmentName.slice(0, 2);
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
        let orderedCatchmentsData = {};
        Object.keys(catchmentsData).sort().forEach(function (key) {
          orderedCatchmentsData[key] = catchmentsData[key];
        });
        return orderedCatchmentsData;
      }
    }
  };
</script>