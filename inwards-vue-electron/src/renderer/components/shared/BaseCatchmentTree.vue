<template>
  <div class="ft-tree-card" :style="cardStyle">
    <!-- Header (optional) -->
    <div v-if="showHeader" class="ft-tree-header">
      <h6>
        <i :class="'fa ' + headerIcon"></i>{{ title }}
      </h6>
      <span v-if="refreshable">
        <i class="fa fa-refresh" :id="refreshButtonId" @click="handleRefresh" style="cursor: pointer; opacity: 0.8;"></i>
      </span>
    </div>

    <!-- Tree Container -->
    <div class="ft-tree-body ft-scrollable" :style="containerStyle">
      <div v-if="loading" style="padding: 10px; color: var(--ft-text-muted);">{{ loadingText }}</div>
      <div v-else>
        <div :id="treeContainerId" :ref="setTreeRef" :style="treeStyle"></div>
      </div>
    </div>

    <!-- Search Box (optional) -->
    <div v-if="searchEnabled" class="ft-search-box">
      <div class="ft-search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <input
        type="text"
        class="ft-search-input"
        :id="searchInputId"
        :ref="setSearchRef"
        :placeholder="searchPlaceholder"
      >
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import 'jstree/dist/themes/default/style.min.css';
import 'jstree/dist/jstree.min.js';

// Generate unique ID for each component instance
let instanceCounter = 0;

