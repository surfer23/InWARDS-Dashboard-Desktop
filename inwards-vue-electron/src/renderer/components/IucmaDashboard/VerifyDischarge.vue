<template>
    <div class="modal rounded-0 fade modal_center" tabindex="-1" id="verification-modal">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">
                <div class="text-center">
                    Discharge Verification
            <img class="rounded float-right" src="../../assets/iucma.png" style="width: 10%;"/>
        </div>
            </div>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
        </div>
          <div class="modal-body">

            <div class="row">
               <div class="col-md-6">
                  <p class="divider-text"> 
                    <span class="bg-light">Calibration Type</span>
                  </p>
                    <div class="funkyradio" style="width: 100%;">
                    <div class="form-check form-check-inline funkyradio-primary" style="width: 100%;">
                        <input
                        name="chart_components"
                        id="virtual"
                        type="checkbox"
                        :checked="selected === 'virtual'"
                        @click="toggle('virtual')"
                        class="form-check-input"
                        />
                        <label for="virtual" class="form-check-label" style="width: 100%;">Virtual calibration</label>
                    </div>
                    <div class="form-check form-check-inline funkyradio-primary" style="width: 100%;">
                        <input
                        name="chart_components"
                        id="calibration"
                        type="checkbox"
                        :checked="selected === 'calibration'"
                        @click="toggle('calibration')"
                        class="form-check-input"
                        />
                        <label for="calibration" class="form-check-label" style="width: 100%;">Station Level calibration</label>
                    </div>
                </div>
                </div>
                <div class="col-md-6">                            
                  <p class="divider-text"> 
                    <span class="bg-light">Date of observation/calibration</span>
                  </p>
                  <div class="form-group">
                      <input
                          type="datetime-local"
                          name="to"
                          :value="currentDateTimeInput"
                          @input="updateDateTimeInput($event)"
                          class="form-control form-control-sm rounded-0 inwards_label"
                          id="dateObserved"
                      />
                  </div>
                  <p class="divider-text"> 
                    <span class="bg-light">Or Select Plate Sub-mission</span>
                  </p>
                <div class="form-group">
                    <PlateList ref="plateComponent" />
                </div>  
                </div>
            <div class="col-md-6">
                  <p class="divider-text"> 
                    <span class="bg-light">Select station</span>
                  </p>
                <div class="form-group">
                    <multiselect :options="stations" v-model="selectedStations" :multiple="false" :max-height="300"></multiselect>
                </div>       
        </div>
        <div class="col-md-6">
                  <p class="divider-text"> 
                    <span class="bg-light">Select observed/captured stage height <b>(m)</b></span>
                  </p>
                <div class="form-group">
                    <multiselect :options="gaugeHeights" v-model="selectedGaugeHeight" :multiple="false" @input="fetchDischarge()" :max-height="300" :disabled="!selectedStations"></multiselect>
                </div>
        </div>
            <div class="col-sm-12">
             <div class="row">
             <div class="col-sm-4">
                <p class="divider-text"> 
                    <span class="bg-light">Observed/calibrated Stage (m)</span>
                  </p>
                <div class="form-group">
                    <input 
                    id="observedStage" 
                    type="number" 
                    class="form-control form-control-sm rounded-0 inwards_label"
                    :disabled="isDisabled"
                    v-model="observedStageValue"
                    >
                </div>
              </div>
              <div class="col-sm-4">
                <p class="divider-text"> 
                    <span class="bg-light">Stage according to probe (m)</span>
                  </p>
               <div class="form-group">
                 <input 
                    id="databaseStage" 
                    type="number" 
                    class="form-control form-control-sm rounded-0 inwards_label"
                    :disabled="isDisabled"
                    v-model="stageProbeValue"
                    >
                </div>
              </div>
              <div class="col-sm-4">
                <p class="divider-text"> 
                <span class="bg-light">Stage variation (%)</span>
                </p>
                <div v-if="showPopover" class="popover">
                  <span @click.stop="togglePopover" style="font-size: 11px;" v-katex="'\\text{stageVariation} = \\left( \\frac{\\text{observedStageValue} - \\text{stageProbeValue}}{\\text{observedStageValue}} \\right) \\times 100'"></span>
                </div>
                <div class="form-group">
                <div class="input-group form-control-sm rounded-0 inwards_label">  
                 <input 
                    id="heightVariation" 
                    type="number" 
                    class="form-control form-control-sm rounded-0 inwards_label"
                    :disabled="isDisabled"
                    v-model="stageVariation"
                    >
                    <div class="input-group-append rounded-0 inwards_label">
                      <span
                          class="input-group-text rounded-0 inwards_label"
                          id="infoButton"
                          style="cursor: pointer"
                          role="button"
                          @click="togglePopover"
                        >
                          <font-awesome-icon
                            icon="fa-solid fa-info"
                          />
                        </span>
                      </div>   
                </div>
              </div>
              </div>
            </div>
            <div class="row">
            <div class="col-md-4">
              <p class="divider-text"> 
                    <span class="bg-light">Obs/calibrated discharge (m<sup>3</sup>&middot;s<sup>-1</sup>)</span>
                  </p>
                <div class="form-group">
                    <input 
                    id="dischargeEstimate" 
                    type="number" 
                    class="form-control form-control-sm rounded-0 inwards_label"
                    :disabled="isDisabled"
                    v-model="dischargeEstimateValue"
                    >
                </div>
              </div>
              <div class="col-md-4">
                <p class="divider-text"> 
                    <span class="bg-light">Discharge according to probe (m<sup>3</sup>&middot;s<sup>-1</sup>)</span>
                  </p>
                <div class="form-group">
                    <input 
                    id="dischargeProbe" 
                    type="number" 
                    class="form-control form-control-sm rounded-0 inwards_label"
                    :disabled="isDisabled"
                    v-model="dischargeProbeValue"
                    >
                </div>
              </div>
              <div class="col-md-4">
                <p class="divider-text"> 
                    <span class="bg-light">Discharge variation (%)</span>
                  </p>                
               <div class="form-group">
                 <input 
                    id="dischargeVariationCalc" 
                    type="number" 
                    class="form-control form-control-sm rounded-0 inwards_label"
                    :disabled="isDisabled"
                    v-model="dischargeVariation"
                    >
                </div>
              </div>
            </div>
            </div>
            <div class="col-md-4">
                <p class="divider-text"> 
                    <span class="bg-light">Closest probe reading:</span>
                  </p>
                <div class="form-group">
                    <input
                    type="datetime-local"
                    v-model="closestDate"
                    name="to"
                    class="form-control form-control-sm rounded-0 inwards_label"
                    id="closestDate"
                    :disabled="isDisabled"
                    />
            </div> 
            </div>             
            <div class="col-md-4">
                  <p class="divider-text"> 
                      <span class="bg-light">Correction start date:</span>
                    </p>
                  <div class="form-group">
                      <input
                      type="datetime-local"
                      name="to"
                      v-model="startDate"
                      @input="updateDateTime($event)"
                      class="form-control form-control-sm rounded-0 inwards_label"
                      id="startDate"
                      />
              </div> 
              <p class="divider-text"> 
                    <span class="bg-light">Select correction</span>
                  </p>
                <div class="form-group">
                    <multiselect :options="corrections" v-model="selectedCorrection" :multiple="false" @input="insertDate()" :max-height="300"></multiselect>
                </div>   
            </div>
                <div class="col-md-4">   
                    <p class="divider-text"> 
                    <span class="bg-light">Correction end date:</span>
                  </p>
                    <div class="form-group">
                      <div class="form-group">
                    <input
                      type="datetime-local"
                      name="to"
                      v-model="endDate"
                      @input="updateDateTime($event)"
                      class="form-control form-control-sm rounded-0 inwards_label"
                      id="startDate"
                    />
                </div> 
                </div>
                </div>
            <div class="col-md-12">
             <p class="divider-text"> 
               <span class="bg-light">Correction methods</span>
             </p>
            </div>

            <div class="col-md-4">
                    <div class="funkyradio" style="width: 100%;">
                    <div class="form-check form-check-inline funkyradio-primary" style="width: 100%;">
                        <input
                        name="chart_components"
                        id="simplePercCorrection"
                        type="checkbox"
                        :checked="selectedStats === 'simplePercCorrection'"
                        @click="toggleStat('simplePercCorrection')"
                        class="form-check-input"
                        />
                        <label for="simplePercCorrection" class="form-check-label" style="width: 100%;">Simple gain/loss correction (%)</label>
                    </div>
                    </div>
                    </div>
                    <div class="col-md-4">
                    <div class="funkyradio" style="width: 100%;">
                    <div class="form-check form-check-inline funkyradio-primary" style="width: 100%;">
                        <input
                        name="chart_components"
                        id="linearLoss"
                        type="checkbox"
                        :checked="selectedStats === 'linearLoss'"
                        @click="toggleStat('linearLoss')"
                        class="form-check-input"
                        />
                        <label for="linearLoss" class="form-check-label" style="width: 100%;">Linear gain/loss model</label>
                    </div>
                    </div>
                    </div>
                    <div class="col-md-4">
                    <div class="funkyradio" style="width: 100%;">
                    <div class="form-check form-check-inline funkyradio-primary" style="width: 100%;">
                        <input
                        name="chart_components"
                        id="exponentialLoss"
                        type="checkbox"
                        :checked="selectedStats === 'exponentialLoss'"
                        @click="toggleStat('exponentialLoss')"
                        class="form-check-input"
                        />
                        <label for="exponentialLoss" class="form-check-label" style="width: 100%;">Exponential gain/loss correction</label>
                    </div>
                </div>
            </div>
            </div>
            <hr>
            <div class="modal-footer">
                <div class="btn inwards_button" @click=saveCorrection()>Save Correction</div>
                <div class="btn inwards_button" v-if="isCorrectionSaved" @click=applyCorrection()>Apply Correction</div>
            </div>
            </div>
            </div>          
            </div>
            </div>
  </template>
  <script>
  import $ from 'jquery';
  import { remote } from '../../services/electron-compat';
  const { dialog } = remote;
  import stateStore from '../../store/state_handler';
  import { textHeights } from 'ol/render/canvas';
  import PlateList from "./PlateList";
  export default {
    components: {
      PlateList
    },
    data: function() {
        return {
            stations: [],
            corrections: [],
            plates: [],
            selectedPlates: [],
            selectedCorrection: [],
            uploadPercentage: 0,
            selectedStations: "",
            gaugeHeights: [],
            selectedGaugeHeight: 0.0,
            currentDateTime: "",
            currentDateTimeInput: this.formatDateTime(new Date()),
            closestDate: null,
            selectedStations: null,
            fileURL: '',
            fileName: '',
            userCode: '',
            file:'',
            successAlert: false,
            errorAlert: false,
            uploadedImage:'',
            discharge: [],
            selected: 'virtual',
            selectedVirtual: 1,
            isCorrectionSaved: false,
            selectedStats: 'simpleCorrection',            
            isDisabled: true,
            dischargeEstimateValue: 0.0,
            dischargeProbeValue: 0.0,
            stageProbeValue: 0.0,
            observedStageValue: 0.0,
            stageVariation: 0.0,
            dischargeVariation: 0.0,
            showPopover: false,
            startDate: null,
            endDate: null,
            simplePercCorrection: 1,
            linearLoss: 0,
            exponentialLoss: 0,
            siteCode: '',
            entryId:''


        };
    },
    created () {
            // Get current date and time
    document.addEventListener('click', this.closePopover);

    const now = new Date();
    // Convert to YYYY-MM-DDTHH:MM format
    const dateTime = now.toISOString().substring(0, 16);
    this.currentDateTime = dateTime;
    this.currentDateTimeInput = dateTime;
    stateStore.getState(
        stateStore.keys.loginStatus, (status) => {
            this.userCode = status['uniqueCode'];
           // console.log(this.userCode);
        }
        );
        this.$axios.get('https://inwards.award.org.za/app_json/iucma_verification/stations_all.php')
        .then(
          response => {
            this.stations = response.data;
            //console.log(this.stations);
          })
        .catch(function (error) {
          console.log(error);
        });
        this.$axios.get('https://inwards.award.org.za/app_json/gauge_heights.php')
        .then(
          response => {
            this.gaugeHeights = response.data;
            //console.log(this.stations);
          })
        .catch(function (error) {
          console.log(error);
        });
    }, 
    beforeUnmount() {
      document.removeEventListener('click', this.closePopover);
    },    
    methods: {
        formatDateTime(date) {
            let YYYY = date.getFullYear();
            let MM = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JavaScript
            let DD = String(date.getDate()).padStart(2, '0');
            let HH = String(date.getHours()).padStart(2, '0');
            let MI = String(date.getMinutes()).padStart(2, '0');
            let SS = String(date.getSeconds()).padStart(2, '0');
            return `${YYYY}-${MM}-${DD}T${HH}:${MI}:${SS}`;
        },
        updateDateTimeInput(event) {
          this.currentDateTimeInput = event.target.value;
        },
        togglePopover() {
          this.showPopover = !this.showPopover;
        },
        closePopover(event) {
          if (!this.$el.contains(event.target)) {
            this.showPopover = false;
          }
        },
        showVerifyForm () {
        let operationalModel = $('#verification-modal');
        var today  = new Date();
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var H = today.getHours();
        var i = today.getMinutes();
        var s = today.getSeconds();

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (H < 10) {
            H = '0' + H;
        }
        if (i < 10) {
            i = '0' + i;
        }
        if (s < 10) {
            s = '0' + s;
        }
        today = yyyy + '-' + mm + '-' + dd+'T'+H+':'+i+':'+s;
        console.log(today);
        document.getElementById('dateObserved').value = today;
        operationalModel.modal({
          keyboard: true
        });
      },
      toggle(option) {
      if (this.selected === option) {
        this.selected = ''; // deselect if the same box is clicked again
        this.selectedVirtual = 0;

      } else {
        this.selected = option; // set the selected box
        this.selectedVirtual = 1;

    }

    },
    toggleStat(option) {
          if (this.selectedStats === option) {
              this.selectedStats = ''; // deselect if the same box is clicked again
              this.simplePercCorrection = 0;
              this.linearLoss = 0;
              this.exponentialLoss = 0;
          } else {
              this.selectedStats = option; // set the selected box
              switch(this.selectedStats) {
                  case 'simplePercCorrection':
                      this.simplePercCorrection = 1;
                      this.linearLoss = 0;
                      this.exponentialLoss = 0;
                      break;
                  case 'linearLoss':
                      this.simplePercCorrection = 0;
                      this.linearLoss = 1;
                      this.exponentialLoss = 0;
                      break;
                  case 'exponentialLoss':
                      this.simplePercCorrection = 0;
                      this.linearLoss = 0;
                      this.exponentialLoss = 1;
                      break;
                  default:
                      this.simplePercCorrection = 0;
                      this.linearLoss = 0;
                      this.exponentialLoss = 0;
                      break;
              }
          }
      },
      onChangeFileUpload(){
        this.file = this.$refs.file.files[0];
        document.getElementById("gaugeThumbnail").src = this.file.path;
      },
      updateDateTime(event) {
        this.currentDateTime = event.target.value;
      },
      updateDateTimeInput(event) {
        this.currentDateTimeInput = event.target.value;
      },
      uploadImage (imageId) {    
            let dateObserved = $('#dateObserved').val();
            let stationsAll = this.selectedStations;
            let stationSplit = stationsAll.split(':');
            this.siteCode = stationSplit[0];
            //console.log(siteCode);
            let segment = $('#segment').val();
            let height = this.selectedGaugeHeight;
            let discharge =   $('#dischargeEstimate').val();
            let api = 'https://inwards.award.org.za/app_json/upload_data/stage.php?image_url='+imageId+'&user_code=' + this.userCode + '&station=' + siteCode + '&date_taken=' + dateObserved + '&plate=' + segment + '&stage_height=' + height + '&discharge=' + discharge;
            $.get(api, function (dataAPI) {
                if (dataAPI === 'true') {
                dialog.showMessageBox(null, {
                    type: 'info',
                    message: 'Successfully Submited!',
                    buttons: ['OK']
                });
                
                } else {
                dialog.showMessageBox(null, {
                    type: 'info',
                    message: 'Failed to Submit Please Try Again or Contact Admin!',
                    buttons: ['OK']
                });
                }
            }); 
    },
    fetchDischarge(){
        this.dischargeEstimateValue = 0.0;
        this.observedStageValue = 0.0;
        this.stageProbeValue = 0.0;
        this.dischargeProbeValue = 0.0;
        this.dischargeVariation = 0.0;
        this.stageVariation = 0.0;
        let stationsAll = this.selectedStations;
        let stationSplit = stationsAll.split(':');
        let siteCode = stationSplit[0];
        let heightPlate = this.selectedGaugeHeight;
        //console.log('https://inwards.award.org.za/app_json/plate_convert.php?station='+siteCode+'&height='+heightPlate);
        this.$axios.get('https://inwards.award.org.za/app_json/iucma_verification/plate_convert.php?station='+siteCode+'&height='+heightPlate)
        .then(
          response => {
            this.discharge = response.data;
            //console.log(this.discharge);
            //console.log(this.discharge[0].flow);
            this.dischargeEstimateValue = this.discharge[0].flow;
            this.observedStageValue = this.discharge[0].stage;
            this.fetchClosest();
            this.loadCorrections(siteCode);
            //document.getElementById("dischargeEstimate").value = this.discharge[0].flow;
          })
        .catch(function (error) {
          console.log(error);
        });
        

    },
    fetchClosest() {
        let stationsAll = this.selectedStations;
        let stationSplit = stationsAll.split(':');
        let siteCode = stationSplit[0];

        const url = 'https://inwards.award.org.za/app_json/iucma_verification/closest_record.php';
        const fullUrl = `${url}?station=${encodeURIComponent(siteCode)}&date=${encodeURIComponent(this.currentDateTimeInput)}`;

        this.$axios.get(fullUrl)
        .then(response => {
            this.discharge = response.data;
            this.nextFunction(); // This is correctly placed to ensure calculations happen after data load.
        })
        .catch(error => {
            console.log(error);
        });
    },

    nextFunction() {
        //load
        this.stageProbeValue = this.discharge.stage;
        this.dischargeProbeValue = this.discharge.flow;

        //calcs
        let differenceDischarge = this.dischargeEstimateValue - this.dischargeProbeValue;
        this.dischargeVariation = ((differenceDischarge / this.dischargeEstimateValue) * 100).toPrecision(6);

        let differenceStage = this.selectedGaugeHeight - this.stageProbeValue;
        this.stageVariation = ((differenceStage / this.selectedGaugeHeight) * 100).toPrecision(6);

        this.closestDate = this.discharge.date;
    },
    saveCorrection() {

        let stationsAll = this.selectedStations;
        let stationSplit = stationsAll.split(':');
        let siteCode = stationSplit[0];  
        const params = {
            station: siteCode,
            verified_stage: this.observedStageValue,
            date_of_verification: this.currentDateTimeInput,
            probe_date: this.closestDate,
            submitted_by: this.userCode,
            virtual_calibration: this.selectedVirtual,
            verified_discharge: this.dischargeEstimateValue,
            probe_discharge: this.dischargeProbeValue,
            probe_stage: this.stageProbeValue,
            stage_variation: this.stageVariation,
            discharge_variation: this.dischargeVariation,
            apply_start_date: this.startDate,
            apply_end_date: this.endDate,
            simple_perc_correction: this.simplePercCorrection,
            linear_loss: this.linearLoss,
            exponential_loss: this.exponentialLoss
        };

        const url = 'https://inwards.award.org.za/app_json/iucma_verification/capture_correction.php';
        this.$axios.get(url, {params: params}).then(response => {
            
            this.entryId = response.data.id;
            //console.log(this.entryId);
            // Handle success response here
        }).catch(error => {
            console.log(error);
            // Handle errors here
        });
        this.isCorrectionSaved = true;
    },
    applyCorrection(){

        const url = 'https://inwards.award.org.za/app_json/iucma_verification/apply_correction.php';
        const fullUrl = `${url}?id=${encodeURIComponent(this.entryId)}`;
        this.$axios.get(fullUrl)
        .then(response => {
          //console.log(response.data);
          if (response.data.status === true) {
          dialog.showMessageBox(null, {
            type: 'info',
            message: 'Successfully corrected the stage heights',
            buttons: ['OK']
          });
        } else {
          dialog.showMessageBox(null, {
            type: 'error',
            message: 'Sorry we failed to correct for the period specified',
            buttons: ['OK']
          });
        }            
        })
        .catch(error => {
            console.log(error);
        });





    },
    insertDate(){
      let date = this.selectedCorrection;
      this.startDate = date.replace(" ", "T");
    },
    loadCorrections (siteCode){
      //console.log("https://inwards.award.org.za/app_json/iucma_verification/correction_list.php?site='" + siteCode);
    this.$axios.get('https://inwards.award.org.za/app_json/iucma_verification/correction_list.php?site='+ siteCode)
        .then(
          response => {
            this.corrections = response.data;
            //console.log(this.stations);
          })
        .catch(function (error) {
          console.log(error);
        });
    },
    submitVerify(){
            let userCodeglobal = this.userCode;
            let dateObserved = $('#dateObserved').val();
            let stationsAll = this.selectedStations;
            let stationSplit = stationsAll.split(':');
            let siteCode = stationSplit[0];
            //console.log(siteCode);
            let segment = $('#segment').val();
            let height = this.selectedGaugeHeight;
            let dischargeEst = $('#dischargeEstimate').val(); 
            let formData = new FormData();

            const config = {
                //Choose upload
                onUploadProgress: event => {
                    this.imageUploadPercentage = Math.round(
                        (event.loaded * 100) / event.total
                    );
                },
            };
            var imageURL = '';        
            formData.append('file', this.file);
            this.axios.post('https://inwards.award.org.za/app_json/data_upload/image.php',
                formData,
                {
                  headers: {
                  'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: function( progressEvent ) {
                  this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ) );
                }.bind(this)       
               }

            ).then(
            function(data){
              imageURL = data.data.message; 
            },
            ).then(function(){
              
                let callApi = 'https://inwards.award.org.za/app_json/data_upload/stage.php?image_url='+imageURL+'&user_code=' + userCodeglobal + '&station=' + siteCode + '&date_taken=' + dateObserved + '&plate=' + segment + '&stage_height=' + height + '&discharge=' + dischargeEst;
                //console.log(callApi);
                $.get(callApi, function (data) {
                    if (data === 'true') {
                    dialog.showMessageBox(null, {
                        type: 'info',
                        message: 'Successfully Submited!',
                        buttons: ['OK']
                    });
                    $('#verification-modal').modal('hide');
                    } else {
                    dialog.showMessageBox(null, {
                        type: 'info',
                        message: 'Failed to Submit Please Try Again or Contact Admin!',
                        buttons: ['OK']
                    });
                    }
                });               
            }           
            ).catch(function(){
                console.log('FAILURE!!');
            });
      }
    }
  };
  </script>
  <style>
  .popover {
    border: 1px solid #ccc;
    padding: 10px;
    background-color: #f9f9f9;
    position: center;
    top: 10%; 
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
  }
  </style>