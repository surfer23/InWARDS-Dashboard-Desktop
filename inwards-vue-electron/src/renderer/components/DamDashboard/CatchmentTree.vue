<template>
  <div>
     <div class="card rounded-0" style="margin-top: 5px; margin-bottom: 2px; width:100%">
        <div class="card-header inwards_card"><h6 style="color: white;"><i class="fa fa-map-marker" style="padding-right: 10px;"></i>Stations
        <span v-if='refreshable'>
          <i class="fa fa-refresh" id="refresh-stations" v-on:click="refreshStations"></i>
        </span>
        </h6>
        </div>
        <div class="card-body jstree-container" style="max-height:380px; height: 380px;">
          <div v-if='loading'>Loading...</div>
          <div v-else>
              <div id="jstree-div" style="font-size: 14px;">
              </div>
          </div>
        </div>
         <div class="card rounded-0" style="margin-top: 5px; margin-bottom: 0px; width:100%">
          <div class="card-body" >
        <div style="margin-left: 0px;" class="input-group mb-2 mr-sm-2">
          <div class="input-group-prepend" style="font-size:11pt; height:30px;" >
              <div class="input-group-text rounded-0 inwards_search" style="margin-right:0px;"><i class="fa fa-search" aria-hidden="true" ></i></div>
            </div>
          <input type="text" class="form-control rounded-0" id="catchmentSearchInput" placeholder="Search" style="margin-right:0px;11pt;height:30px;width:100%;">
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
        this.$bus.$emit('refreshStations');
      },
      toggleNode (node, selected) {
        let nodeBehaviour = selected ? 'select_node' : 'deselect_node';
        let $jsTreeDiv = $('#jstree-div');
        if (!$jsTreeDiv) {
          return false;
        }
        $jsTreeDiv.jstree(nodeBehaviour, node);
        let nodes = $jsTreeDiv.jstree(true).get_node(node, true);
        if (nodes) {
          nodes.children('.jstree-anchor').focus();
        }
      },
      expandAll () {
        let $jsTreeDiv = $('#jstree-div');
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
        let iconTree = require('../../assets/layer.png');
        let iconStation = require('../../assets/station.png');
        setTimeout(function () {
          let $jsTreeDiv = $('#jstree-div');
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
                'icon': iconStation
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