export default {
  name: 'BaseCatchmentTree',

  props: {
    // Unique identifier for this tree instance (required to avoid DOM ID conflicts)
    treeId: {
      type: String,
      required: true,
      validator: (value) => value && value.length > 0
    },

    // Display options
    title: {
      type: String,
      default: 'Stations'
    },
    headerIcon: {
      type: String,
      default: 'fa-map-marker'
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    loadingText: {
      type: String,
      default: 'Loading...'
    },

    // Behavior options
    selectable: {
      type: Boolean,
      default: true
    },
    refreshable: {
      type: Boolean,
      default: true
    },
    searchEnabled: {
      type: Boolean,
      default: true
    },
    searchPlaceholder: {
      type: String,
      default: 'Search'
    },

    // Checkbox configuration
    checkboxConfig: {
      type: Object,
      default: () => ({
        tie_selection: true,
        whole_node: false,
        three_state: false
      })
    },

    // Node icons - paths relative to assets folder or full paths
    nodeIcons: {
      type: Object,
      default: () => ({
        layer: null,  // Will use default if not provided
        station: null
      })
    },

    // Style options
    containerHeight: {
      type: String,
      default: '380px'
    },
    containerMaxHeight: {
      type: String,
      default: '380px'
    },
    fontSize: {
      type: String,
      default: '14px'
    },
    cardMarginTop: {
      type: String,
      default: '5px'
    },
    cardMarginBottom: {
      type: String,
      default: '2px'
    }
  },

  emits: [
    'tree-clicked',      // When a node is clicked/selected
    'tree-ready',        // When the tree is fully initialized
    'refresh-requested', // When refresh button is clicked
    'node-toggled'       // When a node is programmatically toggled
  ],

  data() {
    return {
      loading: true,
      instanceId: ++instanceCounter,
      jsTreeInstance: null,
      treeElement: null,
      searchElement: null
    };
  },

  computed: {
    // Generate unique IDs based on treeId prop to avoid conflicts
    treeContainerId() {
      return `jstree-${this.treeId}`;
    },
    searchInputId() {
      return `search-${this.treeId}`;
    },
    refreshButtonId() {
      return `refresh-${this.treeId}`;
    },
    cardStyle() {
      return {
        marginTop: this.cardMarginTop,
        marginBottom: this.cardMarginBottom,
        width: '100%'
      };
    },
    containerStyle() {
      return {
        maxHeight: this.containerMaxHeight,
        height: this.containerHeight
      };
    },
    treeStyle() {
      return {
        fontSize: this.fontSize
      };
    }
  },

  methods: {
    // Vue 3 ref callback functions
    setTreeRef(el) {
      this.treeElement = el;
    },
    setSearchRef(el) {
      this.searchElement = el;
    },

    // Get the jQuery element for the tree (using unique ID)
    getTreeElement() {
      return $(`#${this.treeContainerId}`);
    },

    // Get the jQuery element for the search input
    getSearchElement() {
      return $(`#${this.searchInputId}`);
    },

    // Handle refresh button click
    handleRefresh() {
      this.loading = true;
      this.$emit('refresh-requested');
    },

    // Toggle multiple nodes at once
    toggleMultipleNodes(nodes, selected) {
      for (let i = 0; i < nodes.length; i++) {
        this.toggleNode(nodes[i], selected);
      }
    },

    // Toggle a single node's selection state
    toggleNode(node, selected) {
      // Ensure selected is a boolean
      selected = selected === true;

      const $jsTreeDiv = this.getTreeElement();
      if (!$jsTreeDiv || !$jsTreeDiv.length) {
        console.warn(`[${this.treeId}] Tree element not found`);
        return false;
      }

      // Check if jstree is initialized
      const jsTreeInstance = $jsTreeDiv.jstree(true);
      if (!jsTreeInstance || typeof jsTreeInstance.get_node !== 'function') {
        console.warn(`[${this.treeId}] jstree not initialized`);
        return false;
      }

      // Get the node object
      const nodeObj = jsTreeInstance.get_node(node);
      if (!nodeObj) {
        console.warn(`[${this.treeId}] Node not found:`, node);
        return false;
      }

      // Open parent nodes if collapsed
      const parent = jsTreeInstance.get_parent(node);
      if (parent && parent !== '#') {
        jsTreeInstance.open_node(parent);
      }

      // Use check_node/uncheck_node for checkbox plugin, select_node/deselect_node otherwise
      if (this.selectable) {
        if (selected) {
          jsTreeInstance.check_node(node);
        } else {
          jsTreeInstance.uncheck_node(node);
        }
      } else {
        if (selected) {
          jsTreeInstance.select_node(node, false, false);
        } else {
          jsTreeInstance.deselect_node(node, false);
        }
      }

      // Focus the node element
      const nodeElement = jsTreeInstance.get_node(node, true);
      if (nodeElement && nodeElement.length) {
        nodeElement.children('.jstree-anchor').focus();
      }

      this.$emit('node-toggled', { node, selected });
      return true;
    },

    // Expand all tree nodes
    expandAll() {
      const $jsTreeDiv = this.getTreeElement();
      if ($jsTreeDiv && $jsTreeDiv.length) {
        $jsTreeDiv.jstree('open_all');
      }
    },

    // Collapse all tree nodes
    collapseAll() {
      const $jsTreeDiv = this.getTreeElement();
      if ($jsTreeDiv && $jsTreeDiv.length) {
        $jsTreeDiv.jstree('close_all');
      }
    },

    // Get currently selected nodes
    getSelectedNodes() {
      const $jsTreeDiv = this.getTreeElement();
      if (!$jsTreeDiv || !$jsTreeDiv.length) return [];

      const jsTreeInstance = $jsTreeDiv.jstree(true);
      if (!jsTreeInstance) return [];

      return jsTreeInstance.get_selected();
    },

    // Get the jstree instance for advanced operations
    getJsTreeInstance() {
      const $jsTreeDiv = this.getTreeElement();
      if (!$jsTreeDiv || !$jsTreeDiv.length) return null;
      return $jsTreeDiv.jstree(true);
    },

    // Destroy the existing tree (useful for reloading)
    destroyTree() {
      const $jsTreeDiv = this.getTreeElement();
      if ($jsTreeDiv && $jsTreeDiv.length) {
        const instance = $jsTreeDiv.jstree(true);
        if (instance) {
          instance.destroy();
        }
      }
    },

    // Create/initialize the tree with data
    createTree(jsonData, onTreeClicked, onTreeReady) {
      const self = this;

      // Build plugins array
      const jsTreePlugins = ['wholerow', 'types', 'search'];
      if (this.selectable) {
        jsTreePlugins.push('checkbox');
      }

      // Process jsonData to extract IDs (remove any suffix after :)
      for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i]['children'] && jsonData[i]['children'].length > 0) {
          for (let j = 0; j < jsonData[i]['children'].length; j++) {
            if (jsonData[i]['children'][j]['id']) {
              jsonData[i]['children'][j]['id'] = jsonData[i]['children'][j]['id'].split(':')[0];
            }
          }
        }
      }

      this.loading = false;

      // Load icons - use provided or defaults
      let iconLayer, iconStation;
      try {
        iconLayer = this.nodeIcons.layer || require('../../assets/layer.png');
      } catch (e) {
        try {
          iconLayer = require('../../assets/iconfinder_layer_37228.png');
        } catch (e2) {
          iconLayer = null;
        }
      }
      try {
        iconStation = this.nodeIcons.station || require('../../assets/station.png');
      } catch (e) {
        try {
          iconStation = require('../../assets/iconfinder_layer_37228.png');
        } catch (e2) {
          iconStation = iconLayer;
        }
      }

      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        const $jsTreeDiv = self.getTreeElement();
        const $searchInputDiv = self.getSearchElement();

        if (!$jsTreeDiv || !$jsTreeDiv.length) {
          console.error(`[${self.treeId}] Could not find tree element`);
          return;
        }

        // Build jstree config
        const jsTreeConfig = {
          'core': {
            'data': jsonData
          },
          'search': {
            'show_only_matches': true,
            'show_only_matches_children': true
          },
          'plugins': jsTreePlugins,
          'types': {
            'layer': {
              'icon': iconLayer
            },
            'station': {
              'icon': iconStation
            }
          }
        };

        // Add checkbox config if selectable
        if (this.selectable) {
          jsTreeConfig['checkbox'] = this.checkboxConfig;
        }

        // Create wrapper for tree clicked handler that also emits event
        const wrappedTreeClicked = (event, data) => {
          if (onTreeClicked) {
            onTreeClicked(event, data);
          }
          self.$emit('tree-clicked', { event, data });
        };

        // Create wrapper for tree ready handler
        const wrappedTreeReady = (event, data) => {
          if (onTreeReady) {
            onTreeReady(event, data);
          }
          self.$emit('tree-ready', { event, data });
        };

        // Initialize jstree
        $jsTreeDiv.on('changed.jstree', wrappedTreeClicked).jstree(jsTreeConfig);
        $jsTreeDiv.on('ready.jstree', wrappedTreeReady);

        // Setup search functionality
        if (self.searchEnabled && $searchInputDiv && $searchInputDiv.length) {
          let searchTimeout = false;
          $searchInputDiv.keyup(function() {
            if (searchTimeout) {
              clearTimeout(searchTimeout);
            }
            searchTimeout = setTimeout(function() {
              const searchValue = $searchInputDiv.val();
              const instance = $jsTreeDiv.jstree(true);
              if (instance) {
                instance.search(searchValue);
              }
            }, 250);
          });
        }
      }, 100);
    },

    // Set loading state
    setLoading(isLoading) {
      this.loading = isLoading;
    }
  },

  beforeUnmount() {
    // Clean up jstree instance to prevent memory leaks
    this.destroyTree();
  }
};
</script>

<style scoped>
/* Tree body overflow is handled by ft-tree-body in dashboard.css */
</style>
