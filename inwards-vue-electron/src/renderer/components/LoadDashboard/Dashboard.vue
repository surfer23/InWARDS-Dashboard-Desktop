<template>
  <div style="height: 100%">
    <!--Selection Modal-->
    <div
      class="modal rounded-0 fade modal_center"
      tabindex="-1"
      id="upstreamModal"
    >
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="upstreamModalLabel">
              Select Observed Sites
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row no-gutters">
              <div
                class="col-md-5 ml-auto"
                ref="catchmentTreeColumn"
                :style="{ width: catchmentTreeWidth + 'px' }"
                @mousedown="startDragging"
              >
                <StationTree ref="stationTree" @refresh-requested="fetchStations" />
                <div class="legend">
                  <p style="font-size: x-small"><strong>Tree Legend</strong></p>

                  <p style="font-size: xx-small">
                    RQO Water Quality Monitoring Site:
                    <font-awesome-icon
                      icon="fa-solid fa-vial"
                      style="color: #190193"
                    />
                  </p>

                  <p style="font-size: xx-small">
                    Water Quality Monitoring Site:
                    <font-awesome-icon
                      icon="fa-solid fa-vial"
                      style="color: #938701"
                    />
                  </p>

                  <p style="font-size: xx-small">
                    River Flow Monitoring Site:
                    <font-awesome-icon
                      icon="fa-solid fa-water"
                      style="color: rgb(104, 193, 223)"
                    />
                  </p>
                  </div>
              </div>
              <div class="col-md-7 ml-auto p-0" ref="mapColumn">
                <MapDashboard ref="mapDashboard" />
                <div class="mapLegend">
                  <p style="font-size: x-small"><strong>Tree Legend</strong></p>

                  <p style="font-size: xx-small">
                    Water Quality Monitoring Site:
                    <font-awesome-icon
                      icon="fa-solid fa-circle"
                      style="color: #dd1b1b"
                    />
                  </p>
                  <p style="font-size: xx-small">
                    River Flow Monitoring Site:
                    <font-awesome-icon
                      icon="fa-solid fa-circle"
                      style="color: rgb(41, 19, 235)"
                    />
                  </p>
                  <p style="font-size: xx-small">
                    Selected Site:
                    <font-awesome-icon
                      icon="fa-solid fa-circle"
                      style="color: rgb(6, 226, 79)"
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer" style="display: block">
            <div class="row">
              <div class="col-md-5">
                <div class="row">
                  <div class="col-md-5">
                    <!-- Upstream River Site Form Group -->
                    <div class="form-group mr-auto">
                      <label
                        class="inwards_form_label form-control-sm"
                        for="SelectedUpstreamSite"
                        >WQ U/S Site</label
                      >
                      <div class="input-group form-control-sm">
                        <div class="input-group-prepend">
                          <span
                            class="input-group-text rounded-0 inwards_search"
                            id="selected-upstream-addon"
                          >
                            <font-awesome-icon
                              icon="fa-solid fa-map-marked-alt"
                            />
                          </span>
                        </div>
                        <input
                          type="text"
                          class="form-control rounded-0 inwards_label"
                          id="SelectedUpstreamSite"
                          aria-describedby="selected-upstream-addon"
                          readonly
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2 my-auto">
                    <div class="form-group mr-auto">
                      <label
                        class="inwards_form_label form-control-sm"
                        for="swapIcon"
                        >Swap</label
                      >
                      <span class="btn inwards_button center">
                        <font-awesome-icon
                          id="swapIcon"
                          icon="fa-solid fa-right-left"
                          role="button"
                        >
                          >
                        </font-awesome-icon>
                      </span>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div
                      class="form-group mr-auto"
                      style="margin-right: 0.5rem"
                    >
                      <label
                        for="SelectedDownstreamSite"
                        class="form-control-sm inwards_form_label"
                        >WQ D/S Site</label
                      >
                      <div
                        class="input-group form-control-sm"
                        style="margin-left: 4px; margin-right: 10px"
                      >
                        <div class="input-group-prepend">
                          <span
                            class="input-group-text rounded-0 inwards_search"
                            id="selected-downstream-addon"
                            ><font-awesome-icon
                              icon="fa-solid fa-map-marked-alt"
                          /></span>
                        </div>
                        <input
                          type="text"
                          class="form-control rounded-0 inwards_label"
                          id="SelectedDownstreamSite"
                          aria-describedby="selected-downstream-addon"
                          readonly
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-5">
                    <!-- Upstream River Site Form Group -->
                    <div class="form-group mr-auto">
                      <label
                        class="inwards_form_label form-control-sm"
                        for="SelectedUpstreamHydro"
                        >Hydro U/S Site</label
                      >
                      <div class="input-group form-control-sm">
                        <div class="input-group-prepend">
                          <span
                            class="input-group-text rounded-0 inwards_search"
                            id="selected-upstream-addon"
                          >
                            <font-awesome-icon
                              icon="fa-solid fa-map-marked-alt"
                            />
                          </span>
                        </div>
                        <input
                          type="text"
                          class="form-control rounded-0 inwards_label"
                          id="SelectedUpstreamHydro"
                          aria-describedby="selected-upstream-addon"
                          readonly
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2 my-auto">
                    <div class="form-group mr-auto">
                      <label
                        class="inwards_form_label form-control-sm"
                        for="hydroSwap"
                        >Swap</label
                      >
                      <span class="btn inwards_button center">
                        <font-awesome-icon
                          id="hydroSwap"
                          icon="fa-solid fa-right-left"
                          role="button"
                        >
                          >
                        </font-awesome-icon>
                      </span>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div
                      class="form-group mr-auto"
                      style="margin-right: 0.5rem"
                    >
                      <label
                        for="SelectedDownstreamHydro"
                        class="form-control-sm inwards_form_label"
                        >Hydro D/S Site</label
                      >
                      <div
                        class="input-group form-control-sm"
                        style="margin-left: 4px; margin-right: 10px"
                      >
                        <div class="input-group-prepend">
                          <span
                            class="input-group-text rounded-0 inwards_search"
                            id="selected-downstream-addon"
                            ><font-awesome-icon
                              icon="fa-solid fa-map-marked-alt"
                          /></span>
                        </div>
                        <input
                          type="text"
                          class="form-control rounded-0 inwards_label"
                          id="SelectedDownstreamHydro"
                          aria-describedby="selected-downstream-addon"
                          readonly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-7">
                <div class="form-group" style="margin-right: 0.5rem">
                  <label
                    for="select_sites"
                    class="form-control-sm inwards_form_label"
                    >Click select sites to confirm your selection</label
                  >
                  <div
                    class="input-group form-control-sm"
                    style="margin-left: 4px; margin-right: 10px"
                  >
                    <div class="col-md-6">
                      <button
                        type="button"
                        class="btn inwards_button"
                        id="select_sites"
                        style="cursor: pointer"
                        role="button"
                        @click="selectSites"
                      >
                        Select Sites
                      </button>
                    </div>
                    <div class="col-md-6">
                      <button
                        type="button"
                        class="btn btn-warning"
                        data-dismiss="modal"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <StatusBar /> 
    <div class="container-fluid" style="height: 100%">  
      <div class="row no-gutters" style="height: 100%">
        <!--Left Panel--> 
        <div 
          class="col-md-4 no-float left-panel"  
          style="background: #252526; padding-left: 8px"
        >
          <div
            class="card rounded-0"
            style="margin-top: 5px; margin-bottom: 5px; width: 100%"
          >
            <div class="card-header inwards_card">   
              <h6 style="color: white"> 
                <i class="fa fa-bar-chart" style="padding-right: 10px"></i 
                >Parameters
              </h6>
            </div>
            <div class="card-body">
              <!--Scenario Name--> 
              <div class="row"> 
                <div class="col-md-12">
                  <p class="divider-text"> 
                    <span class="bg-light">Select saved scenario or save new scenario</span>
                  </p>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">

                        <UserScenarios ref="userScenarios" @select-changed="handleSelectChange"/>

                </div>
              </div>
              <br>
              <!--Select Data Source-->
              <div class="row">
                <div class="col-md-12">
                  <p class="divider-text">
                    <span class="bg-light">Data Source Selection</span>
                  </p>
                  <div class="funkyradio form-control-sm inwards_form_label">
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="iucmaData"
                        type="checkbox"
                        class="form-check-input form-check-input"
                        checked
                      />
                      <label for="iucmaData" class="form-check-label"
                        >IUCMA Data</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="dwsData"
                        type="checkbox"
                        class="form-check-input form-check-input"
                        disabled
                      />
                      <label for="dwsData" class="form-check-label"
                        >DWS Data</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="mergeData"
                        type="checkbox"
                        class="form-check-input form-check-input"
                        disabled
                      />
                      <label for="mergeData" class="form-check-label"
                        >Merge Datasets</label
                      >
                    </div>
                  </div>
                </div>
              </div>
              <!--Select Variable-->
              <div class="row">
                <div class="col-md-12">      
                <p class="divider-text">
                    <span class="bg-light">Select Variable</span>
                  </p>
                  </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div
                    class="form-group form-control-sm"
                    style="margin-right: 0.5rem"
                  >
                    <select
                      class="form-control form-control-sm rounded-0 inwards_label"
                      style="margin-left: 4px; margin-right: 10px"
                      name="variableSelect"
                      v-model="selectedVariable"
                      placeholder="Please Select Water Quality Variable"
                    >
                      <option value="" disabled selected hidden>
                        Select a variable
                      </option>
                      <option
                        class="dropdown-item"
                        v-for="variable in variables"
                        v-bind:key="variable.id"
                        v-bind:value="[
                          variable.mon_variable_abbr,
                          variable.measure_unit_abbr,
                          variable.id
                        ]"
                      >
                        {{ variable.mon_variable_name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                                <div class="col-md-12">
                <div class="form-group" style="margin-right: 0.5rem">
                  <div
                      class="input-group form-control-sm"
                      style="margin-left: 4px; margin-right: 10px"
                    >
                    <div class="btn-group-vertical" style="width:100%">
                        <button class="btn inwards_button btn-labeled text-left" style="width: 100%" @click="showModal" type="button"><span class="btn-label"><font-awesome-icon icon="fa-solid fa-map-marked-alt" style="color: rgb(255, 255, 255)"></font-awesome-icon></span>Select Observed Sites<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right; "></i></button>
                    </div>
                 </div>
                 </div> 
                </div>
                <div class="col-md-12">
                  <p class="divider-text"> 
                    <span class="bg-light">Up and Downstream WQ Sites</span>
                  </p>
                </div>
              </div>
              <div class="row no-gutters">
                <div class="col-md-6">
                  <!-- Upstream River Site Form Group -->
                  <div class="form-group" style="margin-right: 0.5rem">
                    <div
                      class="input-group form-control-sm"
                      style="margin-left: 4px; margin-right: 10px"
                    >
                      <div class="input-group-prepend">
                        <span
                          class="input-group-text rounded-0 inwards_search"
                          id="upstream-addon"
                          style="cursor: pointer"
                          role="button"
                          @click="showModal"
                        >
                          <font-awesome-icon
                            icon="fa-solid fa-map-marked-alt"
                          /><font-awesome-icon icon="fa-solid fa-arrow-up" />
                        </span>
                      </div>
                      <input
                        type="text"
                        class="form-control rounded-0 inwards_label"
                        id="upstreamSite"
                        aria-describedby="upstream-addon"
                        placeholder="U/S WQ Site (Opt)"
                        readonly
                      />
                    </div>
                  </div>
                  </div>
                  <div class="col-md-6">
                  <!-- Downstream River Site Form Group -->
                  <div class="form-group" style="margin-right: 0.5rem">
                    <div
                      class="input-group form-control-sm"
                      style="margin-left: 4px; margin-right: 10px"
                    >
                      <div class="input-group-prepend">
                        <span
                          class="input-group-text rounded-0 inwards_search"
                          id="downstream-addon"
                          style="cursor: pointer"
                          role="button"
                          @click="showModal"
                          ><font-awesome-icon
                            icon="fa-solid fa-map-marked-alt" /><font-awesome-icon
                            icon="fa-solid fa-arrow-down"
                        /></span>
                      </div>
                      <input
                        type="text"
                        class="form-control rounded-0 inwards_label"
                        id="downstreamSite"
                        aria-describedby="downstream-addon"
                        placeholder="D/S WQ Site (Req)"
                        readonly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <p class="divider-text"> 
                    <span class="bg-light">Up and Downstream Hydro Sites</span>
                  </p>
                </div>
              </div>              
              <div class="row no-gutters">
                <div class="col-md-6">
                  <!-- Upstream River Site Form Group -->
                  <div class="form-group" style="margin-right: 0.5rem">
                    <div
                      class="input-group form-control-sm"
                      style="margin-left: 4px; margin-right: 10px"
                    >
                      <div class="input-group-prepend">
                        <span
                          class="input-group-text rounded-0 inwards_search"
                          id="upstreamHydro-addon"
                          style="cursor: pointer"
                          role="button"
                          @click="showModal"
                        >
                          <font-awesome-icon
                            icon="fa-solid fa-map-marked-alt"
                          /><font-awesome-icon icon="fa-solid fa-arrow-up" />
                        </span>
                      </div>
                      <input
                        type="text"
                        class="form-control rounded-0 inwards_label"
                        id="upstreamHydroSite"
                        aria-describedby="upstreamHydro-addon"
                        placeholder="U/S WQ Site (Opt)"
                        readonly
                      />
                    </div>
                  </div>
                  </div>
                  <div class="col-md-6">
                  <!-- Downstream River Site Form Group -->
                  <div class="form-group" style="margin-right: 0.5rem">
                    <div
                      class="input-group form-control-sm"
                      style="margin-left: 4px; margin-right: 10px"
                    >
                      <div class="input-group-prepend">
                        <span
                          class="input-group-text rounded-0 inwards_search"
                          id="downstreamHydro-addon"
                          style="cursor: pointer"
                          role="button"
                          @click="showModal"
                          ><font-awesome-icon
                            icon="fa-solid fa-map-marked-alt" /><font-awesome-icon
                            icon="fa-solid fa-arrow-down"
                        /></span>
                      </div>
                      <input
                        type="text"
                        class="form-control rounded-0 inwards_label"
                        id="downstreamHydroSite"
                        aria-describedby="downstream-addon"
                        placeholder="D/S WQ Site (Req)"
                        readonly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!--Upstream Date Range-->
              <div class="row">
                <div class="col-md-12">
                  <p class="divider-text"> 
                    <span class="bg-light">Date Range</span>
                  </p>
                </div>
              </div>   
              <div class="row">
                <div class="col-sm-6" style="padding-right: 5px">
                  <div class="form-group form-control-sm">
                    <input
                      class="form-control form-control-sm rounded-0 inwards_label"
                      id="DateStart"
                      style="margin-left: 4px"
                      type="date"
                    />
                  </div>
                </div>
                <div class="col-sm-6" style="padding-left: 2px">
                  <div
                    class="form-group form-control-sm"
                    style="margin-right: 0.2rem"
                  >
                    <input
                      class="form-control form-control-sm rounded-0 inwards_label"
                      id="DateEnd"
                      style="margin-right: 0px"
                      type="date"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <p class="divider-text">
                    <span class="bg-light">WQ Scenario Inputs</span>
                  </p>
                </div>
              </div>
              <!--Enter Low Concentration -->
              <div class="row no-gutters">
                              <div class="col-md-12">
              <div class="form-group form-control-sm">
                <div class="input-group"> 
                                        <div class="input-group-prepend">
                        <span class="input-group-text rounded-0 inwards_search"
                          ><font-awesome-icon
                            icon="fa-solid fa-cube" 
                            style="color: rgb(255, 255, 254)"
                        /></span> 
                      </div> 
                  <select class="form-control form-control-sm rounded-0" id="concentrationUnitsDischarge">
                      <option value="m3/s-1">Select units of measurement</option>  
                      <option value="mg/L">mg/L</option>
                      <option value="µg/L">µg/L</option>
                      <option value="ng/L">ng/L</option>
                      <option value="pg/L">pg/L</option>
                    </select>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group form-control-sm">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text rounded-0 inwards_search"
                          ><font-awesome-icon
                            icon="fa-solid fa-vial"
                            style="color: lightgreen"
                        /></span>
                      </div>
                      <input
                        type="number"
                        step="any"
                        class="form-control form-control-sm rounded-0 inwards_label"
                        id="dischargeConcentrationLow"
                        placeholder="Low Concentration"
                        style="font-size:  small;"
                      />
                    </div>
                  </div>
                </div>
              
              <!--Enter High Concentration-->
              
                <div class="col-md-6">
                  <div class="form-group form-control-sm">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text rounded-0 inwards_search"
                          ><font-awesome-icon
                            icon="fa-solid fa-vial"
                            style="color: orange"
                        /></span>
                      </div>
                      <input
                        type="number"
                        step="any"
                        class="form-control form-control-sm rounded-0 inwards_label"
                        id="dischargeConcentrationHigh"
                        placeholder="High Concentration"
                        style="font-size:  small;"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <p class="divider-text">
                    <span class="bg-light">Effulent Discharge Scenario Inputs</span>
                  </p>
                </div>
              </div>
              <!--Enter discharge Volume -->
              <div class="row no-gutters">
                 
                <div class="col-md-12">

                  <div class="form-group form-control-sm">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text rounded-0 inwards_search"
                          ><font-awesome-icon  
                            icon="fa-solid fa-cube" 
                            style="color: rgb(255, 255, 254)" 
                        /></span>
                      </div>
                     <select class="form-control form-control-sm rounded-0" id="volumeUnitsDischarge">
                          <option value="none">Select units of measurement</option>    
                          <option value="cumecs">m3/s-1</option>
                          <option value="MCM/day">MCM/day</option>
                          <option value="ML/day">ML/day</option>
                          <option value="L/day">L/day</option> 
                          <option value="L/s">L/s</option>
                        </select>
                        </div> 
                        </div>
                        </div> 
                <div class="col-md-6">
                  <div class="form-group form-control-sm">
                    <div class="input-group">
                      <div class="input-group-prepend"> 
                        <span
                          class="input-group-text form-control-sm rounded-0 inwards_search"
                          ><font-awesome-icon
                            icon="fa-solid fa-faucet-drip"
                            style="color: rgb(118, 194, 31)"
                        /></span>
                      </div>
                      <input
                        type="number"
                        step="any"
                        class="form-control form-control-sm rounded-0 inwards_label" 
                        id="dischargeVolumeLow"
                        placeholder="Low Effluent"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group form-control-sm">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span
                          class="input-group-text form-control-sm rounded-0 inwards_search"
                          ><font-awesome-icon
                            icon="fa-solid fa-faucet-drip"
                            style="color: rgb(96, 134, 52)"
                        /></span>
                      </div>
                      <input
                        type="number"
                        step="any"
                        class="form-control form-control-sm rounded-0 inwards_label"
                        id="dischargeVolumeHigh"
                        placeholder="High Effluent"
                      /> 
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <p class="divider-text">
                    <span class="bg-light">Abstraction Scenario Inputs</span>
                  </p>
                </div>
              </div>
              <div class="row no-gutters">
              <div class="col-md-12">
              <div class="form-group form-control-sm">
                <div class="input-group">
                                        <div class="input-group-prepend">
                        <span class="input-group-text rounded-0 inwards_search"
                          ><font-awesome-icon
                            icon="fa-solid fa-cube"
                            style="color: rgb(255, 255, 254)"
                        /></span>
                      </div>
                  <select class="form-control form-control-sm rounded-0" id="volumeUnitsAbstraction">
                      <option value="none">Select units of measurement</option>  
                      <option value="cumecs">m3/s-1</option>
                      <option value="MCM/day">MCM/day</option>
                      <option value="ML/day">ML/day</option>
                      <option value="L/day">L/day</option>
                      <option value="L/s">L/s</option>
                    </select>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group form-control-sm">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span
                          class="input-group-text form-control-sm rounded-0 inwards_search"
                          ><font-awesome-icon
                            icon="fa-solid fa-arrow-up-from-ground-water"
                            style="color: rgb(104, 193, 223)"
                        /></span>
                      </div>
                      <input
                        type="number"
                        step="any"
                        class="form-control form-control-sm rounded-0 inwards_label"
                        id="dischargeAbstractLow"
                        placeholder="Low Abstraction"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group form-control-sm">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span
                          class="input-group-text form-control-sm rounded-0 inwards_search"
                          ><font-awesome-icon
                            icon="fa-solid fa-arrow-up-from-ground-water"
                            style="color: rgb(104, 193, 223)"
                        /></span>
                      </div>
                      <input
                        type="number"
                        step="any"
                        class="form-control form-control-sm rounded-0 inwards_label"
                        id="dischargeAbstractHigh"
                        placeholder="High Abstraction"
                      />
                    </div>
                  </div>
                </div>


              </div>
              <!--Limit Selection-->
              <div class="row" style="margin-bottom: 0.1rem">
                <div class="col-md-12">
                  <p class="divider-text">
                    <span class="bg-light">Limits and Standards</span>
                  </p>
                  <div class="funkyradio inwards_form_label">
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="rqoLimits"
                        type="checkbox"
                        checked="checked"
                        class="form-check-input"
                      />
                      <label for="rqoLimits" class="form-check-label"
                        >RQOs</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="sansLimits"
                        type="checkbox"
                        class="form-check-input"
                        disabled
                      />
                      <label for="sansLimits" class="form-check-label"
                        >SANS241</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="dwsDomestic"
                        type="checkbox"
                        class="form-check-input"
                        disabled
                      />
                      <label for="dwsDomestic" class="form-check-label"
                        >DWS Domestic</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="dwsIrrigation"
                        type="checkbox"
                        class="form-check-input"
                        disabled
                      />
                      <label for="dwsIrrigation" class="form-check-label"
                        >DWS Irrigation</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="dwsLivestock"
                        type="checkbox"
                        class="form-check-input"
                        disabled
                      />
                      <label for="dwsLivestock" class="form-check-label"
                        >DWS Livestock</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="dwsIndustry"
                        type="checkbox"
                        class="form-check-input"
                        disabled
                      />
                      <label for="dwsIndustry" class="form-check-label"
                        >DWS Industry</label
                      >
                    </div>
                    <div
                      class="form-check form-check-inline funkyradio-primary"
                    >
                      <input
                        name="chart_components"
                        id="dwsNWRQOs"
                        type="checkbox"
                        class="form-check-input"
                        checked="checked"
                      />
                      <label for="dwsNWRQOs" class="form-check-label"
                        >DWS NWRQOs</label
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
              <div class="row no-gutters">
                <div class="btn-group-vertical" style="width:100%; margin-bottom: 5%;">
                <button class="btn inwards_button btn-labeled text-left" style="width: 100%" @click="doAnalysis()" type="button"><span class="btn-label"><font-awesome-icon icon="fa-solid fa-calculator" style="color: rgb(255, 255, 255)"></font-awesome-icon></span>Run Scenario<i class="fa fa-chevron-right vertical-center" style="padding-left: 10px; float : right; "></i></button>
            </div>
          </div>
        </div>
        <!--Right Panel-->
        <div
          class="col-md-8 no-float right-panel"
          style="
            background: #1e1e1e;
            padding-bottom: 50px;
            padding-left: 10px;
            padding-right: 10px;
          "
        >
          <div class="row no-gutters">
            <div class="col-md-6">
              <AllocatableLoad ref="allocatableComponent" style="margin-top: 5px;"/>
            </div>
            <div class="col-md-6" style="padding-left: 2px;">
              <BoxChart ref="boxComponent" style="margin-top: 5px;"/>
            </div>
            <div class="col-md-6">
              <DurationCurve ref="durationComponent" style="margin-top: 5px;"/>
            </div>
            <div class="col-md-6" style="padding-left: 2px; margin-top: 5px;">
                <Station ref="stationComponent"/>
            </div>
          </div>

          </div>
          <br />

          <grid-loader
            :loading="loading"
            :color="color"
            :size="size"
            class="loading_disks"
          ></grid-loader>

          <NavButtons />
        </div>
      </div>
    </div>
</template>
<style>
.chartDivId.c3-line-[Reserve] {
  stroke-width: 5px;
}
.right-panel {
  overflow-y: scroll;
}
.left-panel {
  overflow-y: scroll;
}
.c3-line-Reserve {
  stroke-width: 2px;
}
.c3-line-Observed {
  stroke-width: 2px;
}
.c3-line-Last_Year {
  stroke-width: 2px;
  stroke-dasharray: 5.5;
}
.c3-circle-Events {
  stroke-width: 15px;
  stroke: rgb(0, 0, 0);
}
.modal .map-container {
  height: 400px; /* Set an appropriate height */
  width: 100%; /* Set an appropriate width */
}
.dragging {
  opacity: 0.8;
  cursor: move;
}
.jstree-default a {
  white-space: normal !important;
  height: auto;
}
.left-container {
  overflow-x: hidden;
}

.jstree-anchor {
  white-space: break-spaces !important;
  height: auto !important;
}
.jstree-default li > ins {
  vertical-align: top;
}
.jstree-leaf { 
  height: auto;
}
.jstree-leaf a {
  height: auto !important;
}
.no_checkbox>i.jstree-checkbox
{
    display:none
}
/* Position the legend as an overlay on the map */
.legend {
  position: absolute;
  top: 80%;
  right: 60%;
  background-color: rgba(255, 255, 255, 0.452);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.mapLegend {
  position: absolute;
  top: 80%;
  right: 10%;
  background-color: rgba(255, 255, 255, 0.637);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
/* Add some styling to the legend text */
.legend p {
  margin: 5px;
}
.legend icon {
  margin-right: 5px;
}

.rqo-site {
  color: #190193;
}

.water-quality-site {
  color: #938701;
}

.flow-monitoring-site {
  color: #0000ff; /* Blue color for water icon */
}
</style>
<script>
import axios from 'axios'
import NavButtons from '../../components/NavButtons'
import UserScenarios from './UserScenarios'
import MapDashboard from './MapDashboard'
import StationTree from './StationTree'
import BoxChart from './BoxChart'
import TimeseriesChart from './TimeseriesChart'
import DurationChart from './DurationChart'
import LoadChart from './LoadChart'
import EcoliCompliance from './EcoliCompliance'
import EcCompliance from './EcCompliance'
import PhosCompliance from './PhosCompliance'
import ArseCompliance from './ArseCompliance'
import CnCompliance from './CnCompliance'
import StatusBar from '../StatusBar'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import AllocatableLoad from './AllocatableLoad'
import GeoJSON from 'ol/format/GeoJSON'
import { Fill, Stroke, Style } from 'ol/style'
import { GridLoader } from 'vue-spinner/dist/vue-spinner.min.js'
import $ from 'jquery'
import 'jquery-ui/ui/widgets/resizable.js' // Import the jQuery UI resizable component
import 'jquery-ui/ui/widgets/draggable.js' // Import the jQuery UI draggable component
import 'jquery-ui/themes/base/all.css' // Import the jQuery UI CSS styles
import stateStore from '../../store/state_handler'
// Import the event bus composable for automatic cleanup
import { useEventBus } from '../../composables/useEventBus'
require('promise.prototype.finally').shim()
// Import bootstrap4-toggle CSS
// Import jQuery and popper.js (required by bootstrap4-toggle)
//import 'jquery'
//import 'popper.js'
//Import bootstrap4-toggle (should be imported after jQuery and popper.js)
//import 'bootstrap4-toggle/css/bootstrap4-toggle.min.css'
//import 'bootstrap4-toggle/js/bootstrap4-toggle.min.js'
import WmaJson from '../../assets/inkomati_usuthu_wma.json'
const { dialog } = require('electron').remote

export default {
  name: 'LoadDashboard',

  components: {
    NavButtons,
    UserScenarios,
    MapDashboard,
    GridLoader,
    StationTree,
    BoxChart,
    TimeseriesChart,
    DurationChart,
    LoadChart,
    AllocatableLoad,
    StatusBar,
    EcoliCompliance,
    PhosCompliance,
    EcCompliance,
    CnCompliance,
    ArseCompliance,
  },

  setup() {
    // Use the event bus composable - listeners will be auto-cleaned on unmount
    const { on, emit } = useEventBus()
    return { busOn: on, busEmit: emit }
  },

  data() {
    return {
      stationsApi:
      'https://inwards.award.org.za/app_json/load_dash/stations/fetch_sites.php',
      boxplotApi: 'https://inwards.award.org.za/app_json/wq_boxplot.php',
      stationsCoordinates: {}, // To stored all stations with their coordinates
      stationsFeatures: {}, // To stored station features
      stationsRequest: null,
      selectedLoadStations: [],
      selectedWMAs: [],
      mergeAPI: 'false',
      selectedType: 'river',
      types: [],
      selectedVariable: '',
      selectedScenario: '',
      variableUnit: '',
      variables: [],
      scenarios: [],
      variableSample: 'All',
      typeSelect: 'river',
      variableSelect: '',
      scenarioSelect: '',
      upstreamSite: '',
      upstreamHydroSite: '',
      downstreamSite: '',
      downstreamHydroSite: '',
      dischargeAbstract: '',
      dischargeVolume: '',
      volumeUnits: '',
      dischargeConcentrationLow: '',
      dischargeConcentrationHigh: '',
      rqoLimits: '',
      stationsList: 'all',
      stationAttributes: {},
      color: '#177a98',
      height: '35px',
      width: '4px',
      margin: '2px',
      size: '40px',
      loading: false,
      radius: '2px',
      isModalVisible: false,
      counterMap: false,
      catchmentTreeWidth: 100, // Initial width for the catchment tree column
      showMap: false,
      selectedCounter: 0,
      userCode: '',
      showUserScenarios: false
    }
  },
  computed: {
    mapDashboardRef() {
      return this.$refs.mapDashboard
    },
    stationTreeRef() {
      return this.$refs.stationTree
    }
  },

  created() {
    stateStore.getState(
      stateStore.keys.loginStatus, (status) => {
        this.userCode = status['uniqueCode'];
      }
    );
  },
  beforeMount() {
    this.loadVariables()
    //this.loadTypes()
  },
  mounted() {
    let self = this
    const catchmentTreeColumn = this.$refs.catchmentTreeColumn
    stateStore.clearSelectedLoadStations()
    // Initialize resizable functionality using jQuery UI Resizable
    $(catchmentTreeColumn).resizable({
      handles: 'e',
      minWidth: 200, // Minimum width for the column
      stop: (event, ui) => {
        this.catchmentTreeWidth = ui.size.width
      },
    })

    // Initialize draggable functionality using jQuery UI Draggable
    $(catchmentTreeColumn).draggable({
      handle: '.modal-header', // Set the handle for dragging
      containment: 'parent', // Restrict dragging within the parent element
      start: () => {
        $(catchmentTreeColumn).addClass('dragging')
      },
      stop: () => {
        $(catchmentTreeColumn).removeClass('dragging')
      },
    })
    $('#upstreamModal').on('shown.bs.modal', () => {
      if (this.counterMap === false) {
        self.mapDashboardRef.initiateMap()
        let wmaNames = ['inkomati_usuthu']
        self.mapDashboardRef.showSelectedWMA(wmaNames)
        // Use busOn for automatic cleanup on unmount
        self.busOn(
          'stationSelectedFromMap',
          (payload) => {
            // Mitt only passes one argument
            const { station, selected } = payload
            self.stationTreeRef.toggleNode(station, selected)
            console.log(station)
            console.log(selected)
          }
        )
        self.busOn('addStationsToStore', (payload) => {
          // Mitt only passes one argument
          const { stations, chartStoredId } = payload
          self.addStationsToStore(stations, chartStoredId)
        })
        let map = this.$refs.mapDashboard.map
        self.addKnpLayer(map)
        //console.log(this.selectedVariable);
        this.variableSample = this.selectedVariable[0]
        // Set tree to loading state and fetch stations
        this.stationTreeRef.setLoading(true)
        this.fetchStations()
        this.counterMap = true
      }
      // Map initialization code here
    })
    /* 
      $('#customRange3').on('input', function(){
              let v = $('#customRange3').val();
              //console.log(v);
              $('div.minSamples').text(v);
       });  */
  },
  methods: {
    handleSelectChange(selectedItem) {
            // Call the populateData function when the event is received
      this.populateData();
    },
    toggleUserScenarios() {
      this.showUserScenarios = !this.showUserScenarios;
    },
    startDragging() {
      $(this.$refs.catchmentTreeColumn).css('z-index', 1000)
    },
    updateScenario(data) {
      // Construct the URL with parameters
      let url = new URL("https://inwards.award.org.za/app_json/load_dash/user_data/update_scenario.php");

      // Append parameters to the URL
      Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));

      // Make the GET request
      fetch(url)
      .then(response => response.text())
      .then(result => {
          console.log("Success:", result);
      })
      .catch(error => {
          console.error("Error:", error);
      });
    },

    doAnalysis() {     
      console.log(this.$refs.userScenarios.selectedScenario)
      let dataToUpdate = {
        id: this.$refs.userScenarios.selectedId, 
        user_code: this.$refs.userScenarios.userCode, 
        //label: this.$refs.userScenarios.selectedScenario,
        variable_selected: this.selectedVariable[0],
        measure_unit_abbr: this.selectedVariable[1],
        variable_id: this.selectedVariable[2],
		    iucma_data: document.getElementById('iucmaData').checked,
        dws_data: document.getElementById('dwsData').checked,
        merge_data: document.getElementById('mergeData').checked,
        upstream_wq: document.getElementById('upstreamSite').value,
        downstream_wq: document.getElementById('downstreamSite').value,
        upstream_q: document.getElementById('upstreamHydroSite').value,
        downstream_q: document.getElementById('downstreamHydroSite').value,
        start_date: document.getElementById('DateStart').value,
        end_date: document.getElementById('DateEnd').value,
        concentration_units_discharge: document.getElementById('concentrationUnitsDischarge').value,
        volume_units_abstraction: document.getElementById('volumeUnitsAbstraction').value,
        volume_units_discharge: document.getElementById('volumeUnitsDischarge').value,
        discharge_concentration_low: document.getElementById('dischargeConcentrationLow').value,
        discharge_concentration_high: document.getElementById('dischargeConcentrationHigh').value,
        discharge_volume_low: document.getElementById('dischargeVolumeLow').value,
        discharge_volume_high: document.getElementById('dischargeVolumeHigh').value,
        discharge_abstract_low: document.getElementById('dischargeAbstractLow').value,
        discharge_abstract_high: document.getElementById('dischargeAbstractHigh').value,
        rqo_limits: document.getElementById('rqoLimits').checked,
        sans_limits: document.getElementById('sansLimits').checked,
        dws_domestic: document.getElementById('dwsDomestic').checked,
        dws_irrigation: document.getElementById('dwsIrrigation').checked,
        dws_livestock: document.getElementById('dwsLivestock').checked,
        dws_industry: document.getElementById('dwsIndustry').checked,
        dws_nwrqos: document.getElementById('dwsNWRQOs').checked,
     };

     this.updateScenario(dataToUpdate);

/*       if (this.selectedLoadStations.length === 0) {
        dialog.showMessageBox(null, {
          type: 'warning',
          message: 'Please select at least a downstream station',
          buttons: ['OK'], 
        })
        return
      }
      let mergeDWS = document.getElementById('mergeData').checked

      if (mergeDWS === true) {
        this.mergeAPI = 'true' 
      } */
      this.loading = true;
      this.$refs.allocatableComponent.displayLoad(
        'Allocatable Load',
        this.$refs.userScenarios.userCode,
        this.$refs.userScenarios.selectedId
      ); 
      this.loading = false;
/*       this.$refs.boxComponent.displayChart(
        this.selectedLoadStations,
        this.selectedVariable[0],
        this.formatDate(dateStart),
        this.formatDate(dateEnd),
        this.selectedVariable[1]
      )
      this.$refs.timeseriesComponent.displayChart(
        this.selectedLoadStations,
        this.selectedVariable[0],
        this.formatDate(dateStart),
        this.formatDate(dateEnd),
        this.selectedVariable[1],
        this.mergeAPI
      )
      this.$refs.durationComponent.displayChart(
        this.selectedLoadStations,
        this.selectedVariable[0],
        this.formatDate(dateStart),
        this.formatDate(dateEnd),
        this.selectedVariable[1]
      )
      this.$refs.loadComponent.displayChart(
        this.selectedLoadStations,
        this.selectedVariable[0],
        this.formatDate(dateStart),
        this.formatDate(dateEnd),
        this.selectedVariable[1]
      ) */

      //this.loading = false
    },
    populateData() {
        fetch('https://inwards.award.org.za/app_json/load_dash/user_data/populate_scenario.php?id=' + this.$refs.userScenarios.selectedId)
        .then(response => response.json())
        .then(data => {
          this.$refs.userScenarios.selectedScenario = data.label;
          const stringVariableId = data.variable_id.toString();            
            const variableToSelect = this.variables.find(v => v.mon_variable_id === stringVariableId);
            if (variableToSelect) {
                this.selectedVariable = [
                    variableToSelect.mon_variable_abbr,
                    variableToSelect.measure_unit_abbr,
                    variableToSelect.id
                ];
            }
            document.getElementById('iucmaData').checked = data.iucma_data;
            document.getElementById('dwsData').checked = data.dws_data;
            document.getElementById('mergeData').checked = data.merge_data;
            document.getElementById('upstreamSite').value = data.upstream_wq;
            document.getElementById('downstreamSite').value = data.downstream_wq;
            document.getElementById('upstreamHydroSite').value = data.upstream_q;
            document.getElementById('downstreamHydroSite').value = data.downstream_q;
            document.getElementById('DateStart').value = data.start_date;
            document.getElementById('DateEnd').value = data.end_date;
            const stringconcentrationUnitsDischarge = data.concentration_units_discharge.toString();            
            const stringvolumeUnitsAbstraction = data.volume_units_abstraction.toString();            
            const stringvolumeUnitsDischarge = data.volume_units_discharge.toString();            
            document.getElementById('concentrationUnitsDischarge').value = stringconcentrationUnitsDischarge;
            document.getElementById('volumeUnitsAbstraction').value = stringvolumeUnitsAbstraction;
            document.getElementById('volumeUnitsDischarge').value = stringvolumeUnitsDischarge;
            document.getElementById('dischargeConcentrationLow').value = data.discharge_concentration_low;
            document.getElementById('dischargeConcentrationHigh').value = data.discharge_concentration_high;
            document.getElementById('dischargeVolumeLow').value = data.discharge_volume_low;
            document.getElementById('dischargeVolumeHigh').value = data.discharge_volume_high;
            document.getElementById('dischargeAbstractLow').value = data.discharge_abstract_low;
            document.getElementById('dischargeAbstractHigh').value = data.discharge_abstract_high;
            document.getElementById('rqoLimits').checked = data.rqo_limits;
            document.getElementById('sansLimits').checked = data.sans_limits;
            document.getElementById('dwsDomestic').checked = data.dws_domestic;
            document.getElementById('dwsIrrigation').checked = data.dws_irrigation;
            document.getElementById('dwsLivestock').checked = data.dws_livestock;
            document.getElementById('dwsIndustry').checked = data.dws_industry;
            document.getElementById('dwsNWRQOs').checked = data.dws_nwrqos;
        });
    },
    sendPostRequest() {
      this.typeSelect = 'river' 
      this.label = this.label
      this.variableSelect = this.selectedVariable
      this.upstreamSite = this.selectedLoadSites[0]
      this.upstreamHydroSite = this.selectedHydroSites[0]
      this.downstreamSite = this.selectedLoadSites[1]
      this.downstreamHydroSite = this.selectedHydroSites[1]
      this.dischargeAbstract = document.getElementById('dischargeAbstract').value
      this.dischargeVolume = document.getElementById('dischargeVolume').value
      this.volumeUnits = document.getElementById('volumeUnits').value
      this.dischargeConcentration = document.getElementById('dischargeConcentration').value
      this.dischargeConcentrationHigh = document.getElementById('dischargeConcentrationHigh').value
      this.rqoLimits = document.getElementById('rqoLimits').value
      this.startDate = document.getElementById('startDate').value
      this.endDate = document.getElementById('endDate').value
      const url = 'https://inwards.award.org.za/app_json/load_dash/user_data/scenario_insert.php';
      const data = {
        user_id: 1,
        label: label,
        variable_selected: variableSelect, 
        upstream_wq: upstreamSite,
        downstream_wq: downstreamSite,
        upstream_q: upstreamHydroSite,
        downstream_q: downstreamHydroSite,
        start_date: startDate,
        end_date: endDate,
        discharge_abstract: dischargeAbstract,
        discharge_volume: dischargeVolume,
        volume_units: volumeUnits, 
        discharge_conc_low: dischargeConcentration,
        discharge_conc_high: dischargeConcentrationHigh 
      };

      fetch(url, { 
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => response.text())
      .then(data => {
          this.serverResponse = data;
      })
      .catch(error => { 
          console.error('Error:', error);
          this.serverResponse = 'Error occurred. See console for details.';
      });
    },
    detectType() {
      // Set tree to loading state and fetch new stations
      this.stationTreeRef.setLoading(true)
      //console.log(this.selectedType);
      this.fetchStations()
    },
    loadTypes() {
      axios
        .get('http://inwards.award.org.za/app_json/iucma_gauge_types.php') 
        .then((response) => {
          this.types = response.data
        })
        .catch((e) => {})
    },
    loadVariables() { 
      axios
        .get('http://inwards.award.org.za/app_json/variables.php')
        .then((response) => {
          this.variables = response.data
        })
        .catch((e) => {})
    },
    selectSites() {
      let upstream = document.getElementById('SelectedUpstreamSite').value
      let downstream = document.getElementById('SelectedDownstreamSite').value
      document.getElementById('upstreamSite').value = upstream
      document.getElementById('downstreamSite').value = downstream
      let upstreamHydro = document.getElementById('SelectedUpstreamHydro').value
      let downstreamHydro = document.getElementById('SelectedDownstreamHydro').value
      document.getElementById('upstreamHydroSite').value = upstreamHydro
      document.getElementById('downstreamHydroSite').value = downstreamHydro

      if (upstream === '') {
        upstream = downstream;
      }


      let upstream_start = this.stationAttributes[upstream]['start_date']
      let upstream_end = this.stationAttributes[upstream]['end_date']

      document.getElementById('DateStart').value =
        this.formatDate(upstream_start)
      document.getElementById('DateEnd').value =
        this.formatDate(upstream_end)

      $('#upstreamModal').modal('hide')

      //this.fetchStations();
    },
    changeVariable() {
      //this.fetchStations();
    },
    showModal() {
      if (this.selectedVariable === '') {
        dialog.showMessageBox(null, {
          type: 'warning',
          message:
            'Please select a variable before selecting your sites',
          buttons: ['OK'],
        })
        return
      } else {
        let self = this
        let selectModal = $('#upstreamModal')
        selectModal.modal({
          keyboard: true,
        })
      }
    },
    fetchStations() {
      let self = this
      let wmaNames = ['inkomati_usuthu']
      this.selectedType = 'rivers'
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
      let url = `${self.stationsApi}?wma=${wmaNames.join()}&type=${
        this.selectedType
      }&list=${this.stationsList}&variable=${this.variableSample}`
      console.log(url)
      //console.log(stationFile);
      // Check if online
      let cancelToken = null
      if (self.stationsRequest) {
        cancelToken = self.stationsRequest.token
      }
      axios
        .get(url, { cancelToken: cancelToken })
        .then((response) => {
          self.mapDashboardRef.loadStationsToMap(response.data)
          self.createTreeStructure(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    addStationsToStore(stations, chartStoredId) {
      let self = this
      stateStore.getState(
        stateStore.keys.selectedLoadStations,
        function (selectedLoadStations) {
          if (
            !selectedLoadStations ||
            typeof selectedLoadStations === 'undefined'
          ) {
            selectedLoadStations = {}
          }
          for (let i = 0; i < stations.length; i++) {
            if (!selectedLoadStations[stations[i]]) {
              selectedLoadStations[stations[i]] = {
                feature: self.stationsFeatures[stations[i]],
                stationCoord: self.stationsCoordinates[stations[i]],
                chartStored: [chartStoredId],
              }
            } else {
              if (
                selectedLoadStations[stations[i]]['chartStored'].indexOf(
                  chartStoredId
                ) < 0
              ) {
                selectedLoadStations[stations[i]]['chartStored'].push(
                  chartStoredId
                )
              }
            }
          }
          stateStore.setState(
            stateStore.keys.selectedLoadStations,
            selectedLoadStations
          )
        }
      )
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
        updateWhileInteracting: false,
      })
      // map.addLayer(knpLayer);
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
    createTreeStructure(stationsData) {
      let self = this
      // Start adding stations data to catchment
      let catchmentsData = self.mapDashboardRef.getCatchmentsData()
      console.log(catchmentsData)
      for (let i = 0; i < stationsData.features.length; i++) {
        // let primary = stationsData.features[i]['properties']['primary'];
        let secondary = stationsData.features[i]['properties']['secondary']
        let tertiary = stationsData.features[i]['properties']['tertiary']
        let quaternary = stationsData.features[i]['properties']['quaternary']
        let station = stationsData.features[i]['properties']['station']
        let place = stationsData.features[i]['properties']['desc']
        let sampleSize =
          stationsData.features[i]['properties']['sample_size_iucma']
        let latestReading = stationsData.features[i]['properties']['latest']
        let startDate = stationsData.features[i]['properties']['start']
        let hydro = stationsData.features[i]['properties']['hydro']
        let rqo = stationsData.features[i]['properties']['ewr_site']
        let iucma = stationsData.features[i]['properties']['iucma']
        this.stationsFeatures[station] = stationsData.features[i]
        this.stationsCoordinates[station] =
          stationsData.features[i].geometry.coordinates
        if (!this.stationAttributes[station]) {
          this.stationAttributes[station] = {}
        }
        this.stationAttributes[station]['start_date'] = startDate
        this.stationAttributes[station]['end_date'] = latestReading
        let flow = 'N'
        if (hydro > 0) {
          flow = 'Y'
        }
        if (catchmentsData.hasOwnProperty(secondary)) {
          let stationName = ''
          if (latestReading != null) {
            if (quaternary.length === 4) {
              stationName =
                station +
                ': ' +
                '(' +
                iucma +
                ') ' +
                '' +
                rqo +
                '<br>     ---' +
                place +
                '<br>' +
                '     ---' +
                sampleSize +
                ' samples latest: ' +
                latestReading.toString().slice(0, 10)
              catchmentsData[secondary][tertiary][quaternary].push(stationName)
              catchmentsData[secondary][tertiary][quaternary].sort()
            }
          } else {
            stationName = 'Problem with Station' 
          }
        }
      }
      //console.log(catchmentsData);
      let treeData = self.generateTreeStations(catchmentsData)
      this.stationTreeRef.createStationTree(
        treeData,
        this.onStationTreeSelectedHandler,
        this.onTreeReady
      )
      console.log(this.stationAttributes)
    },
    onTreeReady(event, data) {
      const self = this
      stateStore.getState(
        stateStore.keys.selectedLoadSites,
        function (selectedLoadSites) {
          if (!selectedLoadSites) {
            return false
          }
          self.stationTreeRef.toggleMultipleNodes(selectedLoadSites, true)
        }
      )
    },
    generateTreeStations(dictionary) {
      let treeData = [] 

      // Loop through the secondary catchments (top-level keys in the dictionary)
      Object.keys(dictionary).forEach(function (secondaryCatchmentKey) {
        let secondaryCatchmentNode = {
          text: secondaryCatchmentKey,
          id: secondaryCatchmentKey,
          type: 'layer',
          selectable: false, // Secondary catchment nodes are not selectable
          children: [],
          a_attr: { class: "no_checkbox" }
        }

        let tertiaryCatchments = dictionary[secondaryCatchmentKey]

        // Loop through the tertiary catchments (keys in the nested object)
        Object.keys(tertiaryCatchments).forEach(function (
          tertiaryCatchmentKey
        ) { 
          let tertiaryCatchmentNode = { 
            text: tertiaryCatchmentKey, 
            id: secondaryCatchmentKey + '-' + tertiaryCatchmentKey, 
            type: 'layer', 
            selectable: false, // Tertiary catchment nodes are not selectable
            children: [],
            a_attr: { class: "no_checkbox" }
          }

          let quaternaryCatchments = tertiaryCatchments[tertiaryCatchmentKey]

          // Loop through the quaternary catchments (keys in the nested object)
          Object.keys(quaternaryCatchments).forEach(function (
            quaternaryCatchmentKey
          ) {
            let features = quaternaryCatchments[quaternaryCatchmentKey]

            let quaternaryCatchmentNode = {
              text: quaternaryCatchmentKey,
              id: 
                secondaryCatchmentKey +
                '-' +
                tertiaryCatchmentKey + 
                '-' + 
                quaternaryCatchmentKey,
              type: 'layer',
              selectable: false, // Quaternary catchment nodes are not selectable
              children: [],
              a_attr: { class: "no_checkbox" }
            }

            // Loop through the features (stations) in the quaternary catchment
            for (let i = 0; i < features.length; i++) {
              let feature = features[i]
              let featureType = feature.split(':')[0]
              let featureNode = {}
              // Create a tree node for the station (feature)

              if (featureType[2] === 'H' || featureType[2] === 'R') {
                featureNode = {
                  text: feature,
                  id: feature,
                  type: 'hydroStation',
                  selectable: true, // Features (stations) are selectable
                }
              } else {
                if (!feature.includes('RQO')) {
                  featureNode = {
                    text: feature,
                    id: feature,
                    type: 'station',
                    selectable: true, // Features (stations) are selectable
                  }
                } else {
                  featureNode = {
                    text: feature,
                    id: feature, 
                    type: 'rqoStation',
                    selectable: true, // Features (stations) are selectable
                  }
                }
              }
              // Add the feature node to the quaternary catchment node's children
              quaternaryCatchmentNode.children.push(featureNode)
            }

            // Add the quaternary catchment node to the tertiary catchment node's children
            tertiaryCatchmentNode.children.push(quaternaryCatchmentNode)
          })

          // Add the tertiary catchment node to the secondary catchment node's children
          secondaryCatchmentNode.children.push(tertiaryCatchmentNode)
        })

        // Add the secondary catchment node to the tree data
        treeData.push(secondaryCatchmentNode)
      })

      return treeData
    },
    fillSelectedLoadStationsWithNulls(arr) {
        const MAX_LENGTH = 4;
        while (arr.length < MAX_LENGTH) {
            arr.push(null);
        }
        return arr;
    },
    onStationTreeSelectedHandler: async function (event, data) {
    let selected = '';
    let selectedLoadSites = [];
    let _selectedLoadStations = this.fillSelectedLoadStationsWithNulls(Object.assign([], this.selectedLoadStations));
    let _unselectedLoadStations = Object.assign([], this.selectedLoadStations);

    let self = this;
    self.mapDashboardRef = self.$refs.mapDashboard;
    self.stationTreeRef = self.$refs.stationTree;

    // Get the latest selected node
    const latestSelectedNode = data.selected[data.selected.length - 1];
    selected = data.instance.get_node(latestSelectedNode).text;
    let selectedBits = selected.split(':');
    let type = data.instance.get_node(latestSelectedNode).type;

    if (type === 'layer') {
        selectedLoadSites.push(selectedBits[0]);
        console.log('This is a layer: ' + selectedBits[0]);
    } else if (
        type === 'station' ||
        type === 'rqoStation' ||
        type === 'hydroStation'
    ) {
        console.log(_selectedLoadStations);

        async function showDialogAndProcessResponse() {
                  try {
                      let hydroSite = false
                      let options = {
                          type: 'question',
                          buttons: ['Set Upstream WQ Site', 'Set Downstream WQ Site', 'Cancel'],
                          defaultId: 2,
                          message: 'Select an option:',
                      }

                      if (selectedBits[0].includes('H')) {
                          hydroSite = true
                          options = {
                              type: 'question',
                              buttons: ['Set Upstream Hydro Site', 'Set Downstream Hydro Site', 'Cancel'],
                              defaultId: 2,
                              message: 'Select an option:',
                          }
                      }

                      const response = await dialog.showMessageBox(null, options)
                      const buttonIndex = response.response

                      if (buttonIndex === 0 && !hydroSite) {
                          _handleSiteSelection(0, 'SelectedUpstreamSite')
                      } else if (buttonIndex === 1 && !hydroSite) {
                          _handleSiteSelection(1, 'SelectedDownstreamSite')
                      } else if (buttonIndex === 0 && hydroSite) {
                          _handleSiteSelection(2, 'SelectedUpstreamHydro')
                      } else if (buttonIndex === 1 && hydroSite) {
                          _handleSiteSelection(3, 'SelectedDownstreamHydro')
                      } else if (buttonIndex === 2) {
                          // Handle 'Cancel' button action here
                      }

                  } catch (error) {
                      console.error('An error occurred:', error)
                  }
              }

              // This function handles the selection logic, reducing code redundancy
              function _handleSiteSelection(index, elementId) {
                  if (_selectedLoadStations[index]) {
                      _unselectedLoadStations.push(_selectedLoadStations[index])
                      self.stationTreeRef.toggleNode(
                          _selectedLoadStations[index],
                          false
                      )
                  }
                  _selectedLoadStations[index] = selectedBits[0]
                  if (_unselectedLoadStations.indexOf(selectedBits[0]) !== -1) {
                      _unselectedLoadStations.splice(
                          _unselectedLoadStations.indexOf(selectedBits[0]),
                          1
                      )
                  }
                  document.getElementById(elementId).value = selectedBits[0]
              }

              // Call the async function
              await showDialogAndProcessResponse()
          }  
 
      this.mapDashboardRef.toggleselectedLoadStationsByStationNames(
          _selectedLoadStations,
          _unselectedLoadStations 
      )

      this.selectedLoadStations = _selectedLoadStations
      stateStore.setState(
          stateStore.keys.selectedLoadSites,
          this.selectedLoadStations
      )
      this.mapDashboardRef.selectCatchments(selectedLoadSites)
    },
    hideModal() {
      this.isModalVisible = false
    },
    onModalShow() {},
  },
}
</script>