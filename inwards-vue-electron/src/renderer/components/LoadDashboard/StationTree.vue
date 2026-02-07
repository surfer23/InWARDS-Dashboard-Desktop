<template>
  <div class="card rounded-0">
    <div class="card-header inwards_card">
      <h6 style="color: white">
        <i class="fa fa-map-marker" style="padding-right: 10px"></i>Select from
        Tree
        <span v-if="refreshable">
          <i
            class="fa fa-refresh"
            :id="refreshButtonId"
            v-on:click="refreshStations"
            ref="refreshType"
          ></i>
        </span>
      </h6>
    </div>
    <div
      class="card-body jstree-container"
      style="max-height: 56vh; height: 56vh"
    >
      <div class="center text-sm inwards_label" v-if="loading">
        Stations with data will be displayed after selecting type and variable
        above...
      </div>
      <div v-else>
        <div :id="treeContainerId" style="font-size: 11px">
          <div :id="treeSubContainerId" style="font-size: 11px"></div>
        </div>
      </div>
    </div>
    <div class="form-group" style="margin-right: 0.5rem">
      <div
        class="input-group form-control-sm"
        style="margin-left: 4px; margin-right: 10px"
      >
        <div class="input-group-prepend">
          <span
            class="input-group-text rounded-0 inwards_search"
            :id="searchAddonId"
          >
            <font-awesome-icon icon="fa-solid fa-map-marked-alt" />
          </span>
        </div>
        <input
          type="text"
          class="form-control rounded-0 inwards_label"
          :id="searchInputId"
          :aria-describedby="searchAddonId"
          placeholder="Search"
        />
        <div class="input-group-append">
          <span
            class="input-group-text rounded-0 inwards_search"
            :id="searchAddonAppendId"
            style="cursor: pointer"
            role="button"
          >
            <i class="fa fa-search" aria-hidden="true"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import 'jstree/dist/jstree.min.js'
import 'jstree/src/jstree.wholerow.js'
import 'jstree/src/jstree.types.js'
import 'jstree/src/jstree.search.js'
import 'jstree/dist/themes/default/style.css'

export default {
  name: 'StationTree',

  props: {
    treeId: {
      type: String,
      default: 'load-station-tree'
    }
  },

  emits: ['refresh-requested'],

  data() {
    return {
      selectable: true,
      loading: true,
      refreshable: true,
    }
  },

  computed: {
    treeContainerId() {
      return `jstree-${this.treeId}`
    },
    treeSubContainerId() {
      return `jstree-sub-${this.treeId}`
    },
    searchInputId() {
      return `search-${this.treeId}`
    },
    searchAddonId() {
      return `search-addon-${this.treeId}`
    },
    searchAddonAppendId() {
      return `search-addon-append-${this.treeId}`
    },
    refreshButtonId() {
      return `refresh-${this.treeId}`
    }
  },
  methods: {
    toggleMultipleNodes(nodes, selected) {
      for (let i = 0; i < nodes.length; i++) {
        this.toggleNode(nodes[i], selected)
      }
    },
    refreshStations() {
      this.loading = true
      this.$emit('refresh-requested')
    },
    setLoading(isLoading) {
      this.loading = isLoading
    },
    toggleNode(node, selected) {
      let $jsTreeDiv = $(`#${this.treeContainerId}`)
      if (!$jsTreeDiv || !$jsTreeDiv.length) {
        return false
      }
      // Check if jstree is initialized
      let jsTreeInstance = $jsTreeDiv.jstree(true)
      if (!jsTreeInstance || typeof jsTreeInstance.get_node !== 'function') {
        return false
      }
      // Get the node object to check if it exists
      let nodeObj = jsTreeInstance.get_node(node)
      if (!nodeObj) {
        console.warn('Node not found in tree:', node)
        return false
      }
      // Open parent nodes if collapsed so the node is visible
      let parent = jsTreeInstance.get_parent(node)
      if (parent && parent !== '#') {
        jsTreeInstance.open_node(parent)
      }
      // Use jstree instance methods to properly trigger events
      // select_node(obj, supress_event, prevent_open) - we want supress_event=false to trigger changed.jstree
      if (selected) {
        jsTreeInstance.select_node(node, false, false)
      } else {
        jsTreeInstance.deselect_node(node, false)
      }
      let nodeElement = jsTreeInstance.get_node(node, true)
      if (nodeElement && nodeElement.length) {
        nodeElement.children('.jstree-anchor').focus()
      }
    },
    expandAll() {
      let $jsTreeDiv = $(`#${this.treeContainerId}`)
      $jsTreeDiv.jstree('open_all')
    },
    createStationTree(jsonData, treeClicked, treeReady) {
      const self = this
      let jsTreePlugins = ['wholerow', 'types', 'search', 'checkbox']

      this.loading = false
      let iconHydro = require('../../assets/river.svg')
      let iconStation = require('../../assets/vial.svg')
      let iconRQO = require('../../assets/rqo.svg')
      let iconTree = require('../../assets/iconfinder_layer_37228.png')
      setTimeout(function () {
        let $jsTreeDiv = $(`#${self.treeContainerId}`)
        let $searchInputDiv = $(`#${self.searchInputId}`)
        $jsTreeDiv.on('changed.jstree', treeClicked).jstree({
          core: {
            data: jsonData,
          },
          search: {
            show_only_matches: true,
            show_only_matches_children: true,
          },
          plugins: jsTreePlugins,
          types: {
            layer: {
              icon: iconTree,
            },
            station: {
              icon: iconStation,
            },
            hydroStation: {
              icon: iconHydro,
            },
            rqoStation: {
              icon: iconRQO,
            },
          },
          checkbox: {
            three_state: false,
            cascade: 'down'
          },
        })
        $jsTreeDiv.on('ready.jstree', treeReady)
        let to = false
        $searchInputDiv.keyup(function () {
          if (to) {
            clearTimeout(to)
          }
          to = setTimeout(function () {
            let v = String($searchInputDiv.val()) // Ensure v is a string
            $jsTreeDiv.jstree(true).search(v)
          }, 250)
        })
      }, 100)
    },
  },
}
</script>