<template>
  <div>
          <div style="float:right" class="input-group mb-2 mr-sm-2">
            <div class="input-group-prepend">
                <div class="input-group-text"><i class="fa fa-search" aria-hidden="true"></i></div>
              </div>
            <input type="text" class="form-control" id="bioSearchInput" placeholder="Search">
      </div>
      <div class="card rounded-0">
        <div class="card-body jstree-container" style="max-height:300px; height: 300px;">
          <div v-if='loading'>Select Station Types...</div>
          <div v-else>
              <div id="hydrotree-div" style="font-size: 14px;">
              </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
  import $ from 'jquery';
  import 'jstree/dist/themes/default/style.min.css';
  import 'jstree/dist/jstree.min.js';

  export default {
    data () {
      return {
        selectable: true,
        loading: true,
        refreshable: true
      };
    },
    methods: {
      toggleMultipleNodes (nodes, selected) {
        for (let i = 0; i < nodes.length; i++) {
          this.toggleNode(nodes[i], selected);
        }
      },
      refreshStations () {
        this.loading = true;
        this.$bus.emit('refreshStations');
      },
      toggleNode (node, selected) {
        let $jsTreeDiv = $('#hydrotree-div');
        if (!$jsTreeDiv || !$jsTreeDiv.length) {
          return false;
        }
        // Check if jstree is initialized
        let jsTreeInstance = $jsTreeDiv.jstree(true);
        if (!jsTreeInstance || typeof jsTreeInstance.get_node !== 'function') {
          return false;
        }
        // Get the node object to check if it exists
        let nodeObj = jsTreeInstance.get_node(node);
        if (!nodeObj) {
          console.warn('Node not found in tree:', node);
          return false;
        }
        // Open parent nodes if collapsed so the node is visible
        let parent = jsTreeInstance.get_parent(node);
        if (parent && parent !== '#') {
          jsTreeInstance.open_node(parent);
        }
        // Use jstree instance methods to properly trigger events
        // select_node(obj, supress_event, prevent_open) - we want supress_event=false to trigger changed.jstree
        if (selected) {
          jsTreeInstance.select_node(node, false, false);
        } else {
          jsTreeInstance.deselect_node(node, false);
        }
        let nodeElement = jsTreeInstance.get_node(node, true);
        if (nodeElement && nodeElement.length) {
          nodeElement.children('.jstree-anchor').focus();
        }
      },
      expandAll () {
        let $jsTreeDiv = $('#hydrotree-div');
        $jsTreeDiv.jstree('open_all');
      },
      createTree (jsonData, treeClicked, treeReady) {
        let jsTreePlugins = [ 'wholerow', 'types', 'search' ];
        if (this.selectable) {
          jsTreePlugins.push('checkbox');
        }
        for (let i = 0; i < jsonData.length; i++) {
          if (jsonData[i]['children'].length > 0) {
            for (let j = 0; j < jsonData[i]['children'].length; j++) {
              jsonData[i]['children'][j]['id'] = jsonData[i]['children'][j]['id'].split(':')[0];
            }
          }
        }
        this.loading = false;
        let iconTree = require('../../assets/iconfinder_layer_37228.png');
        setTimeout(function () {
          let $jsTreeDiv = $('#hydrotree-div');
          let $searchInputDiv = $('#catchmentSearchInput');
          $jsTreeDiv.on('changed.jstree', treeClicked).jstree({
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
                'icon': iconTree
              },
              'station': {
                'icon': iconTree
              }
            }
          });
          $jsTreeDiv.on('ready.jstree', treeReady);
          let to = false;
          $searchInputDiv.keyup(function () {
            if (to) { clearTimeout(to); };
            to = setTimeout(function () {
              let v = $searchInputDiv.val();
              $jsTreeDiv.jstree(true).search(v);
            }, 250);
          });
        }, 100);
      }
    }
  };
</script>